"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAdminToken } from "@/lib/adminApi";
import { getInitialAdminData, syncAdminDataDataStore } from "@/lib/dataStore";
import {
  FiMail,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiUser,
  FiPhone,
  FiMessageSquare,
  FiCalendar,
} from "react-icons/fi";

export default function EnquiriesPage() {
  const router = useRouter();
  const [enquiries, setEnquiries] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const token = getAdminToken();
    if (!token) { router.replace("/admin"); return; }
    const cached = getInitialAdminData();
    if (cached.enquiries) setEnquiries(cached.enquiries);
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    setLoadingData(true);
    const res = await syncAdminDataDataStore();
    if (res?.success && res.data?.enquiries) setEnquiries(res.data.enquiries);
    setLoadingData(false);
  };

  const totalPages = Math.ceil(enquiries.length / itemsPerPage) || 1;
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * itemsPerPage;
  const paginatedEnquiries = enquiries.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    } catch (_) { return "—"; }
  };

  return (
    <div className="p-4 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Enquiries & Leads</h3>
          <p className="text-xs text-slate-500">{enquiries.length} total enquiries from customers</p>
        </div>
        <button
          onClick={loadData}
          className="p-2 rounded-xl bg-slate-100/80 border border-slate-200 text-slate-600 hover:text-amber-600 hover:border-amber-400 hover:bg-white transition-all"
        >
          <FiRefreshCw className={`text-base ${loadingData ? "animate-spin text-amber-600" : ""}`} />
        </button>
      </div>

      {/* Enquiries Table */}
      {enquiries.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white border border-slate-200 text-center space-y-3">
          <FiMail className="text-4xl text-slate-300 mx-auto" />
          <h4 className="text-slate-800 font-bold text-base">No enquiries yet</h4>
          <p className="text-xs text-slate-500">Customer enquiries will appear here when submitted.</p>
        </div>
      ) : (
        <div className="rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-5 py-3.5 font-semibold text-slate-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2"><FiUser className="text-slate-400" /> Customer</div>
                  </th>
                  <th className="text-left px-5 py-3.5 font-semibold text-slate-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2"><FiPhone className="text-slate-400" /> Contact</div>
                  </th>
                  <th className="text-left px-5 py-3.5 font-semibold text-slate-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2"><FiMessageSquare className="text-slate-400" /> Message / Details</div>
                  </th>
                  <th className="text-left px-5 py-3.5 font-semibold text-slate-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2"><FiCalendar className="text-slate-400" /> Date</div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedEnquiries.map((enq, idx) => (
                  <tr key={enq._id || idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0 font-bold text-sm">
                          {(enq.name || enq.customerName || "G")[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">
                            {enq.name || enq.customerName || "Website Guest"}
                          </div>
                          {enq.email && <div className="text-slate-400 text-[11px]">{enq.email}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-700 font-medium">
                      {enq.phone || enq.mobile || "N/A"}
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-slate-600 max-w-xs">
                        {enq.message || enq.items || enq.enquiry || "Jewellery Enquiry"}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-500 whitespace-nowrap">
                      {formatDate(enq.createdAt || enq.date)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-5 py-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Showing {startIndex + 1}–{Math.min(startIndex + itemsPerPage, enquiries.length)} of {enquiries.length}
              </span>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={activePage === 1} className="p-1.5 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50">
                  <FiChevronLeft />
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`w-7 h-7 rounded-lg text-xs font-semibold border ${activePage === i + 1 ? "bg-amber-600 text-white border-amber-600" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                    {i + 1}
                  </button>
                ))}
                <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={activePage === totalPages} className="p-1.5 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50">
                  <FiChevronRight />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
