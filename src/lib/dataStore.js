import {
  listCategoriesApi,
  listProductsApi,
  listEnquiriesApi,
  listMenusApi,
  listReelsApi,
} from "./adminApi";

const CACHE_KEYS = {
  CATEGORIES: "vj_cache_categories",
  PRODUCTS: "vj_cache_products",
  ENQUIRIES: "vj_cache_enquiries",
  MENUS: "vj_cache_menus",
  REELS: "vj_cache_reels",
  TIMESTAMP: "vj_cache_timestamp",
};

// In-memory store
const memoryCache = {
  categories: null,
  products: null,
  enquiries: null,
  menus: null,
  reels: null,
  lastFetched: 0,
};

/**
 * Get initial cached data synchronously (0ms delay) from memory or localStorage
 */
export function getInitialAdminData() {
  if (memoryCache.categories && memoryCache.products) {
    return { ...memoryCache };
  }

  if (typeof window !== "undefined") {
    try {
      const cat = localStorage.getItem(CACHE_KEYS.CATEGORIES);
      const prod = localStorage.getItem(CACHE_KEYS.PRODUCTS);
      const enq = localStorage.getItem(CACHE_KEYS.ENQUIRIES);
      const menu = localStorage.getItem(CACHE_KEYS.MENUS);
      const reel = localStorage.getItem(CACHE_KEYS.REELS);
      const ts = localStorage.getItem(CACHE_KEYS.TIMESTAMP);

      if (cat) memoryCache.categories = JSON.parse(cat);
      if (prod) memoryCache.products = JSON.parse(prod);
      if (enq) memoryCache.enquiries = JSON.parse(enq);
      if (menu) memoryCache.menus = JSON.parse(menu);
      if (reel) memoryCache.reels = JSON.parse(reel);
      if (ts) memoryCache.lastFetched = parseInt(ts, 10);
    } catch (e) {
      console.warn("Failed to load local storage cache:", e);
    }
  }

  return { ...memoryCache };
}

/**
 * Save data to memory and localStorage cache
 */
function saveCacheData(key, data) {
  memoryCache[key] = data;
  if (typeof window !== "undefined") {
    try {
      const storageKey = CACHE_KEYS[key.toUpperCase()];
      if (storageKey) {
        localStorage.setItem(storageKey, JSON.stringify(data));
      }
      localStorage.setItem(CACHE_KEYS.TIMESTAMP, Date.now().toString());
    } catch (e) {
      console.warn("Failed to persist to localStorage cache:", e);
    }
  }
}

/**
 * Fetch all admin data in parallel and refresh cache (Stale-While-Revalidate)
 */
export async function syncAdminDataDataStore() {
  try {
    const [catRes, prodRes, enqRes, menuRes, reelRes] = await Promise.all([
      listCategoriesApi(),
      listProductsApi(),
      listEnquiriesApi(),
      listMenusApi(),
      listReelsApi(),
    ]);

    const updated = {};

    if (catRes && catRes.success && Array.isArray(catRes.data)) {
      saveCacheData("categories", catRes.data);
      updated.categories = catRes.data;
    }

    if (prodRes && prodRes.success && Array.isArray(prodRes.data)) {
      saveCacheData("products", prodRes.data);
      updated.products = prodRes.data;
    }

    if (enqRes && enqRes.success && Array.isArray(enqRes.data)) {
      saveCacheData("enquiries", enqRes.data);
      updated.enquiries = enqRes.data;
    }

    if (menuRes && menuRes.success && Array.isArray(menuRes.data)) {
      saveCacheData("menus", menuRes.data);
      updated.menus = menuRes.data;
    }

    if (reelRes && reelRes.success && Array.isArray(reelRes.data)) {
      saveCacheData("reels", reelRes.data);
      updated.reels = reelRes.data;
    }

    memoryCache.lastFetched = Date.now();
    return { success: true, data: { ...memoryCache, ...updated } };
  } catch (err) {
    console.error("DataStore sync error:", err);
    return { success: false, data: { ...memoryCache } };
  }
}

/**
 * Clear cache if needed
 */
export function invalidateAdminCache() {
  memoryCache.categories = null;
  memoryCache.products = null;
  memoryCache.enquiries = null;
  memoryCache.menus = null;
  memoryCache.reels = null;
  memoryCache.lastFetched = 0;

  if (typeof window !== "undefined") {
    try {
      Object.values(CACHE_KEYS).forEach((k) => localStorage.removeItem(k));
    } catch (_e) {}
  }
}
