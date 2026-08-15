"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  getAdminToken,
  createProductJsonApi,
  createProductFormDataApi,
  updateProductApi,
  deleteProductApi,
} from "@/lib/adminApi";
import {
  getInitialAdminData,
  syncAdminDataDataStore,
  invalidateAdminCache,
} from "@/lib/dataStore";
import {
  FiPlus,
  FiRefreshCw,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiX,
  FiCheckCircle,
  FiAlertCircle,
  FiChevronLeft,
  FiChevronRight,
  FiUploadCloud,
  FiImage,
  FiBox,
} from "react-icons/fi";

const COLLECTIONS_ENUM = [
  "Gold", "Silver", "Diamond", "Gifting",
  "Wedding Collection", "Birth Stones", "Coins", "Mens",
];

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [alert, setAlert] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCollection, setFilterCollection] = useState("All");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Add Product Modal
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [uploadingProduct, setUploadingProduct] = useState(false);
  const [newProdImageMode, setNewProdImageMode] = useState("file");
  const [newProdFile, setNewProdFile] = useState(null);
  const [newProdFilePreview, setNewProdFilePreview] = useState(null);
  const [newProdForm, setNewProdForm] = useState({
    productName: "", sku: "", details: "",
    collections: [],          // multi-select — first one = primary collection
    category: "", subcategory: "", image: "",
  });

  // Edit Product Modal
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [editProdImageMode, setEditProdImageMode] = useState("file");
  const [editProdFile, setEditProdFile] = useState(null);
  const [editProdFilePreview, setEditProdFilePreview] = useState(null);
  const [editProdForm, setEditProdForm] = useState({
    id: "", productName: "", sku: "", details: "",
    collections: [],          // multi-select — first one = primary collection
    category: "", subcategory: "", image: "",
  });

  useEffect(() => {
    const token = getAdminToken();
    if (!token) { router.replace("/admin"); return; }
    const cached = getInitialAdminData();
    if (cached.products) setProducts(cached.products);
    if (cached.categories) setCategories(cached.categories);
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    setLoadingData(true);
    const res = await syncAdminDataDataStore();
    if (res?.success && res.data) {
      if (res.data.products) setProducts(res.data.products);
      if (res.data.categories) setCategories(res.data.categories);
    }
    setLoadingData(false);
  };

  const showAlert = (type, text) => {
    setAlert({ type, text });
    setTimeout(() => setAlert(null), 4000);
  };

  // Filtering
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      (p.productName || p.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.sku || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesColl = filterCollection === "All" || p.collection === filterCollection;
    return matchesSearch && matchesColl;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  /* ── ADD PRODUCT ─────────────────────────────────────────── */
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProdForm.productName || !newProdForm.sku) {
      showAlert("error", "Product Name and SKU are required.");
      return;
    }
    if (newProdForm.collections.length === 0) {
      showAlert("error", "Please select at least one collection.");
      return;
    }
    const primaryCollection = newProdForm.collections[0];
    const extraCollections = newProdForm.collections.slice(1);

    setUploadingProduct(true);
    let res;
    try {
      if (newProdImageMode === "file" && newProdFile) {
        const fd = new FormData();
        fd.append("image", newProdFile);
        fd.append("productName", newProdForm.productName.trim());
        fd.append("sku", newProdForm.sku.trim());
        fd.append("details", newProdForm.details.trim() || "High quality handcrafted jewellery.");
        fd.append("collection", primaryCollection);
        fd.append("collections", JSON.stringify(extraCollections));
        if (newProdForm.category) fd.append("category", newProdForm.category.trim());
        if (newProdForm.subcategory) fd.append("subcategory", newProdForm.subcategory.trim());
        res = await createProductFormDataApi(fd);
      } else if (newProdForm.image) {
        res = await createProductJsonApi({
          productName: newProdForm.productName.trim(),
          sku: newProdForm.sku.trim(),
          details: newProdForm.details.trim() || "High quality handcrafted jewellery.",
          collection: primaryCollection,
          collections: extraCollections,
          category: newProdForm.category,
          subcategory: newProdForm.subcategory,
          image: newProdForm.image.trim(),
        });
      } else {
        showAlert("error", "Please upload an image file or provide an Image URL.");
        setUploadingProduct(false);
        return;
      }
    } catch (err) {
      showAlert("error", "Upload failed: " + (err?.message || "Network error"));
      setUploadingProduct(false);
      return;
    }
    setUploadingProduct(false);
    if (res?.success) {
      showAlert("success", "Product added successfully!");
      setShowAddProductModal(false);
      setNewProdForm({ productName: "", sku: "", details: "", collections: [], category: "", subcategory: "", image: "" });
      setNewProdFile(null);
      setNewProdFilePreview(null);
      invalidateAdminCache();
      if (res.data) setProducts((prev) => [res.data, ...prev]);
      else loadData();
    } else {
      showAlert("error", res?.message || "Failed to create product.");
    }
  };

  /* ── EDIT PRODUCT ────────────────────────────────────────── */
  const handleOpenEditProduct = (prod) => {
    const primaryCollection = prod.collection || "";
    // Merge primary + extra into one unified collections array (deduped)
    const allCollections = [...new Set([
      ...(primaryCollection ? [primaryCollection] : []),
      ...(prod.collections || []),
    ])];
    setEditProdForm({
      id: prod._id || prod.id,
      productName: prod.productName || prod.title || "",
      sku: prod.sku || "",
      details: prod.details || "",
      collections: allCollections,
      category: prod.category || "",
      subcategory: prod.subcategory || "",
      image: prod.image || prod.images?.[0] || "",
    });
    setEditProdFile(null);
    setEditProdFilePreview(prod.image || prod.images?.[0] || null);
    setEditProdImageMode("file");
    setShowEditProductModal(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editProdForm.id || !editProdForm.productName) {
      showAlert("error", "Product Name is required.");
      return;
    }
    if (editProdForm.collections.length === 0) {
      showAlert("error", "Please select at least one collection.");
      return;
    }
    const primaryCollection = editProdForm.collections[0];
    const extraCollections = editProdForm.collections.slice(1);

    setUploadingProduct(true);
    let res;
    try {
      if (editProdImageMode === "file" && editProdFile) {
        const fd = new FormData();
        fd.append("image", editProdFile);
        fd.append("productName", editProdForm.productName.trim());
        fd.append("sku", editProdForm.sku.trim());
        fd.append("details", editProdForm.details.trim());
        fd.append("collection", primaryCollection);
        fd.append("collections", JSON.stringify(extraCollections));
        if (editProdForm.category) fd.append("category", editProdForm.category.trim());
        if (editProdForm.subcategory) fd.append("subcategory", editProdForm.subcategory.trim());
        res = await updateProductApi(editProdForm.id, fd);
      } else {
        res = await updateProductApi(editProdForm.id, {
          productName: editProdForm.productName.trim(),
          sku: editProdForm.sku.trim(),
          details: editProdForm.details.trim() || "High quality handcrafted jewellery.",
          collection: primaryCollection,
          collections: extraCollections,
          category: editProdForm.category.trim(),
          subcategory: editProdForm.subcategory.trim(),
          image: editProdForm.image.trim(),
        });
      }
    } catch (err) {
      showAlert("error", "Update failed: " + (err?.message || "Network error"));
      setUploadingProduct(false);
      return;
    }
    setUploadingProduct(false);
    if (res?.success) {
      showAlert("success", "Product updated successfully!");
      setShowEditProductModal(false);
      setEditProdFile(null);
      setEditProdFilePreview(null);
      invalidateAdminCache();
      const updated = {
        ...(res.data || {}),
        _id: editProdForm.id,
        productName: editProdForm.productName.trim(),
        sku: editProdForm.sku.trim(),
        details: editProdForm.details.trim(),
        collection: primaryCollection,
        collections: editProdForm.collections,
        category: editProdForm.category,
        subcategory: editProdForm.subcategory,
        image: editProdForm.image || undefined,
      };
      setProducts((prev) =>
        prev.map((p) => (String(p._id || p.id) === String(editProdForm.id) ? { ...p, ...updated } : p))
      );
    } else {
      showAlert("error", `Update failed: ${res?.message || "Unknown error"}`);
    }
  };

  /* ── DELETE PRODUCT ──────────────────────────────────────── */
  const handleDeleteProduct = async (prodId, prodTitle) => {
    if (!window.confirm(`Delete product "${prodTitle}"?`)) return;
    const res = await deleteProductApi(prodId);
    if (res?.success) {
      showAlert("success", "Product deleted successfully!");
      invalidateAdminCache();
      setProducts((prev) => prev.filter((p) => (p._id || p.id) !== prodId));
    } else {
      showAlert("error", res?.message || "Failed to delete product.");
    }
  };

  /* ── SUBCATEGORIES FOR SELECTED COLLECTION ───────────────── */
  const getSubcatsForCollection = (collection) => {
    const cats = categories.filter((c) => c.collection === collection);
    const subs = new Set();
    cats.forEach((c) => (c.subcategories || []).forEach((s) => subs.add(s)));
    return Array.from(subs);
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
          <h3 className="text-lg font-bold text-slate-900">Products Catalog</h3>
          <p className="text-xs text-slate-500">{filteredProducts.length} products found</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="text"
              placeholder="Search name/SKU..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 text-xs focus:outline-none focus:border-amber-600 w-52"
            />
          </div>
          {/* Collection filter */}
          <select
            value={filterCollection}
            onChange={(e) => { setFilterCollection(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 font-medium focus:outline-none focus:border-amber-600"
          >
            <option value="All">All Collections</option>
            {COLLECTIONS_ENUM.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <button
            onClick={loadData}
            className="p-2 rounded-xl bg-slate-100/80 border border-slate-200 text-slate-600 hover:text-amber-600 hover:border-amber-400 hover:bg-white transition-all"
          >
            <FiRefreshCw className={`text-base ${loadingData ? "animate-spin text-amber-600" : ""}`} />
          </button>
          <button
            onClick={() => setShowAddProductModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#b89028] text-white font-bold text-xs flex items-center gap-2 hover:brightness-105 shadow-sm whitespace-nowrap"
          >
            <FiPlus className="text-base" /> Add Product
          </button>
        </div>
      </div>

      {/* Products Table */}
      {paginatedProducts.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white border border-slate-200 text-center space-y-3">
          <FiBox className="text-4xl text-slate-300 mx-auto" />
          <h4 className="text-slate-800 font-bold text-base">No products found</h4>
          <p className="text-xs text-slate-500">Try a different filter or add your first product.</p>
          <button onClick={() => setShowAddProductModal(true)} className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-semibold inline-flex items-center gap-2">
            <FiPlus /> Add Product
          </button>
        </div>
      ) : (
        <div className="rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-5 py-3.5 font-semibold text-slate-500 uppercase tracking-wider w-16">Image</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-slate-500 uppercase tracking-wider">Product Name</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-slate-500 uppercase tracking-wider">SKU</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-slate-500 uppercase tracking-wider">Collection</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-slate-500 uppercase tracking-wider">Subcategory</th>
                  <th className="text-right px-5 py-3.5 font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedProducts.map((prod) => (
                  <tr key={prod._id || prod.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                        {(prod.image || prod.images?.[0]) ? (
                          <img src={prod.image || prod.images?.[0]} alt={prod.productName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <FiImage className="text-lg" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="font-semibold text-slate-900 truncate max-w-[200px]" title={prod.productName || prod.title}>
                        {prod.productName || prod.title || "—"}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-600 font-mono">{prod.sku || "—"}</td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1">
                        {/* Primary collection */}
                        {prod.collection && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-semibold">
                            {prod.collection}
                          </span>
                        )}
                        {/* Extra collections */}
                        {(prod.collections || [])
                          .filter((c) => c !== prod.collection)
                          .map((c) => (
                            <span key={c} className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-[11px] font-medium">
                              {c}
                            </span>
                          ))}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{prod.category || "—"}</td>
                    <td className="px-5 py-3 text-slate-500">{prod.subcategory || "—"}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditProduct(prod)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-800 transition-colors"
                          title="Edit"
                        >
                          <FiEdit className="text-sm" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod._id || prod.id, prod.productName || prod.title)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 className="text-sm" />
                        </button>
                      </div>
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
                Showing {startIndex + 1}–{Math.min(startIndex + itemsPerPage, filteredProducts.length)} of {filteredProducts.length}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={activePage === 1}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50"
                >
                  <FiChevronLeft />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-7 h-7 rounded-lg text-xs font-semibold border ${activePage === page ? "bg-amber-600 text-white border-amber-600" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={activePage === totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50"
                >
                  <FiChevronRight />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── ADD PRODUCT MODAL ──────────────────────────────────── */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Add New Product</h3>
              <button onClick={() => setShowAddProductModal(false)} className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
                <FiX />
              </button>
            </div>
            <form onSubmit={handleCreateProduct} className="p-6 space-y-4">
              {/* Image Mode Toggle */}
              <div className="flex rounded-xl overflow-hidden border border-slate-200">
                <button type="button" onClick={() => setNewProdImageMode("file")} className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-2 transition-all ${newProdImageMode === "file" ? "bg-amber-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}>
                  <FiUploadCloud /> Upload File
                </button>
                <button type="button" onClick={() => setNewProdImageMode("url")} className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-2 transition-all ${newProdImageMode === "url" ? "bg-amber-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}>
                  <FiImage /> Image URL
                </button>
              </div>

              {newProdImageMode === "file" ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Product Image *</label>
                  <input
                    key="new-prod-file"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) { setNewProdFile(f); setNewProdFilePreview(URL.createObjectURL(f)); }
                    }}
                    className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-amber-50 file:text-amber-700 file:font-semibold hover:file:bg-amber-100"
                  />
                  {newProdFilePreview && <img src={newProdFilePreview} alt="Preview" className="mt-2 h-24 w-24 object-cover rounded-lg border border-slate-200" />}
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Image URL *</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newProdForm.image}
                    onChange={(e) => setNewProdForm((f) => ({ ...f, image: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-amber-600"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Product Name *</label>
                  <input type="text" value={newProdForm.productName} onChange={(e) => setNewProdForm((f) => ({ ...f, productName: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-amber-600" placeholder="e.g. Gold Ring" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">SKU *</label>
                  <input type="text" value={newProdForm.sku} onChange={(e) => setNewProdForm((f) => ({ ...f, sku: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-amber-600" placeholder="e.g. VJ001" required />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Description</label>
                <textarea rows={3} value={newProdForm.details} onChange={(e) => setNewProdForm((f) => ({ ...f, details: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-amber-600 resize-none" placeholder="Product description..." />
              </div>

              {/* Collections multi-select */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">
                  Collections * <span className="text-slate-400 font-normal">(select one or more — first selected = primary)</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {COLLECTIONS_ENUM.map((c) => {
                    const checked = newProdForm.collections.includes(c);
                    const isPrimary = newProdForm.collections[0] === c;
                    return (
                      <label
                        key={c}
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border cursor-pointer transition-all text-xs font-medium select-none ${
                          checked
                            ? "bg-amber-50 border-amber-400 text-amber-900"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:border-amber-300 hover:bg-amber-50/40"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            setNewProdForm((f) => {
                              const next = checked
                                ? f.collections.filter((x) => x !== c)
                                : [...f.collections, c];
                              return { ...f, collections: next };
                            });
                          }}
                          className="accent-amber-600 w-3.5 h-3.5 shrink-0"
                        />
                        <span className="flex-1">{c}</span>
                        {isPrimary && (
                          <span className="text-[10px] bg-amber-600 text-white px-1.5 py-0.5 rounded-full font-bold shrink-0">
                            Primary
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
                {newProdForm.collections.length === 0 && (
                  <p className="text-[11px] text-red-500 mt-1.5">Select at least one collection</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Category</label>
                  <input
                    type="text"
                    value={newProdForm.category}
                    onChange={(e) => setNewProdForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-amber-600"
                    placeholder="e.g. Rings"
                    list="new-cats"
                  />
                  <datalist id="new-cats">
                    {(newProdForm.collections[0]
                      ? getSubcatsForCollection(newProdForm.collections[0])
                      : []
                    ).map((s) => <option key={s} value={s} />)}
                  </datalist>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Subcategory</label>
                  <input
                    type="text"
                    value={newProdForm.subcategory}
                    onChange={(e) => setNewProdForm((f) => ({ ...f, subcategory: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-amber-600"
                    placeholder="e.g. 22 Karat Rings"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button type="button" onClick={() => setShowAddProductModal(false)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={uploadingProduct} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#b89028] text-white font-bold text-xs hover:brightness-105 disabled:opacity-60 flex items-center gap-2">
                  {uploadingProduct ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" /> Uploading...</> : <><FiPlus /> Add Product</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── EDIT PRODUCT MODAL ─────────────────────────────────── */}
      {showEditProductModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Edit Product</h3>
              <button onClick={() => setShowEditProductModal(false)} className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"><FiX /></button>
            </div>
            <form onSubmit={handleUpdateProduct} className="p-6 space-y-4">
              <div className="flex rounded-xl overflow-hidden border border-slate-200">
                <button type="button" onClick={() => setEditProdImageMode("file")} className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-2 transition-all ${editProdImageMode === "file" ? "bg-amber-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}>
                  <FiUploadCloud /> Upload New Image
                </button>
                <button type="button" onClick={() => setEditProdImageMode("url")} className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-2 transition-all ${editProdImageMode === "url" ? "bg-amber-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}>
                  <FiImage /> Use URL
                </button>
              </div>

              {editProdImageMode === "file" ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Product Image (leave empty to keep current)</label>
                  <input
                    key="edit-prod-file"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) { setEditProdFile(f); setEditProdFilePreview(URL.createObjectURL(f)); }
                    }}
                    className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-amber-50 file:text-amber-700 file:font-semibold hover:file:bg-amber-100"
                  />
                  {editProdFilePreview && <img src={editProdFilePreview} alt="Preview" className="mt-2 h-24 w-24 object-cover rounded-lg border border-slate-200" />}
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Image URL</label>
                  <input type="url" placeholder="https://..." value={editProdForm.image} onChange={(e) => setEditProdForm((f) => ({ ...f, image: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-amber-600" />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Product Name *</label>
                  <input type="text" value={editProdForm.productName} onChange={(e) => setEditProdForm((f) => ({ ...f, productName: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-amber-600" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">SKU</label>
                  <input type="text" value={editProdForm.sku} onChange={(e) => setEditProdForm((f) => ({ ...f, sku: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-amber-600" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Description</label>
                <textarea rows={3} value={editProdForm.details} onChange={(e) => setEditProdForm((f) => ({ ...f, details: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-amber-600 resize-none" />
              </div>

              {/* Collections multi-select */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">
                  Collections * <span className="text-slate-400 font-normal">(select one or more — first selected = primary)</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {COLLECTIONS_ENUM.map((c) => {
                    const checked = editProdForm.collections.includes(c);
                    const isPrimary = editProdForm.collections[0] === c;
                    return (
                      <label
                        key={c}
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border cursor-pointer transition-all text-xs font-medium select-none ${
                          checked
                            ? "bg-amber-50 border-amber-400 text-amber-900"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:border-amber-300 hover:bg-amber-50/40"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            setEditProdForm((f) => {
                              const next = checked
                                ? f.collections.filter((x) => x !== c)
                                : [...f.collections, c];
                              return { ...f, collections: next };
                            });
                          }}
                          className="accent-amber-600 w-3.5 h-3.5 shrink-0"
                        />
                        <span className="flex-1">{c}</span>
                        {isPrimary && (
                          <span className="text-[10px] bg-amber-600 text-white px-1.5 py-0.5 rounded-full font-bold shrink-0">
                            Primary
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
                {editProdForm.collections.length === 0 && (
                  <p className="text-[11px] text-red-500 mt-1.5">Select at least one collection</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Category</label>
                  <input
                    type="text"
                    value={editProdForm.category}
                    onChange={(e) => setEditProdForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Subcategory</label>
                  <input
                    type="text"
                    value={editProdForm.subcategory}
                    onChange={(e) => setEditProdForm((f) => ({ ...f, subcategory: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button type="button" onClick={() => setShowEditProductModal(false)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={uploadingProduct} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#b89028] text-white font-bold text-xs hover:brightness-105 disabled:opacity-60 flex items-center gap-2">
                  {uploadingProduct ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" /> Saving...</> : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
