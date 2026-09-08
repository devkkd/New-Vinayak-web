"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/adminApi";
import { categories as categoryRoutes, subCategoriesByCategory } from "@/lib/data";

// Build a flat list: [{ name, categorySlug, categoryLabel }, ...] — deduped
const ALL_SUBCATEGORIES = (() => {
  const seen = new Set();
  const list = [];
  Object.entries(subCategoriesByCategory).forEach(([slug, subs]) => {
    const parent = categoryRoutes.find(c => c.slug === slug);
    if (!parent) return;
    subs.forEach(sub => {
      const key = `${slug}::${sub.toLowerCase()}`;
      if (seen.has(key)) return;
      seen.add(key);
      list.push({ name: sub, categorySlug: slug, categoryLabel: parent.heading || parent.label });
    });
  });
  return list;
})();

/**
 * Smart local matcher — understands multi-word queries like "gold ring" or "diamond bangles".
 *
 * Returns { matchedCats, matchedSubs, combinedHints }
 *   combinedHints: [{ categoryLabel, categorySlug, subName }] — cross-word matches
 *                  e.g. "gold ring" → { Gold Jewellery, gold, Ring }
 */
function smartLocalMatch(rawQuery) {
  const q = rawQuery.toLowerCase().trim();
  const tokens = q.split(/\s+/).filter(Boolean);

  // ── simple single-token match ──────────────────────────────
  const matchedCats = categoryRoutes.filter(c =>
    c.label.toLowerCase().includes(q) ||
    c.slug.toLowerCase().includes(q) ||
    (c.heading || "").toLowerCase().includes(q)
  );

  const matchedSubs = ALL_SUBCATEGORIES.filter(s =>
    s.name.toLowerCase().includes(q)
  );

  // ── multi-word cross matching ──────────────────────────────
  // For each token, check if it's a category token or subcategory token
  const catTokens = tokens.filter(t =>
    categoryRoutes.some(c =>
      c.label.toLowerCase().includes(t) ||
      c.slug.toLowerCase().includes(t) ||
      (c.heading || "").toLowerCase().includes(t)
    )
  );
  const subTokens = tokens.filter(t =>
    ALL_SUBCATEGORIES.some(s => s.name.toLowerCase().includes(t))
  );

  const combinedHints = [];
  if (catTokens.length > 0 && subTokens.length > 0) {
    // Find categories matched by catTokens
    const catsFromTokens = categoryRoutes.filter(c =>
      catTokens.some(t =>
        c.label.toLowerCase().includes(t) ||
        c.slug.toLowerCase().includes(t) ||
        (c.heading || "").toLowerCase().includes(t)
      )
    );
    // Find subcategories matched by subTokens
    const subsFromTokens = ALL_SUBCATEGORIES.filter(s =>
      subTokens.some(t => s.name.toLowerCase().includes(t))
    );

    // Cross-join: only show sub if it belongs to one of the matched cats
    catsFromTokens.forEach(cat => {
      subsFromTokens
        .filter(s => s.categorySlug === cat.slug)
        .forEach(s => {
          combinedHints.push({
            categoryLabel: cat.heading || cat.label,
            categorySlug: cat.slug,
            subName: s.name,
          });
        });
    });
  }

  return {
    matchedCats: matchedCats.slice(0, 3),
    matchedSubs: matchedSubs.slice(0, 4),
    combinedHints: combinedHints.slice(0, 5),
  };
}

/* ----------------------------- ICONS ----------------------------- */

const IconSearch = p => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...p}
  >
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconMenu = p => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...p}
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const IconClose = p => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...p}
  >
    <line x1="5" y1="5" x2="19" y2="19" />
    <line x1="19" y1="5" x2="5" y2="19" />
  </svg>
);

const IconChevron = p => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...p}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const IconHome = p => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...p}
  >
    <path d="M3 11.5 12 4l9 7.5" />
    <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
  </svg>
);

const IconCollections = p => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...p}
  >
    <path d="M4 8h16l-1.2 11a2 2 0 0 1-2 1.8H7.2a2 2 0 0 1-2-1.8L4 8Z" />
    <path d="M8 8V6a4 4 0 0 1 8 0v2" />
  </svg>
);

const IconBars = p => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...p}
  >
    <rect x="3" y="5" width="18" height="4" rx="1" />
    <rect x="3" y="10.5" width="18" height="4" rx="1" />
    <rect x="3" y="16" width="18" height="4" rx="1" />
  </svg>
);

const IconDiamond = p => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...p}
  >
    <path d="M6 3h12l4 6-10 12L2 9Z" />
    <path d="M2 9h20M9 3 7 9l5 12M15 3l2 6-5 12" />
  </svg>
);

const IconPerson = p => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...p}
  >
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5 20c1-3.5 4-5.5 7-5.5s6 2 7 5.5" />
  </svg>
);

const IconCoin = p => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...p}
  >
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
  </svg>
);

const IconGift = p => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...p}
  >
    <rect x="3" y="9" width="18" height="4" rx="1" />
    <path d="M5 13h14v7a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-7Z" />
    <path d="M12 9v12" />
    <path d="M12 9C10 6 6 6 6 9c0 0 0 0 0 0" />
    <path d="M12 9c2-3 6-3 6 0 0 0 0 0 0 0" />
  </svg>
);

const IconHexagon = p => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...p}
  >
    <path d="M12 2 21 7v10l-9 5-9-5V7Z" />
    <path d="M12 2v20M3 7l9 5 9-5M12 12v10" />
  </svg>
);

const IconAbout = p => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    {...p}
  >
    <path d="M8 4c-3 2-3 6 0 8-3 2-3 6 0 8" />
  </svg>
);

const IconPhone = p => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...p}
  >
    <path d="M4 4h4l2 5-2.5 1.5a12 12 0 0 0 6 6L15 14l5 2v4a2 2 0 0 1-2 2C10 22 2 14 2 6a2 2 0 0 1 2-2Z" />
  </svg>
);

const IconPin = p => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...p}
  >
    <path d="M12 22s7-7.2 7-12a7 7 0 0 0-14 0c0 4.8 7 12 7 12Z" />
    <circle cx="12" cy="10" r="2.4" />
  </svg>
);

const IconWhatsapp = p => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M17.5 14.4c-.3-.1-1.7-.9-2-1-.3-.1-.5-.1-.6.1-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.6-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.2-.4.1-.2 0-.4 0-.5-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1.1 2.7c.1.2 1.8 2.8 4.4 3.9.6.3 1.1.4 1.5.5.6.2 1.1.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.2-.2-.5-.3Z" />
    <path
      d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 18.2a8.1 8.1 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Z"
      fillRule="evenodd"
      clipRule="evenodd"
    />
  </svg>
);

const IconInstagram = p => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    {...p}
  >
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const IconBag = p => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...p}
  >
    <path d="M6 8h12l1 12.5a1.5 1.5 0 0 1-1.5 1.5H6.5A1.5 1.5 0 0 1 5 20.5L6 8Z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
);

/* --------------------------- NAV DATA --------------------------- */

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: IconHome, dropdown: false },
  {
    label: "Collections",
    href: "/collections",
    icon: IconCollections,
    dropdown: true
  },
  { label: "Gold", href: "/gold", icon: IconBars, dropdown: true },
  { label: "Diamond", href: "/diamond", icon: IconDiamond, dropdown: true },
  { label: "Silver", href: "/silver", icon: IconBars, dropdown: true },
  { label: "Mens", href: "/mens", icon: IconPerson, dropdown: true },
  { label: "Coins", href: "/coins", icon: IconCoin, dropdown: true },
  { label: "Gifting", href: "/gifting", icon: IconGift, dropdown: true },
  {
    label: "Birth Stones",
    href: "/birth-stones",
    icon: IconHexagon,
    dropdown: false
  }
];

/* ---------------------------- HEADER ---------------------------- */

export default function Header() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // ── Search state ──
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ products: [], categories: [], subcategories: [], combinedHints: [] });
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const debounceRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Debounced search
  const handleSearchChange = useCallback((val) => {
    setSearchQuery(val);
    clearTimeout(debounceRef.current);
    if (!val.trim()) { setSearchResults({ products: [], categories: [], subcategories: [], combinedHints: [] }); setSearchOpen(false); return; }
    debounceRef.current = setTimeout(async () => {
      setSearchLoading(true);
      try {
        // Search products via API
        const endpoints = [`${API_BASE_URL}/api/products/search?q=${encodeURIComponent(val)}`, `https://vinayakjewellersjaipur.com/api/products/search?q=${encodeURIComponent(val)}`];
        let products = [];
        for (const url of [...new Set(endpoints)]) {
          try {
            const res = await fetch(url);
            if (res.ok) { const data = await res.json(); products = data.data || []; break; }
          } catch (_) {}
        }
        // Smart local match — handles "gold ring", "diamond bangles", etc.
        const { matchedCats, matchedSubs, combinedHints } = smartLocalMatch(val);
        setSearchResults({ products: products.slice(0, 6), categories: matchedCats, subcategories: matchedSubs, combinedHints });
        setSearchOpen(true);
      } catch (_) {}
      setSearchLoading(false);
    }, 300);
  }, []);

  function handleSearchSubmit(e) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchOpen(false);
    setMobileSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  }

  function clearSearch() {
    setSearchQuery("");
    setSearchResults({ products: [], categories: [], subcategories: [], combinedHints: [] });
    setSearchOpen(false);
  }

useEffect(() => {
  const updateCartCount = () => {
    const cart =
      JSON.parse(localStorage.getItem("enquiryCart")) || [];
    setCartCount(cart.length);
  };

  updateCartCount();

  window.addEventListener("storage", updateCartCount);

  const interval = setInterval(updateCartCount, 300);

  return () => {
    window.removeEventListener("storage", updateCartCount);
    clearInterval(interval);
  };
}, []);

  const closeDrawer = () => setDrawerOpen(false);

  return (
    <header className="hdr-root">
      {/* ---------------- DESKTOP TOP BAR ---------------- */}
      <div className="hdr-topbar">
        <Link href="/" className="hdr-logo">
          <Image
            src="/logo.png"
            alt="Vinayak Jewellers"
            width={184}
            height={64}
            className="hdr-logo-img"
            priority
          />
        </Link>

        <form className="hdr-search" onSubmit={handleSearchSubmit} ref={searchRef} autoComplete="off">
          <IconSearch className="hdr-search-icon" />
          <input
            type="text"
            placeholder="Search Gold, Diamond, Silver…"
            className="hdr-search-input"
            value={searchQuery}
            onChange={e => handleSearchChange(e.target.value)}
            onFocus={() => searchQuery.trim() && setSearchOpen(true)}
          />
          {searchQuery && (
            <button type="button" className="hdr-search-clear" onClick={clearSearch} aria-label="Clear">✕</button>
          )}

          {/* Dropdown */}
          {searchOpen && (searchResults.products.length > 0 || searchResults.categories.length > 0 || searchResults.subcategories.length > 0 || searchResults.combinedHints.length > 0) && (
            <div className="hdr-search-dropdown">
              {searchLoading && <div className="hdr-sd-loading">Searching…</div>}

              {/* Combined hints — shown FIRST when query spans category + subcategory e.g. "gold ring" */}
              {searchResults.combinedHints.length > 0 && (
                <div className="hdr-sd-group">
                  <p className="hdr-sd-label">Best Match</p>
                  {searchResults.combinedHints.map(hint => (
                    <Link key={`${hint.categorySlug}-${hint.subName}`} href={`/${hint.categorySlug}`} className="hdr-sd-catrow hdr-sd-combined" onClick={clearSearch}>
                      <span className="hdr-sd-cat-icon">✦</span>
                      <span className="hdr-sd-sub-name">{hint.subName}</span>
                      <span className="hdr-sd-combined-sep">in</span>
                      <span className="hdr-sd-combined-cat">{hint.categoryLabel}</span>
                    </Link>
                  ))}
                </div>
              )}

              {/* Plain category matches — only if no combined hints cover them already */}
              {searchResults.categories.length > 0 && searchResults.combinedHints.length === 0 && (
                <div className="hdr-sd-group">
                  <p className="hdr-sd-label">Categories</p>
                  {searchResults.categories.map(cat => (
                    <Link key={cat.slug} href={`/${cat.slug}`} className="hdr-sd-catrow" onClick={clearSearch}>
                      <span className="hdr-sd-cat-icon">🏷</span>
                      <span>{cat.heading || cat.label}</span>
                    </Link>
                  ))}
                </div>
              )}

              {/* Subcategory matches — only if no combined hints */}
              {searchResults.subcategories.length > 0 && searchResults.combinedHints.length === 0 && (
                <div className="hdr-sd-group">
                  <p className="hdr-sd-label">Subcategories</p>
                  {searchResults.subcategories.map(sub => (
                    <Link key={`${sub.categorySlug}-${sub.name}`} href={`/${sub.categorySlug}`} className="hdr-sd-catrow" onClick={clearSearch}>
                      <span className="hdr-sd-cat-icon">◈</span>
                      <span className="hdr-sd-sub-name">{sub.name}</span>
                      <span className="hdr-sd-sub-parent">in {sub.categoryLabel}</span>
                    </Link>
                  ))}
                </div>
              )}

              {searchResults.products.length > 0 && (
                <div className="hdr-sd-group">
                  <p className="hdr-sd-label">Products</p>
                  {searchResults.products.map(p => {
                    const img = (p.images?.length > 0 ? p.images[0] : p.image) || "/home/logo.png";
                    const title = p.productName || p.title || "";
                    const href = `/product/${p.slug || p._id || p.id}`;
                    return (
                      <Link key={p._id} href={href} className="hdr-sd-prodrow" onClick={clearSearch}>
                        <img src={img} alt={title} className="hdr-sd-prod-img" onError={e => { e.currentTarget.src="/home/logo.png"; }} />
                        <div className="hdr-sd-prod-info">
                          <span className="hdr-sd-prod-name">{title}</span>
                          {p.sku && <span className="hdr-sd-prod-sku">SKU: {p.sku}</span>}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}

              <button type="submit" className="hdr-sd-viewall">
                View all results for &ldquo;{searchQuery}&rdquo; →
              </button>
            </div>
          )}
        </form>

        <nav className="hdr-toplinks">
          <Link href="/about" className="hdr-link-group">
            <img src="/about/about.svg" className="w-5"/>
            <span className="hdr-toplink">About Vinayak</span>
          </Link>

          <span className="hdr-divider">|</span>

          <Link href="/contact" className="hdr-link-group">
            <IconPhone className="hdr-toplink-icon" />
            <span className="hdr-toplink">Contact Us</span>
          </Link>

          <span className="hdr-divider">|</span>

          <a
            href="https://www.google.com/maps/dir/?api=1&destination=Vinayak%20Jewellers%20G-46%2C%20Unnati%20Tower%2C%20Sector%202%2C%20Central%20Spine%2C%20Vidyadhar%20Nagar%2C%20Jaipur%20Rajasthan%20302039"
            target="_blank"
            rel="noopener noreferrer"
            className="hdr-link-group"
          >
            <IconPin className="hdr-toplink-icon" />
            <span className="hdr-toplink">Visit Our Store</span>
          </a>
        </nav>

        <div className="hdr-pills">
          <a
            href="https://wa.me/919414156451"
            target="_blank"
            rel="noopener noreferrer"
            className="hdr-pill hdr-pill-whatsapp"
          >
            <IconWhatsapp className="hdr-pill-icon" />
            <span>WhatsApp</span>
          </a>
          <a
            href="https://www.instagram.com/vinayak_jewellers_jaipur"
            target="_blank"
            rel="noopener noreferrer"
            className="hdr-pill hdr-pill-instagram"
          >
            <IconInstagram className="hdr-pill-icon" />
            <span>Instagram</span>
          </a>
          <Link href="/enquiry-cart" className="hdr-pill hdr-pill-cart">
  <IconBag className="hdr-pill-icon" />
  <span>Enquiry Cart</span>

  {cartCount > 0 && (
    <span className="hdr-cart-count">
      {cartCount}
    </span>
  )}
</Link>
        </div>
      </div>

      {/* ---------------- DESKTOP NAV BAR ---------------- */}
      <nav className="hdr-navbar">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`hdr-navitem ${isActive ? "hdr-navitem-active" : ""}`}
            >
              <Icon className="hdr-navitem-icon" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* ---------------- MOBILE HEADER ---------------- */}
      <div className="hdr-mobilebar">
        <Link href="/" className="hdr-mobile-logo">
          <Image
            src="/logo.png"
            alt="Vinayak Jewellers"
            width={130}
            height={60}
            className="hdr-mobile-logo-img"
            priority
          />
        </Link>

        <div className="hdr-mobile-actions">
          <button
            type="button"
            aria-label="Search"
            className="hdr-icon-btn"
            onClick={() => setMobileSearchOpen(v => !v)}
          >
            <IconSearch className="hdr-icon-btn-svg" />
          </button>
          <button
            type="button"
            aria-label="Open menu"
            className="hdr-icon-btn"
            onClick={() => setDrawerOpen(true)}
          >
            <IconMenu className="hdr-icon-btn-svg" />
          </button>
        </div>
      </div>

      {mobileSearchOpen && (
        <div className="hdr-mobile-search-wrap" ref={mobileSearchRef}>
          <form className="hdr-mobile-search-row" onSubmit={handleSearchSubmit} autoComplete="off">
            <IconSearch className="hdr-search-icon" />
            <input
              type="text"
              placeholder="Search Gold, Diamond, Silver…"
              className="hdr-search-input"
              value={searchQuery}
              onChange={e => handleSearchChange(e.target.value)}
              onFocus={() => searchQuery.trim() && setSearchOpen(true)}
              autoFocus
            />
            {searchQuery && (
              <button type="button" className="hdr-search-clear" onClick={clearSearch}>✕</button>
            )}
          </form>

          {/* Mobile dropdown */}
          {searchOpen && (searchResults.products.length > 0 || searchResults.categories.length > 0 || searchResults.subcategories.length > 0 || searchResults.combinedHints.length > 0) && (
            <div className="hdr-search-dropdown hdr-mobile-dropdown">
              {searchLoading && <div className="hdr-sd-loading">Searching…</div>}

              {searchResults.combinedHints.length > 0 && (
                <div className="hdr-sd-group">
                  <p className="hdr-sd-label">Best Match</p>
                  {searchResults.combinedHints.map(hint => (
                    <Link key={`${hint.categorySlug}-${hint.subName}`} href={`/${hint.categorySlug}`} className="hdr-sd-catrow hdr-sd-combined" onClick={() => { clearSearch(); setMobileSearchOpen(false); }}>
                      <span className="hdr-sd-cat-icon">✦</span>
                      <span className="hdr-sd-sub-name">{hint.subName}</span>
                      <span className="hdr-sd-combined-sep">in</span>
                      <span className="hdr-sd-combined-cat">{hint.categoryLabel}</span>
                    </Link>
                  ))}
                </div>
              )}

              {searchResults.categories.length > 0 && searchResults.combinedHints.length === 0 && (
                <div className="hdr-sd-group">
                  <p className="hdr-sd-label">Categories</p>
                  {searchResults.categories.map(cat => (
                    <Link key={cat.slug} href={`/${cat.slug}`} className="hdr-sd-catrow" onClick={() => { clearSearch(); setMobileSearchOpen(false); }}>
                      <span className="hdr-sd-cat-icon">🏷</span>
                      <span>{cat.heading || cat.label}</span>
                    </Link>
                  ))}
                </div>
              )}

              {searchResults.subcategories.length > 0 && searchResults.combinedHints.length === 0 && (
                <div className="hdr-sd-group">
                  <p className="hdr-sd-label">Subcategories</p>
                  {searchResults.subcategories.map(sub => (
                    <Link key={`${sub.categorySlug}-${sub.name}`} href={`/${sub.categorySlug}`} className="hdr-sd-catrow" onClick={() => { clearSearch(); setMobileSearchOpen(false); }}>
                      <span className="hdr-sd-cat-icon">◈</span>
                      <span className="hdr-sd-sub-name">{sub.name}</span>
                      <span className="hdr-sd-sub-parent">in {sub.categoryLabel}</span>
                    </Link>
                  ))}
                </div>
              )}

              {searchResults.products.length > 0 && (
                <div className="hdr-sd-group">
                  <p className="hdr-sd-label">Products</p>
                  {searchResults.products.map(p => {
                    const img = (p.images?.length > 0 ? p.images[0] : p.image) || "/home/logo.png";
                    const title = p.productName || p.title || "";
                    const href = `/product/${p.slug || p._id || p.id}`;
                    return (
                      <Link key={p._id} href={href} className="hdr-sd-prodrow" onClick={() => { clearSearch(); setMobileSearchOpen(false); }}>
                        <img src={img} alt={title} className="hdr-sd-prod-img" onError={e => { e.currentTarget.src="/home/logo.png"; }} />
                        <div className="hdr-sd-prod-info">
                          <span className="hdr-sd-prod-name">{title}</span>
                          {p.sku && <span className="hdr-sd-prod-sku">SKU: {p.sku}</span>}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}

              <button type="button" className="hdr-sd-viewall" onClick={() => {
                if (!searchQuery.trim()) return;
                setSearchOpen(false);
                setMobileSearchOpen(false);
                router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                clearSearch();
              }}>
                View all results for &ldquo;{searchQuery}&rdquo; →
              </button>
            </div>
          )}
        </div>
      )}

      {/* ---------------- MOBILE DRAWER ---------------- */}
      <div
        className={`hdr-overlay ${drawerOpen ? "hdr-overlay-open" : ""}`}
        onClick={closeDrawer}
      />

      <aside className={`hdr-drawer ${drawerOpen ? "hdr-drawer-open" : ""}`}>
        <div className="hdr-drawer-head">
          <Image
            src="/logo.png"
            alt="Vinayak Jewellers"
            width={40}
            height={40}
            className="hdr-drawer-logo-img"
          />
          <div className="hdr-mobile-logo-text">
            <span className="hdr-mobile-logo-hindi">विनायक ज्वैलर्स</span>
            <span className="hdr-mobile-logo-tag">
              DIAMOND, GOLD &amp; SILVER JEWELLERY
            </span>
            <span className="hdr-mobile-logo-loc">
              Vidhyadhar Nagar, Jaipur | Since 2005
            </span>
          </div>
          <button
            type="button"
            aria-label="Close menu"
            className="hdr-icon-btn hdr-drawer-close"
            onClick={closeDrawer}
          >
            <IconClose className="hdr-icon-btn-svg" />
          </button>
        </div>

        <nav className="hdr-drawer-nav">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`hdr-drawer-item ${
                  isActive ? "hdr-drawer-item-active" : ""
                }`}
                onClick={closeDrawer}
              >
                <span className="hdr-drawer-item-left">
                  <Icon className="hdr-drawer-item-icon" />
                  <span>{item.label}</span>
                </span>
                {/* {item.dropdown && (
                  <IconChevron className="hdr-drawer-chevron" />
                )} */}
              </Link>
            );
          })}

          <Link href="/about" className="hdr-drawer-item" onClick={closeDrawer}>
            <span className="hdr-drawer-item-left">
              <IconAbout className="hdr-drawer-item-icon" />
              <span>About Us</span>
            </span>
          </Link>

          <Link
            href="/contact"
            className="hdr-drawer-item"
            onClick={closeDrawer}
          >
            <span className="hdr-drawer-item-left">
              <IconPhone className="hdr-drawer-item-icon" />
              <span>Contact Us</span>
            </span>
          </Link>
        </nav>

        <div className="hdr-drawer-pills">
          <a
            href="https://wa.me/919414156451"
            target="_blank"
            rel="noopener noreferrer"
            className="hdr-pill hdr-pill-whatsapp hdr-pill-full"
          >
            <IconWhatsapp className="hdr-pill-icon" />
            <span>WhatsApp</span>
          </a>
          <a
            href="https://instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hdr-pill hdr-pill-instagram hdr-pill-full"
          >
            <IconInstagram className="hdr-pill-icon" />
            <span>Instagram</span>
          </a>
          <Link
            href="/enquiry-cart"
            className="hdr-pill hdr-pill-cart hdr-pill-full"
            onClick={closeDrawer}
          >
            <IconBag className="hdr-pill-icon" />
            <span>Enquiry Cart</span>
          </Link>
        </div>
      </aside>

      <style>{`
     .hdr-root {
  --hdr-dark: #681f00;
  --hdr-bg: #fff4dc;
  --hdr-cream: #fff4dc;
  --hdr-border: rgba(104, 31, 0, 0.15);
  --hdr-muted: rgba(104, 31, 0, 0.65);

  font-family: "Mona Sans", sans-serif;
  background: var(--hdr-bg);
  color: var(--hdr-dark);
  position: relative;
  z-index: 100;

  border-bottom: 0.9px solid #61311e;
}

        a { text-decoration: none; color: inherit; }
        button { font-family: inherit; cursor: pointer; background: none; border: none; }

        /* ---------- DESKTOP TOP BAR ---------- */
        .hdr-topbar {
  display: flex;
  align-items: center;
  gap: 24px;
  padding-top: 10px;
  padding-right: 32px;
  padding-bottom: 0;
  padding-left: 32px;
  max-width: 1440px;
  margin: 0 auto;
}

       .hdr-logo{
  display:flex;
  align-items:center;
  gap:12px;
  flex-shrink:0;
  transition:all .3s ease;
}

// .hdr-logo:hover{
//   opacity:.88;
//   transform:scale(1.02);
// }
       .hdr-logo-img{
  border-radius:50%;
  object-fit:cover;
  transition:transform .35s ease, filter .35s ease;
}

// .hdr-logo:hover .hdr-logo-img{
//   transform:scale(1.05);
//   filter:brightness(1.05);
// }
        .hdr-logo-text { display: flex; flex-direction: column; line-height: 1.25; }
        .hdr-logo-hindi { font-size: 22px; font-weight: 700; color: var(--hdr-dark); }
        .hdr-logo-tag { font-size: 10px; font-weight: 600; letter-spacing: 0.5px; color: var(--hdr-muted); }
        .hdr-logo-loc { font-size: 11px; color: var(--hdr-muted); }
        .hdr-link-group{
  display:flex;
  align-items:center;
  gap:8px;
  cursor:pointer;
  transition:.3s ease;
  text-decoration:none;
}

.hdr-link-group:hover{
  transform:translateY(-1px);
}

.hdr-link-group:hover .hdr-toplink,
.hdr-link-group:hover .hdr-toplink-icon,
.hdr-link-group:hover .hdr-toplink-swirl{
  color:#BF9555;
}

.hdr-logo{
  cursor:pointer;
}

        .hdr-search {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--hdr-cream);
          border: 1px solid var(--hdr-border);
          border-radius: 9px;
          padding: 11px 18px;
          max-width: 620px;
          position: relative;
        }
        .hdr-search-icon { width: 18px; height: 18px; color: var(--hdr-muted); flex-shrink: 0; }
        .hdr-search-input {
          border: none;
          outline: none;
          background: transparent;
          width: 100%;
          font-size: 12px;
          color: var(--hdr-dark);
          font-family: inherit;
        }
        .hdr-search-input::placeholder { color: var(--hdr-muted); }
        .hdr-search-clear {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--hdr-muted);
          font-size: 13px;
          padding: 0 2px;
          flex-shrink: 0;
          line-height: 1;
        }
        .hdr-search-clear:hover { color: var(--hdr-dark); }

        /* ── Search Dropdown ── */
        .hdr-search-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          right: 0;
          background: #fff;
          border: 1px solid rgba(104,31,0,0.12);
          border-radius: 14px;
          box-shadow: 0 12px 40px rgba(104,31,0,0.14);
          z-index: 500;
          overflow: hidden;
          max-height: 480px;
          overflow-y: auto;
        }
        .hdr-sd-loading {
          padding: 12px 16px;
          font-size: 12px;
          color: var(--hdr-muted);
        }
        .hdr-sd-group { padding: 8px 0; }
        .hdr-sd-label {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: rgba(104,31,0,0.45);
          padding: 4px 16px 6px;
          margin: 0;
        }
        .hdr-sd-catrow {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 16px;
          font-size: 13px;
          font-weight: 600;
          color: var(--hdr-dark);
          text-decoration: none;
          transition: background 0.15s;
        }
        .hdr-sd-catrow:hover { background: #fff8ee; }
        .hdr-sd-cat-icon { font-size: 14px; }
        .hdr-sd-sub-name { font-size: 13px; font-weight: 600; flex: 1; }
        .hdr-sd-sub-parent {
          font-size: 10px;
          color: rgba(104,31,0,0.45);
          font-style: italic;
          white-space: nowrap;
          margin-left: auto;
          padding-left: 8px;
        }
        .hdr-sd-combined {
          background: linear-gradient(90deg, #fffaf2, #fff8ee);
          border-left: 3px solid #BF9555;
        }
        .hdr-sd-combined:hover { background: #fff4e0; }
        .hdr-sd-combined-sep {
          font-size: 10px;
          color: rgba(104,31,0,0.4);
          margin: 0 4px;
          font-style: italic;
        }
        .hdr-sd-combined-cat {
          font-size: 11px;
          font-weight: 600;
          color: #BF9555;
          white-space: nowrap;
        }
        .hdr-sd-prodrow {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 16px;
          text-decoration: none;
          transition: background 0.15s;
        }
        .hdr-sd-prodrow:hover { background: #fff8ee; }
        .hdr-sd-prod-img {
          width: 44px;
          height: 44px;
          border-radius: 8px;
          object-fit: cover;
          border: 1px solid rgba(104,31,0,0.1);
          flex-shrink: 0;
        }
        .hdr-sd-prod-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }
        .hdr-sd-prod-name {
          font-size: 12px;
          font-weight: 600;
          color: #1a1a1a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 320px;
        }
        .hdr-sd-prod-sku {
          font-size: 10px;
          color: var(--hdr-muted);
          font-family: monospace;
        }
        .hdr-sd-viewall {
          display: block;
          width: 100%;
          padding: 11px 16px;
          border: none;
          border-top: 1px solid rgba(104,31,0,0.08);
          background: #fffaf0;
          color: var(--hdr-dark);
          font-size: 12px;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          text-align: left;
          transition: background 0.15s;
        }
        .hdr-sd-viewall:hover { background: #fff0d0; }

       .hdr-toplinks{
  display:flex;
  align-items:center;
  gap:10px;
  font-size:15px;
  font-weight:500;
  white-space:nowrap;
}

.hdr-link-group{
  display:flex;
  align-items:center;
  gap:8px;
  cursor:pointer;
  transition:.3s ease;
}

.hdr-toplink{
  color:var(--hdr-dark);
  transition:.3s ease;
}

.hdr-toplink-icon,
.hdr-toplink-swirl{
  width:16px;
  height:16px;
  color:var(--hdr-dark);
  transition:.3s ease;
}

.hdr-link-group:hover{
  transform:translateY(-1px);
}

.hdr-link-group:hover .hdr-toplink{
  color:#BF9555;
}

.hdr-link-group:hover .hdr-toplink-icon,
.hdr-link-group:hover .hdr-toplink-swirl{
  color:#BF9555;
}

.hdr-divider{
  color:var(--hdr-border);
  margin:0 4px;
}
        .hdr-pills {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }
        .hdr-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 18px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 500;
          color: var(--hdr-cream);
          white-space: nowrap;
        }
        .hdr-pill-icon { width: 16px; height: 16px; flex-shrink: 0; }
        .hdr-pill-whatsapp { background: #57C86B; }
        .hdr-pill-instagram { background: linear-gradient(135deg, #8a3ab9, #e0416a, #f9a04b); }
        .hdr-pill-cart { background: linear-gradient(135deg, #4a2410, var(--hdr-dark)); }

        /* ---------- DESKTOP NAV BAR ---------- */
        .hdr-navbar {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 6px 32px 6px;
          max-width: 1440px;
          margin: 0 auto;
          flex-wrap: wrap;
        }
        .hdr-navitem {
          display: flex;
          align-items: center;
          gap: 22px;
          padding: 10px 18px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 600;
          color: var(--hdr-dark);
          transition: background 0.15s ease, color 0.15s ease;
        }
        .hdr-navitem:hover { background: rgba(104, 31, 0, 0.08); }
        .hdr-navitem-icon { width: 20px; height: 20px; flex-shrink: 0; }
        .hdr-navitem-active {
  background: #681f00;
  color: #fff4dc;

  border-radius: 10px;
  padding: 10px 18px;

  border: 1px solid rgba(255, 255, 255, 0.12);

  box-shadow:
    0 4px 12px rgba(104, 31, 0, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);

  transition: all 0.3s ease;
}

.hdr-navitem-active .hdr-navitem-icon {
  color: #fff;
}

.hdr-navitem-active:hover {
  background: #5b1a00;
  color: #fff4dc;
}
        /* ---------- MOBILE HEADER ---------- */
        .hdr-mobilebar {
          display: none;
          align-items: center;
          justify-content: space-between;
          padding: 0px 16px;
    }
        .hdr-mobile-logo { display: flex; align-items: center; gap: 8px; min-width: 0; }
        .hdr-mobile-logo-img { border-radius: 50%; object-fit: cover; flex-shrink: 0; }
        .hdr-mobile-logo-text { display: flex; flex-direction: column; line-height: 1.2; min-width: 0; }
        .hdr-mobile-logo-hindi { font-size: 14px; font-weight: 700; color: var(--hdr-dark); white-space: nowrap; }
        .hdr-mobile-logo-tag { font-size: 7px; font-weight: 600; letter-spacing: 0.3px; color: var(--hdr-muted); white-space: nowrap; }
        .hdr-mobile-logo-loc { font-size: 8px; color: var(--hdr-muted); white-space: nowrap; }

        .hdr-mobile-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
        .hdr-icon-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          color: var(--hdr-dark);
        }
        .hdr-icon-btn-svg { width: 22px; height: 22px; }

        .hdr-mobile-search-wrap {
          display: none;
          flex-direction: column;
          margin: 0 16px 12px;
          position: relative;
        }

        .hdr-mobile-search-row {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--hdr-cream);
          border: 1px solid var(--hdr-border);
          border-radius: 999px;
          padding: 9px 14px;
        }

        .hdr-mobile-dropdown {
          position: static !important;
          top: auto !important;
          margin-top: 6px;
          border-radius: 12px;
        }

        /* ---------- MOBILE DRAWER ---------- */
        .hdr-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.45);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.25s ease;
          z-index: 200;
        }
        .hdr-overlay-open { opacity: 1; pointer-events: auto; }

        .hdr-drawer {
          position: fixed;
          top: 0;
          right: 0;
          height: 100vh;
          width: 300px;
          max-width: 85vw;
          background: var(--hdr-bg);
          transform: translateX(100%);
          transition: transform 0.28s ease;
          z-index: 201;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }
        .hdr-drawer-open { transform: translateX(0); }

        .hdr-drawer-head {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 18px 16px;
          border-bottom: 1px solid var(--hdr-border);
          position: relative;
        }
        .hdr-drawer-logo-img { border-radius: 50%; object-fit: cover; flex-shrink: 0; }
        .hdr-drawer-close { position: absolute; right: 10px; top: 14px; }

        .hdr-drawer-nav { display: flex; flex-direction: column; padding: 8px 16px; }
        .hdr-drawer-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 8px;
          border-bottom: 1px solid var(--hdr-border);
          font-size: 15px;
          font-weight: 600;
          color: var(--hdr-dark);
        }
        .hdr-drawer-item:hover { background: rgba(104, 31, 0, 0.06); }
        .hdr-drawer-item-active { background: rgba(104, 31, 0, 0.08); }
        .hdr-drawer-item-left { display: flex; align-items: center; gap: 12px; }
        .hdr-drawer-item-icon { width: 20px; height: 20px; flex-shrink: 0; }
        .hdr-drawer-chevron { width: 16px; height: 16px; color: var(--hdr-muted); }

        .hdr-drawer-pills {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 16px;
          margin-top: auto;
        }
        .hdr-pill-full { justify-content: center; width: 100%; padding: 12px 18px; font-size: 14px; }

        .hdr-pill-cart{
  position: relative;
}

.hdr-cart-count{
  position:absolute;
  top:-8px;
  right:-8px;

  width:22px;
  height:22px;

  border-radius:50%;
  background:#ff2d2d;
  color:#fff;

  display:flex;
  align-items:center;
  justify-content:center;

  font-size:12px;
  font-weight:700;
}
        /* ---------- RESPONSIVE ---------- */
        @media (max-width: 900px) {
          .hdr-topbar, .hdr-navbar { display: none; }
          .hdr-mobilebar { display: flex; }
          .hdr-mobile-search-wrap.hdr-mobile-search-wrap { display: flex; }
          .hdr-mobile-search-row.hdr-mobile-search-row { display: flex; }
        }
      `}</style>
    </header>
  );
}
