"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  getAdminToken,
  getAdminUser,
  verifyAdminToken,
  removeAdminAuth,
  setAdminAuth,
} from "@/lib/adminApi";
import {
  getInitialAdminData,
  syncAdminDataDataStore,
  invalidateAdminCache,
} from "@/lib/dataStore";

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Shared data states
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [menus, setMenus] = useState([]);
  const [reels, setReels] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Alert state
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const token = getAdminToken();
    const cachedUser = getAdminUser();
    if (token && cachedUser) {
      setUser(cachedUser);
      setIsAuthenticated(true);
    }

    async function verify() {
      if (!token) { setCheckingAuth(false); return; }
      try {
        const res = await verifyAdminToken(token);
        if (res.success) {
          setIsAuthenticated(true);
          if (res.user) setUser(res.user);
        } else {
          setIsAuthenticated(false);
          setUser(null);
          removeAdminAuth();
        }
      } catch (_) {}
      finally { setCheckingAuth(false); }
    }
    verify();
  }, []);

  // Load cache instantly on mount
  useEffect(() => {
    const cached = getInitialAdminData();
    if (cached.categories) setCategories(cached.categories);
    if (cached.products) setProducts(cached.products);
    if (cached.enquiries) setEnquiries(cached.enquiries);
    if (cached.menus) setMenus(cached.menus);
    if (cached.reels) setReels(cached.reels);
  }, []);

  const loadAllData = useCallback(async () => {
    setLoadingData(true);
    const res = await syncAdminDataDataStore();
    if (res?.success && res.data) {
      if (res.data.categories) setCategories(res.data.categories);
      if (res.data.products) setProducts(res.data.products);
      if (res.data.enquiries) setEnquiries(res.data.enquiries);
      if (res.data.menus) setMenus(res.data.menus);
      if (res.data.reels) setReels(res.data.reels);
    }
    setLoadingData(false);
  }, []);

  const showAlert = useCallback((type, text) => {
    if (!type || !text) { setAlert(null); return; }
    setAlert({ type, text });
    setTimeout(() => setAlert(null), 4000);
  }, []);

  const handleLoginSuccess = (userData, token) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    removeAdminAuth();
    invalidateAdminCache();
    setIsAuthenticated(false);
    setUser(null);
    setCategories([]);
    setProducts([]);
    setEnquiries([]);
    setMenus([]);
    setReels([]);
  };

  return (
    <AdminContext.Provider
      value={{
        isAuthenticated,
        user,
        checkingAuth,
        categories, setCategories,
        products, setProducts,
        enquiries, setEnquiries,
        menus, setMenus,
        reels, setReels,
        loadingData,
        loadAllData,
        alert,
        showAlert,
        setAlert,
        handleLoginSuccess,
        handleLogout,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used inside AdminProvider");
  return ctx;
}
