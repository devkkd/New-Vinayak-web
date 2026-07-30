"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import { FaStar, FaQuoteRight, FaGoogle, FaInstagram, FaChevronLeft, FaChevronRight } from "react-icons/fa";

/* ------------------------------------------------------------------ */
/* Reusable data array — swap `avatar` with real customer photos.     */
/* Leave items as [] (or omit prop) to see the "no data" fallback.    */
/* ------------------------------------------------------------------ */
const defaultReviews = [
  {
    id: "rev-1",
    rating: 5,
    quote:
      "Excellent customer service, wide range of products, purity assured, transparent pricing and more than two decades of confidence. You will be pampered to visit the showroom again and again.",
    name: "Ajay Gupta",
    location: "Pune",
    avatar: "/home/rev1.jpg"
  },
  {
    id: "rev-2",
    rating: 4,
    quote:
      "I truly had a very pleasant experience here since past 10 years. The collection here is both unique and elegant. Owner's nature is also very humble and trustworthy.",
    name: "Sunita Lamba",
    location: "Jaipur",
    avatar: "/home/rev2.jpg"
  },
  {
    id: "rev-3",
    rating: 5,
    quote:
      "A plethora of designs and variety in both silver and gold jewelery. Collection includes diamond jewelry as well. Custom jewelry made on order and at reasonable rates.",
    name: "Arjun Mehta",
    location: "Ahmedabad",
    avatar: "/home/rev3.jpg"
  },
  {
    id: "rev-4",
    rating: 5,
    quote:
      "Beautiful craftsmanship and honest pricing. The staff took the time to explain every piece and never once felt pushy. Highly recommended for traditional gold jewellery.",
    name: "Priya Sharma",
    location: "Jaipur",
    avatar: "/home/rev4.jpg"
  },
  {
    id: "rev-5",
    rating: 4,
    quote:
      "Great experience buying my wedding jewellery here. The Rajasthani collection is stunning and the team helped us stay within budget without compromising on quality.",
    name: "Rohit Verma",
    location: "Udaipur",
    avatar: "/home/rev5.jpg"
  },
  {
    id: "rev-6",
    rating: 5,
    quote:
      "Trustworthy shop with generations of goodwill behind it. Got my mother's old jewellery redesigned and the finishing was flawless.",
    name: "Kavita Joshi",
    location: "Jaipur",
    avatar: "/home/rev6.jpg"
  }
];

function getInitials(name = "") {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function CustomerReviews({ items = defaultReviews }) {
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [avatarErrorMap, setAvatarErrorMap] = useState({});

  const hasData = Array.isArray(items) && items.length > 0;

  /* Measure the distance (card width + gap) to move per step */
  const getStep = useCallback(() => {
    const track = trackRef.current;
    if (!track || !track.children[0]) return 0;
    const style = window.getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap || "0");
    return track.children[0].getBoundingClientRect().width + gap;
  }, []);

  const scrollToIndex = useCallback(
    (index) => {
      const track = trackRef.current;
      if (!track) return;
      const clamped = Math.max(0, Math.min(index, items.length - 1));
      const step = getStep();
      track.scrollTo({ left: step * clamped, behavior: "smooth" });
      setActiveIndex(clamped);
    },
    [getStep, items.length]
  );

  const handlePrev = () => scrollToIndex(activeIndex - 1);
  const handleNext = () => scrollToIndex(activeIndex + 1);

  /* Keep dots in sync when the user swipes/drags manually */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame = null;
    const handleScroll = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const step = getStep();
        if (!step) return;
        const nearest = Math.round(track.scrollLeft / step);
        setActiveIndex((prev) => (prev === nearest ? prev : nearest));
      });
    };

    track.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      track.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [getStep]);

  const handleAvatarError = (id) => {
    setAvatarErrorMap((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section className="rev-section">
      <div className="rev-container">
        {/* Top divider with logo */}
        <div className="rev-divider-row">
          <span className="rev-divider-line" />
          <Image
            src="/home/logo.png"
            alt="Vinayak Jewellers"
            width={64}
            height={64}
            className="rev-divider-logo"
          />
          <span className="rev-divider-line" />
        </div>

        {/* Heading */}
        <h2 className="rev-heading">Customer Experiences &amp; Reviews</h2>
        <p className="rev-subheading">
          Explore what our customers say about Vinayak Jewellers - trust, quality, and service.
        </p>

        {/* Carousel or fallback */}
        {hasData ? (
          <div className="rev-carousel">
            <button
              type="button"
              className="rev-arrow rev-arrow-left"
              onClick={handlePrev}
              disabled={activeIndex === 0}
              aria-label="Previous"
            >
              <FaChevronLeft />
            </button>

            <div className="rev-track" ref={trackRef}>
              {items.map((item) => (
                <div className="rev-card" key={item.id}>
                  {/* Stars */}
                  <div className="rev-stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FaStar
                        key={i}
                        className={i < item.rating ? "rev-star rev-star-filled" : "rev-star"}
                      />
                    ))}
                  </div>

                  {/* Quote icon */}
                  <FaQuoteRight className="rev-quote-icon" />

                  {/* Review text */}
                  <p className="rev-quote-text">&quot;{item.quote}&quot;</p>

                  <span className="rev-card-divider" />

                  {/* Reviewer */}
                  <div className="rev-author-row">
                    <div className="rev-avatar-wrap">
                      {!avatarErrorMap[item.id] ? (
                        <Image
                          src={item.avatar}
                          alt={item.name}
                          fill
                          sizes="48px"
                          className="rev-avatar-img"
                          onError={() => handleAvatarError(item.id)}
                        />
                      ) : (
                        <span className="rev-avatar-fallback">{getInitials(item.name)}</span>
                      )}
                    </div>
                    <div className="rev-author-info">
                      <p className="rev-author-name">{item.name}</p>
                      <p className="rev-author-location">{item.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="rev-arrow rev-arrow-right"
              onClick={handleNext}
              disabled={activeIndex === items.length - 1}
              aria-label="Next"
            >
              <FaChevronRight />
            </button>
          </div>
        ) : (
          <div className="rev-no-data">
            <p>No data. Back soon.</p>
          </div>
        )}

        {/* Dots */}
        {hasData && (
          <div className="rev-dots">
            {items.map((item, index) => (
              <button
                type="button"
                key={item.id}
                className={`rev-dot ${index === activeIndex ? "rev-dot-active" : ""}`}
                onClick={() => scrollToIndex(index)}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="rev-actions">
          <a
            href="https://www.google.com/search?q=vinayak+jewellers+jaipur+reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="rev-btn rev-btn-google"
          >
            <FaGoogle className="rev-btn-icon" />
            Read on Google
          </a>
          <a
            href="https://www.instagram.com/vinayak_jewellers_jaipur/"
            target="_blank"
            rel="noopener noreferrer"
            className="rev-btn rev-btn-instagram"
          >
            <FaInstagram className="rev-btn-icon" />
            Follow Us
          </a>
        </div>
      </div>

      <style>{`
        .rev-section, .rev-section * {
          box-sizing: border-box;
        }

        .rev-section {
          background: #FFF4DC;
          font-family: "Mona Sans", sans-serif;
          padding: 80px 0;
        }

        .rev-container {
          max-width: 1400px;
          width: 100%;
          margin: 0 auto;
          padding: 0 32px;
        }

        /* ---------- Divider ---------- */
        .rev-divider-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          margin-bottom: 24px;
        }

        .rev-divider-line {
          flex: 1;
          max-width: 420px;
          height: 1px;
          background: #61311E;
        }

        .rev-divider-logo {
          width: 64px;
          height: 64px;
          border-radius: 999px;
          flex-shrink: 0;
        }

        /* ---------- Heading ---------- */
        .rev-heading {
          text-align: center;
          font-family: "Cinzel", serif;
          font-size: 32px;
          font-weight: 500;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #3B2E1E;
          margin: 0 0 12px;
        }

        .rev-subheading {
          text-align: center;
          font-family: "Mona Sans", sans-serif;
          font-size: 16px;
          font-weight: 400;
          color: #6C4A37;
          margin: 0 0 48px;
        }

        /* ---------- Carousel ---------- */
        .rev-carousel {
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .rev-track {
          flex: 1;
          display: flex;
          gap: 24px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }

        .rev-track::-webkit-scrollbar {
          display: none;
        }

        /* ---------- Card ---------- */
        .rev-card {
          flex: 0 0 calc((100% - 72px) / 4);
          scroll-snap-align: start;
          background: #FFFFFF;
          border-radius: 20px;
          padding: 32px 28px;
          display: flex;
          flex-direction: column;
        }

        .rev-stars {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          margin-bottom: 16px;
        }

        .rev-star {
          font-size: 16px;
          color: #E6D9C4;
        }

        .rev-star-filled {
          color: #D9A441;
        }

        .rev-quote-icon {
          display: block;
          margin: 0 auto 16px;
          font-size: 22px;
          color: #D9CBB8;
        }

        .rev-quote-text {
          text-align: center;
          font-size: 15px;
          font-weight: 400;
          line-height: 1.7;
          color: #3B2E1E;
          margin: 0 0 24px;
        }

        .rev-card-divider {
          display: block;
          width: 100%;
          height: 1px;
          background: #BF9555;
          margin: 0 0 20px;
          margin-top: auto;
        }

        .rev-author-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .rev-avatar-wrap {
          position: relative;
          width: 48px;
          height: 48px;
          border-radius: 999px;
          overflow: hidden;
          flex-shrink: 0;
          background: #FBEACC;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .rev-avatar-img {
          object-fit: cover;
        }

        .rev-avatar-fallback {
          font-size: 15px;
          font-weight: 600;
          color: #61311E;
        }

        .rev-author-name {
          font-size: 15px;
          font-weight: 700;
          color: #3B2E1E;
          margin: 0;
        }

        .rev-author-location {
          font-size: 13px;
          font-weight: 400;
          color: #6C4A37;
          margin: 2px 0 0;
        }

        /* ---------- Arrows (same style as Instagram carousel) ---------- */
        .rev-arrow {
          flex-shrink: 0;
          width: 44px;
          height: 44px;
          border-radius: 999px;
          border: 1px solid #BF9555;
          background: #FFF6E0;
          color: #5A2F18;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          cursor: pointer;
          transition: background 0.25s ease, opacity 0.25s ease;
        }

        .rev-arrow:hover:not(:disabled) {
          background: #FBEACC;
        }

        .rev-arrow:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        /* ---------- No data state ---------- */
        .rev-no-data {
          width: 100%;
          min-height: 240px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 20px;
          background: #FFF6E0;
          border: 1px dashed #BF9555;
        }

        .rev-no-data p {
          font-size: 16px;
          font-weight: 500;
          color: #6C4A37;
          margin: 0;
        }

        /* ---------- Dots ---------- */
        .rev-dots {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 24px;
        }

        .rev-dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #D9C6A3;
          border: none;
          padding: 0;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .rev-dot:hover {
          background: #BF9555;
        }

        .rev-dot-active {
          width: 26px;
          background: #61311E;
        }

        /* ---------- Action buttons ---------- */
        .rev-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-top: 32px;
          flex-wrap: wrap;
        }

        .rev-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 14px 28px;
          border-radius: 999px;
          font-size: 16px;
          font-weight: 500;
          text-decoration: none;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .rev-btn:hover {
          transform: translateY(-2px);
        }

        .rev-btn-google {
          background: #3B2412;
          color: #fff;
        }

        .rev-btn-instagram {
          background: linear-gradient(90deg, #d6336c 0%, #e95950 100%);
          color: #fff;
        }

        .rev-btn-icon {
          font-size: 16px;
        }

        /* ====================== LAPTOP ====================== */
        @media (max-width: 1280px) {
          .rev-track {
            gap: 20px;
          }

          .rev-card {
            flex: 0 0 calc((100% - 20px * 1) / 2);
          }
        }

        /* ====================== TABLET ====================== */
        @media (max-width: 1024px) {
          .rev-section {
            padding: 60px 0;
          }

          .rev-container {
            padding: 0 24px;
          }

          .rev-divider-line {
            max-width: 260px;
          }

          .rev-card {
            flex: 0 0 calc((100% - 20px * 1) / 2);
          }
        }

        /* ====================== MOBILE ====================== */
        @media (max-width: 768px) {
          .rev-section {
            padding: 50px 0;
          }

          .rev-container {
            padding: 0 20px;
          }

          .rev-divider-row {
            gap: 14px;
            margin-bottom: 18px;
          }

          .rev-divider-line {
            max-width: 100px;
          }

          .rev-divider-logo {
            width: 44px;
            height: 44px;
          }

          .rev-heading {
            font-size: 22px;
            margin-bottom: 8px;
          }

          .rev-subheading {
            font-size: 12px;
            margin-bottom: 28px;
          }

          .rev-carousel {
            gap: 8px;
          }

          .rev-track {
            gap: 14px;
          }

         .rev-card {
  flex: 0 0 calc((100% - 14px) / 1);
  border-radius: 16px;
  padding: 20px 16px;
}

          .rev-quote-text {
            font-size: 14px;
          }

          .rev-arrow {
            width: 34px;
            height: 34px;
            font-size: 12px;
          }

          .rev-dots {
            margin-top: 18px;
          }

          .rev-actions {
            flex-direction: column;
            gap: 12px;
            margin-top: 24px;
          }

          .rev-btn {
            width: 100%;
            padding: 12px 20px;
            font-size: 14px;
          }
        }

        /* ====================== SMALL MOBILE ====================== */
        @media (max-width: 480px) {
          .rev-container {
            padding: 0 16px;
          }

          .rev-divider-line {
            max-width: 60px;
          }

          .rev-divider-logo {
            width: 36px;
            height: 36px;
          }

          .rev-heading {
            font-size: 19px;
          }

          .rev-card {
            padding: 20px 16px;
          }

          .rev-quote-text {
            font-size: 13px;
          }

          .rev-btn {
            font-size: 13px;
          }
        }
      `}</style>
    </section>
  );
}