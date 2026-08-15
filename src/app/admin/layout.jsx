"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  getAdminToken,
  getAdminUser,
  verifyAdminToken,
  removeAdminAuth,
} from "@/lib/adminApi";
import {
  FiGrid,
  FiBox,
  FiFolder,
  FiMail,
  FiVideo,
  FiLogOut,
  FiUser,
  FiX,
  FiMenu as FiMenuIcon,
  FiExternalLink,
} from "react-icons/fi";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isLoginPage = pathname === "/admin";

  useEffect(() => {
    async function checkAuth() {
      const token = getAdminToken();
      const cachedUser = getAdminUser();

      if (!token) {
        setCheckingAuth(false);
        setIsAuthenticated(false);
        if (!isLoginPage) router.replace("/admin");
        return;
      }

      if (cachedUser) {
        setUser(cachedUser);
        setIsAuthenticated(true);
      }

      try {
        const res = await verifyAdminToken(token);
        if (res.success) {
          setIsAuthenticated(true);
          if (res.user) setUser(res.user);
        } else {
          setIsAuthenticated(false);
          setUser(null);
          removeAdminAuth();
          router.replace("/admin");
        }
      } catch (_e) {
        // keep current state on network error
      } finally {
        setCheckingAuth(false);
      }
    }
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    removeAdminAuth();
    setIsAuthenticated(false);
    setUser(null);
    router.replace("/admin");
  };

  const navItems = [
    { href: "/admin/overview", label: "Dashboard", icon: FiGrid },
    { href: "/admin/products", label: "Products Catalog", icon: FiBox },
    { href: "/admin/categories", label: "Categories", icon: FiFolder },
    { href: "/admin/enquiries", label: "Enquiries & Leads", icon: FiMail },
    { href: "/admin/reels", label: "Instagram Reels", icon: FiVideo },
  ];

  // Show loading spinner while checking auth on protected pages
  if (checkingAuth && !isLoginPage) {
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

  // Login page — render without sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Protected pages — render with sidebar layout
  if (!isAuthenticated) return null;

  const pageTitle = navItems.find((n) => n.href === pathname)?.label || "Admin Panel";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex font-sans overflow-hidden">
      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200/80 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } transition-transform duration-300 ease-in-out flex flex-col justify-between shadow-sm`}
      >
        <div>
          {/* Brand Logo */}
          <div className="h-20 px-6 flex items-center justify-between border-b border-slate-200/80">
            <div className="flex items-center w-full justify-center gap-3">
              <Image
                src="/logo1.png"
                alt="Vinayak Jewellers"
                width={90}
                height={40}
                className="object-contain"
                style={{ width: "100px", height: "80px" }}
              />
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-slate-700"
            >
              <FiX className="text-xl" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <div className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Menu Navigation
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    if (window.innerWidth < 1024) setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-amber-50 text-amber-800 border-l-4 border-amber-600 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`text-lg ${isActive ? "text-amber-600" : "text-slate-400"}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-slate-200/80 bg-slate-50/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0">
                <FiUser className="text-base" />
              </div>
              <div className="truncate">
                <div className="text-xs font-semibold text-slate-800 truncate">
                  {user?.email || "Admin User"}
                </div>
                <div className="text-[10px] text-emerald-600 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                  Active Session
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <FiLogOut className="text-lg" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden lg:ml-64">
        {/* TOP NAVBAR */}
        <header className="h-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
            >
              <FiMenuIcon className="text-xl" />
            </button>
            <h2 className="text-lg font-bold text-slate-900 capitalize hidden sm:block">
              {pageTitle}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100/80 border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-white text-xs transition-all"
            >
              <span>View Main Site</span>
              <FiExternalLink className="text-xs" />
            </a>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
