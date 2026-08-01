"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  removeAdminAuth,
  API_BASE_URL,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
  addSubcategoryApi,
  deleteSubcategoryApi,
  createProductJsonApi,
  createProductFormDataApi,
  updateProductApi,
  deleteProductApi,
  createReelApi,
  updateReelApi,
  deleteReelApi,
} from "@/lib/adminApi";
import {
  getInitialAdminData,
  syncAdminDataDataStore,
} from "@/lib/dataStore";
import {
  FiGrid,
  FiBox,
  FiFolder,
  FiMenu,
  FiMail,
  FiVideo,
  FiSettings,
  FiLogOut,
  FiSearch,
  FiPlus,
  FiRefreshCw,
  FiEdit,
  FiTrash2,
  FiExternalLink,
  FiUser,
  FiCheckCircle,
  FiTrendingUp,
  FiMenu as FiMenuIcon,
  FiX,
  FiAlertCircle,
  FiTag,
  FiChevronLeft,
  FiChevronRight,
  FiUploadCloud,
  FiImage,
  FiPlay,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

const COLLECTIONS_ENUM = [
  "Gold",
  "Silver",
  "Diamond",
  "Gifting",
  "Wedding Collection",
  "Birth Stones",
  "Coins",
  "Mens",
];

const MAX_INSTAGRAM_REELS = 7;
const INSTAGRAM_HANDLE = "vinayak_jewellers_jaipur";

export default function AdminDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCollection, setFilterCollection] = useState("All");
  const [loadingData, setLoadingData] = useState(false);
  const [alert, setAlert] = useState(null); // { type: "success"|"error", text: string }

  // Live Data States
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [menus, setMenus] = useState([]);
  const [reels, setReels] = useState([]);

  // Pagination State for Products
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Pagination State for Categories
  const [categoryCurrentPage, setCategoryCurrentPage] = useState(1);
  const [categoryItemsPerPage, setCategoryItemsPerPage] = useState(9);

  // Pagination State for Enquiries
  const [enquiryCurrentPage, setEnquiryCurrentPage] = useState(1);
  const [enquiryItemsPerPage] = useState(10);

  // Modals state
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCatForm, setNewCatForm] = useState({
    collection: "Gold",
    category: "",
    subcategoriesStr: "",
  });

  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [editCatForm, setEditCatForm] = useState({
    id: "",
    collection: "Gold",
    category: "",
    subcategoriesStr: "",
  });

  const [showAddSubModal, setShowAddSubModal] = useState(false);
  const [selectedCatForSub, setSelectedCatForSub] = useState(null);
  const [newSubName, setNewSubName] = useState("");

  // Add Product State with File Upload & URL
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProdImageMode, setNewProdImageMode] = useState("file"); // "file" | "url"
  const [newProdFile, setNewProdFile] = useState(null);
  const [newProdFilePreview, setNewProdFilePreview] = useState(null);
  const [newProdForm, setNewProdForm] = useState({
    productName: "",
    sku: "",
    details: "",
    collection: "Gold",
    category: "",
    subcategory: "",
    image: "",
  });

  // Edit Product State with File Upload & URL
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [editProdImageMode, setEditProdImageMode] = useState("file"); // "file" | "url"
  const [editProdFile, setEditProdFile] = useState(null);
  const [editProdFilePreview, setEditProdFilePreview] = useState(null);
  const [editProdForm, setEditProdForm] = useState({
    id: "",
    productName: "",
    sku: "",
    details: "",
    collection: "Gold",
    category: "",
    subcategory: "",
    image: "",
  });

  // Instagram Reels State
  const [showAddReelModal, setShowAddReelModal] = useState(false);
  const [reelVideoFile, setReelVideoFile] = useState(null);
  const [reelVideoPreview, setReelVideoPreview] = useState(null);
  const [reelThumbFile, setReelThumbFile] = useState(null);
  const [reelThumbPreview, setReelThumbPreview] = useState(null);
  const [uploadingReel, setUploadingReel] = useState(false);

  // Load Initial Data instantly from Cache + Background Sync
  useEffect(() => {
    // Instant 0ms load from cache
    const cached = getInitialAdminData();
    if (cached.categories) setCategories(cached.categories);
    if (cached.products) setProducts(cached.products);
    if (cached.enquiries) setEnquiries(cached.enquiries);
    if (cached.menus) setMenus(cached.menus);
    if (cached.reels) setReels(cached.reels);

    // Silent background sync
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoadingData(true);
    const res = await syncAdminDataDataStore();
    if (res && res.success && res.data) {
      if (res.data.categories) setCategories(res.data.categories);
      if (res.data.products) setProducts(res.data.products);
      if (res.data.enquiries) setEnquiries(res.data.enquiries);
      if (res.data.menus) setMenus(res.data.menus);
      if (res.data.reels) setReels(res.data.reels);
    }
    setLoadingData(false);
  };

  const showAlert = (type, text) => {
    if (!type || !text) {
      setAlert(null);
      return;
    }
    setAlert({ type, text });
    setTimeout(() => {
      setAlert(null);
    }, 4000);
  };

  const handleLogout = () => {
    removeAdminAuth();
    if (onLogout) onLogout();
  };

  /* ==========================================================================
     CATEGORY & SUBCATEGORY HANDLERS
     ========================================================================== */

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCatForm.category.trim()) {
      showAlert("error", "Please enter a category name.");
      return;
    }

    const subArray = newCatForm.subcategoriesStr
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const res = await createCategoryApi({
      collection: newCatForm.collection,
      category: newCatForm.category.trim(),
      subcategories: subArray,
    });

    if (res && res.success) {
      showAlert("success", "Category created successfully!");
      setShowAddCategoryModal(false);
      setNewCatForm({ collection: "Gold", category: "", subcategoriesStr: "" });
      loadAllData();
    } else {
      showAlert("error", res.message || "Failed to create category.");
    }
  };

  const handleDeleteCategory = async (catId, catName) => {
    if (!window.confirm(`Are you sure you want to delete category "${catName}"?`)) return;
    const res = await deleteCategoryApi(catId);
    if (res && res.success) {
      showAlert("success", "Category deleted successfully!");
      loadAllData();
    } else {
      showAlert("error", res.message || "Failed to delete category.");
    }
  };

  const handleOpenEditCategory = (catDoc) => {
    setEditCatForm({
      id: catDoc._id,
      collection: catDoc.collection || "Gold",
      category: catDoc.category || "",
      subcategoriesStr: (catDoc.subcategories || []).join(", "),
    });
    setShowEditCategoryModal(true);
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editCatForm.category.trim()) {
      showAlert("error", "Please enter a category name.");
      return;
    }

    const subArray = editCatForm.subcategoriesStr
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const res = await updateCategoryApi(editCatForm.id, {
      collection: editCatForm.collection,
      category: editCatForm.category.trim(),
      subcategories: subArray,
    });

    if (res && res.success) {
      showAlert("success", "Category updated successfully!");
      setShowEditCategoryModal(false);
      setEditCatForm({ id: "", collection: "Gold", category: "", subcategoriesStr: "" });
      loadAllData();
    } else {
      showAlert("error", res.message || "Failed to update category.");
    }
  };

  const handleAddSubcategorySubmit = async (e) => {
    e.preventDefault();
    if (!selectedCatForSub || !newSubName.trim()) {
      showAlert("error", "Please enter a subcategory name.");
      return;
    }

    const res = await addSubcategoryApi(selectedCatForSub._id, newSubName.trim());
    if (res && res.success) {
      showAlert("success", `Subcategory "${newSubName}" added!`);
      setShowAddSubModal(false);
      setNewSubName("");
      setSelectedCatForSub(null);
      loadAllData();
    } else {
      showAlert("error", res.message || "Failed to add subcategory.");
    }
  };

  const handleDeleteSubcategory = async (catId, subName) => {
    if (!window.confirm(`Remove subcategory "${subName}"?`)) return;
    const res = await deleteSubcategoryApi(catId, subName);
    if (res && res.success) {
      showAlert("success", "Subcategory removed successfully!");
      loadAllData();
    } else {
      showAlert("error", res.message || "Failed to remove subcategory.");
    }
  };

  /* ==========================================================================
     PRODUCT HANDLERS (Add, Edit, Delete with File Upload)
     ========================================================================== */

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProdForm.productName || !newProdForm.sku) {
      showAlert("error", "Product Name and SKU are required.");
      return;
    }

    let res;
    if (newProdImageMode === "file" && newProdFile) {
      const formData = new FormData();
      formData.append("image", newProdFile);
      formData.append("productName", newProdForm.productName.trim());
      formData.append("sku", newProdForm.sku.trim());
      formData.append("details", newProdForm.details.trim() || "High quality handcrafted jewellery.");
      if (newProdForm.collection) formData.append("collection", newProdForm.collection);
      if (newProdForm.category) formData.append("category", newProdForm.category.trim());
      if (newProdForm.subcategory) formData.append("subcategory", newProdForm.subcategory.trim());

      res = await createProductFormDataApi(formData);
    } else if (newProdForm.image) {
      res = await createProductJsonApi({
        productName: newProdForm.productName.trim(),
        sku: newProdForm.sku.trim(),
        details: newProdForm.details.trim() || "High quality handcrafted jewellery.",
        collection: newProdForm.collection,
        category: newProdForm.category,
        subcategory: newProdForm.subcategory,
        image: newProdForm.image.trim(),
      });
    } else {
      showAlert("error", "Please upload an image file or provide an Image URL.");
      return;
    }

    if (res && res.success) {
      showAlert("success", "Product added successfully!");
      setShowAddProductModal(false);
      setNewProdForm({
        productName: "",
        sku: "",
        details: "",
        collection: "Gold",
        category: "",
        subcategory: "",
        image: "",
      });
      setNewProdFile(null);
      setNewProdFilePreview(null);
      loadAllData();
    } else {
      showAlert("error", res.message || "Failed to create product.");
    }
  };

  const handleOpenEditProduct = (prod) => {
    setEditProdForm({
      id: prod._id || prod.id,
      productName: prod.productName || prod.title || "",
      sku: prod.sku || "",
      details: prod.details || "",
      collection: prod.collection || "Gold",
      category: prod.category || "",
      subcategory: prod.subcategory || "",
      image: prod.image || prod.images?.[0] || "",
    });
    setEditProdFile(null);
    setEditProdFilePreview(prod.image || prod.images?.[0] || null);
    setShowEditProductModal(true);
  };

  const handleUpdateProductSubmit = async (e) => {
    e.preventDefault();
    if (!editProdForm.id || !editProdForm.productName) {
      showAlert("error", "Product Name is required.");
      return;
    }

    let res;
    if (editProdImageMode === "file" && editProdFile) {
      const formData = new FormData();
      formData.append("image", editProdFile);
      formData.append("productName", editProdForm.productName.trim());
      formData.append("sku", editProdForm.sku.trim());
      formData.append("details", editProdForm.details.trim());
      if (editProdForm.collection) formData.append("collection", editProdForm.collection);
      if (editProdForm.category) formData.append("category", editProdForm.category.trim());
      if (editProdForm.subcategory) formData.append("subcategory", editProdForm.subcategory.trim());

      res = await updateProductApi(editProdForm.id, formData);
    } else {
      res = await updateProductApi(editProdForm.id, {
        productName: editProdForm.productName.trim(),
        sku: editProdForm.sku.trim(),
        details: editProdForm.details.trim(),
        collection: editProdForm.collection,
        category: editProdForm.category.trim(),
        subcategory: editProdForm.subcategory.trim(),
        image: editProdForm.image.trim(),
      });
    }

    if (res && res.success) {
      showAlert("success", "Product updated successfully!");
      setShowEditProductModal(false);
      setEditProdFile(null);
      setEditProdFilePreview(null);
      loadAllData();
    } else {
      showAlert("error", res.message || "Failed to update product.");
    }
  };

  const handleDeleteProduct = async (prodId, prodTitle) => {
    if (!window.confirm(`Are you sure you want to delete product "${prodTitle}"?`)) return;
    const res = await deleteProductApi(prodId);
    if (res && res.success) {
      showAlert("success", "Product deleted successfully!");
      loadAllData();
    } else {
      showAlert("error", res.message || "Failed to delete product.");
    }
  };

  /* ==========================================================================
     INSTAGRAM REELS HANDLERS
     ========================================================================== */

  const resetReelForm = () => {
    if (reelVideoPreview) URL.revokeObjectURL(reelVideoPreview);
    if (reelThumbPreview) URL.revokeObjectURL(reelThumbPreview);
    setReelVideoFile(null);
    setReelVideoPreview(null);
    setReelThumbFile(null);
    setReelThumbPreview(null);
  };

  const handleReelVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      showAlert("error", "Please select a valid video file (MP4, MOV, WEBM).");
      return;
    }
    if (reelVideoPreview) URL.revokeObjectURL(reelVideoPreview);
    setReelVideoFile(file);
    setReelVideoPreview(URL.createObjectURL(file));
  };

  const handleReelThumbChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showAlert("error", "Please select a valid image file.");
      return;
    }
    if (reelThumbPreview) URL.revokeObjectURL(reelThumbPreview);
    setReelThumbFile(file);
    setReelThumbPreview(URL.createObjectURL(file));
  };

  const handleAddReelSubmit = async (e) => {
    e.preventDefault();
    if (!reelVideoFile) {
      showAlert("error", "Please upload a reel video.");
      return;
    }

    setUploadingReel(true);
    const formData = new FormData();
    formData.append("video", reelVideoFile);
    if (reelThumbFile) formData.append("thumbnail", reelThumbFile);

    const wasAtMax = reels.length >= MAX_INSTAGRAM_REELS;
    const res = await createReelApi(formData);
    setUploadingReel(false);

    if (res?.success) {
      showAlert(
        "success",
        wasAtMax
          ? "New reel uploaded! Oldest reel was automatically removed (max 7 limit)."
          : "Instagram reel uploaded successfully!"
      );
      setShowAddReelModal(false);
      resetReelForm();
      loadAllData();
    } else {
      showAlert("error", res?.message || "Failed to upload reel.");
    }
  };

  const handleToggleReelActive = async (reel) => {
    const formData = new FormData();
    formData.append("isActive", String(!reel.isActive));
    const res = await updateReelApi(reel._id, formData);
    if (res?.success) {
      showAlert("success", `Reel ${reel.isActive ? "hidden from" : "visible on"} website.`);
      loadAllData();
    } else {
      showAlert("error", res?.message || "Failed to update reel.");
    }
  };

  const handleDeleteReel = async (reelId) => {
    if (!window.confirm("Delete this reel permanently from storage and website?")) return;
    const res = await deleteReelApi(reelId);
    if (res?.success) {
      showAlert("success", "Reel deleted successfully.");
      loadAllData();
    } else {
      showAlert("error", res?.message || "Failed to delete reel.");
    }
  };

  // Nav Items with Dynamic Counts
  const navItems = [
    { id: "overview", label: "Dashboard", icon: FiGrid },
    { id: "products", label: "Products Catalog", icon: FiBox, count: products.length },
    { id: "categories", label: "Categories", icon: FiFolder, count: categories.length },
    // { id: "menus", label: "Navigation Menus", icon: FiMenu, count: menus.length },
    { id: "enquiries", label: "Enquiries & Leads", icon: FiMail, count: enquiries.length },
    { id: "reels", label: "Instagram Reels", icon: FiVideo, count: reels.length },
    // { id: "settings", label: "System Settings", icon: FiSettings },
  ];

  // Filtering for products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      (p.productName || p.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.sku || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesColl = filterCollection === "All" || p.collection === filterCollection;
    return matchesSearch && matchesColl;
  });

  // Product Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  // Filter categories by collection tab
  const displayedCategories =
    filterCollection === "All"
      ? categories
      : categories.filter((c) => c.collection === filterCollection);

  const getCategoriesForCollection = (collection) =>
    categories.filter((c) => c.collection === collection);

  const getSubcategoriesForCategory = (collection, categoryName) => {
    const cat = categories.find(
      (c) => c.collection === collection && c.category === categoryName
    );
    return cat?.subcategories ?? [];
  };

  // Category Pagination calculations
  const categoryTotalPages = Math.ceil(displayedCategories.length / categoryItemsPerPage) || 1;
  const categoryActivePage = Math.min(categoryCurrentPage, categoryTotalPages);
  const categoryStartIndex = (categoryActivePage - 1) * categoryItemsPerPage;
  const paginatedCategories = displayedCategories.slice(
    categoryStartIndex,
    categoryStartIndex + categoryItemsPerPage
  );

  // Enquiry Pagination calculations
  const enquiryTotalPages = Math.ceil(enquiries.length / enquiryItemsPerPage) || 1;
  const enquiryActivePage = Math.min(enquiryCurrentPage, enquiryTotalPages);
  const enquiryStartIndex = (enquiryActivePage - 1) * enquiryItemsPerPage;
  const paginatedEnquiries = enquiries.slice(enquiryStartIndex, enquiryStartIndex + enquiryItemsPerPage);

  const sortedReels = [...reels].sort(
    (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  );
  const activeReelsCount = reels.filter((r) => r.isActive !== false).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex font-sans overflow-hidden">
      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200/80 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } transition-transform duration-300 ease-in-out flex flex-col justify-between shadow-xs`}
      >
        <div>
          {/* Brand Logo & Header */}
          <div className="h-20 px-6 flex items-center justify-between border-b border-slate-200/80">
            <div className="flex items-center w-full justify-center gap-3">
              <Image
                src="/logo1.png"
                alt="Vinayak Jewellers"
                width={90}
                height={40}
                className="object-contain"
                style={{ width: "auto", height: "auto" }}
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
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
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
                  {item.count !== undefined && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? "bg-amber-600 text-white"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
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
        <header className="h-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
            >
              <FiMenuIcon className="text-xl" />
            </button>
            <h2 className="text-lg font-bold text-slate-900 capitalize hidden sm:block">
              {activeTab === "overview"
                ? "Control Panel Overview"
                : activeTab === "categories"
                ? "Category & Subcategory Management"
                : `${activeTab} Management`}
            </h2>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block w-64">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                placeholder="Search catalog/sku..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100/80 border border-slate-200 text-slate-800 placeholder-slate-400 text-xs focus:outline-none focus:bg-white focus:border-amber-600 transition-all"
              />
            </div>
            <button
              onClick={loadAllData}
              className="p-2 rounded-xl bg-slate-100/80 border border-slate-200 text-slate-600 hover:text-amber-600 hover:border-amber-400 hover:bg-white transition-all"
              title="Refresh Live Data"
            >
              <FiRefreshCw className={`text-base ${loadingData ? "animate-spin text-amber-600" : ""}`} />
            </button>
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

        {/* ALERT NOTIFICATION */}
        {alert && (
          <div
            className={`mx-4 sm:mx-8 mt-4 p-3.5 rounded-xl text-xs flex items-center justify-between border ${
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

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-amber-400 hover:shadow-md transition-all group">
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
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-amber-400 hover:shadow-md transition-all group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase">Categories</span>
                    <div className="w-10 h-10 rounded-xl bg-blue-100/80 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FiFolder className="text-xl" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-slate-900 mt-3">{categories.length}</div>
                  <div className="text-xs text-slate-500 mt-1">Across Collections</div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-amber-400 hover:shadow-md transition-all group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase">Enquiries</span>
                    <div className="w-10 h-10 rounded-xl bg-purple-100/80 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FiMail className="text-xl" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-slate-900 mt-3">{enquiries.length}</div>
                  <div className="text-xs text-purple-600 font-medium mt-1">Total Submissions</div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-amber-400 hover:shadow-md transition-all group">
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
                </div>
              </div>

              {/* Quick Actions & Recent Enquiries Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Customer Enquiries */}
                <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <FiMail className="text-amber-600" /> Recent Customer Enquiries
                    </h3>
                    <button
                      onClick={() => setActiveTab("enquiries")}
                      className="text-xs text-amber-600 font-semibold hover:underline"
                    >
                      View All ({enquiries.length})
                    </button>
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
                <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
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
                        <span className="text-slate-500">Subcategories Count</span>
                        <span className="text-slate-800 font-bold">
                          {categories.reduce((acc, c) => acc + (c.subcategories?.length || 0), 0)} Items
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200/80 flex flex-col gap-2">
                    <button
                      onClick={() => setShowAddCategoryModal(true)}
                      className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-800 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-slate-200 transition-all border border-slate-200"
                    >
                      <FiPlus /> Add Category & Subcategories
                    </button>
                    <button
                      onClick={() => setShowAddProductModal(true)}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#b89028] text-white font-bold text-xs flex items-center justify-center gap-2 hover:brightness-105 shadow-xs transition-all"
                    >
                      <FiPlus /> Add New Product Catalog Item
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CATEGORIES & SUBCATEGORIES */}
          {activeTab === "categories" && (
            <div className="space-y-6">
              {/* Header & Controls */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Categories & Subcategories</h3>
                  <p className="text-xs text-slate-500">
                    Organize your jewellery catalog collections, categories, and subcategories ({displayedCategories.length} found)
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {/* Collection Filter Pill */}
                  <select
                    value={filterCollection}
                    onChange={(e) => {
                      setFilterCollection(e.target.value);
                      setCategoryCurrentPage(1);
                    }}
                    className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 font-medium focus:outline-none focus:border-amber-600 shadow-xs"
                  >
                    <option value="All">All Collections ({categories.length})</option>
                    {COLLECTIONS_ENUM.map((coll) => (
                      <option key={coll} value={coll}>
                        {coll}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => setShowAddCategoryModal(true)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#b89028] text-white font-bold text-xs flex items-center gap-2 hover:brightness-105 shadow-xs whitespace-nowrap"
                  >
                    <FiPlus className="text-base" /> Add Category
                  </button>
                </div>
              </div>

              {/* Category Grid */}
              {displayedCategories.length === 0 ? (
                <div className="p-12 rounded-2xl bg-white border border-slate-200 text-center space-y-3">
                  <FiFolder className="text-4xl text-slate-300 mx-auto" />
                  <h4 className="text-slate-800 font-bold text-base">No categories found</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Click the "Add Category" button to create your first category and define subcategories.
                  </p>
                  <button
                    onClick={() => setShowAddCategoryModal(true)}
                    className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-semibold inline-flex items-center gap-2"
                  >
                    <FiPlus /> Add Category Now
                  </button>
                </div>
              ) : (
                <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {paginatedCategories.map((catDoc) => (
                    <div
                      key={catDoc._id}
                      className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-amber-300 transition-all"
                    >
                      <div>
                        {/* Collection Badge & Actions */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold tracking-wide">
                            {catDoc.collection}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleOpenEditCategory(catDoc)}
                              title="Edit Category"
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-800 text-xs transition-colors"
                            >
                              <FiEdit />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedCatForSub(catDoc);
                                setShowAddSubModal(true);
                              }}
                              title="Add Subcategory"
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-800 text-xs flex items-center gap-1 font-medium transition-colors"
                            >
                              <FiPlus /> Subcategory
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(catDoc._id, catDoc.category)}
                              title="Delete Category"
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-400 hover:text-red-600 text-xs transition-colors"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </div>

                        {/* Category Name */}
                        <h4 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
                          <FiFolder className="text-amber-600 shrink-0" />
                          <span>{catDoc.category}</span>
                        </h4>

                        {/* Subcategories List */}
                        <div className="space-y-1.5">
                          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                            <span>Subcategories ({catDoc.subcategories?.length || 0})</span>
                          </div>

                          {(!catDoc.subcategories || catDoc.subcategories.length === 0) ? (
                            <p className="text-xs text-slate-400 italic py-1">
                              No subcategories added yet.
                            </p>
                          ) : (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {catDoc.subcategories.map((subName, sIdx) => (
                                <span
                                  key={sIdx}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium group hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-colors"
                                >
                                  <FiTag className="text-[10px] text-slate-400 group-hover:text-red-500" />
                                  <span>{subName}</span>
                                  <button
                                    onClick={() => handleDeleteSubcategory(catDoc._id, subName)}
                                    title="Delete subcategory"
                                    className="ml-0.5 text-slate-400 hover:text-red-600"
                                  >
                                    <FiX className="text-xs" />
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CATEGORY PAGINATION CONTROLS */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <span>Showing</span>
                    <span className="font-semibold text-slate-900">
                      {categoryStartIndex + 1}
                    </span>
                    <span>to</span>
                    <span className="font-semibold text-slate-900">
                      {Math.min(categoryStartIndex + categoryItemsPerPage, displayedCategories.length)}
                    </span>
                    <span>of</span>
                    <span className="font-semibold text-slate-900">
                      {displayedCategories.length}
                    </span>
                    <span>categories</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500">Per page:</span>
                      <select
                        value={categoryItemsPerPage}
                        onChange={(e) => {
                          setCategoryItemsPerPage(Number(e.target.value));
                          setCategoryCurrentPage(1);
                        }}
                        className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold focus:outline-none"
                      >
                        <option value={6}>6</option>
                        <option value={9}>9</option>
                        <option value={12}>12</option>
                        <option value={24}>24</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        disabled={categoryActivePage <= 1}
                        onClick={() => setCategoryCurrentPage((prev) => Math.max(prev - 1, 1))}
                        className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                        title="Previous Page"
                      >
                        <FiChevronLeft />
                      </button>

                      <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-semibold text-slate-800">
                        {categoryActivePage} / {categoryTotalPages}
                      </span>

                      <button
                        disabled={categoryActivePage >= categoryTotalPages}
                        onClick={() =>
                          setCategoryCurrentPage((prev) => Math.min(prev + 1, categoryTotalPages))
                        }
                        className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                        title="Next Page"
                      >
                        <FiChevronRight />
                      </button>
                    </div>
                  </div>
                </div>
                </>
              )}
            </div>
          )}

          {/* TAB 3: PRODUCTS WITH PAGINATION & EDIT OPTION */}
          {activeTab === "products" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Product Catalog</h3>
                  <p className="text-xs text-slate-500">
                    Live products catalog synced with backend database ({filteredProducts.length} items found)
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={filterCollection}
                    onChange={(e) => {
                      setFilterCollection(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 font-medium focus:outline-none focus:border-amber-600 shadow-xs"
                  >
                    <option value="All">All Collections</option>
                    {COLLECTIONS_ENUM.map((coll) => (
                      <option key={coll} value={coll}>
                        {coll}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => setShowAddProductModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#b89028] text-white font-bold text-xs flex items-center gap-2 hover:brightness-105 shadow-xs"
                  >
                    <FiPlus className="text-base" /> Add Product
                  </button>
                </div>
              </div>

              {/* PRODUCTS TABLE */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="py-3.5 px-4 font-semibold">SKU</th>
                        <th className="py-3.5 px-4 font-semibold">Product Name</th>
                        <th className="py-3.5 px-4 font-semibold">Collection</th>
                        <th className="py-3.5 px-4 font-semibold">Category</th>
                        <th className="py-3.5 px-4 font-semibold">Subcategory</th>
                        <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginatedProducts.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-400">
                            No products found matching filters.
                          </td>
                        </tr>
                      ) : (
                        paginatedProducts.map((p) => (
                          <tr key={p._id || p.id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3.5 px-4 font-mono text-slate-500">{p.sku || "N/A"}</td>
                            <td className="py-3.5 px-4 font-semibold text-slate-900 flex items-center gap-3">
                              {p.image || p.images?.[0] ? (
                                <img
                                  src={p.image || p.images[0]}
                                  alt={p.productName || p.title}
                                  loading="lazy"
                                  className="w-9 h-9 object-cover rounded-lg border border-slate-200 shrink-0 bg-slate-100"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              ) : (
                                <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0 font-bold">
                                  VJ
                                </div>
                              )}
                              <span>{p.productName || p.title}</span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200">
                                {p.collection || "Gold"}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200/80 text-[10px] font-semibold">
                                {p.category || "General"}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-slate-600">
                              {p.subcategory || "—"}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleOpenEditProduct(p)}
                                  className="p-1.5 rounded bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-800 transition-colors"
                                  title="Edit Product"
                                >
                                  <FiEdit />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(p._id, p.productName || p.title)}
                                  className="p-1.5 rounded bg-slate-100 hover:bg-red-100 text-slate-500 hover:text-red-600 transition-colors"
                                  title="Delete Product"
                                >
                                  <FiTrash2 />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* PAGINATION CONTROLS FOOTER */}
                {filteredProducts.length > 0 && (
                  <div className="p-4 bg-slate-50 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <span>Showing</span>
                      <span className="font-semibold text-slate-900">
                        {startIndex + 1}
                      </span>
                      <span>to</span>
                      <span className="font-semibold text-slate-900">
                        {Math.min(startIndex + itemsPerPage, filteredProducts.length)}
                      </span>
                      <span>of</span>
                      <span className="font-semibold text-slate-900">
                        {filteredProducts.length}
                      </span>
                      <span>products</span>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Items per page selector */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500">Per page:</span>
                        <select
                          value={itemsPerPage}
                          onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                          }}
                          className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold focus:outline-none"
                        >
                          <option value={10}>10</option>
                          <option value={20}>20</option>
                          <option value={50}>50</option>
                          <option value={100}>100</option>
                        </select>
                      </div>

                      {/* Previous / Next buttons */}
                      <div className="flex items-center gap-1">
                        <button
                          disabled={activePage <= 1}
                          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                          className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                          title="Previous Page"
                        >
                          <FiChevronLeft />
                        </button>

                        <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-semibold text-slate-800">
                          {activePage} / {totalPages}
                        </span>

                        <button
                          disabled={activePage >= totalPages}
                          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                          className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                          title="Next Page"
                        >
                          <FiChevronRight />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: ENQUIRIES */}
          {activeTab === "enquiries" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Enquiries & Leads</h3>
                  <p className="text-xs text-slate-500">Customer requests and consultation leads</p>
                </div>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full">
                  {enquiries.length} total
                </span>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="py-3.5 px-4 font-semibold">#</th>
                        <th className="py-3.5 px-4 font-semibold">Customer</th>
                        <th className="py-3.5 px-4 font-semibold">Phone</th>
                        <th className="py-3.5 px-4 font-semibold">Product</th>
                        <th className="py-3.5 px-4 font-semibold">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {enquiries.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-slate-400">
                            No enquiries found in database.
                          </td>
                        </tr>
                      ) : (
                        paginatedEnquiries.map((e, idx) => (
                          <tr key={e._id || idx} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3.5 px-4 text-slate-400 font-mono">
                              {enquiryStartIndex + idx + 1}
                            </td>
                            <td className="py-3.5 px-4 font-semibold text-slate-900">
                              {e.name || e.customerName || "Guest"}
                            </td>
                            <td className="py-3.5 px-4 text-slate-600 font-mono">
                              <a href={`tel:${e.phone}`} className="hover:text-amber-700 hover:underline">
                                {e.phone || "—"}
                              </a>
                            </td>
                            <td className="py-3.5 px-4">
                              {e.productName || e.productId ? (
                                <div className="flex items-center gap-3">
                                  {e.productImage && (
                                    <img
                                      src={e.productImage}
                                      alt={e.productName || "product"}
                                      className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                                      onError={(ev) => { ev.currentTarget.style.display = "none"; }}
                                    />
                                  )}
                                  <div>
                                    <p className="font-semibold text-slate-800 leading-tight">
                                      {e.productName || "—"}
                                    </p>
                                    {e.productId && (() => {
                                      // Show SKU by looking up from products list
                                      const prod = products.find(p => (p._id || p.id) === e.productId);
                                      return (
                                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                                          SKU: {prod?.sku || e.productId}
                                        </p>
                                      );
                                    })()}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-slate-400">General Enquiry</span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                              {e.createdAt
                                ? new Date(e.createdAt).toLocaleDateString("en-IN", {
                                    day: "2-digit", month: "short", year: "numeric",
                                  })
                                : "Recent"}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {enquiryTotalPages > 1 && (
                  <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/60">
                    <p className="text-xs text-slate-500">
                      Showing <span className="font-semibold text-slate-700">{enquiryStartIndex + 1}–{Math.min(enquiryStartIndex + enquiryItemsPerPage, enquiries.length)}</span> of <span className="font-semibold text-slate-700">{enquiries.length}</span> enquiries
                    </p>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEnquiryCurrentPage(1)}
                        disabled={enquiryActivePage === 1}
                        className="px-2 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-white hover:border-slate-300 border border-transparent disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        «
                      </button>
                      <button
                        onClick={() => setEnquiryCurrentPage(p => Math.max(1, p - 1))}
                        disabled={enquiryActivePage === 1}
                        className="px-2 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-white hover:border-slate-300 border border-transparent disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        ‹
                      </button>
                      {Array.from({ length: enquiryTotalPages }, (_, i) => i + 1)
                        .filter(p => p === 1 || p === enquiryTotalPages || Math.abs(p - enquiryActivePage) <= 1)
                        .reduce((acc, p, i, arr) => {
                          if (i > 0 && p - arr[i - 1] > 1) acc.push("...");
                          acc.push(p);
                          return acc;
                        }, [])
                        .map((p, i) =>
                          p === "..." ? (
                            <span key={`dot-${i}`} className="px-1 text-slate-400 text-xs">…</span>
                          ) : (
                            <button
                              key={p}
                              onClick={() => setEnquiryCurrentPage(p)}
                              className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all ${
                                enquiryActivePage === p
                                  ? "bg-amber-600 text-white shadow-sm"
                                  : "text-slate-600 hover:bg-white hover:border-slate-300 border border-transparent"
                              }`}
                            >
                              {p}
                            </button>
                          )
                        )}
                      <button
                        onClick={() => setEnquiryCurrentPage(p => Math.min(enquiryTotalPages, p + 1))}
                        disabled={enquiryActivePage === enquiryTotalPages}
                        className="px-2 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-white hover:border-slate-300 border border-transparent disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        ›
                      </button>
                      <button
                        onClick={() => setEnquiryCurrentPage(enquiryTotalPages)}
                        disabled={enquiryActivePage === enquiryTotalPages}
                        className="px-2 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-white hover:border-slate-300 border border-transparent disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        »
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: INSTAGRAM REELS */}
          {activeTab === "reels" && (
            <div className="space-y-6">
              {/* Hero Header */}
              <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="absolute inset-0 bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] opacity-90" />
                <div className="relative p-6 sm:p-8 text-white">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold backdrop-blur-sm">
                        <FiVideo className="text-sm" />
                        Instagram Integration
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold tracking-tight">Reels Management</h3>
                      <p className="text-sm text-white/85 max-w-xl">
                        Upload and manage homepage Instagram reels. Maximum {MAX_INSTAGRAM_REELS} reels — adding a new one automatically removes the oldest.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="px-4 py-3 rounded-xl bg-white/15 border border-white/20 backdrop-blur-sm min-w-[120px]">
                        <div className="text-[11px] uppercase tracking-wider text-white/70 font-semibold">Slots Used</div>
                        <div className="text-2xl font-bold mt-0.5">
                          {reels.length}
                          <span className="text-sm font-semibold text-white/70">/{MAX_INSTAGRAM_REELS}</span>
                        </div>
                      </div>
                      <div className="px-4 py-3 rounded-xl bg-white/15 border border-white/20 backdrop-blur-sm min-w-[120px]">
                        <div className="text-[11px] uppercase tracking-wider text-white/70 font-semibold">Live on Site</div>
                        <div className="text-2xl font-bold mt-0.5">{activeReelsCount}</div>
                      </div>
                      <button
                        onClick={() => setShowAddReelModal(true)}
                        disabled={uploadingReel}
                        className="px-5 py-3 rounded-xl bg-white text-slate-900 font-bold text-xs flex items-center gap-2 hover:bg-white/95 shadow-lg transition-all disabled:opacity-60"
                      >
                        <FiUploadCloud className="text-base" />
                        Upload Reel
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Banner when at max */}
              {reels.length >= MAX_INSTAGRAM_REELS && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                  <FiAlertCircle className="text-base shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Maximum capacity reached.</span> Uploading a new reel will automatically delete the oldest reel to maintain the {MAX_INSTAGRAM_REELS}-reel limit.
                  </div>
                </div>
              )}

              {/* Reels Grid */}
              {sortedReels.length === 0 ? (
                <div className="p-12 rounded-2xl bg-white border border-dashed border-slate-300 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 text-pink-600 flex items-center justify-center mx-auto text-3xl">
                    <FiVideo />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">No reels uploaded yet</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                      Upload vertical MP4 reels to showcase on your homepage Instagram carousel.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddReelModal(true)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white font-bold text-xs inline-flex items-center gap-2"
                  >
                    <FiUploadCloud /> Upload Your First Reel
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                  {sortedReels.map((reel, index) => (
                    <div
                      key={reel._id}
                      className="group relative rounded-2xl bg-white border border-slate-200/90 shadow-xs overflow-hidden hover:shadow-md hover:border-pink-300 transition-all"
                    >
                      {/* Video Preview */}
                      <div className="relative aspect-[9/16] bg-slate-900">
                        <video
                          src={reel.videoUrl}
                          poster={reel.thumbnailUrl || undefined}
                          className="w-full h-full object-cover"
                          muted
                          loop
                          playsInline
                          onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                          onMouseLeave={(e) => {
                            e.currentTarget.pause();
                            e.currentTarget.currentTime = 0;
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                        {/* Slot badge */}
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold">
                          #{index + 1}
                        </div>

                        {/* Status badge */}
                        <div
                          className={`absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            reel.isActive !== false
                              ? "bg-emerald-500/90 text-white"
                              : "bg-slate-500/90 text-white"
                          }`}
                        >
                          {reel.isActive !== false ? "Live" : "Hidden"}
                        </div>

                        {/* Play icon overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                            <FiPlay className="text-lg ml-0.5" />
                          </div>
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="p-3 space-y-2">
                        <p className="text-[10px] text-slate-400 font-medium truncate">
                          {reel.createdAt
                            ? new Date(reel.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "Recently added"}
                        </p>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleToggleReelActive(reel)}
                            title={reel.isActive !== false ? "Hide from website" : "Show on website"}
                            className={`flex-1 py-1.5 rounded-lg text-[10px] font-semibold flex items-center justify-center gap-1 transition-colors ${
                              reel.isActive !== false
                                ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            }`}
                          >
                            {reel.isActive !== false ? (
                              <>
                                <FiEyeOff className="text-xs" /> Hide
                              </>
                            ) : (
                              <>
                                <FiEye className="text-xs" /> Show
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteReel(reel._id)}
                            title="Delete reel"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-500 hover:text-red-600 transition-colors"
                          >
                            <FiTrash2 className="text-xs" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Empty slots placeholder */}
                  {Array.from({ length: Math.max(0, MAX_INSTAGRAM_REELS - sortedReels.length) }).map((_, i) => (
                    <button
                      key={`empty-${i}`}
                      type="button"
                      onClick={() => setShowAddReelModal(true)}
                      className="aspect-[9/16] rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-pink-300 hover:bg-pink-50/30 hover:text-pink-500 transition-all"
                    >
                      <FiPlus className="text-xl" />
                      <span className="text-[10px] font-semibold uppercase tracking-wider">Add Reel</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Instagram profile link */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-slate-200/80 text-xs">
                <div className="text-slate-500">
                  Reels appear on homepage in the <span className="font-semibold text-slate-700">Follow Us On Instagram</span> section.
                </div>
                <a
                  href={`https://www.instagram.com/${INSTAGRAM_HANDLE}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  @{INSTAGRAM_HANDLE}
                  <FiExternalLink className="text-xs" />
                </a>
              </div>
            </div>
          )}

          {/* OTHER TABS FALLBACK (Menus, Settings) */}
          {(activeTab === "menus" || activeTab === "settings") && (
            <div className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-2xl">
                <FiSettings />
              </div>
              <h3 className="text-base font-bold text-slate-900 capitalize">{activeTab} Management Panel</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Ready for live API management endpoints. Backend routes fully configured.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* MODAL 1: ADD CATEGORY */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-md p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <FiFolder className="text-amber-600" /> Add New Category
              </h3>
              <button
                onClick={() => setShowAddCategoryModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Collection Type
                </label>
                <select
                  value={newCatForm.collection}
                  onChange={(e) => setNewCatForm({ ...newCatForm, collection: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:bg-white focus:border-amber-600"
                >
                  {COLLECTIONS_ENUM.map((coll) => (
                    <option key={coll} value={coll}>
                      {coll}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Category Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Neckwear, Rings, Earrings..."
                  value={newCatForm.category}
                  onChange={(e) => setNewCatForm({ ...newCatForm, category: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:bg-white focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Initial Subcategories (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Gold Chains, Chokers, Pendants (comma separated)"
                  value={newCatForm.subcategoriesStr}
                  onChange={(e) => setNewCatForm({ ...newCatForm, subcategoriesStr: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:bg-white focus:border-amber-600"
                />
                <p className="text-[11px] text-slate-400 mt-1">Separate multiple subcategories with commas.</p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCategoryModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#b89028] text-white font-bold text-xs hover:brightness-105 shadow-xs"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT CATEGORY */}
      {showEditCategoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-md p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <FiEdit className="text-amber-600" /> Edit Category
              </h3>
              <button
                onClick={() => setShowEditCategoryModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            <form onSubmit={handleUpdateCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Collection Type
                </label>
                <select
                  value={editCatForm.collection}
                  onChange={(e) => setEditCatForm({ ...editCatForm, collection: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:bg-white focus:border-amber-600"
                >
                  {COLLECTIONS_ENUM.map((coll) => (
                    <option key={coll} value={coll}>
                      {coll}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Category Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Neckwear, Rings, Earrings..."
                  value={editCatForm.category}
                  onChange={(e) => setEditCatForm({ ...editCatForm, category: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:bg-white focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Subcategories
                </label>
                <input
                  type="text"
                  placeholder="e.g. Gold Chains, Chokers, Pendants (comma separated)"
                  value={editCatForm.subcategoriesStr}
                  onChange={(e) => setEditCatForm({ ...editCatForm, subcategoriesStr: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:bg-white focus:border-amber-600"
                />
                <p className="text-[11px] text-slate-400 mt-1">Separate multiple subcategories with commas.</p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditCategoryModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#b89028] text-white font-bold text-xs hover:brightness-105 shadow-xs"
                >
                  Update Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: UPLOAD INSTAGRAM REEL */}
      {showAddReelModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-lg p-6 space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] flex items-center justify-center text-white">
                    <FiVideo className="text-sm" />
                  </span>
                  Upload Instagram Reel
                </h3>
                <p className="text-[11px] text-slate-500 mt-1">
                  Vertical video recommended (9:16). Max {MAX_INSTAGRAM_REELS} reels on homepage.
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAddReelModal(false);
                  resetReelForm();
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            {reels.length >= MAX_INSTAGRAM_REELS && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
                <FiAlertCircle className="shrink-0 mt-0.5" />
                <span>
                  You already have {MAX_INSTAGRAM_REELS} reels. Uploading will <strong>auto-delete the oldest reel</strong>.
                </span>
              </div>
            )}

            <form onSubmit={handleAddReelSubmit} className="space-y-4">
              {/* Video Upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Reel Video <span className="text-red-500">*</span>
                </label>
                {!reelVideoPreview ? (
                  <label className="flex flex-col items-center justify-center w-full h-44 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:border-pink-400 hover:bg-pink-50/30 cursor-pointer transition-all">
                    <FiUploadCloud className="text-3xl text-slate-400 mb-2" />
                    <span className="text-xs font-semibold text-slate-600">Click to upload video</span>
                    <span className="text-[10px] text-slate-400 mt-1">MP4, MOV, WEBM — max 100MB</span>
                    <input
                      type="file"
                      accept="video/mp4,video/quicktime,video/webm,video/x-msvideo"
                      onChange={handleReelVideoChange}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-black aspect-[9/16] max-h-64 mx-auto w-36">
                    <video src={reelVideoPreview} className="w-full h-full object-cover" muted loop autoPlay playsInline />
                    <button
                      type="button"
                      onClick={() => {
                        URL.revokeObjectURL(reelVideoPreview);
                        setReelVideoFile(null);
                        setReelVideoPreview(null);
                      }}
                      className="absolute top-2 right-2 p-1 rounded-lg bg-black/60 text-white hover:bg-red-600 transition-colors"
                    >
                      <FiX className="text-sm" />
                    </button>
                  </div>
                )}
              </div>

              {/* Thumbnail Upload (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Thumbnail Poster <span className="text-slate-400 font-normal normal-case">(optional)</span>
                </label>
                {!reelThumbPreview ? (
                  <label className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:border-amber-400 hover:bg-amber-50/30 cursor-pointer transition-all">
                    <FiImage className="text-xl text-slate-400" />
                    <div>
                      <span className="text-xs font-semibold text-slate-600 block">Add cover image</span>
                      <span className="text-[10px] text-slate-400">JPEG, PNG, WEBP</span>
                    </div>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/jpg"
                      onChange={handleReelThumbChange}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 w-24 h-32">
                    <img src={reelThumbPreview} alt="Thumbnail preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        URL.revokeObjectURL(reelThumbPreview);
                        setReelThumbFile(null);
                        setReelThumbPreview(null);
                      }}
                      className="absolute top-1 right-1 p-0.5 rounded bg-black/60 text-white hover:bg-red-600"
                    >
                      <FiX className="text-xs" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddReelModal(false);
                    resetReelForm();
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingReel || !reelVideoFile}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white font-bold text-xs hover:opacity-90 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {uploadingReel ? (
                    <>
                      <FiRefreshCw className="animate-spin" /> Uploading...
                    </>
                  ) : (
                    <>
                      <FiUploadCloud /> Upload Reel
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD SUBCATEGORY */}
      {showAddSubModal && selectedCatForSub && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-md p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <FiTag className="text-amber-600" /> Add Subcategory
                </h3>
                <p className="text-xs text-slate-500">
                  Adding to <span className="font-semibold text-slate-800">{selectedCatForSub.category}</span> ({selectedCatForSub.collection})
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAddSubModal(false);
                  setSelectedCatForSub(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            <form onSubmit={handleAddSubcategorySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Subcategory Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Temple Jewellery, Solitaires, Light Weight..."
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  required
                  autoFocus
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:bg-white focus:border-amber-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddSubModal(false);
                    setSelectedCatForSub(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 shadow-xs"
                >
                  Add Subcategory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD PRODUCT WITH DUAL FILE UPLOAD / URL */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-lg p-6 space-y-4 my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <FiBox className="text-amber-600" /> Add Product To Catalog
              </h3>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Gold Choker Set"
                    value={newProdForm.productName}
                    onChange={(e) => setNewProdForm({ ...newProdForm, productName: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:bg-white focus:border-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. VJ-NK-001"
                    value={newProdForm.sku}
                    onChange={(e) => setNewProdForm({ ...newProdForm, sku: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:bg-white focus:border-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Collection
                  </label>
                  <select
                    value={newProdForm.collection}
                    onChange={(e) =>
                      setNewProdForm({
                        ...newProdForm,
                        collection: e.target.value,
                        category: "",
                        subcategory: "",
                      })
                    }
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:bg-white focus:border-amber-600"
                  >
                    {COLLECTIONS_ENUM.map((coll) => (
                      <option key={coll} value={coll}>
                        {coll}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={newProdForm.category}
                    onChange={(e) =>
                      setNewProdForm({
                        ...newProdForm,
                        category: e.target.value,
                        subcategory: "",
                      })
                    }
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:bg-white focus:border-amber-600"
                  >
                    <option value="">Select category</option>
                    {getCategoriesForCollection(newProdForm.collection).map((c) => (
                      <option key={c._id} value={c.category}>
                        {c.category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Subcategory
                  </label>
                  <select
                    value={newProdForm.subcategory}
                    onChange={(e) => setNewProdForm({ ...newProdForm, subcategory: e.target.value })}
                    disabled={!newProdForm.category}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:bg-white focus:border-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Select subcategory</option>
                    {getSubcategoriesForCategory(newProdForm.collection, newProdForm.category).map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* DUAL IMAGE INPUT: FILE UPLOAD vs URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Product Image
                </label>

                <div className="flex items-center gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setNewProdImageMode("file")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      newProdImageMode === "file"
                        ? "bg-amber-100 text-amber-800 border border-amber-300"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <FiUploadCloud /> Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewProdImageMode("url")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      newProdImageMode === "url"
                        ? "bg-amber-100 text-amber-800 border border-amber-300"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <FiImage /> Image URL
                  </button>
                </div>

                {newProdImageMode === "file" ? (
                  <div className="border-2 border-dashed border-slate-200 hover:border-amber-400 rounded-xl p-4 text-center bg-slate-50 transition-colors cursor-pointer relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setNewProdFile(file);
                          setNewProdFilePreview(URL.createObjectURL(file));
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {newProdFilePreview ? (
                      <div className="flex items-center justify-center gap-3">
                        <img
                          src={newProdFilePreview}
                          alt="Preview"
                          className="w-16 h-16 object-cover rounded-lg border border-amber-300"
                        />
                        <div className="text-left text-xs">
                          <p className="font-semibold text-slate-800 truncate max-w-[200px]">{newProdFile?.name}</p>
                          <p className="text-slate-400">{(newProdFile?.size / 1024).toFixed(1)} KB</p>
                          <span className="text-amber-700 font-medium text-[11px]">Click to replace file</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <FiUploadCloud className="text-3xl text-amber-600 mx-auto" />
                        <p className="text-xs font-semibold text-slate-700">Click or drop image file to upload</p>
                        <p className="text-[11px] text-slate-400">Supports JPEG, PNG, WEBP</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <input
                    type="text"
                    placeholder="https://res.cloudinary.com/... or image url"
                    value={newProdForm.image}
                    onChange={(e) => setNewProdForm({ ...newProdForm, image: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:bg-white focus:border-amber-600"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Details / Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Enter product features, purity, weight details..."
                  value={newProdForm.details}
                  onChange={(e) => setNewProdForm({ ...newProdForm, details: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:bg-white focus:border-amber-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#b89028] text-white font-bold text-xs hover:brightness-105 shadow-xs"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: EDIT PRODUCT WITH DUAL FILE UPLOAD / URL */}
      {showEditProductModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-lg p-6 space-y-4 my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <FiEdit className="text-amber-600" /> Edit Product Details
              </h3>
              <button
                onClick={() => setShowEditProductModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            <form onSubmit={handleUpdateProductSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={editProdForm.productName}
                    onChange={(e) => setEditProdForm({ ...editProdForm, productName: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:bg-white focus:border-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    value={editProdForm.sku}
                    onChange={(e) => setEditProdForm({ ...editProdForm, sku: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:bg-white focus:border-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Collection
                  </label>
                  <select
                    value={editProdForm.collection}
                    onChange={(e) =>
                      setEditProdForm({
                        ...editProdForm,
                        collection: e.target.value,
                        category: "",
                        subcategory: "",
                      })
                    }
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:bg-white focus:border-amber-600"
                  >
                    {COLLECTIONS_ENUM.map((coll) => (
                      <option key={coll} value={coll}>
                        {coll}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={editProdForm.category}
                    onChange={(e) =>
                      setEditProdForm({
                        ...editProdForm,
                        category: e.target.value,
                        subcategory: "",
                      })
                    }
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:bg-white focus:border-amber-600"
                  >
                    <option value="">Select category</option>
                    {getCategoriesForCollection(editProdForm.collection).map((c) => (
                      <option key={c._id} value={c.category}>
                        {c.category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Subcategory
                  </label>
                  <select
                    value={editProdForm.subcategory}
                    onChange={(e) => setEditProdForm({ ...editProdForm, subcategory: e.target.value })}
                    disabled={!editProdForm.category}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:bg-white focus:border-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Select subcategory</option>
                    {getSubcategoriesForCategory(editProdForm.collection, editProdForm.category).map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* DUAL IMAGE INPUT FOR EDIT: FILE UPLOAD vs URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Update Product Image
                </label>

                <div className="flex items-center gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setEditProdImageMode("file")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      editProdImageMode === "file"
                        ? "bg-amber-100 text-amber-800 border border-amber-300"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <FiUploadCloud /> Upload New File
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditProdImageMode("url")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      editProdImageMode === "url"
                        ? "bg-amber-100 text-amber-800 border border-amber-300"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <FiImage /> Image URL
                  </button>
                </div>

                {editProdImageMode === "file" ? (
                  <div className="border-2 border-dashed border-slate-200 hover:border-amber-400 rounded-xl p-4 text-center bg-slate-50 transition-colors cursor-pointer relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setEditProdFile(file);
                          setEditProdFilePreview(URL.createObjectURL(file));
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {editProdFilePreview ? (
                      <div className="flex items-center justify-center gap-3">
                        <img
                          src={editProdFilePreview}
                          alt="Preview"
                          className="w-16 h-16 object-cover rounded-lg border border-amber-300"
                        />
                        <div className="text-left text-xs">
                          <p className="font-semibold text-slate-800 truncate max-w-[200px]">
                            {editProdFile ? editProdFile.name : "Current Product Image"}
                          </p>
                          <span className="text-amber-700 font-medium text-[11px]">Click to replace file</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <FiUploadCloud className="text-3xl text-amber-600 mx-auto" />
                        <p className="text-xs font-semibold text-slate-700">Click or drop new image file</p>
                        <p className="text-[11px] text-slate-400">Supports JPEG, PNG, WEBP</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={editProdForm.image}
                    onChange={(e) => setEditProdForm({ ...editProdForm, image: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:bg-white focus:border-amber-600"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Details / Description
                </label>
                <textarea
                  rows={2}
                  value={editProdForm.details}
                  onChange={(e) => setEditProdForm({ ...editProdForm, details: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:bg-white focus:border-amber-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditProductModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 shadow-xs"
                >
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
