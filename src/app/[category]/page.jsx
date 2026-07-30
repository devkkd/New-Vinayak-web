"use client";
import { useState, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  subCategoriesByCategory,
  collectionSidebar,
  getProductsByCategory,
  getCategory,
} from "@/lib/data";
import ContactCTA from "../components/ContactCTA";
import VisitOurStore from "../components/Visitourstore";
import ImageStrip from "../components/Imagestrip";

export default function CategoryPage() {
  const { category } = useParams();
  const meta = getCategory(category);
  const allProducts = getProductsByCategory(category);
  const subCats = subCategoriesByCategory[category] || [];

  const [activeFilter, setActiveFilter] = useState(
    category === "collections" ? "All Jewellery" : "All"
  );
 const [showPopup, setShowPopup] = useState(false);
const [enquiryCart, setEnquiryCart] = useState([]);
const [selectedProduct, setSelectedProduct] = useState(null);

useEffect(() => {
  const cart =
    JSON.parse(localStorage.getItem("enquiryCart")) || [];

  setEnquiryCart(cart);
}, []);

const openPopup = (product) => {
  setSelectedProduct(product);
  setShowPopup(true);
};

const closePopup = () => {
  setShowPopup(false);
  setSelectedProduct(null);
};
  const filtered = useMemo(() => {
    if (activeFilter === "All" || activeFilter === "All Jewellery") return allProducts;
    if (category === "collections") {
      return allProducts.filter(
        (p) =>
          p.category === activeFilter.toLowerCase() ||
          p.collectionTag === activeFilter
      );
    }
    return allProducts.filter((p) => p.subCategory === activeFilter);
  }, [activeFilter, allProducts, category]);

  if (!meta) return <div className="cat-empty">Page not found.</div>;

  const isSidebar = meta.type === "sidebar";
  const isPills = meta.type === "pills" || meta.type === "pills-center";

  return (
    <main className="cat-root">
        <div className="cat-content">
      {!isSidebar && (
        <>
          <h1 className="cat-heading">{meta.heading}</h1>
          {meta.note && <p className="cat-note">{meta.note}</p>}
        </>
      )}

      {isPills && (
        <div className={`cat-pills ${meta.type === "pills-center" ? "cat-pills-center" : ""}`}>
          <button
            className={`cat-pill ${activeFilter === "All" ? "cat-pill-active" : ""}`}
            onClick={() => setActiveFilter("All")}
          >
            All
          </button>
          {subCats.map((sc) => (
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
        {isSidebar && (
          <aside className="cat-sidebar">
            <h2 className="cat-sidebar-title">
              Collections <span className="cat-sidebar-sub">— curated pieces</span>
            </h2>
            <div className="cat-sidebar-list">
              {collectionSidebar.map((item) => (
                <button
                  key={item}
                  className={`cat-sidebar-item ${activeFilter === item ? "cat-sidebar-item-active" : ""}`}
                  onClick={() => setActiveFilter(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </aside>
        )}

        <section className="cat-grid-wrap">
          {isSidebar && (
            <div className="cat-grid-head">
              <span className="cat-grid-count">{filtered.length} Products</span>
            </div>
          )}

          {filtered.length === 0 ? (
            <p className="cat-no-products">No products found.</p>
          ) : (
            <div className="cat-grid">
              {filtered.map((p) => (
               <div className="cat-card" key={p.id}>

  <Link href={`/product/${p.slug}`}>

    <div className="cat-card-imgwrap">
      <Image
        src={p.images[0]}
        alt={p.title}
        fill
        className="cat-card-img"
      />
    </div>

    <p className="cat-card-title">
      {p.title}
    </p>

  </Link>

 <button
  className="cat-card-btn"
  onClick={() => openPopup(p)}
>
  {enquiryCart.some(item => item.id === p.id)
    ? "Added ✓"
    : "Enquiry Now →"}
</button>

</div>
              ))}
            </div>
          )}
        </section>
      </div>
      </div>
     {showPopup && selectedProduct && (

<div className="popup-overlay">

<div className="popup">

<button
className="popup-close"
onClick={closePopup}
>
✕
</button>

<h2>
ADD PRODUCT TO ENQUIRY
</h2>

<p>
You can add multiple products and send a combined enquiry later.
</p>

<div className="popup-product">

<img
src={selectedProduct.images[0]}
alt={selectedProduct.title}
/>

<div>

<h3>
{selectedProduct.title}
</h3>

<p>
Model #{selectedProduct.id}
</p>

</div>

</div>

<button
  type="button"
  className="popup-btn"
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();

    const oldCart =
      JSON.parse(localStorage.getItem("enquiryCart")) || [];

    const alreadyAdded = oldCart.some(
      (item) => item.id === selectedProduct.id
    );

    if (!alreadyAdded) {
      oldCart.push(selectedProduct);

      localStorage.setItem(
        "enquiryCart",
        JSON.stringify(oldCart)
      );

      setEnquiryCart([...oldCart]);
    }

    // closePopup();  <-- Is line ko hata do
  }}
>
 {enquiryCart.some(item => item.id === selectedProduct.id)
  ? "Added ✓"
  : "Add to Enquiry →"}
</button>

<Link href="/enquiry-cart">
  <button type="button" className="popup-link">
    View Enquiry Cart
  </button>
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
}
  .cat-content {
  padding: 72px;
}
        .cat-heading {
          font-family: "Cinzel", serif;
          text-align: center;
          font-size: 40px;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 8px;
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
        .cat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
        .cat-card {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  height: 100%;
}
       .cat-card-imgwrap {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  margin-bottom: 14px;
}
        .cat-card-img { object-fit: cover; }
      .cat-card-title {
  font-size: 15px;
  font-weight: 600;
  line-height: 1.45;

  height: 66px;          /* Fixed height */
  margin-bottom: 18px;

  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* Maximum 3 lines */
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
}
        .cat-card-btn {
  display: flex;
  align-items: center;
  justify-content: center;

  margin-top: auto;   /* Same line par button */
  width: 100%;
  height: 52px;

  background: #681f00;
  color: #fff6de;

  font-weight: 600;
  font-size: 15px;

  border-radius: 999px;
}
        .cat-no-products { text-align: center; font-size: 18px; padding: 60px 0; }
        .cat-empty { padding: 60px; text-align: center; }
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
align-items:center;
z-index:9999;
}

.popup{
width:500px;
max-width:60%;
background:#FFF8E7;
border-radius:28px;
padding:40px;
position:relative;
}

.popup-close{
position:absolute;
right:25px;
top:20px;
font-size:20px;

border:none;
background:none;
cursor:pointer;
}

.popup h2{
font-family:"Cinzel",serif;
font-size:30px;
text-align:center;
margin-bottom:16px;
color:#681f00;
}

.popup>p{
text-align:center;
margin-bottom:30px;
font-size:14px;
}

.popup-product{
display:flex;
gap:20px;
padding:20px;
border:1px solid #e7d2a5;
border-radius:18px;
margin-bottom:30px;
}

.popup-product img{
width:90px;
height:90px;
object-fit:cover;
border-radius:12px;
}

.popup-product h3{
font-size:14px;
margin-bottom:10px;
}

.popup-btn{
width:100%;
height:64px;
border:none;
border-radius:999px;
background:linear-gradient(90deg,#E8C57B,#7C2A00);
color:#fff;
font-size:18px;
font-weight:500;
cursor:pointer;
}

.popup-link{
margin-top:25px;
background:none;
border:none;
width:100%;
font-size:18px;
font-weight:500;
color:#681f00;
cursor:pointer;
}
       @media (max-width: 900px) {
  .cat-content {
    padding: 24px 16px;
  }

  .cat-heading {
    font-size: 28px;
    line-height: 1.3;
  }

  .cat-note {
    font-size: 13px;
    margin-bottom: 18px;
  }

  .cat-body-with-sidebar {
    flex-direction: column;
    gap: 20px;
  }

  .cat-sidebar {
    width: 100%;
    position: static;
    top: auto;
  }

  .cat-sidebar-title {
    font-size: 22px;
    margin-bottom: 14px;
  }

  .cat-sidebar-sub {
    display: none;
  }

  .cat-sidebar-list {
    display: flex;
    flex-direction: row;
    gap: 10px;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    padding-bottom: 6px;
    scrollbar-width: none;
  }

  .cat-sidebar-list::-webkit-scrollbar {
    display: none;
  }

  .cat-sidebar-item {
    flex: 0 0 auto;
    padding: 10px 16px;
    border-radius: 999px;
    font-size: 14px;
  }

  .cat-grid-wrap {
    height: auto;
    overflow: visible;
    padding-right: 0;
  }

  .cat-grid-head {
    justify-content: space-between;
    margin-bottom: 14px;
  }

  .cat-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  .cat-card-title {
    font-size: 14px;
    height: 42px;
    line-height: 1.4;

    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .cat-card-btn {
    width: 100%;
    height: 44px;
    font-size: 14px;
  }
}
       @media (max-width: 520px) {
  .cat-content {
    padding: 20px 12px;
  }

  .cat-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .cat-card-imgwrap {
    margin-bottom: 10px;
  }

  .cat-card-title {
    font-size: 13px;
    height: 38px;
    margin-bottom: 10px;
    -webkit-line-clamp: 2;
  }

  .cat-card-btn {
    height: 40px;
    font-size: 13px;
    border-radius: 999px;
  }

  .cat-heading {
    font-size: 24px;
  }

  .cat-grid-count {
    font-size: 12px;
    padding: 6px 12px;
  }
}
      `}</style>
       <ContactCTA />
      <VisitOurStore />
      <ImageStrip />
    </main>
    
  );
}