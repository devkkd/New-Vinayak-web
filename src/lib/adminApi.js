// API Base URL - Tries local backend first, falls back to process.env.NEXT_PUBLIC_API_URL or production API URL
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://vinayak-jewellers-1.onrender.com");

export const PROD_API_URL = "https://vinayak-jewellers-1.onrender.com";

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
  const endpoints = [
    `${API_BASE_URL}/api/auth/login`,
    `http://localhost:5000/api/auth/login`,
    `${PROD_API_URL}/api/auth/login`,
  ];

  let lastError = "Login failed";

  for (const url of Array.from(new Set(endpoints))) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.token) {
        setAdminAuth(data.token, data.user || { email });
        return { success: true, token: data.token, user: data.user || { email } };
      } else {
        lastError = data.message || "Invalid credentials or unauthorized email";
      }
    } catch (err) {
      console.warn(`Failed to connect to ${url}:`, err.message);
      lastError = "Unable to connect to server. Please ensure backend is running or check network.";
    }
  }

  return { success: false, message: lastError };
}

/**
 * Verify current admin token with backend
 */
export async function verifyAdminToken(token) {
  const activeToken = token || getAdminToken();
  if (!activeToken) return { success: false };

  const endpoints = [
    `${API_BASE_URL}/api/auth/me`,
    `http://localhost:5000/api/auth/me`,
    `${PROD_API_URL}/api/auth/me`,
  ];

  for (const url of Array.from(new Set(endpoints))) {
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${activeToken}`,
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true, user: data.user };
      }
    } catch (err) {
      console.warn(`Token verification failed at ${url}:`, err.message);
    }
  }

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

  const urls = [
    endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`,
    endpoint.startsWith("http") ? endpoint : `${PROD_API_URL}${endpoint}`,
  ];

  let lastRes = null;
  for (const url of Array.from(new Set(urls))) {
    try {
      const response = await fetch(url, { ...options, headers });
      if (response.ok || response.status === 400 || response.status === 401 || response.status === 404 || response.status === 409) {
        return response;
      }
      lastRes = response;
    } catch (err) {
      // Continue to next fallback URL
    }
  }

  if (lastRes) return lastRes;
  throw new Error("Unable to connect to backend server");
}

/* ==========================================================================
   CATEGORY & SUBCATEGORY APIS
   ========================================================================== */

export async function listCategoriesApi(collection) {
  const query = collection ? `?collection=${encodeURIComponent(collection)}` : "";
  const endpoints = [
    `${API_BASE_URL}/api/categories${query}`,
    `${PROD_API_URL}/api/categories${query}`,
  ];

  for (const url of Array.from(new Set(endpoints))) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (_err) {
      // continue fallback
    }
  }
  return { success: false, data: [] };
}

export async function listCategoriesGroupedApi() {
  const endpoints = [
    `${API_BASE_URL}/api/categories/grouped`,
    `${PROD_API_URL}/api/categories/grouped`,
  ];

  for (const url of Array.from(new Set(endpoints))) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (_err) {
      // continue fallback
    }
  }
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

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
  const endpoints = [
    `${API_BASE_URL}/api/products${queryString}`,
    `${PROD_API_URL}/api/products${queryString}`,
  ];

  for (const url of Array.from(new Set(endpoints))) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (_err) {
      // continue fallback
    }
  }
  return { success: false, data: [] };
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

export async function getProductByIdApi(id) {
  const endpoints = [
    `${API_BASE_URL}/api/products/${id}`,
    `${PROD_API_URL}/api/products/${id}`,
  ];

  for (const url of Array.from(new Set(endpoints))) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (_err) {
      // continue fallback
    }
  }
  return { success: false, data: null };
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
  const endpoints = [
    `${API_BASE_URL}/api/menus`,
    `${PROD_API_URL}/api/menus`,
  ];

  for (const url of Array.from(new Set(endpoints))) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (_err) {
      // continue fallback
    }
  }
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
  const endpoints = [
    `${API_BASE_URL}/api/instagram-reels`,
    `${PROD_API_URL}/api/instagram-reels`,
  ];

  for (const url of Array.from(new Set(endpoints))) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        return await res.json();
      }
    } catch (_err) {
      // continue fallback
    }
  }
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
