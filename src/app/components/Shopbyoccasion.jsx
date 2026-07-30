"use client";

import Image from "next/image";
import Link from "next/link";

const occasions = [
  {
    id: "gold-wedding",
    label: "Gold Wedding",
    image: "/home/sh1.png",
    href: "/occasions/gold-wedding"
  },
  {
    id: "gold-traditional",
    label: "Gold Traditional",
    image: "/home/sh2.png",
    href: "/occasions/gold-traditional"
  },
  {
    id: "gold-rajasthani",
    label: "Gold Rajasthani Collection",
    image: "/home/sh3.png",
    href: "/occasions/gold-rajasthani-collection"
  },
  {
    id: "rose-gold",
    label: "Rose Gold Collection",
    image: "/home/sh4.png",
    href: "/occasions/rose-gold-collection",
   
  },
  {
    id: "diamond-wedding",
    label: "Diamond Wedding Collection",
    image: "/home/sh5.png",
    href: "/occasions/diamond-wedding-collection"
  }
];

export default function ShopByOccasion() {
  return (
    <section className="soc-section">
      <div className="soc-container">
        {/* Top divider with logo */}
        <div className="soc-divider-row">
          <span className="soc-divider-line" />
          <Image
            src="/home/logo.png"
            alt="Vinayak Jewellers"
            width={64}
            height={64}
            className="soc-divider-logo"
          />
          <span className="soc-divider-line" />
        </div>

        {/* Heading */}
        <h2 className="soc-heading">Shop By Occasion</h2>
        <p className="soc-subheading">Celebrate Every Moment • Jewellery For Every Occasion</p>

        {/* Grid */}
        <div className="soc-grid">
          {occasions.map((item) => (
            <Link href={item.href} className="soc-card" key={item.id}>
              <div className="soc-card-image-wrap">
                <Image
                  src={item.image}
                  alt={item.label}
                  fill
                  sizes="(max-width: 768px) 50vw, 20vw"
                  className="soc-card-image"
                />
              </div>
           <p className="soc-card-label">
  {item.label}
</p>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .soc-section, .soc-section * {
          box-sizing: border-box;
        }

        .soc-section {
          background: #FFF4DC;
          font-family: "Mona Sans", sans-serif;
          padding: 80px 0;
        }

        .soc-container {
          max-width: 1400px;
          width: 100%;
          margin: 0 auto;
          padding: 0 32px;
        }

        /* ---------- Divider ---------- */
        .soc-divider-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          margin-bottom: 24px;
        }

        .soc-divider-line {
          flex: 1;
          max-width: 420px;
          height: 1px;
          background: #61311E;
        }

        .soc-divider-logo {
          width: 64px;
          height: 64px;
          border-radius: 999px;
          flex-shrink: 0;
        }

        /* ---------- Heading ---------- */
        .soc-heading {
          text-align: center;
          font-family: "Cinzel", serif;
          font-size: 32px;
          font-weight: 500;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #3B2E1E;
          margin: 0 0 12px;
        }

        .soc-subheading {
          text-align: center;
          font-family: "Mona Sans", sans-serif;
          font-size: 16px;
          font-weight: 400;
          color: #6C4A37;
          margin: 0 0 48px;
        }

        /* ---------- Grid ---------- */
        .soc-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 32px;
        }

        /* ---------- Card ---------- */
        .soc-card {
          display: block;
          text-decoration: none;
        }

        .soc-card-image-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 332 / 415;
          border-radius: 16px;
          overflow: hidden;
          background: #FFF6E0;
        }

        .soc-card-image {
          object-fit: cover;
          transition: transform 0.35s ease;
        }

        .soc-card:hover .soc-card-image {
          transform: scale(1.05);
        }

        .soc-card-label {
          margin: 16px 0 0;
          text-align: center;
          font-family: "Mona Sans", sans-serif;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          color: #3B2E1E;
          line-height: 1.4;
        }

       .soc-card-label{
  margin:16px 0 0;
  text-align:center;
  font-family:"Mona Sans",sans-serif;
  font-size:14px;
  font-weight:600;
  letter-spacing:.5px;
  text-transform:uppercase;
  color:#3B2E1E;
  line-height:1.4;
  transition:color .3s ease;
}

.soc-card:hover .soc-card-label{
  color:#8B4513;
}

        /* ====================== LAPTOP ====================== */
        @media (max-width: 1280px) {
          .soc-grid {
            gap: 24px;
          }
        }

        /* ====================== TABLET ====================== */
        @media (max-width: 1024px) {
          .soc-section {
            padding: 60px 0;
          }

          .soc-container {
            padding: 0 24px;
          }

          .soc-divider-line {
            max-width: 260px;
          }

          .soc-grid {
            grid-template-columns: repeat(3, 1fr);
            row-gap: 32px;
          }
        }

        /* ====================== MOBILE ====================== */
        @media (max-width: 768px) {
          .soc-section {
            padding: 50px 0;
          }

          .soc-container {
            padding: 0 20px;
          }

          .soc-divider-row {
            gap: 14px;
            margin-bottom: 18px;
          }

          .soc-divider-line {
            max-width: 100px;
          }

          .soc-divider-logo {
            width: 44px;
            height: 44px;
          }

          .soc-heading {
            font-size: 22px;
            margin-bottom: 8px;
          }

          .soc-subheading {
            font-size: 12px;
            margin-bottom: 28px;
          }

          .soc-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px 14px;
          }

          .soc-card-image-wrap {
            border-radius: 12px;
          }

          .soc-card-label {
            margin-top: 10px;
            font-size: 12px;
          }
        }

        /* ====================== SMALL MOBILE ====================== */
        @media (max-width: 480px) {
          .soc-container {
            padding: 0 16px;
          }

          .soc-divider-line {
            max-width: 60px;
          }

          .soc-divider-logo {
            width: 36px;
            height: 36px;
          }

          .soc-heading {
            font-size: 19px;
          }

          .soc-grid {
            gap: 12px 10px;
          }

          .soc-card-image-wrap {
            border-radius: 10px;
          }

          .soc-card-label {
            font-size: 11px;
          }
        }
      `}</style>
    </section>
  );
}