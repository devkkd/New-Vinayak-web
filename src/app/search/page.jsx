"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/adminApi";
import { categories as categoryRoutes, subCategoriesByCategory } from "@/lib/data";

// Build a flat deduped subcategory list with parent info
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

/** Same smart matcher as Header — understands "gold ring", "diamond bangles", etc. */
function smartLocalMatch(rawQuery) {
  const q = rawQuery.toLowerCase().trim();
  const tokens = q.split(/\s+/).filter(Boolean);

  const matchedCats = categoryRoutes.filter(c =>
    c.label.toLowerCase().includes(q) ||
    c.slug.toLowerCase().includes(q) ||
    (c.heading || "").toLowerCase().includes(q)
  );

  const matchedSubs = ALL_SUBCATEGORIES.filter(s =>
    s.name.toLowerCase().includes(q)
  );

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
    const catsFromTokens = categoryRoutes.filter(c =>
      catTokens.some(t =>
        c.label.toLowerCase().includes(t) ||
        c.slug.toLowerCase().includes(t) ||
        (c.heading || "").toLowerCase().includes(t)
      )
    );
    const subsFromTokens = ALL_SUBCATEGORIES.filter(s =>
      subTokens.some(t => s.name.toLowerCase().includes(t))
    );
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

  return { matchedCats, matchedSubs, combinedHints };
}

/* ── icon helpers ── */
const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconTag = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  const [products, setProducts] = useState([]);
  const [matchedCats, setMatchedCats] = useState([]);
  const [matchedSubs, setMatchedSubs] = useState([]);
  const [combinedHints, setCombinedHints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (!q.trim()) {
      setProducts([]);
      setMatchedCats([]);
      setMatchedSubs([]);
      setCombinedHints([]);
      setSearched(false);
      return;
    }

    let cancelled = false;
    async function doSearch() {
      setLoading(true);
      setSearched(false);
      try {
        // Products — hit backend search API
        const endpoints = [
          `${API_BASE_URL}/api/products/search?q=${encodeURIComponent(q)}`,
          `https://vinayakjewellersjaipur.com/api/products/search?q=${encodeURIComponent(q)}`,
        ];
        let prods = [];
        for (const url of [...new Set(endpoints)]) {
          try {
            const res = await fetch(url);
            if (res.ok) {
              const data = await res.json();
              prods = data.data || [];
              break;
            }
          } catch (_) {}
        }

        // Smart local match — handles "gold ring", "diamond bangles", etc.
        const { matchedCats: cats, matchedSubs: subs, combinedHints: hints } = smartLocalMatch(q);

        if (!cancelled) {
          setProducts(prods);
          setMatchedCats(cats);
          setMatchedSubs(subs);
          setCombinedHints(hints);
          setSearched(true);
        }
      } catch (_) {
        if (!cancelled) setSearched(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    doSearch();
    return () => { cancelled = true; };
  }, [q]);

  const totalResults = products.length + matchedCats.length + matchedSubs.length + combinedHints.length;

  return (
    <main className="srp-root">
      {/* ── header ── */}
      <div className="srp-header">
        <div className="srp-query-row">
          <IconSearch />
          {q ? (
            <h1 className="srp-title">
              Search results for <span className="srp-query-highlight">"{q}"</span>
            </h1>
          ) : (
            <h1 className="srp-title">Search our collections</h1>
          )}
        </div>
        {searched && !loading && (
          <p className="srp-count">
            {totalResults === 0
              ? "No results found."
              : `${totalResults} result${totalResults !== 1 ? "s" : ""} found`}
          </p>
        )}
      </div>

      {/* ── loading skeleton ── */}
      {loading && (
        <div className="srp-loading">
          <div className="srp-spinner" />
          <p>Searching…</p>
        </div>
      )}

      {/* ── no query ── */}
      {!loading && !q.trim() && (
        <div className="srp-empty">
          <p>Type something in the search bar above to find products and categories.</p>
        </div>
      )}

      {/* ── no results ── */}
      {!loading && searched && totalResults === 0 && (
        <div className="srp-empty">
          <p>No products or categories matched <strong>"{q}"</strong>.</p>
          <p className="srp-empty-hint">Try searching for Gold, Diamond, Silver, Rings, Bangles, etc.</p>
          <Link href="/collections" className="srp-browse-btn">Browse All Collections →</Link>
        </div>
      )}

      {!loading && searched && totalResults > 0 && (
        <div className="srp-body">

          {/* ── Combined hints — shown first for multi-word queries like "gold ring" ── */}
          {combinedHints.length > 0 && (
            <section className="srp-section">
              <h2 className="srp-section-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                  strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                Best Match
                <span className="srp-section-count">{combinedHints.length}</span>
              </h2>
              <div className="srp-cat-grid">
                {combinedHints.map((hint) => (
                  <Link key={`${hint.categorySlug}-${hint.subName}`} href={`/${hint.categorySlug}`} className="srp-cat-card srp-combined-card">
                    <span className="srp-cat-emoji">✦</span>
                    <div className="srp-cat-info">
                      <span className="srp-cat-label">{hint.subName}</span>
                      <span className="srp-cat-slug">in {hint.categoryLabel}</span>
                    </div>
                    <span className="srp-cat-arrow">→</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ── Categories section — only when no combined hints ── */}
          {matchedCats.length > 0 && combinedHints.length === 0 && (
            <section className="srp-section">
              <h2 className="srp-section-title">
                <IconTag />
                Categories
                <span className="srp-section-count">{matchedCats.length}</span>
              </h2>
              <div className="srp-cat-grid">
                {matchedCats.map((cat) => (
                  <Link key={cat.slug} href={`/${cat.slug}`} className="srp-cat-card">
                    <span className="srp-cat-emoji">🏷</span>
                    <div className="srp-cat-info">
                      <span className="srp-cat-label">{cat.heading || cat.label}</span>
                      <span className="srp-cat-slug">/{cat.slug}</span>
                    </div>
                    <span className="srp-cat-arrow">→</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ── Subcategories section — only when no combined hints ── */}
          {matchedSubs.length > 0 && combinedHints.length === 0 && (
            <section className="srp-section">
              <h2 className="srp-section-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                  strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
                  <circle cx="6" cy="6" r="2" fill="currentColor" stroke="none"/>
                  <circle cx="6" cy="12" r="2" fill="currentColor" stroke="none"/>
                  <circle cx="6" cy="18" r="2" fill="currentColor" stroke="none"/>
                  <line x1="10" y1="6" x2="20" y2="6"/>
                  <line x1="10" y1="12" x2="20" y2="12"/>
                  <line x1="10" y1="18" x2="20" y2="18"/>
                </svg>
                Subcategories
                <span className="srp-section-count">{matchedSubs.length}</span>
              </h2>
              <div className="srp-cat-grid">
                {matchedSubs.map((sub) => (
                  <Link key={`${sub.categorySlug}-${sub.name}`} href={`/${sub.categorySlug}`} className="srp-cat-card">
                    <span className="srp-cat-emoji">◈</span>
                    <div className="srp-cat-info">
                      <span className="srp-cat-label">{sub.name}</span>
                      <span className="srp-cat-slug">in {sub.categoryLabel}</span>
                    </div>
                    <span className="srp-cat-arrow">→</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ── Products section ── */}
          {products.length > 0 && (
            <section className="srp-section">
              <h2 className="srp-section-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                  strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
                  <path d="M6 8h12l-1.2 11a2 2 0 0 1-2 1.8H7.2a2 2 0 0 1-2-1.8L4 8Z" />
                  <path d="M8 8V6a4 4 0 0 1 8 0v2" />
                </svg>
                Products
                <span className="srp-section-count">{products.length}</span>
              </h2>
              <div className="srp-prod-grid">
                {products.map((p, idx) => {
                  const img = (p.images?.length > 0 ? p.images[0] : p.image) || "/home/logo.png";
                  const title = p.productName || p.title || "";
                  const href = `/product/${p.slug || p._id || p.id}`;
                  return (
                    <Link key={p._id || idx} href={href} className="srp-prod-card">
                      <div className="srp-prod-imgwrap">
                        <img
                          src={img}
                          alt={title}
                          className="srp-prod-img"
                          loading={idx < 8 ? "eager" : "lazy"}
                          onError={(e) => { e.currentTarget.src = "/home/logo.png"; }}
                        />
                      </div>
                      <div className="srp-prod-body">
                        <p className="srp-prod-name">{title}</p>
                        {p.sku && <p className="srp-prod-sku">SKU: {p.sku}</p>}
                        {(p.collection || p.category) && (
                          <div className="srp-prod-tags">
                            {p.collection && <span className="srp-prod-tag">{p.collection}</span>}
                            {p.category && <span className="srp-prod-tag srp-prod-tag-sub">{p.category}</span>}
                          </div>
                        )}
                        <span className="srp-prod-cta">View Product →</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

        </div>
      )}

      <style jsx>{`
        .srp-root {
          font-family: "Mona Sans", sans-serif;
          background: #fff6de;
          color: #681f00;
          min-height: 100vh;
          padding: 40px 48px 64px;
          box-sizing: border-box;
        }

        /* ── header ── */
        .srp-header {
          margin-bottom: 36px;
          border-bottom: 1px solid rgba(104,31,0,0.12);
          padding-bottom: 20px;
        }
        .srp-query-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
          color: #681f00;
        }
        .srp-title {
          font-family: "Cinzel", serif;
          font-size: 26px;
          font-weight: 700;
          margin: 0;
        }
        .srp-query-highlight {
          color: #BF9555;
        }
        .srp-count {
          font-size: 13px;
          color: rgba(104,31,0,0.65);
          margin: 0;
        }

        /* ── loading ── */
        .srp-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          padding: 80px 0;
          color: rgba(104,31,0,0.6);
        }
        .srp-spinner {
          width: 36px;
          height: 36px;
          border: 3px solid rgba(104,31,0,0.15);
          border-top-color: #681f00;
          border-radius: 50%;
          animation: srp-spin 0.8s linear infinite;
        }
        @keyframes srp-spin { to { transform: rotate(360deg); } }

        /* ── empty ── */
        .srp-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 80px 0;
          text-align: center;
          color: rgba(104,31,0,0.7);
          font-size: 15px;
        }
        .srp-empty-hint { font-size: 13px; color: rgba(104,31,0,0.5); }
        .srp-browse-btn {
          margin-top: 8px;
          background: #681f00;
          color: #fff6de;
          padding: 12px 28px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          transition: background 0.2s;
        }
        .srp-browse-btn:hover { background: #4a1600; }

        /* ── body ── */
        .srp-body {
          display: flex;
          flex-direction: column;
          gap: 48px;
        }

        /* ── section ── */
        .srp-section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: "Cinzel", serif;
          font-size: 18px;
          font-weight: 700;
          margin: 0 0 20px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .srp-section-count {
          background: #fdeccb;
          color: #681f00;
          font-family: "Mona Sans", sans-serif;
          font-size: 12px;
          font-weight: 700;
          padding: 2px 10px;
          border-radius: 999px;
          margin-left: 4px;
        }

        /* ── category cards ── */
        .srp-cat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 14px;
        }
        .srp-cat-card {
          display: flex;
          align-items: center;
          gap: 14px;
          background: #fff;
          border: 1px solid rgba(104,31,0,0.1);
          border-radius: 12px;
          padding: 16px 18px;
          text-decoration: none;
          color: #681f00;
          transition: box-shadow 0.18s, transform 0.18s;
        }
        .srp-cat-card:hover {
          box-shadow: 0 8px 24px rgba(104,31,0,0.12);
          transform: translateY(-2px);
        }
        .srp-combined-card {
          border-left: 3px solid #BF9555;
          background: linear-gradient(90deg, #fffaf0, #fff);
        }
        .srp-combined-card:hover { background: linear-gradient(90deg, #fff4e0, #fff8ee); }
        .srp-cat-emoji { font-size: 20px; flex-shrink: 0; }
        .srp-cat-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
          min-width: 0;
        }
        .srp-cat-label { font-size: 14px; font-weight: 700; }
        .srp-cat-slug { font-size: 11px; color: rgba(104,31,0,0.5); font-family: monospace; }
        .srp-cat-arrow { font-size: 16px; color: #BF9555; flex-shrink: 0; }

        /* ── product grid ── */
        .srp-prod-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
        }
        .srp-prod-card {
          display: flex;
          flex-direction: column;
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
          text-decoration: none;
          color: #681f00;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .srp-prod-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.16);
        }
        .srp-prod-imgwrap {
          aspect-ratio: 1;
          overflow: hidden;
          background: #f7f0e0;
        }
        .srp-prod-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }
        .srp-prod-card:hover .srp-prod-img { transform: scale(1.04); }
        .srp-prod-body {
          padding: 14px 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
        }
        .srp-prod-name {
          font-size: 13px;
          font-weight: 600;
          line-height: 1.4;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .srp-prod-sku {
          font-size: 10px;
          color: rgba(104,31,0,0.5);
          font-family: monospace;
          margin: 0;
        }
        .srp-prod-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 2px;
        }
        .srp-prod-tag {
          background: #fdeccb;
          color: #681f00;
          font-size: 10px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 999px;
        }
        .srp-prod-tag-sub { background: #f0e8d5; }
        .srp-prod-cta {
          margin-top: auto;
          padding-top: 8px;
          font-size: 12px;
          font-weight: 700;
          color: #BF9555;
        }

        /* ── responsive ── */
        @media (max-width: 768px) {
          .srp-root { padding: 24px 18px 48px; }
          .srp-title { font-size: 20px; }
          .srp-prod-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
          .srp-cat-grid {
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }
        }

        @media (max-width: 480px) {
          .srp-prod-grid { grid-template-columns: repeat(2, 1fr); }
          .srp-cat-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", background: "#fff6de", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 36, height: 36, border: "3px solid rgba(104,31,0,0.15)", borderTopColor: "#681f00", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}
