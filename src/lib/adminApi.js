// API Base URL — single source, no fallback loop that causes 30s waits
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://vinayak-jewellers-1.onrender.com");

export const PROD_API_URL = "https://vinayak-jewellers-1.onrender.com";

// Fast fetch helper with configurable timeout
async function fetchWithTimeout(url, options = {}, timeoutMs = 20000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timer);
    return res;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

// Smart API call — with auto-retry for cold starts (Render free tier)
async function apiCall(endpoint, options = {}, retries = 2) {
  const base = API_BASE_URL;
  const url = endpoint.startsWith("http") ? endpoint : `${base}${endpoint}`;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Increase timeout on each retry (cold start may need more time)
      const timeout = attempt === 0 ? 15000 : 25000;
      const res = await fetchWithTimeout(url, options, timeout);
      if (res.ok || [400, 401, 404, 409].includes(res.status)) return res;
      // Non-ok but not timeout — retry
    } catch (_) {
      // Timeout or network error — retry unless last attempt
      if (attempt === retries) {
        // Last attempt: try prod fallback if on localhost
        if (base !== PROD_API_URL) {
          const fallbackUrl = endpoint.startsWith("http") ? endpoint : `${PROD_API_URL}${endpoint}`;
          return await fetchWithTimeout(fallbackUrl, options, 25000);
        }
        throw _;
      }
      // Wait a bit before retrying (exponential backoff)
      await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
    }
  }

  // If we get here with non-ok responses, try prod fallback
  if (base !== PROD_API_URL) {
    const fallbackUrl = endpoint.startsWith("http") ? endpoint : `${PROD_API_URL}${endpoint}`;
    return await fetchWithTimeout(fallbackUrl, options, 25000);
  }
  throw new Error("API call failed after retries");
}

export const TOKEN_KEY = "admin_token";
export const USER_KEY = "admin_user";

export function getAdminToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getAdminUser() {
  if (typeof window === "undefined") return null;
  try {
    const u = localStorage.getItem(USER_KEY);
    return u ? JSON.parse(u) : null;
  } catch (_e) {
    return null;
  }
}

export function setAdminAuth(token, user) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function removeAdminAuth() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/**
 * Log in admin via API
 */
export async function loginAdmin(email, password) {
  try {
    const res = await apiCall("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok && data.success && data.token) {
      setAdminAuth(data.token, data.user || { email });
      return { success: true, token: data.token, user: data.user || { email } };
    }
    return { success: false, message: data.message || "Invalid credentials or unauthorized email" };
  } catch (err) {
    return { success: false, message: "Unable to connect to server. Please ensure backend is running." };
  }
}

/**
 * Verify current admin token with backend
 */
export async function verifyAdminToken(token) {
  const activeToken = token || getAdminToken();
  if (!activeToken) return { success: false };
  try {
    const res = await apiCall("/api/auth/me", {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${activeToken}` },
    });
    const data = await res.json();
    if (res.ok && data.success) return { success: true, user: data.user };
  } catch (_) {}
  return { success: false };
}

/**
 * Helper to fetch authenticated API endpoints with local + production fallback
 */
export async function fetchWithAuth(endpoint, options = {}) {
  const token = getAdminToken();
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers || {}),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(url, { ...options, headers, signal: controller.signal });
    clearTimeout(timer);
    if (response.ok || [400, 401, 404, 409].includes(response.status)) return response;
    // fallback to prod if on localhost
    if (API_BASE_URL !== PROD_API_URL) {
      const fallback = endpoint.startsWith("http") ? endpoint : `${PROD_API_URL}${endpoint}`;
      return await fetch(fallback, { ...options, headers });
    }
    return response;
  } catch (err) {
    clearTimeout(timer);
    if (API_BASE_URL !== PROD_API_URL) {
      const fallback = endpoint.startsWith("http") ? endpoint : `${PROD_API_URL}${endpoint}`;
      return await fetch(fallback, { ...options, headers });
    }
    throw new Error("Unable to connect to backend server");
  }
}

/* ==========================================================================
   CATEGORY & SUBCATEGORY APIS
   ========================================================================== */

export async function listCategoriesApi(collection) {
  const query = collection ? `?collection=${encodeURIComponent(collection)}` : "";
  try {
    const res = await apiCall(`/api/categories${query}`);
    if (res.ok) return await res.json();
  } catch (_) {}
  return { success: false, data: [] };
}

export async function listCategoriesGroupedApi() {
  try {
    const res = await apiCall(`/api/categories/grouped`);
    if (res.ok) return await res.json();
  } catch (_) {}
  return { success: false, data: {} };
}

export async function createCategoryApi(categoryData) {
  try {
    const res = await fetchWithAuth("/api/categories", {
      method: "POST",
      body: JSON.stringify(categoryData),
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
}

export async function updateCategoryApi(id, categoryData) {
  try {
    const res = await fetchWithAuth(`/api/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(categoryData),
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
}

export async function deleteCategoryApi(id) {
  try {
    const res = await fetchWithAuth(`/api/categories/${id}`, {
      method: "DELETE",
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
}

export async function addSubcategoryApi(id, subcategory) {
  try {
    const res = await fetchWithAuth(`/api/categories/${id}/subcategory`, {
      method: "POST",
      body: JSON.stringify({ subcategory }),
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
}

export async function deleteSubcategoryApi(id, subcategory) {
  try {
    const res = await fetchWithAuth(`/api/categories/${id}/subcategory`, {
      method: "DELETE",
      body: JSON.stringify({ subcategory }),
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
}

/* ==========================================================================
   PRODUCT APIS
   ========================================================================== */

export async function listProductsApi(params = {}) {
  const queryParams = new URLSearchParams();
  if (params.collection) queryParams.append("collection", params.collection);
  if (params.category) queryParams.append("category", params.category);
  if (params.subcategory) queryParams.append("subcategory", params.subcategory);
  const qs = queryParams.toString() ? `?${queryParams.toString()}` : "";
  try {
    const res = await apiCall(`/api/products${qs}`);
    if (res.ok) return await res.json();
  } catch (_) {}
  return { success: false, data: [] };
}

export async function getProductByIdApi(id) {
  try {
    const res = await apiCall(`/api/products/${id}`);
    if (res.ok) return await res.json();
  } catch (_) {}
  return { success: false, data: null };
}

export async function createProductJsonApi(productData) {
  try {
    const res = await fetchWithAuth("/api/products/upload-json", {
      method: "POST",
      body: JSON.stringify(productData),
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
}

export async function createProductFormDataApi(formData) {
  try {
    const res = await fetchWithAuth("/api/products/upload", {
      method: "POST",
      body: formData,
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
}

export async function updateProductApi(id, productDataOrFormData) {
  try {
    const isFormData = typeof FormData !== "undefined" && productDataOrFormData instanceof FormData;
    const body = isFormData ? productDataOrFormData : JSON.stringify(productDataOrFormData);

    const res = await fetchWithAuth(`/api/products/${id}`, {
      method: "PUT",
      body: body,
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
}

export async function deleteProductApi(id) {
  try {
    const res = await fetchWithAuth(`/api/products/${id}`, {
      method: "DELETE",
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
}

/* ==========================================================================
   ENQUIRIES, MENUS & REELS APIS
   ========================================================================== */

export async function listEnquiriesApi() {
  try {
    const res = await fetchWithAuth("/api/enquiries");
    return await res.json();
  } catch (err) {
    return { success: false, data: [] };
  }
}

export async function listMenusApi() {
  try {
    const res = await apiCall(`/api/menus`);
    if (res.ok) return await res.json();
  } catch (_) {}
  return { success: false, data: [] };
}

export async function listReelsApi() {
  try {
    const res = await fetchWithAuth("/api/instagram-reels/all");
    return await res.json();
  } catch (err) {
    return { success: false, data: [] };
  }
}

export async function listPublicReelsApi() {
  try {
    const res = await apiCall(`/api/instagram-reels`);
    if (res.ok) return await res.json();
  } catch (_) {}
  return { success: false, data: [] };
}

export async function createReelApi(formData) {
  try {
    const res = await fetchWithAuth("/api/instagram-reels", {
      method: "POST",
      body: formData,
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
}

export async function updateReelApi(id, formData) {
  try {
    const res = await fetchWithAuth(`/api/instagram-reels/${id}`, {
      method: "PUT",
      body: formData,
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
}

export async function deleteReelApi(id) {
  try {
    const res = await fetchWithAuth(`/api/instagram-reels/${id}`, {
      method: "DELETE",
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
}
