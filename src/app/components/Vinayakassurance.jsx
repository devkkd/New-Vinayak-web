"use client";

import Image from "next/image";

const assurances = [
  {
    id: "craftsmanship",
    icon: "/home/a1.svg",
    title: "Master Craftsmanship",
    desc: "Every Piece Is Made With Expert Attention To Detail."
  },
  {
    id: "purity",
    icon: "/home/a2.svg",
    title: "Purity Certified",
    desc: "Guaranteed Authenticity With Hallmark Standards."
  },
  {
    id: "transparency",
    icon: "/home/a3.svg",
    title: "Complete Transparency",
    desc: "100% Clarity In Quality And Value."
  },
  {
    id: "sourced",
    icon: "/home/a4.svg",
    title: "Responsibly Sourced",
    desc: "Ethically Obtained Materials You Can Trust."
  },
  {
    id: "trust",
    icon: "/home/a5.svg",
    title: "Trust & Clarity",
    desc: "20+ Years Of Transparent Processes For Peace Of Mind."
  },
  {
    id: "exchange",
    icon: "/home/a1.svg",
    title: "Easy Exchange",
    desc: "Hassle-Free Exchange Policy On All Jewellery."
  }
];

export default function VinayakAssurance() {
  return (
    <section className="va-section">
      <div className="va-container">
        {/* Top divider with logo */}
        <div className="va-divider-row">
          <span className="va-divider-line" />
          <Image
            src="/home/logo.png"
            alt="Vinayak Jewellers"
            width={64}
            height={64}
            className="va-divider-logo"
          />
          <span className="va-divider-line" />
        </div>

        {/* Heading */}
        <h2 className="va-heading">Vinayak Assurance</h2>
        <p className="va-subheading">Designed With Precision, Treasured By You.</p>

        {/* Grid */}
        <div className="va-grid">
          {assurances.map((item) => (
            <div className="va-item" key={item.id}>
              <div className="va-icon-wrap">
                <Image
                  src={item.icon}
                  alt={item.title}
                  width={40}
                  height={40}
                  className="va-icon"
                />
              </div>
              <h3 className="va-item-title">{item.title}</h3>
              <p className="va-item-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .va-section, .va-section * {
          box-sizing: border-box;
        }

        .va-section {
          background: #FFF4DC;
          font-family: "Mona Sans", sans-serif;
          padding: 80px 0;
        }

        .va-container {
          max-width: 1400px;
          width: 100%;
          margin: 0 auto;
          padding: 0 32px;
        }

        /* ---------- Divider ---------- */
        .va-divider-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          margin-bottom: 24px;
        }

        .va-divider-line {
          flex: 1;
          max-width: 420px;
          height: 1px;
          background: #61311E;
        }

        .va-divider-logo {
          width: 64px;
          height: 64px;
          border-radius: 999px;
          flex-shrink: 0;
        }

        /* ---------- Heading ---------- */
            .va-heading{
  font-family:"Cinzel", serif;

  text-align:center;
  font-size:32px;
  font-weight:500;
  color:#3B2E1E;
  letter-spacing:1px;
  text-transform:uppercase;
  margin:0 0 12px;
}

        .va-subheading {
          text-align: center;
          font-size: 16px;
          font-weight: 400;
          color: #6C4A37;
          margin: 0 0 48px;
        }

        /* ---------- Grid ---------- */
        .va-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 32px;
        }

        .va-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .va-icon-wrap {
          width: 84px;
          height: 84px;
          border-radius: 999px;
          background: radial-gradient(circle, #FFFDF7 0%, #FBEACC 100%);
          border: 1px solid #BF9555;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          flex-shrink: 0;
        }

        .va-icon {
          width: 34px;
          height: 34px;
          object-fit: contain;
        }

        .va-item-title {
          font-size: 18px;
          font-weight: 600;
          color: #5A2F18;
          margin: 0 0 10px;
        }

        .va-item-desc {
  font-size: 14px;
  font-weight: 400;
  color: #4B5563;
  line-height: 1.6;
  margin: 0;
  max-width: 220px;
}

        /* ====================== LAPTOP ====================== */
        @media (max-width: 1280px) {
          .va-grid {
            gap: 20px;
          }

          .va-item-desc {
            max-width: 180px;
          }
        }

        /* ====================== TABLET ====================== */
        @media (max-width: 1024px) {
          .va-section {
            padding: 60px 0;
          }

          .va-container {
            padding: 0 24px;
          }

          .va-divider-line {
            max-width: 260px;
          }

          .va-grid {
            grid-template-columns: repeat(3, 1fr);
            row-gap: 40px;
          }
        }

        /* ====================== MOBILE ====================== */
        @media (max-width: 768px) {
          .va-section {
            padding: 50px 0;
          }

          .va-container {
            padding: 0 20px;
          }

          .va-divider-row {
            gap: 14px;
            margin-bottom: 18px;
          }

          .va-divider-line {
            max-width: 100px;
          }

          .va-divider-logo {
            width: 44px;
            height: 44px;
          }

          .va-heading {
            font-size: 22px;
            margin-bottom: 8px;
          }

          .va-subheading {
            font-size: 12px;
            margin-bottom: 32px;
          }

          .va-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 28px 16px;
          }

          .va-icon-wrap {
            width: 64px;
            height: 64px;
            margin-bottom: 14px;
          }

          .va-icon {
            width: 26px;
            height: 26px;
          }

          .va-item-title {
            font-size: 16px;
            margin-bottom: 6px;
          }

          .va-item-desc {
            font-size: 12px;
            max-width: 160px;
          }
        }

        /* ====================== SMALL MOBILE ====================== */
        @media (max-width: 480px) {
          .va-container {
            padding: 0 16px;
          }

          .va-divider-line {
            max-width: 60px;
          }

          .va-divider-logo {
            width: 36px;
            height: 36px;
          }

          .va-heading {
            font-size: 18px;
          }

          .va-grid {
            gap: 24px 12px;
          }

          .va-icon-wrap {
            width: 56px;
            height: 56px;
          }

          .va-icon {
            width: 22px;
            height: 22px;
          }

          .va-item-title {
            font-size: 14px;
          }

          .va-item-desc {
            font-size: 11px;
            max-width: 140px;
          }
        }
      `}</style>
    </section>
  );
}