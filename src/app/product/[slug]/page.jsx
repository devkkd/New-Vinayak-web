"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProductByIdApi } from "@/lib/adminApi";
import { products as staticProducts } from "@/lib/data";
import ContactCTA from "@/app/components/ContactCTA";
import VisitOurStore from "@/app/components/Visitourstore";
import ImageStrip from "@/app/components/Imagestrip";

export default function ProductDetailPage() {
  const { slug } = useParams(); // slug = _id from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [enquiryCart, setEnquiryCart] = useState([]);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setEnquiryCart(JSON.parse(localStorage.getItem("enquiryCart")) || []);
  }, []);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    async function fetchProduct() {
      setLoading(true);
      setNotFound(false);
      // slug in URL is the MongoDB _id — fetch directly
      const id = decodeURIComponent(slug);
      const res = await getProductByIdApi(id);
      if (cancelled) return;
      if (res?.success && res.data) {
        setProduct(res.data);
        // check if already in cart
        const cart = JSON.parse(localStorage.getItem("enquiryCart")) || [];
        setAdded(cart.some((item) => (item._id || item.id) === (res.data._id || res.data.id)));
      } else {
        setNotFound(true);
      }
      setLoading(false);
    }
    fetchProduct();
    return () => { cancelled = true; };
  }, [slug]);

  function handleAddToEnquiry() {
    if (!product) return;
    const cart = JSON.parse(localStorage.getItem("enquiryCart")) || [];
    const id = product._id || product.id;
    if (!cart.some((item) => (item._id || item.id) === id)) {
      cart.push(product);
      localStorage.setItem("enquiryCart", JSON.stringify(cart));
      setEnquiryCart(cart);
    }
    setAdded(true);
  }

  if (loading) {
    return (
      <div className="pd-loading">
        <div className="pd-spinner" />
        <p>Loading product…</p>
        <style jsx>{`
          .pd-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; gap: 16px; font-family: "Mona Sans", sans-serif; color: rgba(104,31,0,0.6); font-size: 15px; }
          .pd-spinner { width: 40px; height: 40px; border: 3px solid #fdeccb; border-top-color: #681f00; border-radius: 50%; animation: spin 0.75s linear infinite; }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="pd-notfound">
        Product not found.
        <Link href="/collections" className="pd-back">← Back to Collections</Link>
        <style jsx>{`
          .pd-notfound { padding: 80px; text-align: center; font-family: "Mona Sans", sans-serif; font-size: 22px; color: #681f00; display: flex; flex-direction: column; align-items: center; gap: 20px; }
          .pd-back { font-size: 15px; font-weight: 600; color: #681f00; text-decoration: underline; }
        `}</style>
      </div>
    );
  }

  const images = product.images?.length > 0 ? product.images : ["/home/logo.png"];
  const title = product.productName || product.title || "";
  const sku = product.sku || product._id || "";
  const description = product.details || product.description || "";
  const collection = product.collection || "";
  const category = product.category || "";
  const subcategory = product.subcategory || product.subCategory || "";

  return (
    <>
      <main className="pd-root">
        {/* ── Image panel ── */}
        <div className="pd-gallery">
          <div className="pd-main-imgwrap">
            <Image
              src={images[activeImg]}
              alt={title}
              fill
              className="pd-main-img"
              priority
              onError={(e) => { e.currentTarget.src = "/home/logo.png"; }}
            />
          </div>
          {images.length > 1 && (
            <div className="pd-thumbs">
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`pd-thumb ${activeImg === i ? "pd-thumb-active" : ""}`}
                  onClick={() => setActiveImg(i)}
                >
                  <img src={img} alt={`${title} ${i + 1}`} onError={(e) => { e.currentTarget.src = "/home/logo.png"; }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Info panel ── */}
        <div className="pd-info">
          {/* Breadcrumb */}
          <div className="pd-breadcrumb">
            <Link href="/collections">Collections</Link>
            {collection && <><span>›</span><span>{collection}</span></>}
            {category && <><span>›</span><span>{category}</span></>}
            {subcategory && <><span>›</span><span>{subcategory}</span></>}
          </div>

          <h1 className="pd-title">{title}</h1>

          {sku && (
            <p className="pd-sku">SKU: <span>{sku}</span></p>
          )}

          {description && (
            <p className="pd-desc">{description}</p>
          )}

          {/* Tags row */}
          <div className="pd-tags">
            {collection && <span className="pd-tag">{collection}</span>}
            {category && <span className="pd-tag">{category}</span>}
            {subcategory && <span className="pd-tag pd-tag-sub">{subcategory}</span>}
          </div>

          {/* CTA buttons */}
          <div className="pd-ctas">
            <button
              className={`pd-enquiry-btn ${added ? "pd-enquiry-btn-added" : ""}`}
              onClick={handleAddToEnquiry}
            >
              {added ? "Added to Enquiry ✓" : "Add to Enquiry →"}
            </button>

            {added && (
              <Link href="/enquiry-cart" className="pd-view-cart-btn">
                View Enquiry Cart
              </Link>
            )}

            <a
              href={`https://wa.me/919414156451?text=${encodeURIComponent(
                `Hi, I'm interested in ${title}${sku ? ` (SKU: ${sku})` : ""}. Please share more details.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="pd-whatsapp-btn"
            >
              WhatsApp Enquiry
            </a>
          </div>
        </div>
      </main>

      <ContactCTA />
      <VisitOurStore />
      <ImageStrip />

      <style jsx>{`
        .pd-root {
          font-family: "Mona Sans", sans-serif;
          background: #fff6de;
          color: #681f00;
          width: 100%;
          min-height: 100vh;
          padding: 40px 64px;
          box-sizing: border-box;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 56px;
          align-items: start;
        }

        /* ── Gallery ── */
        .pd-gallery {
          display: flex;
          flex-direction: column;
          gap: 12px;
          position: sticky;
          top: 100px;
        }
        .pd-main-imgwrap {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          border-radius: 20px;
          overflow: hidden;
          background: #fff;
          box-shadow: 0 4px 24px rgba(104,31,0,0.1);
        }
        .pd-main-img { object-fit: cover; }
        .pd-thumbs {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .pd-thumb {
          width: 72px;
          height: 72px;
          border-radius: 10px;
          overflow: hidden;
          border: 2px solid transparent;
          cursor: pointer;
          padding: 0;
          background: #fff;
          flex-shrink: 0;
          transition: border-color 0.2s ease;
        }
        .pd-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .pd-thumb-active { border-color: #681f00; }
        .pd-thumb:hover { border-color: rgba(104,31,0,0.4); }

        /* ── Info ── */
        .pd-info {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding-top: 8px;
        }
        .pd-breadcrumb {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          color: rgba(104,31,0,0.55);
          flex-wrap: wrap;
        }
        .pd-breadcrumb a { color: inherit; text-decoration: none; }
        .pd-breadcrumb a:hover { color: #681f00; text-decoration: underline; }
        .pd-breadcrumb span { color: rgba(104,31,0,0.4); }

        .pd-title {
          font-family: "Cinzel", serif;
          font-size: 30px;
          font-weight: 700;
          line-height: 1.3;
          margin: 0;
          color: #681f00;
        }
        .pd-sku {
          font-size: 13px;
          font-weight: 500;
          color: rgba(104,31,0,0.5);
          margin: 0;
        }
        .pd-sku span { font-weight: 700; }

        .pd-desc {
          font-size: 15px;
          line-height: 1.75;
          color: rgba(104,31,0,0.8);
          margin: 0;
        }

        .pd-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .pd-tag {
          font-size: 12px;
          font-weight: 600;
          background: #fdeccb;
          color: #681f00;
          padding: 4px 12px;
          border-radius: 999px;
          letter-spacing: 0.03em;
        }
        .pd-tag-sub {
          background: rgba(104,31,0,0.1);
        }

        /* ── CTA buttons ── */
        .pd-ctas {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 8px;
        }
        .pd-enquiry-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 56px;
          background: #681f00;
          color: #fff6de;
          font-family: inherit;
          font-weight: 700;
          font-size: 15px;
          border: none;
          border-radius: 999px;
          cursor: pointer;
          transition: background 0.2s ease;
          letter-spacing: 0.02em;
        }
        .pd-enquiry-btn:hover { background: #3d1000; }
        .pd-enquiry-btn-added { background: #2d6a00; }
        .pd-enquiry-btn-added:hover { background: #1e4700; }

        .pd-view-cart-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 48px;
          background: transparent;
          color: #681f00;
          font-family: inherit;
          font-weight: 700;
          font-size: 14px;
          border: 2px solid #681f00;
          border-radius: 999px;
          text-decoration: none;
          transition: all 0.2s ease;
          letter-spacing: 0.02em;
        }
        .pd-view-cart-btn:hover { background: #681f00; color: #fff6de; }

        .pd-whatsapp-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 48px;
          background: #25D366;
          color: #fff;
          font-family: inherit;
          font-weight: 700;
          font-size: 14px;
          border-radius: 999px;
          text-decoration: none;
          transition: background 0.2s ease;
          letter-spacing: 0.02em;
        }
        .pd-whatsapp-btn:hover { background: #1aad52; }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .pd-root {
            grid-template-columns: 1fr;
            padding: 24px 16px 48px;
            gap: 28px;
          }
          .pd-gallery { position: static; }
          .pd-title { font-size: 24px; }
          .pd-thumb { width: 60px; height: 60px; }
        }

        @media (max-width: 520px) {
          .pd-title { font-size: 20px; }
          .pd-root { padding: 16px 12px 40px; }
          .pd-enquiry-btn { height: 50px; font-size: 14px; }
        }
      `}</style>
    </>
  );
}
