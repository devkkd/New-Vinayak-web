"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import { FaInstagram, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { listPublicReelsApi } from "@/lib/adminApi";

/* Fallback items when API has no reels yet */
const fallbackItems = [
  { id: "insta-1", video: "/home/insta1.mp4", poster: "/home/insta1.jpg" },
  { id: "insta-2", video: "/home/insta2.mp4", poster: "/home/insta2.jpg" },
  { id: "insta-3", video: "/home/insta3.mp4", poster: "/home/insta3.jpg" },
  { id: "insta-4", video: "/home/insta4.mp4", poster: "/home/insta4.jpg" },
  { id: "insta-5", video: "/home/insta5.mp4", poster: "/home/insta5.jpg" },
  { id: "insta-6", video: "/home/insta6.mp4", poster: "/home/insta6.jpg" },
  { id: "insta-7", video: "/home/insta7.mp4", poster: "/home/insta7.jpg" },
];

const INSTAGRAM_HANDLE = "vinayak_jewellers_jaipur";

export default function InstagramFollow() {
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [erroredMap, setErroredMap] = useState({});
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadReels() {
      try {
        const res = await listPublicReelsApi();
        if (cancelled) return;

        if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
          setItems(
            res.data.map((reel) => ({
              id: reel._id,
              video: reel.videoUrl,
              poster: reel.thumbnailUrl || undefined,
              reelLink: reel.reelLink || `https://www.instagram.com/${INSTAGRAM_HANDLE}/`,
            }))
          );
        } else {
          setItems(fallbackItems);
        }
      } catch {
        if (!cancelled) setItems(fallbackItems);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadReels();
    return () => {
      cancelled = true;
    };
  }, []);

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

  const handleVideoError = (id) => {
    setErroredMap((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section className="ig-section">
      <div className="ig-container">
        {/* Top divider with logo */}
        <div className="ig-divider-row">
          <span className="ig-divider-line" />
          <Image
            src="/home/logo.png"
            alt="Vinayak Jewellers"
            width={64}
            height={64}
            className="ig-divider-logo"
          />
          <span className="ig-divider-line" />
        </div>

        {/* Heading */}
        <h2 className="ig-heading">Follow Us On Instagram</h2>
        <p className="ig-subheading">Discover Our Latest Designs &amp; Beautiful Moments</p>

        {/* Carousel or fallback */}
        {loading ? (
          <div className="ig-no-data">
            <p>Loading reels...</p>
          </div>
        ) : hasData ? (
          <div className="ig-carousel">
            <button
              type="button"
              className="ig-arrow ig-arrow-left"
              onClick={handlePrev}
              disabled={activeIndex === 0}
              aria-label="Previous"
            >
              <FaChevronLeft />
            </button>

            <div className="ig-track" ref={trackRef}>
              {items.map((item) => (
                <a
                  key={item.id}
                  className="ig-card"
                  href={item.reelLink || `https://www.instagram.com/${INSTAGRAM_HANDLE}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View on Instagram"
                >
                  {!erroredMap[item.id] ? (
                    <video
                      className="ig-card-video"
                      src={item.video}
                      poster={item.poster}
                      muted
                      loop
                      autoPlay
                      playsInline
                      onError={() => handleVideoError(item.id)}
                    />
                  ) : null}
                  <div className="ig-card-overlay">
                    <FaInstagram className="ig-card-overlay-icon" />
                  </div>
                </a>
              ))}
            </div>

            <button
              type="button"
              className="ig-arrow ig-arrow-right"
              onClick={handleNext}
              disabled={activeIndex === items.length - 1}
              aria-label="Next"
            >
              <FaChevronRight />
            </button>
          </div>
        ) : (
          <div className="ig-no-data">
            <p>No data. Back soon.</p>
          </div>
        )}

        {/* Dots */}
        {hasData && (
          <div className="ig-dots">
            {items.map((item, index) => (
              <button
                type="button"
                key={item.id}
                className={`ig-dot ${index === activeIndex ? "ig-dot-active" : ""}`}
                onClick={() => scrollToIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Follow button */}
        <a
          href={`https://www.instagram.com/${INSTAGRAM_HANDLE}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="ig-follow-btn"
        >
          <FaInstagram className="ig-follow-icon" />
          Follow @{INSTAGRAM_HANDLE}
        </a>
      </div>

      <style>{`
        .ig-section, .ig-section * {
          box-sizing: border-box;
        }

        .ig-section {
          background: #FFF4DC;
          font-family: "Mona Sans", sans-serif;
          padding: 80px 0;
        }

        .ig-container {
          max-width: 1400px;
          width: 100%;
          margin: 0 auto;
          padding: 0 32px;
        }

        /* ---------- Divider ---------- */
        .ig-divider-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          margin-bottom: 24px;
        }

        .ig-divider-line {
          flex: 1;
          max-width: 420px;
          height: 1px;
          background: #61311E;
        }

        .ig-divider-logo {
          width: 64px;
          height: 64px;
          border-radius: 999px;
          flex-shrink: 0;
        }

        /* ---------- Heading ---------- */
        .ig-heading {
          text-align: center;
          font-family: "Cinzel", serif;
          font-size: 32px;
          font-weight: 500;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #3B2E1E;
          margin: 0 0 12px;
        }

        .ig-subheading {
          text-align: center;
          font-family: "Mona Sans", sans-serif;
          font-size: 16px;
          font-weight: 400;
          color: #6C4A37;
          margin: 0 0 48px;
        }

        /* ---------- Carousel ---------- */
        .ig-carousel {
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ig-track {
          flex: 1;
          display: flex;
          gap: 24px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }

        .ig-track::-webkit-scrollbar {
          display: none;
        }

        .ig-card {
          position: relative;
          flex: 0 0 calc((100% - 24px * 3) / 4);
          aspect-ratio: 9 / 16;
          border-radius: 20px;
          overflow: hidden;
          background: #000;
          scroll-snap-align: start;
          text-decoration: none;
          cursor: pointer;
        }

        .ig-card-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* Instagram hover overlay */
        .ig-card-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.25s ease;
        }

        .ig-card-overlay-icon {
          color: #fff;
          font-size: 40px;
          opacity: 0;
          transform: scale(0.8);
          transition: opacity 0.25s ease, transform 0.25s ease;
        }

        .ig-card:hover .ig-card-overlay {
          background: rgba(0, 0, 0, 0.45);
        }

        .ig-card:hover .ig-card-overlay-icon {
          opacity: 1;
          transform: scale(1);
        }

        /* ---------- Arrows ---------- */
        .ig-arrow {
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

        .ig-arrow:hover:not(:disabled) {
          background: #FBEACC;
        }

        .ig-arrow:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        /* ---------- No data state ---------- */
        .ig-no-data {
          width: 100%;
          min-height: 240px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 20px;
          background: #FFF6E0;
          border: 1px dashed #BF9555;
        }

        .ig-no-data p {
          font-size: 16px;
          font-weight: 500;
          color: #6C4A37;
          margin: 0;
        }

        /* ---------- Dots ---------- */
        .ig-dots {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 24px;
        }

        .ig-dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #D9C6A3;
          border: none;
          padding: 0;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .ig-dot:hover {
          background: #BF9555;
        }

        .ig-dot-active {
          width: 26px;
          background: #61311E;
        }

        /* ---------- Follow button ---------- */
        .ig-follow-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: fit-content;
          margin: 32px auto 0;
          padding: 14px 28px;
          border-radius: 999px;
          background: linear-gradient(90deg, #8a3ab9 0%, #e95950 50%, #fccc63 100%);
          color: #fff;
          font-size: 16px;
          font-weight: 500;
          text-decoration: none;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .ig-follow-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(139, 58, 90, 0.28);
        }

        .ig-follow-icon {
          font-size: 18px;
        }

        /* ====================== LAPTOP ====================== */
        @media (max-width: 1280px) {
          .ig-track {
            gap: 20px;
          }

          .ig-card {
            flex: 0 0 calc((100% - 20px * 2) / 3);
          }
        }

        /* ====================== TABLET ====================== */
        @media (max-width: 1024px) {
          .ig-section {
            padding: 60px 0;
          }

          .ig-container {
            padding: 0 24px;
          }

          .ig-divider-line {
            max-width: 260px;
          }

          .ig-card {
            flex: 0 0 calc((100% - 20px * 2) / 3);
          }
        }

        /* ====================== MOBILE ====================== */
        @media (max-width: 768px) {
          .ig-section {
            padding: 50px 0;
          }

          .ig-container {
            padding: 0 20px;
          }

          .ig-divider-row {
            gap: 14px;
            margin-bottom: 18px;
          }

          .ig-divider-line {
            max-width: 100px;
          }

          .ig-divider-logo {
            width: 44px;
            height: 44px;
          }

          .ig-heading {
            font-size: 22px;
            margin-bottom: 8px;
          }

          .ig-subheading {
            font-size: 12px;
            margin-bottom: 28px;
          }

          .ig-carousel {
            gap: 8px;
          }

          .ig-track {
            gap: 12px;
          }

          .ig-card {
            flex: 0 0 calc((100% - 12px) / 2);
            border-radius: 14px;
          }

          .ig-arrow {
            width: 34px;
            height: 34px;
            font-size: 12px;
          }

          .ig-dots {
            margin-top: 18px;
          }

          .ig-follow-btn {
            width: 100%;
            padding: 12px 20px;
            font-size: 14px;
            margin-top: 24px;
          }
        }

        /* ====================== SMALL MOBILE ====================== */
        @media (max-width: 480px) {
          .ig-container {
            padding: 0 16px;
          }

          .ig-divider-line {
            max-width: 60px;
          }

          .ig-divider-logo {
            width: 36px;
            height: 36px;
          }

          .ig-heading {
            font-size: 19px;
          }

          .ig-track {
            gap: 10px;
          }

          .ig-card {
            flex: 0 0 calc((100% - 10px) / 2);
            border-radius: 12px;
          }

          .ig-follow-btn {
            font-size: 13px;
          }
        }
      `}</style>
    </section>
  );
}