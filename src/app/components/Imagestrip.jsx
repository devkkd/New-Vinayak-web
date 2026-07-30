"use client";

import Image from "next/image";

/* ------------------------------------------------------------------ */
/* Gallery images — h1.png to h5.png. Add/remove freely; the strip    */
/* auto-adjusts since it loops the array for a seamless scroll.       */
/* ------------------------------------------------------------------ */
const galleryImages = [
  { id: "h1", src: "/home/h1.png", alt: "Vinayak Jewellers showroom" },
  { id: "h2", src: "/home/h2.png", alt: "Vinayak Jewellers craftsman at work" },
  { id: "h3", src: "/home/h3.png", alt: "From Tradition to Trend - Gold for every occasion" },
  { id: "h4", src: "/home/h4.png", alt: "Vinayak Jewellers necklace collection" },
  { id: "h5", src: "/home/h5.png", alt: "Vinayak Jewellers jewellery display" }
];

export default function ImageStrip() {
  const hasImages = Array.isArray(galleryImages) && galleryImages.length > 0;

  /* Duplicate the set once so the marquee can loop seamlessly */
  const loopImages = hasImages ? [...galleryImages, ...galleryImages] : [];

  return (
    <section className="strip-section">
      {hasImages ? (
        <div className="strip-track">
          {loopImages.map((item, index) => (
            <div className="strip-item" key={`${item.id}-${index}`}>
              <Image
                src={item.src}
                alt={item.alt}
                width={480}
                height={520}
                className="strip-image"
                priority={index < galleryImages.length}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="strip-no-data">
          <p>No data. Back soon.</p>
        </div>
      )}

      <style>{`
        .strip-section, .strip-section * {
          box-sizing: border-box;
        }

        .strip-section {
          width: 100%;
          overflow: hidden;
          background: #FFF4DC;
          margin: 0;
          padding: 0;
        }

        .strip-track {
          display: flex;
          align-items: stretch;
          gap: 24px;
          width: max-content;
          height: 350px;
          padding: 0 24px;
          animation: strip-scroll 30s linear infinite;
        }

        .strip-item {
          flex-shrink: 0;
          height: 100%;
        }

        .strip-image {
          height: 100%;
          width: auto;
          display: block;
          object-fit: cover;
          border-radius: 16px;
        }

        .strip-no-data {
          width: 100%;
          height: 320px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .strip-no-data p {
          font-size: 16px;
          font-weight: 500;
          color: #6C4A37;
          margin: 0;
          font-family: "Mona Sans", sans-serif;
        }

        @keyframes strip-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        /* ====================== TABLET ====================== */
        @media (max-width: 1024px) {
          .strip-track {
            height: 400px;
            gap: 18px;
            padding: 20px 18px;
          }
        }

        /* ====================== MOBILE ====================== */
        @media (max-width: 768px) {
          .strip-track {
            height: 260px;
            gap: 12px;
            padding: 20px 12px;
            animation-duration: 28s;
          }

          .strip-image {
            border-radius: 12px;
          }
        }

        /* ====================== SMALL MOBILE ====================== */
        @media (max-width: 480px) {
          .strip-track {
            height: 190px;
            gap: 8px;
            padding: 20px 8px;
            animation-duration: 22s;
          }

          .strip-image {
            border-radius: 10px;
          }

          .strip-no-data {
            height: 190px;
          }
        }
      `}</style>
    </section>
  );
}