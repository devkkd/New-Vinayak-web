"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  getCategory,
} from "@/lib/data";
import {
  listProductsApi,
  listCategoriesGroupedApi,
} from "@/lib/adminApi";
import ContactCTA from "../components/ContactCTA";
import VisitOurStore from "../components/Visitourstore";
import ImageStrip from "../components/Imagestrip";

// ─── helpers ────────────────────────────────────────────────
function buildParams(collection, category, subcategory) {
  const p = {};
  if (collection) p.collection = collection;
  if (category) p.category = category;
  if (subcategory) p.subcategory = subcategory;
  return p;
}
function cacheKey(params) {
  return JSON.stringify(params);
}

function getProductCollectionKeys(product) {
  const keys = [
    product?.collection,
    ...(Array.isArray(product?.collections) ? product.collections : []),
  ]
    .map((value) => String(value || "").trim())
    .filter(Boolean);

  return [...new Set(keys)];
}

export default function CategoryPage() {
  const { category } = useParams();
  const meta = getCategory(category);
  const isCollections = category === "collections";
  // collection name for API (e.g. "Gold", "Silver") — null for collections page
  const collectionName = meta?.collectionName || null;

  // ─── non-collections: dynamic subcategory filter ──────────
  const [activeFilter, setActiveFilter] = useState("All");

  // ─── collections: dynamic 3-level filter state ────────────
  const [activeCollection, setActiveCollection] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState(null);

  // ─── collections: data + UI state ─────────────────────────
  const [groupedCategories, setGroupedCategories] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(isCollections);
  const [error, setError] = useState(null); // null | "products" | "both"

  // ─── collections: session cache ───────────────────────────
  const fetchCache = useRef({});

  // ─── non-collections: data + UI state ───────────────────
  const [staticProducts, setStaticProducts] = useState([]);
  const [nonColLoading, setNonColLoading] = useState(!isCollections && !!collectionName);
  const [nonColError, setNonColError] = useState(null);
  // Subcategory pills derived from fetched products
  const [dynamicSubCats, setDynamicSubCats] = useState([]);

  // ─── reset pill filter when page/collection changes ──────
  useEffect(() => {
    setActiveFilter("All");
    setDynamicSubCats([]);
    setStaticProducts([]);
  }, [category]);
  useEffect(() => {
    if (isCollections) return;
    if (!collectionName) {
      setStaticProducts([]);
      setNonColLoading(false);
      return;
    }
    let cancelled = false;
    async function fetchNonCollection() {
      setNonColLoading(true);
      setNonColError(null);
      try {
        // Fetch products AND DB categories together — same as collections page
        const [prodRes, catRes] = await Promise.all([
          listProductsApi({ collection: collectionName }),
          listCategoriesGroupedApi(),
        ]);
        if (cancelled) return;

        if (prodRes?.success) {
          const prods = prodRes.data || [];
          setStaticProducts(prods);

          // Build subcategory pills from DB categories for this collection
          const grouped = catRes?.success ? (catRes.data || {}) : {};
          const dbCats = grouped[collectionName] || [];
          const subSet = new Set();

          if (dbCats.length > 0) {
            dbCats.forEach((cat) => {
              // Add category.category if any product has that subcategory or category
              if (prods.some((p) => p.subcategory === cat.category || p.category === cat.category)) {
                subSet.add(cat.category);
              }
              // Add each subcategory entry if at least one product matches
              (cat.subcategories || []).forEach((sub) => {
                if (prods.some((p) => p.subcategory === sub)) {
                  subSet.add(sub);
                }
              });
            });
          }

          // Fallback: derive directly from product.subcategory field
          if (subSet.size === 0) {
            prods.forEach((p) => { if (p.subcategory) subSet.add(p.subcategory); });
          }

          setDynamicSubCats([...subSet]);
        } else {
          setNonColError("failed");
        }
      } catch {
        if (!cancelled) setNonColError("failed");
      } finally {
        if (!cancelled) setNonColLoading(false);
      }
    }
    fetchNonCollection();
    return () => { cancelled = true; };
  }, [isCollections, collectionName]);
  const [showPopup, setShowPopup] = useState(false);
  const [enquiryCart, setEnquiryCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // load enquiry cart from localStorage
  useEffect(() => {
    setEnquiryCart(JSON.parse(localStorage.getItem("enquiryCart")) || []);
  }, []);

  // ─── collections: parallel initial fetch ──────────────────
  useEffect(() => {
    if (!isCollections) return;

    let cancelled = false;
    let retryCount = 0;
    const MAX_RETRIES = 2;

    async function initialFetch() {
      setLoading(true);
      setError(null);
      try {
        const [catRes, prodRes] = await Promise.all([
          listCategoriesGroupedApi(),
          listProductsApi({}),
        ]);
        if (cancelled) return;

        if (catRes?.success) setGroupedCategories(catRes.data || {});
        if (prodRes?.success) {
          const prods = prodRes.data || [];
          setProducts(prods);
          fetchCache.current[cacheKey({})] = prods;
        } else if (retryCount < MAX_RETRIES) {
          // Auto-retry on failure
          retryCount++;
          setTimeout(initialFetch, 2000 * retryCount);
          return;
        } else {
          setError("products");
        }
      } catch {
        if (cancelled) return;
        if (retryCount < MAX_RETRIES) {
          retryCount++;
          setTimeout(initialFetch, 2000 * retryCount);
          return;
        }
        setError("both");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    initialFetch();
    return () => { cancelled = true; };
  }, [isCollections]);

  // ─── collections: fetch on filter change ──────────────────
  async function fetchProducts(params) {
    const key = cacheKey(buildParams(params.collection, params.category, params.subcategory));
    if (fetchCache.current[key]) {
      setProducts(fetchCache.current[key]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await listProductsApi(buildParams(params.collection, params.category, params.subcategory));
      if (res?.success) {
        fetchCache.current[key] = res.data || [];
        setProducts(res.data || []);
      } else {
        setError("products");
      }
    } catch {
      setError("products");
    } finally {
      setLoading(false);
    }
  }

  // ─── filter handlers ──────────────────────────────────────
  function handleCollectionSelect(col) {
    setActiveCollection(col);
    setActiveCategory(null);
    setActiveSubcategory(null);
    fetchProducts({ collection: col });
  }

  function handleCategorySelect(cat) {
    setActiveCategory(cat);
    setActiveSubcategory(null);
    fetchProducts({ collection: activeCollection, category: cat });
  }

  function handleSubcategorySelect(sub) {
    const next = sub === activeSubcategory ? null : sub;
    setActiveSubcategory(next);
    fetchProducts({ collection: activeCollection, category: activeCategory, subcategory: next });
  }

  // ─── derived filter data ──────────────────────────────────
  const collectionNames = useMemo(() => Object.keys(groupedCategories), [groupedCategories]);

  const categoriesForActive = useMemo(() => {
    if (!activeCollection) return Object.values(groupedCategories).flat();
    return groupedCategories[activeCollection] || [];
  }, [groupedCategories, activeCollection]);

  const subcategoriesForActive = useMemo(() => {
    if (!activeCategory) return [];
    const record = categoriesForActive.find((c) => c.category === activeCategory);
    return record?.subcategories || [];
  }, [categoriesForActive, activeCategory]);

  // ─── non-collections: filtered products ───────────────────
  const filteredStatic = useMemo(() => {
    if (activeFilter === "All") return staticProducts;
    // Match against subcategory first, then category as fallback
    return staticProducts.filter((p) => {
      const sub = p.subcategory || p.subCategory || "";
      const cat = p.category || "";
      return sub === activeFilter || cat === activeFilter;
    });
  }, [activeFilter, staticProducts]);

  // ─── retry handler ────────────────────────────────────────
  async function handleRetry() {
    setLoading(true);
    setError(null);
    try {
      const [catRes, prodRes] = await Promise.all([
        error === "both" ? listCategoriesGroupedApi() : Promise.resolve({ success: true, data: groupedCategories }),
        listProductsApi(buildParams(activeCollection, activeCategory, activeSubcategory)),
      ]);
      if (catRes?.success) setGroupedCategories(catRes.data || {});
      if (prodRes?.success) {
        setProducts(prodRes.data || []);
      } else {
        setError("products");
      }
    } catch {
      setError("both");
    } finally {
      setLoading(false);
    }
  }

  // ─── popup helpers ────────────────────────────────────────
  const openPopup = (product) => { setSelectedProduct(product); setShowPopup(true); };
  const closePopup = () => { setShowPopup(false); setSelectedProduct(null); };

  if (!meta) return <div className="cat-empty">Page not found.</div>;

  const isSidebar = meta.type === "sidebar";
  const isPills = meta.type === "pills" || meta.type === "pills-center";

  // product identity helpers
  const getId = (p) => p._id || p.id;
  const getImg = (p) => (p.images?.length > 0 ? p.images[0] : p.image) || "/home/logo.png";
  const getTitle = (p) => p.productName || p.title || "";
  // Use slug for URL if available, otherwise _id — SEO friendly and clean
  const getHref = (p) => `/product/${p.slug || p._id || p.id}`;

  // ─── product list to render ──────────────────────────────
  const isLoading = isCollections ? loading : nonColLoading;
  const hasError = isCollections ? !!error : !!nonColError;
  const displayProducts = isCollections ? products : filteredStatic;

  // ─── Desired collection display order for "All Jewellery" ──
  const COLLECTION_ORDER = ["Gold", "Diamond", "Silver", "Mens", "Coins", "Gifting", "Birth Stones", "Wedding Collection"];

  // ─── group products by COLLECTION for "All Jewellery" view ──
  // Used on collections page when NO collection/category/subcategory filter is active
  const groupedByCollection = useMemo(() => {
    if (!isCollections || activeCollection || activeSubcategory || activeCategory) return null;
    if (displayProducts.length === 0) return null;

    const grouped = {};
    displayProducts.forEach((p) => {
      const keys = getProductCollectionKeys(p);
      if (keys.length === 0) {
        const key = "Other";
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(p);
        return;
      }

      keys.forEach((key) => {
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(p);
      });
    });

    // Sort by defined order, then alphabetical for any extras
    const order = [
      ...COLLECTION_ORDER.filter((c) => grouped[c]),
      ...Object.keys(grouped).filter((c) => !COLLECTION_ORDER.includes(c) && c !== "Other"),
      ...(grouped["Other"] ? ["Other"] : []),
    ];

    if (order.length <= 1) return null;
    return { grouped, order };
  }, [isCollections, activeCollection, activeSubcategory, activeCategory, displayProducts]);

  return (
    <main className="cat-root">
      <div className="cat-content">
        {!isSidebar && (
          <>
            <h1 className="cat-heading">{meta.heading}</h1>
            {meta.note && <p className="cat-note">{meta.note}</p>}
          </>
        )}

        {/* ── Non-collections: subcategory pills ── */}
        {isPills && (
          <div className={`cat-pills ${meta.type === "pills-center" ? "cat-pills-center" : ""}`}>
            <button
              className={`cat-pill ${activeFilter === "All" ? "cat-pill-active" : ""}`}
              onClick={() => setActiveFilter("All")}
            >
              All
            </button>
            {dynamicSubCats.map((sc) => (
              <button
                key={sc}
                className={`cat-pill ${activeFilter === sc ? "cat-pill-active" : ""}`}
                onClick={() => setActiveFilter(sc)}
              >
                {sc}
              </button>
            ))}
          </div>
        )}

        <div className={`cat-body ${isSidebar ? "cat-body-with-sidebar" : ""}`}>
          {/* ── Collections: dynamic 3-level sidebar ── */}
          {isSidebar && (
            <aside className="cat-sidebar">
              <h2 className="cat-sidebar-title">
                Collections <span className="cat-sidebar-sub">— curated pieces</span>
              </h2>

              {/* Level 1: Collections */}
              <div className="cat-sidebar-list">
                <button
                  className={`cat-sidebar-item ${activeCollection === null ? "cat-sidebar-item-active" : ""}`}
                  onClick={() => handleCollectionSelect(null)}
                >
                  All Jewellery
                </button>
                {collectionNames.map((col) => (
                  <button
                    key={col}
                    className={`cat-sidebar-item ${activeCollection === col ? "cat-sidebar-item-active" : ""}`}
                    onClick={() => handleCollectionSelect(col)}
                  >
                    {col}
                  </button>
                ))}
              </div>

              {/* Level 2: Categories — header style */}
              {/* MOVED to horizontal tabs above the product grid */}

              {/* Level 3: Subcategory pills — MOVED to above product grid */}
            </aside>
          )}

          {/* ── Product grid ── */}
          <section className="cat-grid-wrap">
            {/* ── Horizontal Category tabs (collections page only, when a collection is selected) ── */}
            {isSidebar && activeCollection !== null && categoriesForActive.length > 0 && (
              <div className="cat-htabs-wrap">
                <div className="cat-htabs">
                  <button
                    className={`cat-htab ${activeCategory === null ? "cat-htab-active" : ""}`}
                    onClick={() => handleCategorySelect(null)}
                  >
                    All
                  </button>
                  {categoriesForActive.map((c) => (
                    <button
                      key={c._id}
                      className={`cat-htab ${activeCategory === c.category ? "cat-htab-active" : ""}`}
                      onClick={() => handleCategorySelect(c.category)}
                    >
                      {c.category}
                    </button>
                  ))}
                </div>

                {/* Subcategory pills — shown when a category is selected */}
                {subcategoriesForActive.length > 0 && (
                  <div className="cat-hsubpills">
                    {subcategoriesForActive.map((sub) => (
                      <button
                        key={sub}
                        className={`cat-hsubpill ${activeSubcategory === sub ? "cat-hsubpill-active" : ""}`}
                        onClick={() => handleSubcategorySelect(sub)}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {isSidebar && (
              <div className="cat-grid-head">
                <span className="cat-grid-count">
                  {isLoading ? "Loading…" : `${displayProducts.length} Products`}
                </span>
              </div>
            )}

            {/* Non-collections: loading */}
            {!isCollections && nonColLoading && (
              <div className="cat-loading">
                <div className="cat-spinner" />
                <p>Loading products…</p>
              </div>
            )}

            {/* Non-collections: error */}
            {!isCollections && !nonColLoading && nonColError && (
              <div className="cat-error">
                <p>Could not load products. Please try again.</p>
                <button className="cat-retry-btn" onClick={() => {
                  setNonColError(null);
                  setNonColLoading(true);
                  Promise.all([
                    listProductsApi({ collection: collectionName }),
                    listCategoriesGroupedApi(),
                  ]).then(([prodRes, catRes]) => {
                    if (prodRes?.success) {
                      const prods = prodRes.data || [];
                      setStaticProducts(prods);
                      const grouped = catRes?.success ? (catRes.data || {}) : {};
                      const dbCats = grouped[collectionName] || [];
                      const subSet = new Set();
                      if (dbCats.length > 0) {
                        dbCats.forEach((cat) => {
                          if (prods.some((p) => p.subcategory === cat.category || p.category === cat.category)) subSet.add(cat.category);
                          (cat.subcategories || []).forEach((sub) => { if (prods.some((p) => p.subcategory === sub)) subSet.add(sub); });
                        });
                      }
                      if (subSet.size === 0) prods.forEach((p) => { if (p.subcategory) subSet.add(p.subcategory); });
                      setDynamicSubCats([...subSet]);
                    } else { setNonColError("failed"); }
                    setNonColLoading(false);
                  }).catch(() => { setNonColError("failed"); setNonColLoading(false); });
                }}>
                  Try again
                </button>
              </div>
            )}

            {/* Collections: loading */}
            {isCollections && loading && (
              <div className="cat-loading">
                <div className="cat-spinner" />
                <p>Loading products…</p>
              </div>
            )}

            {/* Collections: error */}
            {isCollections && !loading && error && (
              <div className="cat-error">
                <p>Could not load products. Please try again.</p>
                <button className="cat-retry-btn" onClick={handleRetry}>
                  Try again
                </button>
              </div>
            )}

            {/* Products / empty */}
            {!isLoading && !hasError && (
              <>
                {displayProducts.length === 0 ? (
                  <p className="cat-no-products">No products found for this filter.</p>
                ) : groupedByCollection ? (
                  /* ── Grouped by COLLECTION: Gold → Diamond → Silver → ... ── */
                  <div className="cat-sections">
                    {groupedByCollection.order.map((collectionKey) => {
                      const sectionProds = groupedByCollection.grouped[collectionKey];
                      return (
                        <div key={collectionKey} className="cat-section">
                          <div className="cat-section-header">
                            <div className="cat-section-header-left">
                              <span className="cat-section-eyebrow">Collection</span>
                              <button
                                className="cat-section-title-btn"
                                onClick={() => handleCollectionSelect(collectionKey)}
                              >
                                {collectionKey}
                              </button>
                            </div>
                            <div className="cat-section-header-right">
                              <span className="cat-section-count">{sectionProds.length} items</span>
                              <button
                                className="cat-section-view-all"
                                onClick={() => handleCollectionSelect(collectionKey)}
                              >
                                View All →
                              </button>
                            </div>
                          </div>
                          <div className="cat-grid cat-grid-4">
                            {sectionProds.slice(0, 4).map((p, idx) => (
                              <div className="cat-card" key={getId(p)}>
                                <Link href={getHref(p)}>
                                  <div className="cat-card-imgwrap">
                                    <img
                                      src={getImg(p)}
                                      alt={getTitle(p)}
                                      loading={idx === 0 ? "eager" : "lazy"}
                                      decoding="async"
                                      className="cat-card-img"
                                      onError={(e) => { e.currentTarget.src = "/home/logo.png"; }}
                                    />
                                  </div>
                                </Link>
                                <div className="cat-card-body">
                                  <Link href={getHref(p)}>
                                    <p className="cat-card-title">{getTitle(p)}</p>
                                  </Link>
                                  <button className="cat-card-btn" onClick={() => openPopup(p)}>
                                    {enquiryCart.some((item) => (item._id || item.id) === getId(p)) ? "Added ✓" : "Enquiry Now →"}
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* ── Flat grid (collection/category/subcategory filter active or non-collections) ── */
                  <div className={`cat-grid ${isCollections ? "cat-grid-4" : ""}`}>
                    {displayProducts.map((p, idx) => (
                      <div className="cat-card" key={getId(p)}>
                        <Link href={getHref(p)}>
                          <div className="cat-card-imgwrap">
                            <img
                              src={getImg(p)}
                              alt={getTitle(p)}
                              loading={idx < 8 ? "eager" : "lazy"}
                              decoding="async"
                              className="cat-card-img"
                              onError={(e) => { e.currentTarget.src = "/home/logo.png"; }}
                            />
                          </div>
                        </Link>
                        <div className="cat-card-body">
                          <Link href={getHref(p)}>
                            <p className="cat-card-title">{getTitle(p)}</p>
                          </Link>
                          <button className="cat-card-btn" onClick={() => openPopup(p)}>
                            {enquiryCart.some((item) => (item._id || item.id) === getId(p)) ? "Added ✓" : "Enquiry Now →"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>

      {/* ── Enquiry popup ── */}
      {showPopup && selectedProduct && (
        <div className="popup-overlay">
          <div className="popup">
            <button className="popup-close" onClick={closePopup}>✕</button>
            <h2>ADD PRODUCT TO ENQUIRY</h2>
            <p>You can add multiple products and send a combined enquiry later.</p>

            <div className="popup-product">
              <img src={getImg(selectedProduct)} alt={getTitle(selectedProduct)} />
              <div>
                <h3>{getTitle(selectedProduct)}</h3>
                {/* <p>Model #{getId(selectedProduct)}</p> */}
              </div>
            </div>

            <button
              type="button"
              className="popup-btn"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const oldCart = JSON.parse(localStorage.getItem("enquiryCart")) || [];
                const alreadyAdded = oldCart.some(
                  (item) => (item._id || item.id) === getId(selectedProduct)
                );
                if (!alreadyAdded) {
                  oldCart.push(selectedProduct);
                  localStorage.setItem("enquiryCart", JSON.stringify(oldCart));
                  setEnquiryCart([...oldCart]);
                }
              }}
            >
              {enquiryCart.some((item) => (item._id || item.id) === getId(selectedProduct))
                ? "Added ✓"
                : "Add to Enquiry →"}
            </button>

            <Link href="/enquiry-cart">
              <button type="button" className="popup-link">View Enquiry Cart</button>
            </Link>
          </div>
        </div>
      )}

      <style jsx>{`
      .cat-root {
  font-family: "Mona Sans", sans-serif;
  background: #fff6de;
  color: #681f00;
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  overflow-x: hidden;
}
  .cat-content {
  padding: 32px 48px 48px;
}
        .cat-heading {
          font-family: "Cinzel", serif;
          text-align: center;
          font-size: 32px;
          font-weight: 700;
          text-transform: uppercase;
          margin-top: 0;
          margin-bottom: 6px;
          letter-spacing: 1px;
        }
        .cat-note {
          text-align: center;
          font-size: 14px;
          color: rgba(104, 31, 0, 0.75);
          margin-bottom: 24px;
        }
        .cat-note :global(a) { color: #681f00; font-weight: 600; text-decoration: underline; }
        .cat-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: center;
          margin-bottom: 40px;
        }
        .cat-pill {
          font-family: inherit;
          border: none;
          background: #fdeccb;
          color: #681f00;
          font-weight: 600;
          font-size: 15px;
          padding: 12px 20px;
          border-radius: 999px;
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease;
        }
        .cat-pill:hover { background: rgba(104, 31, 0, 0.15); }
        .cat-pill-active { background: #681f00; color: #fff6de; }
        .cat-body-with-sidebar { display: flex; gap: 32px; align-items: flex-start; }
        .cat-sidebar {
  width: 260px;
  flex-shrink: 0;
  position: sticky;
  top: 100px;
  align-self: flex-start;
}
        .cat-sidebar-title { font-family: "Cinzel", serif; font-size: 28px; margin-bottom: 20px; }
        .cat-sidebar-sub {
          font-family: "Mona Sans", sans-serif;
          font-size: 12px;
          font-weight: 400;
          color: rgba(104, 31, 0, 0.6);
          margin-left: 8px;
        }
        .cat-sidebar-list { display: flex; flex-direction: column; gap: 8px; }
        .cat-sidebar-item {
          font-family: inherit;
          text-align: left;
          border: none;
          background: #fdeccb;
          color: #681f00;
          font-weight: 600;
          font-size: 15px;
          padding: 14px 18px;
          border-radius: 10px;
          cursor: pointer;
        }
        .cat-sidebar-item-active { background: #681f00; color: #fff6de; }
        .cat-grid-wrap {
  flex: 1;
  height: calc(100vh - 140px); /* Header ke hisaab se adjust kar lena */
  overflow-y: auto;
  padding-right: 10px;
}
        .cat-grid-head { display: flex; justify-content: flex-end; margin-bottom: 16px; }
        .cat-grid-count { background: #fdeccb; padding: 8px 18px; border-radius: 999px; font-size: 14px; font-weight: 600; }
        .cat-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; }
        .cat-grid-4 { grid-template-columns: repeat(4, 1fr); }

        /* ── Product card ── */
        .cat-card {
          display: flex;
          flex-direction: column;
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.10);
          transition: transform 0.22s ease, box-shadow 0.22s ease;
        }
        .cat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 36px rgba(0,0,0,0.18);
        }

        /* image — portrait, dark bg like screenshot */
        .cat-card-imgwrap {
          width: 100%;
          aspect-ratio: 3 / 4;
          overflow: hidden;
          background: #0e0e0e;
          flex-shrink: 0;
          position: relative;
        }
        .cat-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.45s ease;
        }
        .cat-card:hover .cat-card-img { transform: scale(1.04); }

        /* text + button */
        .cat-card-body {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 10px 12px 12px;
          gap: 10px;
          background: #ffffff;
          flex: 1;
          min-height: 90px;
        }
        .cat-card-title {
          font-size: 13px;
          font-weight: 500;
          line-height: 1.45;
          color: #1a1a1a;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin: 0;
        }
        .cat-card-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 40px;
          background: #5a1500;
          color: #ffffff;
          font-weight: 600;
          font-size: 13px;
          letter-spacing: 0.02em;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.2s ease;
          flex-shrink: 0;
        }
        .cat-card-btn:hover { background: #3d0e00; }
        .cat-no-products { text-align: center; font-size: 18px; padding: 60px 0; }
        .cat-empty { padding: 60px; text-align: center; }

        /* loading */
        .cat-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 0;
          gap: 16px;
          color: rgba(104,31,0,0.6);
          font-size: 15px;
        }
        .cat-spinner {
          width: 40px; height: 40px;
          border: 3px solid #fdeccb;
          border-top-color: #681f00;
          border-radius: 50%;
          animation: spin 0.75s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* error */
        .cat-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          padding: 60px 0;
          color: #681f00;
          font-size: 15px;
          text-align: center;
        }
        .cat-retry-btn {
          background: #681f00;
          color: #fff6de;
          border: none;
          border-radius: 999px;
          padding: 12px 28px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
        }

        /* ── Grouped sections (subcategory headers on collections page) ── */
        .cat-sections {
          display: flex;
          flex-direction: column;
          gap: 56px;
        }
        .cat-section {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* Header bar */
        .cat-section-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
          padding-bottom: 16px;
          border-bottom: 1.5px solid rgba(104, 31, 0, 0.18);
          position: relative;
        }
        /* accent left bar */
        .cat-section-header::before {
          content: "";
          position: absolute;
          left: 0;
          bottom: -1.5px;
          width: 60px;
          height: 3px;
          background: #681f00;
          border-radius: 2px;
        }

        /* Left: eyebrow + title */
        .cat-section-header-left {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .cat-section-eyebrow {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(104, 31, 0, 0.45);
        }
        .cat-section-title-btn {
          font-family: "Cinzel", serif;
          font-size: 26px;
          font-weight: 700;
          color: #681f00;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          letter-spacing: 0.04em;
          text-transform: capitalize;
          line-height: 1.1;
          transition: color 0.2s ease;
          text-align: left;
        }
        .cat-section-title-btn:hover { color: #3d1000; }

        /* Right: count pill + view-all link */
        .cat-section-header-right {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
          padding-bottom: 4px;
        }
        .cat-section-count {
          font-size: 11px;
          font-weight: 700;
          color: rgba(104, 31, 0, 0.6);
          background: #fdeccb;
          padding: 5px 12px;
          border-radius: 999px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          white-space: nowrap;
        }
        .cat-section-view-all {
          font-family: inherit;
          font-size: 13px;
          font-weight: 700;
          color: #681f00;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          letter-spacing: 0.02em;
          opacity: 0.7;
          transition: opacity 0.2s ease;
          white-space: nowrap;
        }
        .cat-section-view-all:hover { opacity: 1; text-decoration: underline; text-underline-offset: 3px; }

        /* category/subcategory sections inside sidebar */
        .cat-sidebar-section {
          margin-top: 20px;
        }
        .cat-sidebar-section-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: rgba(104,31,0,0.5);
          margin-bottom: 8px;
        }

        /* ── Horizontal category tabs above product grid ── */
        .cat-htabs-wrap {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1.5px solid rgba(104, 31, 0, 0.12);
        }
        .cat-htabs {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
        }
        .cat-htab {
          font-family: inherit;
          font-size: 13px;
          font-weight: 600;
          color: #681f00;
          background: #fdeccb;
          border: none;
          border-radius: 999px;
          padding: 8px 18px;
          cursor: pointer;
          transition: background 0.18s ease, color 0.18s ease, transform 0.15s ease;
          white-space: nowrap;
          letter-spacing: 0.01em;
        }
        .cat-htab:hover {
          background: rgba(104, 31, 0, 0.15);
          transform: translateY(-1px);
        }
        .cat-htab-active {
          background: #681f00;
          color: #fff6de;
        }
        .cat-htab-active:hover {
          background: #3d1000;
        }

        /* Subcategory row below category tabs */
        .cat-hsubpills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
          padding-left: 4px;
        }
        .cat-hsubpill {
          font-family: inherit;
          font-size: 12px;
          font-weight: 600;
          color: rgba(104, 31, 0, 0.75);
          background: transparent;
          border: 1.5px solid rgba(104, 31, 0, 0.25);
          border-radius: 999px;
          padding: 5px 14px;
          cursor: pointer;
          transition: all 0.18s ease;
          white-space: nowrap;
        }
        .cat-hsubpill:hover {
          border-color: #681f00;
          color: #681f00;
          background: rgba(104, 31, 0, 0.06);
        }
        .cat-hsubpill-active {
          background: #681f00;
          color: #fff6de;
          border-color: #681f00;
        }

        /* ── Category header-style list ── */
        .cat-sidebar-cat-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .cat-sidebar-cat-group {
          display: flex;
          flex-direction: column;
        }
        .cat-sidebar-cat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          font-family: inherit;
          text-align: left;
          background: transparent;
          border: none;
          border-left: 3px solid transparent;
          padding: 10px 14px 10px 12px;
          cursor: pointer;
          border-radius: 0 8px 8px 0;
          transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease;
          color: #681f00;
        }
        .cat-sidebar-cat-header:hover {
          background: rgba(104, 31, 0, 0.07);
          border-left-color: rgba(104, 31, 0, 0.35);
        }
        .cat-sidebar-cat-active {
          background: rgba(104, 31, 0, 0.1);
          border-left-color: #681f00 !important;
        }
        .cat-sidebar-cat-name {
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.01em;
          line-height: 1.3;
        }
        .cat-sidebar-cat-active .cat-sidebar-cat-name {
          font-weight: 700;
          color: #681f00;
        }
        .cat-sidebar-cat-badge {
          font-size: 10px;
          font-weight: 700;
          background: #fdeccb;
          color: rgba(104, 31, 0, 0.65);
          padding: 2px 8px;
          border-radius: 999px;
          letter-spacing: 0.04em;
          flex-shrink: 0;
        }
        .cat-sidebar-cat-active .cat-sidebar-cat-badge {
          background: #681f00;
          color: #fff6de;
        }
        .cat-subcategory-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .cat-sub-pill {
          font-family: inherit;
          border: none;
          background: #fdeccb;
          color: #681f00;
          font-weight: 600;
          font-size: 13px;
          padding: 8px 14px;
          border-radius: 999px;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .cat-sub-pill:hover { background: rgba(104,31,0,0.15); }
        .cat-sub-pill-active { background: #681f00; color: #fff6de; }
        .cat-grid-wrap::-webkit-scrollbar {
  width: 6px;
}

.cat-grid-wrap::-webkit-scrollbar-thumb {
  background: #681f00;
  border-radius: 20px;
}

.cat-grid-wrap::-webkit-scrollbar-track {
  background: transparent;
}
.popup-overlay{
position:fixed;
inset:0;
background:rgba(0,0,0,.55);
display:flex;
justify-content:center;
align-items:flex-end;
z-index:9999;
padding: 0;
}

.popup{
width:100%;
max-width:480px;
background:#FFF8E7;
border-radius:28px 28px 0 0;
padding:32px 24px 40px;
position:relative;
max-height:90vh;
overflow-y:auto;
}

.popup-close{
position:absolute;
right:20px;
top:16px;
font-size:22px;
border:none;
background:none;
cursor:pointer;
color:#681f00;
line-height:1;
width:32px;
height:32px;
display:flex;
align-items:center;
justify-content:center;
}

.popup h2{
font-family:"Cinzel",serif;
font-size:22px;
text-align:center;
margin-bottom:12px;
margin-top:4px;
color:#681f00;
line-height:1.3;
}

.popup>p{
text-align:center;
margin-bottom:20px;
font-size:13px;
color:rgba(104,31,0,0.7);
line-height:1.5;
}

.popup-product{
display:flex;
gap:14px;
padding:14px;
border:1px solid #e7d2a5;
border-radius:14px;
margin-bottom:20px;
align-items:center;
}

.popup-product img{
width:72px;
height:72px;
object-fit:cover;
border-radius:10px;
flex-shrink:0;
}

.popup-product h3{
font-size:13px;
font-weight:600;
margin-bottom:6px;
color:#1a1a1a;
line-height:1.4;
display:-webkit-box;
-webkit-line-clamp:2;
-webkit-box-orient:vertical;
overflow:hidden;
}

.popup-product p{
font-size:11px;
color:rgba(104,31,0,0.55);
font-family:monospace;
margin:0;
overflow:hidden;
text-overflow:ellipsis;
white-space:nowrap;
max-width:180px;
}

.popup-btn{
width:100%;
height:56px;
border:none;
border-radius:999px;
background:linear-gradient(90deg,#E8C57B,#7C2A00);
color:#fff;
font-size:16px;
font-weight:600;
cursor:pointer;
transition:opacity 0.2s;
}
.popup-btn:hover{opacity:0.9;}

.popup-link{
display:block;
margin-top:16px;
background:none;
border:none;
width:100%;
font-size:15px;
font-weight:500;
color:#681f00;
cursor:pointer;
text-align:center;
padding:8px 0;
}

@media (min-width: 600px){
  .popup-overlay{
    align-items:center;
    padding:16px;
  }
  .popup{
    border-radius:28px;
    padding:40px;
    width:480px;
    max-height:85vh;
  }
  .popup h2{ font-size:26px; }
}
       @media (max-width: 900px) {
  .cat-content {
    padding: 20px 0 32px;
    overflow-x: hidden;
  }

  .cat-heading {
    font-size: 28px;
    line-height: 1.3;
    padding: 0 16px;
  }

  .cat-note {
    font-size: 13px;
    margin-bottom: 18px;
    padding: 0 16px;
  }

  .cat-body-with-sidebar {
    flex-direction: column;
    gap: 8px;
  }

  .cat-sidebar {
    width: 100%;
    position: static;
    top: auto;
    overflow: hidden;
  }

  /* Hide sidebar title on mobile */
  .cat-sidebar-title { display: none; }
  .cat-sidebar-sub { display: none; }
  .cat-sidebar-section-label { display: none; }
  .cat-sidebar-section { margin-top: 0; }

  /* ── All scroll rows: full viewport width, scroll inside ── */
  .cat-sidebar-list,
  .cat-sidebar-cat-list,
  .cat-htabs,
  .cat-hsubpills,
  .cat-subcategory-pills {
    display: flex !important;
    flex-direction: row !important;
    flex-wrap: nowrap !important;
    overflow-x: auto !important;
    overflow-y: visible !important;
    gap: 8px;
    padding: 4px 16px 8px !important;
    scrollbar-width: none;
    width: 100% !important;
    box-sizing: border-box;
  }
  .cat-sidebar-list::-webkit-scrollbar,
  .cat-sidebar-cat-list::-webkit-scrollbar,
  .cat-htabs::-webkit-scrollbar,
  .cat-hsubpills::-webkit-scrollbar,
  .cat-subcategory-pills::-webkit-scrollbar { display: none; }

  .cat-sidebar-item,
  .cat-htab,
  .cat-sub-pill,
  .cat-hsubpill {
    flex: 0 0 auto;
    white-space: nowrap;
  }
  .cat-sidebar-item { padding: 8px 14px; border-radius: 999px; font-size: 13px; }
  .cat-htab { font-size: 12px; padding: 7px 14px; }
  .cat-hsubpill { font-size: 11px; padding: 4px 12px; }
  .cat-sub-pill { font-size: 13px; padding: 8px 14px; }

  /* Mobile category pills */
  .cat-sidebar-cat-list { flex-wrap: nowrap !important; }
  .cat-sidebar-cat-group { flex: 0 0 auto; }
  .cat-sidebar-cat-header {
    border-left: none;
    border-radius: 999px;
    background: #fdeccb;
    padding: 8px 16px;
    white-space: nowrap;
  }
  .cat-sidebar-cat-active { background: #681f00 !important; color: #fff6de !important; }
  .cat-sidebar-cat-active .cat-sidebar-cat-name { color: #fff6de; }
  .cat-sidebar-cat-badge { display: none; }

  /* Product grid area gets side padding */
  .cat-grid-wrap {
    height: auto;
    overflow: visible;
    padding: 0 16px;
    box-sizing: border-box;
    width: 100%;
  }

  /* htabs-wrap pulls out of grid-wrap padding to go full bleed */
  .cat-htabs-wrap {
    margin-left: -16px;
    margin-right: -16px;
    width: calc(100% + 32px);
    overflow: hidden;
  }

  .cat-grid-head {
    justify-content: space-between;
    margin-bottom: 12px;
  }

  .cat-htabs-wrap {
    padding: 0;
  }

  .cat-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
  }
  .cat-grid-4 { grid-template-columns: repeat(2, minmax(0, 1fr)); }

  .cat-card-title { font-size: 12px; }
  .cat-card-btn { width: 100%; height: 36px; font-size: 12px; }

  .cat-sections { gap: 36px; }
  .cat-section-title-btn { font-size: 18px; }
  .cat-section-view-all { display: none; }
}
       @media (max-width: 520px) {
  .cat-content {
    padding: 16px 0 24px;
    overflow-x: hidden;
  }

  .cat-grid-wrap {
    padding: 0 12px;
  }

  .cat-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  .cat-card-body { padding: 10px 10px 12px; gap: 8px; }
  .cat-card-title { font-size: 11px; -webkit-line-clamp: 2; }
  .cat-card-btn { height: 34px; font-size: 11px; }
  .cat-heading { font-size: 24px; padding: 0 12px; }
  .cat-grid-count { font-size: 12px; padding: 6px 12px; }
}
      `}</style>
       <ContactCTA />
      <VisitOurStore />
      <ImageStrip />
    </main>
    
  );

  //neww changhes
}