"use client";

import Image from "next/image";
import Link from "next/link";

const collections = [
  {
    id: "gift",
   
    image: "/home/c1.png",
    title: "Gift Collection",
    desc: "Perfect gifts for every occasion",
    href: "/collections/gift"
  },
  {
    id: "mangalsutra",
   
    image: "/home/c2.png",
    title: "Mangalsutra Collection",
    desc: "Exquisite designs for your special day",
    href: "/collections/mangalsutra"
  }
];

export default function VinayakCollections() {
  return (
    <section className="vc-section">
      <div className="vc-container">
        {/* Top divider with logo */}
        <div className="vc-divider-row">
          <span className="vc-divider-line" />
          <Image
            src="/home/logo.png"
            alt="Vinayak Jewellers"
            width={64}
            height={64}
            className="vc-divider-logo"
          />
          <span className="vc-divider-line" />
        </div>

        {/* Heading */}
        <h2 className="vc-heading">Vinayak Collections</h2>
        <p className="vc-subheading">Discover Our Latest Jewellery Launches</p>

        {/* Cards */}
        <div className="vc-grid">
          {collections.map((item) => (
            <div className="vc-card" key={item.id}>
              <div className="vc-card-image-wrap">
                <Image
                  src={item.image}
                  alt={item.tagline}
                  fill
                  sizes="(max-width: 768px) 50vw, 680px"
                  className="vc-card-image"
                />
                <div className="vc-card-overlay">
                  <h3 className="vc-card-brand">{item.brand}</h3>
                  <p className="vc-card-tagline">{item.tagline}</p>
                </div>
              </div>

              <div className="vc-card-footer">
                <h3 className="vc-card-title">{item.title}</h3>
                <p className="vc-card-desc">{item.desc}</p>
                <Link href={item.href} className="vc-explore-link">
                  Explore <span className="vc-explore-arrow">&gt;</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .vc-section, .vc-section * {
          box-sizing: border-box;
        }

        .vc-section {
          background: #FFF4DC;
          font-family: "Mona Sans", sans-serif;
          padding: 80px 0;
        }

        .vc-container {
          max-width: 1400px;
          width: 100%;
          margin: 0 auto;
          padding: 0 32px;
        }

        /* ---------- Divider ---------- */
        .vc-divider-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          margin-bottom: 24px;
        }

        .vc-divider-line {
          flex: 1;
          max-width: 420px;
          height: 1px;
          background: #61311E;
        }

        .vc-divider-logo {
          width: 64px;
          height: 64px;
          border-radius: 999px;
          flex-shrink: 0;
        }

        /* ---------- Heading ---------- */
        .vc-heading{
  font-family:"Cinzel", serif;

  text-align:center;
  font-size:32px;
  font-weight:500;
  color:#3B2E1E;
  letter-spacing:1px;
  text-transform:uppercase;
  margin:0 0 12px;
}

        .vc-subheading {
          text-align: center;
          font-size: 16px;
          font-weight: 400;
          color: #6C4A37;
          margin: 0 0 48px;
        }

        /* ---------- Grid ---------- */
        .vc-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
        }

        /* ---------- Card ---------- */
        .vc-card {
          background: #FFF;
          border-radius: 20px;
          overflow: hidden;
        }

        .vc-card-image-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 680 / 480;
        }

        .vc-card-image {
          object-fit: cover;
        }

        .vc-card-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          padding: 32px 32px 0;
          text-align: center;
        }

        .vc-card-brand {
          font-size: 24px;
          font-weight: 600;
          
          color: #5A2F18;
          margin: 0 0 6px;
          letter-spacing: 2px;
        }

        .vc-card-tagline {
          font-size: 18px;
          font-weight: 400;
          font-style: italic;
          color: #6C4A37;
          margin: 0;
        }

        .vc-card-footer {
          padding: 24px 32px 32px;
        }

        .vc-card-title {
          font-size: 20px;
          font-weight: 500;
           font-family:"Cinzel", serif;
           text-align: center;
           text-transform:uppercase;
          color: #5A2F18;
          margin: 0 0 8px;
        }

        .vc-card-desc {
          font-size: 14px;
          font-weight: 400;
           text-align: center;
          color: #6C4A37;
          margin: 0 0 16px;
        }

        .vc-explore-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 600;
          color: #BF9555;
          text-decoration: none;
        }

        .vc-explore-link:hover {
          color: #61311E;
        }

        .vc-explore-arrow {
          font-size: 14px;
        }

        /* ====================== LAPTOP ====================== */
        @media (max-width: 1280px) {
          .vc-grid {
            gap: 24px;
          }

          .vc-card-overlay {
            padding: 24px 24px 0;
          }

          .vc-card-footer {
            padding: 20px 24px 24px;
          }
        }

        /* ====================== TABLET ====================== */
        @media (max-width: 1024px) {
          .vc-section {
            padding: 60px 0;
          }

          .vc-container {
            padding: 0 24px;
          }

          .vc-divider-line {
            max-width: 260px;
          }

          .vc-card-brand {
            font-size: 20px;
          }

          .vc-card-tagline {
            font-size: 16px;
          }
        }

        /* ====================== MOBILE ====================== */
        @media (max-width: 768px) {
          .vc-section {
            padding: 50px 0;
          }

          .vc-container {
            padding: 0 20px;
          }

          .vc-divider-row {
            gap: 14px;
            margin-bottom: 18px;
          }

          .vc-divider-line {
            max-width: 100px;
          }

          .vc-divider-logo {
            width: 44px;
            height: 44px;
          }

          .vc-heading {
            font-size: 22px;
            margin-bottom: 8px;
          }

          .vc-subheading {
            font-size: 12px;
            margin-bottom: 24px;
          }

          .vc-grid {
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }

          .vc-card {
            border-radius: 12px;
          }

          .vc-card-overlay {
            padding: 12px 12px 0;
          }

          .vc-card-brand {
            font-size: 14px;
            letter-spacing: 1px;
            margin-bottom: 2px;
          }

          .vc-card-tagline {
            font-size: 10px;
          }

          .vc-card-footer {
            padding: 12px 12px 16px;
          }

          .vc-card-title {
            font-size: 13px;
            margin-bottom: 4px;
          }

          .vc-card-desc {
            font-size: 11px;
            margin-bottom: 10px;
          }

          .vc-explore-link {
            font-size: 12px;
            gap: 4px;
          }

          .vc-explore-arrow {
            font-size: 11px;
          }
        }

        /* ====================== SMALL MOBILE ====================== */
        @media (max-width: 480px) {
          .vc-container {
            padding: 0 16px;
          }

          .vc-divider-line {
            max-width: 60px;
          }

          .vc-divider-logo {
            width: 36px;
            height: 36px;
          }

          .vc-heading {
            font-size: 18px;
          }

          .vc-grid {
            gap: 8px;
          }

          .vc-card-overlay {
            padding: 8px 8px 0;
          }

          .vc-card-brand {
            font-size: 12px;
          }

          .vc-card-tagline {
            font-size: 9px;
          }

          .vc-card-footer {
            padding: 8px 8px 12px;
          }

          .vc-card-title {
            font-size: 11px;
          }

          .vc-card-desc {
            font-size: 9px;
            margin-bottom: 6px;
          }

          .vc-explore-link {
            font-size: 10px;
          }
        }
      `}</style>
    </section>
  );
}