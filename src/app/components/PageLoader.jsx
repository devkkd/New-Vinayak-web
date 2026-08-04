"use client";

import { useEffect, useState } from "react";

export default function PageLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Hide loader once DOM is ready (CSS has been applied)
    const hide = () => {
      document.body.classList.add("css-ready");
      setVisible(false);
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", hide);
      return () => document.removeEventListener("DOMContentLoaded", hide);
    } else {
      hide();
    }
  }, []);

  if (!visible) return null;

  return (
    <>
      <div
        id="vj-loader"
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99999,
          background: "#fff6de",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/home/logo.png"
          alt=""
          width={80}
          height={80}
          style={{ borderRadius: "50%", objectFit: "cover" }}
        />
        <div
          style={{
            width: 48,
            height: 48,
            border: "3px solid rgba(104,31,0,0.15)",
            borderTopColor: "#681f00",
            borderRadius: "50%",
            animation: "vj-spin 0.7s linear infinite",
          }}
        />
        <style>{`
          @keyframes vj-spin { to { transform: rotate(360deg); } }
          body { visibility: hidden; }
          body.css-ready { visibility: visible; }
        `}</style>
      </div>
    </>
  );
}
