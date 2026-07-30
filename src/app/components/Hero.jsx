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
  // Track which slide images are fully decoded & ready to show
  const [ready, setReady] = useState({ 0: false });
  const intervalRef = useRef(null);

  // Detect mobile after mount — no hydration mismatch
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Auto-advance only after current slide image is ready
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

  return (
    <section className={`hero ${plusJakarta.className}`} style={{ background: "#111", display: "block" }}>
   <div
  className="hero-wrapper"
  style={{
    position: "relative",
    width: "100%",
    overflow: "hidden",
    background: "#111",
  }}
>

        {banners.map((banner, index) => {
          const src = isMobile ? banner.mobile : banner.desktop;
          const isActive = index === current;
          const isVisible = ready[index] && isActive;

          return (
            <div
              key={index}
              className={`slide ${isVisible ? "slide-visible" : ""}`}
              style={{ position: "absolute", inset: 0, opacity: isVisible ? 1 : 0, transition: "opacity 0.6s ease", zIndex: isVisible ? 1 : 0 }}
              aria-hidden={!isActive}
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
          /* Dark bg shows while first image loads — no white flash */
          background: #111;
        }

        /* Each slide is a full-cover layer, invisible by default */
        .slide {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.6s ease;
          z-index: 0;
        }

        /* Only show when image is decoded AND it's the active slide */
        .slide-visible {
          opacity: 1;
          z-index: 1;
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
          background: blue ;
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
