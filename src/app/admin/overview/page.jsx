"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getAdminToken,
  getAdminUser,
  API_BASE_URL,
} from "@/lib/adminApi";
import {
  getInitialAdminData,
  syncAdminDataDataStore,
} from "@/lib/dataStore";
import { useState } from "react";
import {
  FiGrid,
  FiBox,
  FiFolder,
  FiMail,
  FiVideo,
  FiTrendingUp,
  FiCheckCircle,
  FiPlus,
  FiRefreshCw,
  FiAlertCircle,
  FiX,
} from "react-icons/fi";

const MAX_INSTAGRAM_REELS = 7;

export default function OverviewPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [reels, setReels] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const token = getAdminToken();
    if (!token) { router.replace("/admin"); return; }

    // Instant from cache
    const cached = getInitialAdminData();
    if (cached.categories) setCategories(cached.categories);
    if (cached.products) setProducts(cached.products);
    if (cached.enquiries) setEnquiries(cached.enquiries);
    if (cached.reels) setReels(cached.reels);

    // Background sync
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    setLoadingData(true);
    const res = await syncAdminDataDataStore();
    if (res?.success && res.data) {
      if (res.data.categories) setCategories(res.data.categories);
      if (res.data.products) setProducts(res.data.products);
      if (res.data.enquiries) setEnquiries(res.data.enquiries);
      if (res.data.reels) setReels(res.data.reels);
    }
    setLoadingData(false);
  };

  const activeReelsCount = reels.filter((r) => r.isActive !== false).length;

  return (
    <div className="p-4 sm:p-8 space-y-6">
      {/* Alert */}
      {alert && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center justify-between border ${
            alert.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {alert.type === "success" ? (
              <FiCheckCircle className="text-emerald-600 text-base" />
            ) : (
              <FiAlertCircle className="text-red-600 text-base" />
            )}
            <span className="font-medium">{alert.text}</span>
          </div>
          <button onClick={() => setAlert(null)} className="text-slate-400 hover:text-slate-600">
            <FiX />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Control Panel Overview</h3>
          <p className="text-xs text-slate-500 mt-0.5">Welcome back — here&apos;s a live summary of your store.</p>
        </div>
        <button
          onClick={loadData}
          className="p-2 rounded-xl bg-slate-100/80 border border-slate-200 text-slate-600 hover:text-amber-600 hover:border-amber-400 hover:bg-white transition-all"
          title="Refresh Data"
        >
          <FiRefreshCw className={`text-base ${loadingData ? "animate-spin text-amber-600" : ""}`} />
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/admin/products" className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-amber-400 hover:shadow-md transition-all group cursor-pointer">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Products</span>
            <div className="w-10 h-10 rounded-xl bg-amber-100/80 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FiBox className="text-xl" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-3">{products.length}</div>
          <div className="text-xs text-emerald-600 flex items-center gap-1 mt-1 font-medium">
            <FiTrendingUp /> Live Database Items
          </div>
        </Link>

        <Link href="/admin/categories" className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-amber-400 hover:shadow-md transition-all group cursor-pointer">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Categories</span>
            <div className="w-10 h-10 rounded-xl bg-blue-100/80 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FiFolder className="text-xl" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-3">{categories.length}</div>
          <div className="text-xs text-slate-500 mt-1">Across Collections</div>
        </Link>

        <Link href="/admin/enquiries" className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-amber-400 hover:shadow-md transition-all group cursor-pointer">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Enquiries</span>
            <div className="w-10 h-10 rounded-xl bg-purple-100/80 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FiMail className="text-xl" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-3">{enquiries.length}</div>
          <div className="text-xs text-purple-600 font-medium mt-1">Total Submissions</div>
        </Link>

        <Link href="/admin/reels" className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-amber-400 hover:shadow-md transition-all group cursor-pointer">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Instagram Reels</span>
            <div className="w-10 h-10 rounded-xl bg-pink-100/80 text-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FiVideo className="text-xl" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-3">
            {reels.length}
            <span className="text-sm text-slate-400 font-semibold">/{MAX_INSTAGRAM_REELS}</span>
          </div>
          <div className="text-xs text-pink-600 font-medium mt-1">{activeReelsCount} live on homepage</div>
        </Link>
      </div>

      {/* Quick Actions & Recent Enquiries Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Customer Enquiries */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FiMail className="text-amber-600" /> Recent Customer Enquiries
            </h3>
            <Link
              href="/admin/enquiries"
              className="text-xs text-amber-600 font-semibold hover:underline"
            >
              View All ({enquiries.length})
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-500 border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Phone/Email</th>
                  <th className="pb-3 font-semibold">Message/Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {enquiries.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-slate-400">
                      No customer enquiries recorded yet.
                    </td>
                  </tr>
                ) : (
                  enquiries.slice(0, 5).map((enq, idx) => (
                    <tr key={enq._id || idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 font-semibold text-slate-900">
                        {enq.name || enq.customerName || "Website Guest"}
                      </td>
                      <td className="py-3 text-slate-600">{enq.phone || enq.email || "N/A"}</td>
                      <td className="py-3 text-slate-600 truncate max-w-xs">
                        {enq.message || enq.items || "Jewellery Enquiry"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Status Panel */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FiCheckCircle className="text-emerald-600" /> Backend Live Status
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500">Backend API URL</span>
                <span className="font-mono text-amber-700 font-semibold text-[11px] truncate max-w-[140px]">
                  {API_BASE_URL}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500">Database Connection</span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping"></span>
                  Live MongoDB
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500">Subcategories</span>
                <span className="text-slate-800 font-bold">
                  {categories.reduce((acc, c) => acc + (c.subcategories?.length || 0), 0)} Items
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200/80 flex flex-col gap-2">
            <Link
              href="/admin/categories"
              className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-800 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-slate-200 transition-all border border-slate-200"
            >
              <FiPlus /> Add Category & Subcategories
            </Link>
            <Link
              href="/admin/products"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#b89028] text-white font-bold text-xs flex items-center justify-center gap-2 hover:brightness-105 shadow-sm transition-all"
            >
              <FiPlus /> Add New Product Catalog Item
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
