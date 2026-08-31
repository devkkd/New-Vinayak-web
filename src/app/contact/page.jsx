"use client";

import Image from "next/image";
import { useState } from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import { API_BASE_URL } from "@/lib/adminApi";
import VisitOurStore from "../components/Visitourstore";
import ImageStrip from "../components/Imagestrip";

/* ------------------------------------------------------------------ */
/* Contact touchpoints — update numbers / address here.               */
/* ------------------------------------------------------------------ */
const contactItems = [
  {
    id: "showroom",
    icon: FaMapMarkerAlt,
    title: "Visit Our Showroom",
    lines: ["G-46, Unnati Tower, Sector 2, Central Spine, Vidhyadhar Nagar, Jaipur, Rajasthan, India"]
  },
  {
    id: "call",
    icon: FaPhoneAlt,
    title: "Call Us",
    lines: ["+91 94141 56451", "Speak Directly With Our Jewelry Experts"]
  },
  {
    id: "whatsapp",
    icon: FaWhatsapp,
    title: "WhatsApp Chat",
    lines: ["+91 94141 56451", "Quick Responses & Instant Assistance"]
  }
];

export default function ContactUs() {
  const [form, setForm] = useState({ name: "", mobile: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | submitted | error

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.mobile.trim()) return;

    setStatus("loading");

    const body = {
      name: form.name.trim(),
      phone: form.mobile.trim(),
    };

    const endpoints = [
      `${API_BASE_URL}/api/enquiries`,
      `https://vinayakjewellersjaipur.com/api/enquiries`,
    ];

    let success = false;
    for (const url of [...new Set(endpoints)]) {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (res.ok) { success = true; break; }
      } catch (_) { /* try next */ }
    }

    if (success) {
      setStatus("submitted");
      setForm({ name: "", mobile: "" });
    } else {
      setStatus("error");
    }
  };

  return (
    <section className="contact-section">
      <div className="contact-container">
        {/* Heading */}
        <h2 className="contact-heading">Contact Vinayak Jewellers</h2>
        <p className="contact-subheading">
          We&apos;re Here To Help You Find The Perfect Jewelry For Every Precious Moment. Get In Touch With
          Our Expert Team Today!
        </p>

        <div className="contact-grid">
          {/* Left column — Get In Touch */}
          <div className="contact-left">
            <h3 className="contact-col-title">Get In Touch</h3>

            <div className="contact-cards">
              {contactItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div className="contact-card" key={item.id}>
                    <div className="contact-icon-badge">
                      <Icon />
                    </div>
                    <div className="contact-card-body">
                      <h4 className="contact-card-title">{item.title}</h4>
                      {item.lines.map((line, index) => (
                        <p
                          className={
                            index === 0 ? "contact-card-line contact-card-line-primary" : "contact-card-line"
                          }
                          key={index}
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <span className="contact-divider" />

          {/* Right column — Enquiry form */}
          <div className="contact-right">
            <h3 className="contact-col-title">
              Searching For All
              <br />
              Jewellery?
            </h3>

            <p className="contact-form-intro">
              Our Specialists Are Here To Help You Select The Perfect Piece!
              <br />
              Our Expert Will Get In Touch With You Shortly!
            </p>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-field">
                <label htmlFor="contact-name" className="contact-label">
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder="Enter Your Name"
                  className="contact-input"
                  value={form.name}
                  onChange={handleChange("name")}
                  required
                />
              </div>

              <div className="contact-field">
                <label htmlFor="contact-mobile" className="contact-label">
                  Mobile/WhatsApp Number
                </label>
                <input
                  id="contact-mobile"
                  type="tel"
                  placeholder="Enter Your Mobile/WhatsApp Number"
                  className="contact-input"
                  value={form.mobile}
                  onChange={handleChange("mobile")}
                  required
                />
              </div>

              <button type="submit" className="contact-submit-btn" disabled={status === "loading"}>
                {status === "loading" ? "Sending…" : <>Send <span className="contact-submit-arrow">&rarr;</span></>}
              </button>

              {status === "submitted" && (
                <p className="contact-success-msg">✓ Thank you! Our team will reach out to you shortly.</p>
              )}
              {status === "error" && (
                <p className="contact-error-msg">Something went wrong. Please try again or call us directly.</p>
              )}
            </form>
          </div>
        </div>

        {/* Decorative floating logo badge (desktop only) */}
        {/* <Image
          src="/home/logo.png"
          alt="Vinayak Jewellers"
          width={56}
          height={56}
          className="contact-floating-logo"
        /> */}
      </div>
      <VisitOurStore />
      <ImageStrip />

      <style>{`
        .contact-section, .contact-section * {
          box-sizing: border-box;
        }

        .contact-section {
          position: relative;
          background: #FFF4DC;
          font-family: "Mona Sans", sans-serif;
          padding: 60px 0;
        }

        .contact-container {
          position: relative;
          max-width: 1400px;
          width: 100%;
          margin: 0 auto;
          padding: 0 32px;
        }

        /* ---------- Heading ---------- */
        .contact-heading {
          text-align: center;
          font-family: "Cinzel", serif;
          font-size: 30px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #140100;
          margin: 0 0 16px;
        }

        .contact-subheading {
          text-align: center;
          font-size: 14px;
          font-weight: 400;
          color: #3B2E1E;
          max-width: 760px;
          margin: 0 auto 56px;
          line-height: 1.6;
        }

        /* ---------- Grid ---------- */
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 48px;
          align-items: start;
        }

        .contact-divider {
          width: 1px;
          align-self: stretch;
          background: #3B2E1E;
        }

        .contact-col-title {
          font-family: "Cinzel", serif;
          font-size: 24px;
          font-weight: 500;
          text-transform: uppercase;
          color: #140100;
          margin: 0 0 28px;
          line-height: 1.3;
        }

        /* ---------- Left: contact cards ---------- */
        .contact-cards {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .contact-card {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          background: #FBEACC;
          border-radius: 20px;
          padding: 22px 24px;
        }

        .contact-icon-badge {
          width: 40px;
          height: 40px;
          border-radius: 999px;
          background: #3B2412;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
        }

        .contact-card-title {
          font-size: 15px;
          font-weight: 700;
          color: #140100;
          margin: 0 0 6px;
        }

        .contact-card-line {
          font-size: 14px;
          font-weight: 400;
          color: #3B2E1E;
          line-height: 1.6;
          margin: 0;
        }

        .contact-card-line-primary {
          margin-bottom: 4px;
        }

        /* ---------- Right: form ---------- */
        .contact-form-intro {
          font-size: 15px;
          font-weight: 400;
          color: #3B2E1E;
          line-height: 1.6;
          margin: 0 0 28px;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .contact-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .contact-label {
          font-size: 14px;
          font-weight: 500;
          color: #3B2E1E;
        }

        .contact-input {
          width: 100%;
          height: 52px;
          padding: 0 20px;
          border-radius: 999px;
          border: 1px solid rgba(59, 46, 30, 0.2);
          background: #FFFFFF;
          font-family: "Mona Sans", sans-serif;
          font-size: 14px;
          color: #140100;
        }

        .contact-input::placeholder {
          color: #9A8F80;
        }

        .contact-input:focus {
          outline: none;
          border-color: #BF9555;
        }

        .contact-submit-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: fit-content;
          padding: 14px 30px;
          border: none;
          border-radius: 999px;
          background: #3B2412;
          color: #FFFFFF;
          font-family: "Mona Sans", sans-serif;
          font-size: 15px;
          font-weight: 400;
          cursor: pointer;
          margin-top: 8px;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .contact-submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(59, 36, 18, 0.25);
        }

        .contact-submit-arrow {
          font-size: 15px;
        }

        .contact-success-msg {
          font-size: 14px;
          color: #2F7D4F;
          font-weight: 600;
          margin: 0;
        }

        .contact-error-msg {
          font-size: 14px;
          color: #c0392b;
          font-weight: 600;
          margin: 0;
        }

        .contact-submit-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        /* ---------- Decorative floating logo ---------- */
        .contact-floating-logo {
          position: absolute;
          top: 82%;
          right: 0;
          width: 56px;
          height: 56px;
          border-radius: 999px;
        }

        /* ====================== LAPTOP ====================== */
        @media (max-width: 1280px) {
          .contact-grid {
            gap: 32px;
          }
        }

        /* ====================== TABLET ====================== */
        @media (max-width: 1024px) {
          .contact-section {
            padding: 60px 0;
          }

          .contact-container {
            padding: 0 24px;
          }

          .contact-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .contact-divider {
            display: none;
          }

          .contact-floating-logo {
            display: none;
          }
        }

        /* ====================== MOBILE ====================== */
        @media (max-width: 768px) {
          .contact-section {
            padding: 50px 0;
          }

          .contact-container {
            padding: 0 20px;
          }

          .contact-heading {
            font-size: 22px;
            margin-bottom: 10px;
          }

          .contact-subheading {
            font-size: 13px;
            margin-bottom: 36px;
          }

          .contact-col-title {
            font-size: 20px;
            margin-bottom: 20px;
          }

          .contact-grid {
            gap: 36px;
          }

          .contact-card {
            padding: 18px;
            border-radius: 16px;
          }

          .contact-card-title {
            font-size: 15px;
          }

          .contact-card-line {
            font-size: 13px;
          }

          .contact-form-intro {
            font-size: 12px;
            margin-bottom: 20px;
          }

          .contact-input {
            height: 46px;
            font-size: 13px;
          }

          .contact-submit-btn {
            width: 100%;
            padding: 13px 20px;
            font-size: 14px;
          }
        }

        /* ====================== SMALL MOBILE ====================== */
        @media (max-width: 480px) {
          .contact-container {
            padding: 0 16px;
          }

          .contact-heading {
            font-size: 18px;
          }

          .contact-col-title {
            font-size: 17px;
          }
        }
      `}</style>
    </section>
  );
}