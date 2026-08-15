"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getAdminToken,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
  addSubcategoryApi,
  deleteSubcategoryApi,
} from "@/lib/adminApi";
import {
  getInitialAdminData,
  syncAdminDataDataStore,
} from "@/lib/dataStore";
import {
  FiPlus,
  FiRefreshCw,
  FiEdit,
  FiTrash2,
  FiX,
  FiCheckCircle,
  FiAlertCircle,
  FiFolder,
  FiChevronLeft,
  FiChevronRight,
  FiTag,
} from "react-icons/fi";

const COLLECTIONS_ENUM = [
  "Gold", "Silver", "Diamond", "Gifting",
  "Wedding Collection", "Birth Stones", "Coins", "Mens",
];

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [alert, setAlert] = useState(null);
  const [filterCollection, setFilterCollection] = useState("All");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Add Category Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCatForm, setNewCatForm] = useState({ collection: "Gold", category: "", subcategoriesStr: "" });

  // Edit Category Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCatForm, setEditCatForm] = useState({ id: "", collection: "Gold", category: "", subcategoriesStr: "" });

  // Add Subcategory Modal
  const [showAddSubModal, setShowAddSubModal] = useState(false);
  const [selectedCatForSub, setSelectedCatForSub] = useState(null);
  const [newSubName, setNewSubName] = useState("");

  useEffect(() => {
    const token = getAdminToken();
    if (!token) { router.replace("/admin"); return; }
    const cached = getInitialAdminData();
    if (cached.categories) setCategories(cached.categories);
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    setLoadingData(true);
    const res = await syncAdminDataDataStore();
    if (res?.success && res.data?.categories) setCategories(res.data.categories);
    setLoadingData(false);
  };

  const showAlert = (type, text) => {
    setAlert({ type, text });
    setTimeout(() => setAlert(null), 4000);
  };

  const displayedCategories = filterCollection === "All"
    ? categories
    : categories.filter((c) => c.collection === filterCollection);

  const totalPages = Math.ceil(displayedCategories.length / itemsPerPage) || 1;
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * itemsPerPage;
  const paginatedCategories = displayedCategories.slice(startIndex, startIndex + itemsPerPage);

  /* ── HANDLERS ──────────────────────────────────────────────── */
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCatForm.category.trim()) { showAlert("error", "Category name is required."); return; }
    const subArray = newCatForm.subcategoriesStr.split(",").map((s) => s.trim()).filter(Boolean);
    const res = await createCategoryApi({ collection: newCatForm.collection, category: newCatForm.category.trim(), subcategories: subArray });
    if (res?.success) {
      showAlert("success", "Category created successfully!");
      setShowAddModal(false);
      setNewCatForm({ collection: "Gold", category: "", subcategoriesStr: "" });
      loadData();
    } else {
      showAlert("error", res?.message || "Failed to create category.");
    }
  };

  const handleOpenEditCategory = (cat) => {
    setEditCatForm({ id: cat._id, collection: cat.collection || "Gold", category: cat.category || "", subcategoriesStr: (cat.subcategories || []).join(", ") });
    setShowEditModal(true);
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editCatForm.category.trim()) { showAlert("error", "Category name is required."); return; }
    const subArray = editCatForm.subcategoriesStr.split(",").map((s) => s.trim()).filter(Boolean);
    const res = await updateCategoryApi(editCatForm.id, { collection: editCatForm.collection, category: editCatForm.category.trim(), subcategories: subArray });
    if (res?.success) {
      showAlert("success", "Category updated successfully!");
      setShowEditModal(false);
      loadData();
    } else {
      showAlert("error", res?.message || "Failed to update category.");
    }
  };

  const handleDeleteCategory = async (catId, catName) => {
    if (!window.confirm(`Delete category "${catName}"?`)) return;
    const res = await deleteCategoryApi(catId);
    if (res?.success) {
      showAlert("success", "Category deleted!");
      setCategories((prev) => prev.filter((c) => c._id !== catId));
    } else {
      showAlert("error", res?.message || "Failed to delete.");
    }
  };

  const handleAddSubcategory = async (e) => {
    e.preventDefault();
    if (!selectedCatForSub || !newSubName.trim()) { showAlert("error", "Enter a subcategory name."); return; }
    const res = await addSubcategoryApi(selectedCatForSub._id, newSubName.trim());
    if (res?.success) {
      showAlert("success", `Subcategory "${newSubName}" added!`);
      setShowAddSubModal(false);
      setNewSubName("");
      setSelectedCatForSub(null);
      loadData();
    } else {
      showAlert("error", res?.message || "Failed to add subcategory.");
    }
  };

  const handleDeleteSubcategory = async (catId, subName) => {
    if (!window.confirm(`Remove subcategory "${subName}"?`)) return;
    const res = await deleteSubcategoryApi(catId, subName);
    if (res?.success) {
      showAlert("success", "Subcategory removed!");
      loadData();
    } else {
      showAlert("error", res?.message || "Failed to remove.");
    }
  };

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
          <h3 className="text-lg font-bold text-slate-900">Categories & Subcategories</h3>
          <p className="text-xs text-slate-500">Organize your jewellery catalog ({displayedCategories.length} found)</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={filterCollection}
            onChange={(e) => { setFilterCollection(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 font-medium focus:outline-none focus:border-amber-600"
          >
            <option value="All">All Collections ({categories.length})</option>
            {COLLECTIONS_ENUM.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <button onClick={loadData} className="p-2 rounded-xl bg-slate-100/80 border border-slate-200 text-slate-600 hover:text-amber-600 hover:border-amber-400 hover:bg-white transition-all">
            <FiRefreshCw className={`text-base ${loadingData ? "animate-spin text-amber-600" : ""}`} />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#b89028] text-white font-bold text-xs flex items-center gap-2 hover:brightness-105 shadow-sm whitespace-nowrap"
          >
            <FiPlus className="text-base" /> Add Category
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      {displayedCategories.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white border border-slate-200 text-center space-y-3">
          <FiFolder className="text-4xl text-slate-300 mx-auto" />
          <h4 className="text-slate-800 font-bold text-base">No categories found</h4>
          <p className="text-xs text-slate-500">Click "Add Category" to create your first category.</p>
          <button onClick={() => setShowAddModal(true)} className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-semibold inline-flex items-center gap-2">
            <FiPlus /> Add Category Now
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedCategories.map((catDoc) => (
              <div key={catDoc._id} className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-amber-300 transition-all">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold tracking-wide">
                      {catDoc.collection}
                    </span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleOpenEditCategory(catDoc)} title="Edit" className="p-1.5 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-800 text-xs transition-colors">
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => { setSelectedCatForSub(catDoc); setShowAddSubModal(true); }}
                        title="Add Subcategory"
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-800 text-xs flex items-center gap-1 font-medium transition-colors"
                      >
                        <FiPlus /> Sub
                      </button>
                      <button onClick={() => handleDeleteCategory(catDoc._id, catDoc.category)} title="Delete" className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-400 hover:text-red-600 text-xs transition-colors">
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <FiFolder className="text-amber-600 shrink-0" />
                    {catDoc.category}
                  </h4>

                  {/* Subcategories */}
                  <div className="flex flex-wrap gap-1.5">
                    {(catDoc.subcategories || []).length === 0 ? (
                      <span className="text-xs text-slate-400 italic">No subcategories yet</span>
                    ) : (
                      (catDoc.subcategories || []).map((sub) => (
                        <span
                          key={sub}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200 group/sub"
                        >
                          <FiTag className="text-[10px] text-slate-400" />
                          {sub}
                          <button
                            onClick={() => handleDeleteSubcategory(catDoc._id, sub)}
                            className="text-slate-300 hover:text-red-500 transition-colors ml-0.5"
                            title="Remove subcategory"
                          >
                            <FiX className="text-[10px]" />
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">
                    {(catDoc.subcategories || []).length} subcategories
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Showing {startIndex + 1}–{Math.min(startIndex + itemsPerPage, displayedCategories.length)} of {displayedCategories.length}
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
        </>
      )}

      {/* ── ADD CATEGORY MODAL ─────────────────────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Add New Category</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"><FiX /></button>
            </div>
            <form onSubmit={handleCreateCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Collection *</label>
                <select value={newCatForm.collection} onChange={(e) => setNewCatForm((f) => ({ ...f, collection: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-amber-600">
                  {COLLECTIONS_ENUM.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Category Name *</label>
                <input type="text" value={newCatForm.category} onChange={(e) => setNewCatForm((f) => ({ ...f, category: e.target.value }))} placeholder="e.g. Rings" required className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-amber-600" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Subcategories (comma-separated)</label>
                <textarea rows={3} value={newCatForm.subcategoriesStr} onChange={(e) => setNewCatForm((f) => ({ ...f, subcategoriesStr: e.target.value }))} placeholder="e.g. 22 Karat, 18 Karat, Bridal" className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-amber-600 resize-none" />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50">Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#b89028] text-white font-bold text-xs hover:brightness-105 flex items-center gap-2">
                  <FiPlus /> Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── EDIT CATEGORY MODAL ────────────────────────────────── */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Edit Category</h3>
              <button onClick={() => setShowEditModal(false)} className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"><FiX /></button>
            </div>
            <form onSubmit={handleUpdateCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Collection *</label>
                <select value={editCatForm.collection} onChange={(e) => setEditCatForm((f) => ({ ...f, collection: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-amber-600">
                  {COLLECTIONS_ENUM.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Category Name *</label>
                <input type="text" value={editCatForm.category} onChange={(e) => setEditCatForm((f) => ({ ...f, category: e.target.value }))} required className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-amber-600" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Subcategories (comma-separated)</label>
                <textarea rows={3} value={editCatForm.subcategoriesStr} onChange={(e) => setEditCatForm((f) => ({ ...f, subcategoriesStr: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-amber-600 resize-none" />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50">Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#b89028] text-white font-bold text-xs hover:brightness-105 flex items-center gap-2">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── ADD SUBCATEGORY MODAL ──────────────────────────────── */}
      {showAddSubModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Add Subcategory</h3>
              <button onClick={() => { setShowAddSubModal(false); setNewSubName(""); setSelectedCatForSub(null); }} className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"><FiX /></button>
            </div>
            <form onSubmit={handleAddSubcategory} className="p-6 space-y-4">
              <p className="text-xs text-slate-500">
                Adding to: <span className="font-semibold text-slate-800">{selectedCatForSub?.category}</span>
                <span className="ml-1 text-amber-700 font-medium">({selectedCatForSub?.collection})</span>
              </p>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Subcategory Name *</label>
                <input type="text" value={newSubName} onChange={(e) => setNewSubName(e.target.value)} placeholder="e.g. 22 Karat" required autoFocus className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-amber-600" />
              </div>
              <div className="flex items-center justify-end gap-3 pt-1">
                <button type="button" onClick={() => { setShowAddSubModal(false); setNewSubName(""); setSelectedCatForSub(null); }} className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50">Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#b89028] text-white font-bold text-xs hover:brightness-105 flex items-center gap-2">
                  <FiPlus /> Add Subcategory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
