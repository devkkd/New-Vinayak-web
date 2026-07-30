"use client";

import Image from "next/image";
import { useState } from "react";
import { FaClock, FaMapMarkerAlt, FaDirections } from "react-icons/fa";

/* ------------------------------------------------------------------ */
/* Store data — update address / hours / map query here.              */
/* Leave `mapQuery` empty ("") to see the "no data" fallback.         */
/* ------------------------------------------------------------------ */
const storeInfo = {
  name: "Vinayak Jewellers",
  addressLines: [
    "Vinayak Jewellers G-46,",
    "Unnati Tower, Sector 2, Central Spine,",
    "Vidyadhar Nagar, Jaipur, Rajasthan 302039"
  ],
  mapQuery:
    "Vinayak Jewellers G-46, Unnati Tower, Sector 2, Central Spine, Vidyadhar Nagar, Jaipur, Rajasthan 302039",
  hours: [{ days: "Monday - Saturday", time: "10:30 AM - 8:30 PM" }]
};

export default function VisitOurStore() {
  const [mapError, setMapError] = useState(false);

  const hasMap = Boolean(storeInfo.mapQuery) && !mapError;
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    storeInfo.mapQuery
  )}&output=embed`;
  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    storeInfo.mapQuery
  )}`;

  return (
    <section className="visit-section">
      <div className="visit-container">
        {/* Top divider with logo */}
        <div className="visit-divider-row">
          <span className="visit-divider-line" />
          <Image
            src="/home/logo.png"
            alt="Vinayak Jewellers"
            width={64}
            height={64}
            className="visit-divider-logo"
          />
          <span className="visit-divider-line" />
        </div>

        {/* Heading */}
        <h2 className="visit-heading">Visit Our Store</h2>
        <p className="visit-subheading">
          Visit Us At Vidyadhar Nagar, Jaipur — And Experience Our Collection Of Gold, Diamond &amp; Silver
          Jewellery In Person.
        </p>

        {/* Content */}
        <div className="visit-grid">
          {/* Map */}
          <div className="visit-map-card">
            {hasMap ? (
              <iframe
                title="Vinayak Jewellers location on Google Maps"
                src={mapSrc}
                className="visit-map-iframe"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                onError={() => setMapError(true)}
              />
            ) : (
              <div className="visit-no-data">
                <p>No data. Back soon.</p>
              </div>
            )}
          </div>

          {/* Info column */}
          <div className="visit-info-col">
            {/* Store Hours */}
            <div className="visit-hours-card">
              <div className="visit-icon-badge visit-icon-badge-light">
                <FaClock />
              </div>
              <div className="visit-hours-content">
                <h3 className="visit-card-title">Store Hours</h3>
                <div className="visit-hours-list">
                  {storeInfo.hours.map((slot, index) => (
                    <div className="visit-hours-row" key={index}>
                      <span>{slot.days}</span>
                      <span>{slot.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="visit-location-card">
              <div className="visit-icon-badge visit-icon-badge-dark">
                <FaMapMarkerAlt />
              </div>
              <h3 className="visit-card-title visit-card-title-light">Location</h3>
              <p className="visit-address-text">
                {storeInfo.addressLines.map((line, index) => (
                  <span key={index}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
              <a
                href={directionsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="visit-directions-btn"
              >
                <FaDirections className="visit-directions-icon" />
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .visit-section, .visit-section * {
          box-sizing: border-box;
        }

        .visit-section {
          background: #FFF4DC;
          font-family: "Mona Sans", sans-serif;
          padding: 80px 0;
        }

        .visit-container {
          max-width: 1400px;
          width: 100%;
          margin: 0 auto;
          padding: 0 32px;
        }

        /* ---------- Divider ---------- */
        .visit-divider-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          margin-bottom: 24px;
        }

        .visit-divider-line {
          flex: 1;
          max-width: 420px;
          height: 1px;
          background: #61311E;
        }

        .visit-divider-logo {
          width: 64px;
          height: 64px;
          border-radius: 999px;
          flex-shrink: 0;
        }

        /* ---------- Heading ---------- */
        .visit-heading {
          text-align: center;
          font-family: "Cinzel", serif;
          font-size: 32px;
          font-weight: 500;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #3B2E1E;
          margin: 0 0 16px;
        }

        .visit-subheading {
          text-align: center;
          font-family: "Mona Sans", sans-serif;
          font-size: 16px;
          font-weight: 400;
          color: #3B2E1E;
          max-width: 900px;
          margin: 0 auto 48px;
        }

        /* ---------- Grid ---------- */
        .visit-grid {
          display: grid;
          grid-template-columns: 1.7fr 1fr;
          gap: 32px;
          align-items: stretch;
        }

        /* ---------- Map ---------- */
        .visit-map-card {
          position: relative;
          border-radius: 20px;
          border: 2px solid #BF9555;
          overflow: hidden;
          min-height: 480px;
          background: #FFF6E0;
        }

        .visit-map-iframe {
          width: 100%;
          height: 100%;
          min-height: 480px;
          border: 0;
          display: block;
        }

        .visit-no-data {
          width: 100%;
          height: 100%;
          min-height: 480px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .visit-no-data p {
          font-size: 16px;
          font-weight: 500;
          color: #6C4A37;
          margin: 0;
        }

        /* ---------- Info column ---------- */
        .visit-info-col {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .visit-icon-badge {
          width: 48px;
          height: 48px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }

        .visit-icon-badge-light {
          background: #FBEACC;
          color: #61311E;
        }

        .visit-icon-badge-dark {
          background: rgba(255, 255, 255, 0.12);
          color: #FFF6E0;
        }

        /* Store hours card */
        .visit-hours-card {
          background: #FFFFFF;
          border-radius: 16px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .visit-hours-content {
          flex: 1;
        }

        .visit-card-title {
          font-size: 18px;
          font-weight: 600;
          color: #3B2E1E;
          margin: 0 0 12px;
        }

        .visit-hours-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          font-size: 14px;
          color: #3B2E1E;
        }

        /* Location card */
        .visit-location-card {
          background: #61311E;
          border-radius: 16px;
          padding: 28px 24px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .visit-card-title-light {
          color: #FFFFFF;
          margin-top: 16px;
        }

        .visit-address-text {
          font-size: 14px;
          font-weight: 400;
          line-height: 1.7;
          color: #F3E4C8;
          margin: 0 0 24px;
        }

        .visit-directions-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: fit-content;
          padding: 12px 22px;
          border-radius: 999px;
          background: #FFFFFF;
          color: #61311E;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          margin-top: auto;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .visit-directions-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.18);
        }

        .visit-directions-icon {
          font-size: 15px;
        }

        /* ====================== LAPTOP ====================== */
        @media (max-width: 1280px) {
          .visit-grid {
            gap: 24px;
          }
        }

        /* ====================== TABLET ====================== */
        @media (max-width: 1024px) {
          .visit-section {
            padding: 60px 0;
          }

          .visit-container {
            padding: 0 24px;
          }

          .visit-divider-line {
            max-width: 260px;
          }

          .visit-grid {
            grid-template-columns: 1fr;
          }

          .visit-map-card,
          .visit-map-iframe,
          .visit-no-data {
            min-height: 380px;
          }

          .visit-info-col {
            flex-direction: row;
          }

          .visit-hours-card,
          .visit-location-card {
            flex: 1;
          }
        }

        /* ====================== MOBILE ====================== */
        @media (max-width: 768px) {
          .visit-section {
            padding: 50px 0;
          }

          .visit-container {
            padding: 0 20px;
          }

          .visit-divider-row {
            gap: 14px;
            margin-bottom: 18px;
          }

          .visit-divider-line {
            max-width: 100px;
          }

          .visit-divider-logo {
            width: 44px;
            height: 44px;
          }

          .visit-heading {
            font-size: 22px;
            margin-bottom: 8px;
          }

          .visit-subheading {
            font-size: 12px;
            margin-bottom: 28px;
          }

          .visit-map-card,
          .visit-map-iframe,
          .visit-no-data {
            min-height: 280px;
          }

          .visit-info-col {
            flex-direction: column;
          }

          .visit-hours-card {
            padding: 18px;
          }

          .visit-location-card {
            padding: 22px 18px;
          }

          .visit-card-title {
            font-size: 16px;
          }
        }

        /* ====================== SMALL MOBILE ====================== */
        @media (max-width: 480px) {
          .visit-container {
            padding: 0 16px;
          }

          .visit-divider-line {
            max-width: 60px;
          }

          .visit-divider-logo {
            width: 36px;
            height: 36px;
          }

          .visit-heading {
            font-size: 19px;
          }

          .visit-map-card,
          .visit-map-iframe,
          .visit-no-data {
            min-height: 220px;
          }

          .visit-hours-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }
        }
      `}</style>
    </section>
  );
}