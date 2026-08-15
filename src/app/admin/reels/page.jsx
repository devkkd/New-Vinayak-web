"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getAdminToken,
  createReelApi,
  updateReelApi,
  deleteReelApi,
} from "@/lib/adminApi";
import {
  getInitialAdminData,
  syncAdminDataDataStore,
} from "@/lib/dataStore";
import {
  FiPlus,
  FiRefreshCw,
  FiTrash2,
  FiX,
  FiCheckCircle,
  FiAlertCircle,
  FiVideo,
  FiEye,
  FiEyeOff,
  FiUploadCloud,
  FiImage,
  FiPlay,
} from "react-icons/fi";

const MAX_INSTAGRAM_REELS = 7;
const INSTAGRAM_HANDLE = "vinayak_jewellers_jaipur";

export default function ReelsPage() {
  const router = useRouter();
  const [reels, setReels] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [alert, setAlert] = useState(null);
  const [uploadingReel, setUploadingReel] = useState(false);

  // Add Reel Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [reelVideoFile, setReelVideoFile] = useState(null);
  const [reelVideoPreview, setReelVideoPreview] = useState(null);
  const [reelThumbFile, setReelThumbFile] = useState(null);
  const [reelThumbPreview, setReelThumbPreview] = useState(null);

  useEffect(() => {
    const token = getAdminToken();
    if (!token) { router.replace("/admin"); return; }
    const cached = getInitialAdminData();
    if (cached.reels) setReels(cached.reels);
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    setLoadingData(true);
    const res = await syncAdminDataDataStore();
    if (res?.success && res.data?.reels) setReels(res.data.reels);
    setLoadingData(false);
  };

  const showAlert = (type, text) => {
    setAlert({ type, text });
    setTimeout(() => setAlert(null), 4000);
  };

  const resetReelForm = () => {
    if (reelVideoPreview) URL.revokeObjectURL(reelVideoPreview);
    if (reelThumbPreview) URL.revokeObjectURL(reelThumbPreview);
    setReelVideoFile(null); setReelVideoPreview(null);
    setReelThumbFile(null); setReelThumbPreview(null);
  };

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("video/")) { showAlert("error", "Please select a valid video file (MP4, MOV, WEBM)."); return; }
    if (reelVideoPreview) URL.revokeObjectURL(reelVideoPreview);
    setReelVideoFile(file);
    setReelVideoPreview(URL.createObjectURL(file));
  };

  const handleThumbChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { showAlert("error", "Please select a valid image file."); return; }
    if (reelThumbPreview) URL.revokeObjectURL(reelThumbPreview);
    setReelThumbFile(file);
    setReelThumbPreview(URL.createObjectURL(file));
  };

  const handleAddReel = async (e) => {
    e.preventDefault();
    if (!reelVideoFile) { showAlert("error", "Please upload a reel video."); return; }
    setUploadingReel(true);
    const fd = new FormData();
    fd.append("video", reelVideoFile);
    if (reelThumbFile) fd.append("thumbnail", reelThumbFile);
    const wasAtMax = reels.length >= MAX_INSTAGRAM_REELS;
    const res = await createReelApi(fd);
    setUploadingReel(false);
    if (res?.success) {
      showAlert("success", wasAtMax ? "New reel uploaded! Oldest reel was automatically removed (max 7 limit)." : "Instagram reel uploaded successfully!");
      setShowAddModal(false);
      resetReelForm();
      loadData();
    } else {
      showAlert("error", res?.message || "Failed to upload reel.");
    }
  };

  const handleToggleActive = async (reel) => {
    const fd = new FormData();
    fd.append("isActive", String(!reel.isActive));
    const res = await updateReelApi(reel._id, fd);
    if (res?.success) {
      showAlert("success", `Reel ${reel.isActive ? "hidden from" : "now visible on"} website.`);
      loadData();
    } else {
      showAlert("error", res?.message || "Failed to update reel.");
    }
  };

  const handleDeleteReel = async (reelId) => {
    if (!window.confirm("Delete this reel permanently?")) return;
    const res = await deleteReelApi(reelId);
    if (res?.success) {
      showAlert("success", "Reel deleted successfully.");
      setReels((prev) => prev.filter((r) => r._id !== reelId));
    } else {
      showAlert("error", res?.message || "Failed to delete reel.");
    }
  };

  const sortedReels = [...reels].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  const activeReelsCount = reels.filter((r) => r.isActive !== false).length;

  return (
    <div className="p-4 sm:p-8 space-y-6">
      {/* Alert */}
      {alert && (
        <div className={`p-3.5 rounded-xl text-xs flex items-center justify-between border ${alert.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-800"}`}>
          <div className="flex items-center gap-2">
            {alert.type === "success" ? <FiCheckCircle className="text-emerald-600 text-base" /> : <FiAlertCircle className="text-red-600 text-base" />}
            <span className="font-medium">{alert.text}</span>
          </div>
          <button onClick={() => setAlert(null)} className="text-slate-400 hover:text-slate-600"><FiX /></button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Instagram Reels</h3>
          <p className="text-xs text-slate-500">
            {reels.length}/{MAX_INSTAGRAM_REELS} reels &bull; {activeReelsCount} live on homepage
            &bull; @{INSTAGRAM_HANDLE}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadData} className="p-2 rounded-xl bg-slate-100/80 border border-slate-200 text-slate-600 hover:text-amber-600 hover:border-amber-400 hover:bg-white transition-all">
            <FiRefreshCw className={`text-base ${loadingData ? "animate-spin text-amber-600" : ""}`} />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#b89028] text-white font-bold text-xs flex items-center gap-2 hover:brightness-105 shadow-sm whitespace-nowrap"
          >
            <FiPlus className="text-base" /> Upload Reel
          </button>
        </div>
      </div>

      {/* Max limit warning */}
      {reels.length >= MAX_INSTAGRAM_REELS && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
          <FiAlertCircle className="text-amber-600 shrink-0" />
          <span>Maximum {MAX_INSTAGRAM_REELS} reels reached. Uploading a new one will auto-remove the oldest reel.</span>
        </div>
      )}

      {/* Reels Grid */}
      {sortedReels.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white border border-slate-200 text-center space-y-3">
          <FiVideo className="text-4xl text-slate-300 mx-auto" />
          <h4 className="text-slate-800 font-bold text-base">No reels uploaded yet</h4>
          <p className="text-xs text-slate-500">Upload your first Instagram reel to show on the homepage.</p>
          <button onClick={() => setShowAddModal(true)} className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-semibold inline-flex items-center gap-2">
            <FiPlus /> Upload First Reel
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {sortedReels.map((reel, idx) => (
            <div key={reel._id || idx} className={`rounded-2xl bg-white border shadow-sm overflow-hidden transition-all hover:shadow-md ${reel.isActive !== false ? "border-slate-200/80 hover:border-amber-300" : "border-slate-200/50 opacity-60"}`}>
              {/* Thumbnail / Video Preview */}
              <div className="relative aspect-[9/16] bg-slate-900 overflow-hidden">
                {reel.thumbnail ? (
                  <img src={reel.thumbnail} alt={`Reel ${idx + 1}`} className="w-full h-full object-cover" />
                ) : reel.videoUrl ? (
                  <video src={reel.videoUrl} className="w-full h-full object-cover" muted playsInline />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FiPlay className="text-4xl text-slate-600" />
                  </div>
                )}
                {/* Status Badge */}
                <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${reel.isActive !== false ? "bg-emerald-500 text-white" : "bg-slate-700/80 text-slate-200"}`}>
                  {reel.isActive !== false ? <><FiEye className="text-[11px]" /> Live</> : <><FiEyeOff className="text-[11px]" /> Hidden</>}
                </div>
                {/* Reel number */}
                <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/60 text-white text-[10px] font-bold">
                  #{idx + 1}
                </div>
              </div>

              {/* Actions */}
              <div className="p-3 flex items-center justify-between gap-2">
                <div className="text-[11px] text-slate-500 truncate">
                  {reel.createdAt ? new Date(reel.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : "—"}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleToggleActive(reel)}
                    title={reel.isActive !== false ? "Hide from website" : "Show on website"}
                    className={`p-1.5 rounded-lg text-xs transition-colors ${reel.isActive !== false ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200" : "bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200"}`}
                  >
                    {reel.isActive !== false ? <FiEye /> : <FiEyeOff />}
                  </button>
                  <button
                    onClick={() => handleDeleteReel(reel._id)}
                    title="Delete reel"
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-400 hover:text-red-600 text-xs transition-colors border border-slate-200"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── UPLOAD REEL MODAL ──────────────────────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Upload Instagram Reel</h3>
              <button onClick={() => { setShowAddModal(false); resetReelForm(); }} className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"><FiX /></button>
            </div>
            <form onSubmit={handleAddReel} className="p-6 space-y-5">
              {/* Video Upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wider">
                  <FiVideo className="inline mr-1" /> Reel Video *
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  required
                  className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-amber-50 file:text-amber-700 file:font-semibold hover:file:bg-amber-100"
                />
                {reelVideoPreview && (
                  <video src={reelVideoPreview} controls className="mt-2 rounded-xl w-full max-h-40 object-cover bg-slate-900" />
                )}
                <p className="text-[11px] text-slate-400 mt-1">MP4, MOV, WEBM — max 100MB</p>
              </div>

              {/* Thumbnail Upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wider">
                  <FiImage className="inline mr-1" /> Thumbnail Image (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbChange}
                  className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-slate-50 file:text-slate-700 file:font-semibold hover:file:bg-slate-100"
                />
                {reelThumbPreview && (
                  <img src={reelThumbPreview} alt="Thumb" className="mt-2 h-20 w-20 object-cover rounded-lg border border-slate-200" />
                )}
              </div>

              {reels.length >= MAX_INSTAGRAM_REELS && (
                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">
                  ⚠️ You&apos;re at the max limit. The oldest reel will be automatically removed.
                </p>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowAddModal(false); resetReelForm(); }} className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={uploadingReel} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#b89028] text-white font-bold text-xs hover:brightness-105 disabled:opacity-60 flex items-center gap-2">
                  {uploadingReel ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" /> Uploading...</> : <><FiUploadCloud /> Upload Reel</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
