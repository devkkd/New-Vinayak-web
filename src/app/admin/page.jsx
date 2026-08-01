"use client";

import { useState, useEffect } from "react";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import { getAdminToken, getAdminUser, verifyAdminToken } from "@/lib/adminApi";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const token = getAdminToken();
      const cachedUser = getAdminUser();

      if (!token) {
        setCheckingAuth(false);
        setIsAuthenticated(false);
        return;
      }

      // Quick optimistic authentication if user & token are cached
      if (cachedUser) {
        setUser(cachedUser);
        setIsAuthenticated(true);
      }

      // Verify token in background with backend
      try {
        const res = await verifyAdminToken(token);
        if (res.success) {
          setIsAuthenticated(true);
          if (res.user) setUser(res.user);
        } else {
          // Token invalid or expired
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (_e) {
        // Fall back to current state
      } finally {
        setCheckingAuth(false);
      }
    }

    checkAuth();
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  // Fullscreen loading spinner while checking auth status
  if (checkingAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="relative w-14 h-14 mb-4">
          <div className="absolute inset-0 rounded-full border-4 border-amber-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-amber-600 border-t-transparent animate-spin"></div>
        </div>
        <p className="text-xs text-slate-500 font-sans tracking-widest uppercase animate-pulse">
          Verifying Admin Access...
        </p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <AdminDashboard user={user} onLogout={handleLogout} />;
  }

  return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
}
