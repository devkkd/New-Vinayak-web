"use client";

import Image from "next/image";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const banners = [
  { desktop: "/home/hero1.png", mobile: "/home/hero6.png" },
  { desktop: "/home/hero2.png", mobile: "/home/hero5.png" },
  { desktop: "/home/hero3.png", mobile: "/home/hero7.png" },
  { desktop: "/home/hero4.png", mobile: "/home/hero8.png" },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  // Start with slide 0 ready so hero shows immediately
  const [ready, setReady] = useState({});
  const intervalRef = useRef(null);
  // Track previous src to re-mark ready when src changes (mobile/desktop switch)
  const prevSrcRef = useRef({});

  // Detect mobile after mount
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // When isMobile changes, reset ready state so images re-trigger onLoad
  useEffect(() => {
    setReady({});
    prevSrcRef.current = {};
  }, [isMobile]);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const goTo = (index) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCurrent(index);
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
  };

  const markReady = (index) => {
    setReady((prev) => ({ ...prev, [index]: true }));
  };

  // Show slide if: ready OR it's index 0 and we just mounted (fallback)
  const isSlideVisible = (index) => ready[index] && index === current;

  return (
    <section className={`hero ${plusJakarta.className}`} style={{ background: "#111", display: "block" }}>
      <div
        className="hero-wrapper"
        style={{ position: "relative", width: "100%", overflow: "hidden", background: "#111" }}
      >
        {/* Skeleton shown until first image loads */}
        {!ready[0] && (
          <div className="hero-skeleton" aria-hidden="true" />
        )}

        {banners.map((banner, index) => {
          const src = isMobile ? banner.mobile : banner.desktop;
          const visible = isSlideVisible(index);

          return (
            <div
              key={index}
              style={{
                position: "absolute",
                inset: 0,
                opacity: visible ? 1 : 0,
                transition: "opacity 0.6s ease",
                zIndex: visible ? 1 : 0,
              }}
              aria-hidden={!visible}
            >
              <Image
                src={src}
                alt={`Banner ${index + 1}`}
                fill
                priority={index === 0}
                sizes="100vw"
                className="hero-image"
                onLoad={() => markReady(index)}
              />
            </div>
          );
        })}

    

        {/* Dots */}
        <div className="dots">
          {banners.map((_, index) => (
            <span
              key={index}
              className={`dot ${current === index ? "active" : ""}`}
              onClick={() => goTo(index)}
              role="button"
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

      </div>

      <style jsx>{`
        .hero {
          width: 100%;
          background: #111;
        }

        .hero-wrapper {
          position: relative;
          width: 100%;
          height: 650px;
          overflow: hidden;
          background: #111;
        }

        /* Skeleton shimmer shown while first image loads */
        .hero-skeleton {
          position: absolute;
          inset: 0;
          z-index: 2;
          background: linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .hero-image {
          object-fit: cover;
          object-position: center;
        }

       
        /* Dots */
        .dots {
          position: absolute;
          bottom: 18px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 10px;
          z-index: 10;
        }
        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background:#681f00 ;
          opacity: 0.45;
          cursor: pointer;
          transition: all 0.3s;
        }
        .dot.active {
          width: 20px;
          border-radius: 20px;
          opacity: 1;
        }

        /* Tablet */
        @media (max-width: 991px) {
          .arrow { width: 40px; height: 40px; }
        }

        /* Mobile */
        @media (max-width: 768px) {
          .hero-wrapper { height: 350px; }
          .arrow { width: 36px; height: 36px; }
          .left-arrow { left: 12px; }
          .right-arrow { right: 12px; }
        }

        /* Small Mobile */
        @media (max-width: 480px) {
          .hero-wrapper { height: 250px; }
        }
      `}</style>
    </section>
  );
}
