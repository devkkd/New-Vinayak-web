"use client";

import Image from "next/image";
import Link from "next/link";

const categories = [
  { id: "gold",       label: "Gold",             image: "/home/vc1.png", href: "/gold" },
  { id: "silver",     label: "Silver",           image: "/home/vc2.png", href: "/silver" },
  { id: "diamond",    label: "Diamond",          image: "/home/vc3.png", href: "/diamond" },
  { id: "mens",       label: "Men's Specials",   image: "/home/vc4.png", href: "/mens" },
  { id: "coins",      label: "Coins",            image: "/home/vc5.png", href: "/coins" },
  { id: "gifting",    label: "Gifting",          image: "/home/vc6.png", href: "/gifting" },
  { id: "birth-stones", label: "Birth Stones",  image: "/home/vc7.png", href: "/birth-stones" },
  { id: "collections", label: "All Collections", image: "/home/vc8.png", href: "/collections" },
];

export default function VinayakCategories() {
  return (
    <section className="cat-section">
      <div className="cat-container">
        {/* Top divider with logo */}
        <div className="cat-divider-row">
          <span className="cat-divider-line" />
          <Image
            src="/home/logo.png"
            alt="Vinayak Jewellers"
            width={64}
            height={64}
            className="cat-divider-logo"
          />
          <span className="cat-divider-line" />
        </div>

        {/* Heading */}
        <h2 className="cat-heading">Vinayak Categories</h2>
        <p className="cat-subheading">Discover Your Perfect Fit - Shop By Category</p>

        {/* Grid */}
        <div className="cat-grid">
          {categories.map((item) => (
            <Link href={item.href} className="cat-card" key={item.id}>
              <div className="cat-card-image-wrap">
                <Image
                  src={item.image}
                  alt={item.label}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="cat-card-image"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .cat-section, .cat-section * {
          box-sizing: border-box;
        }

        .cat-section {
          background: #FFF4DC;
          font-family: "Mona Sans", sans-serif;
          padding: 80px 0;
        }

        .cat-container {
          max-width: 1400px;
          width: 100%;
          margin: 0 auto;
          padding: 0 32px;
        }

        /* ---------- Divider ---------- */
        .cat-divider-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          margin-bottom: 24px;
        }

        .cat-divider-line {
          flex: 1;
          max-width: 420px;
          height: 1px;
          background: #61311E;
        }

        .cat-divider-logo {
          width: 64px;
          height: 64px;
          border-radius: 999px;
          flex-shrink: 0;
        }

        /* ---------- Heading ---------- */
            .cat-heading{
  font-family:"Cinzel", serif;

  text-align:center;
  font-size:32px;
  font-weight:500;
  color:#3B2E1E;
  letter-spacing:1px;
  text-transform:uppercase;
  margin:0 0 12px;
}

        .cat-subheading {
          text-align: center;
          font-size: 16px;
          font-weight: 400;
          color: #6C4A37;
          margin: 0 0 48px;
        }
        /* ---------- Grid ---------- */
        .cat-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 32px 32px;
        }

        /* ---------- Card ---------- */
        .cat-card {
          display: block;
       
          overflow: hidden;
          background: #FFF6E0;
          border: 1px solid rgba(104,31,0,0.15);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .cat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(97, 49, 30, 0.15);
        }

        .cat-card-image-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 240 / 305;
        }

        .cat-card-image {
          object-fit: cover;
        }

        /* ====================== LAPTOP ====================== */
        @media (max-width: 1280px) {
          .cat-grid {
            gap: 24px;
          }
        }

        /* ====================== TABLET ====================== */
        @media (max-width: 1024px) {
          .cat-section {
            padding: 60px 0;
          }

          .cat-container {
            padding: 0 24px;
          }

          .cat-divider-line {
            max-width: 260px;
          }

          .cat-grid {
            gap: 20px;
          }
        }

        /* ====================== MOBILE ====================== */
        @media (max-width: 768px) {
          .cat-section {
            padding: 50px 0;
          }

          .cat-container {
            padding: 0 20px;
          }

          .cat-divider-row {
            gap: 14px;
            margin-bottom: 18px;
          }

          .cat-divider-line {
            max-width: 100px;
          }

          .cat-divider-logo {
            width: 44px;
            height: 44px;
          }

          .cat-heading {
            font-size: 24px;
            letter-spacing: 1.5px;
          }

          .cat-subheading {
            font-size: 13px;
            margin-bottom: 24px;
          }

          .cat-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 14px;
          }

          .cat-card {
            border-radius: 12px;
          }
        }

        /* ====================== SMALL MOBILE ====================== */
        @media (max-width: 480px) {
          .cat-container {
            padding: 0 16px;
          }

          .cat-divider-line {
            max-width: 60px;
          }

          .cat-divider-logo {
            width: 36px;
            height: 36px;
          }

          .cat-heading {
            font-size: 20px;
            letter-spacing: 1px;
          }

          .cat-subheading {
            font-size: 12px;
            margin-bottom: 20px;
          }

          .cat-grid {
            gap: 10px;
          }

          .cat-card {
            border-radius: 10px;
          }
        }
      `}</style>
    </section>
  );
}