"use client";

import React, { useState } from "react";
import VinayakAssurance from "../components/Vinayakassurance";
import VisitOurStore from "../components/Visitourstore";
import ImageStrip from "../components/Imagestrip";

/**
 * AboutVinayakPage
 * -----------------
 * Full About page: "Meet the Founder / Vinayak Assurance / Important Note /
 * Get in Touch" block followed by "About Vinayak Jewellers".
 *
 * STYLING: no inline `style={{}}` anywhere. Every visual value (colors,
 * spacing, type) lives in ONE <style jsx global> block at the bottom of
 * this file, inside the top-level <AboutVinayakPage /> component. All
 * sub-components just use plain className strings, which is why the CSS
 * is written with `jsx global` instead of scoped `jsx` — scoped styles in
 * styled-jsx only apply to the component that renders the <style> tag, and
 * we want one shared sheet usable by every section/component in this file.
 *
 * LAYOUT RULES (as requested):
 *  - Desktop: content max-width 1400px, side padding 32px, top padding 60px
 *  - Mobile (<= 768px): side padding 20px, and every size (type, spacing,
 *    icons, images, gaps) scaled down — see the `@media (max-width: 768px)`
 *    block at the end of the stylesheet.
 *
 * Image paths assume `public/about/` in your Next.js project:
 *   public/about/founder.png
 *   public/about/1.png -> heritage / Amber Fort shot
 *   public/about/2.png -> Vinayak showroom front
 *   public/about/3.png -> Hawa Mahal / Pink City shot
 *   public/about/4.png -> team photo
 *
 * Fonts: Cinzel (headings) + Mona Sans (body) — assumed already registered
 * globally (next/font or a <link> in _document), same as rest of the site.
 */

// ---- Shared bits ------------------------------------------------------------

function Eyebrow({ children }) {
  return (
    <div className="vj-eyebrow">
      <span className="vj-eyebrow-line" />
      <span className="vj-eyebrow-text">{children}</span>
      <span className="vj-eyebrow-line" />
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div className="vj-stat">
      <p className="vj-stat-value">{value}</p>
      <p className="vj-stat-label">{label}</p>
    </div>
  );
}

function Divider() {
  return <span className="vj-stat-divider" />;
}

// ---- SECTION 1: Meet the Founder --------------------------------------------

function FounderSection() {
  return (
    <section className="vj-section vj-section--bg">
      <div className="vj-container">
        <Eyebrow>Est. 2005 · Jaipur, Rajasthan</Eyebrow>

        <div className="vj-founder-grid">
          {/* Portrait */}
          <div className="vj-founder-portrait">
            <div className="vj-founder-portrait-img" />
            <div className="vj-founder-caption">
              <p className="vj-founder-name">Mr. Vinay Gupta</p>
              <p className="vj-founder-role">Founder &amp; Director, Vinayak Jewellers</p>
              <p className="vj-founder-address">Vidhyadhar Nagar, Jaipur · Est. 2005</p>
            </div>
          </div>

          {/* Copy */}
          <div>
            <h2 className="vj-heading-lg">Meet the Founder</h2>
            <span className="vj-title-underline" />

            <p className="vj-body vj-mb-md">
              Founded in <strong className="vj-strong">2005</strong>, Vinayak
              Jewellers was built on a single belief — that every family deserves
              jewellery they can trust. Starting from a humble showroom in Vidhyadhar
              Nagar, Jaipur, the founder&apos;s vision was to blend Rajasthan&apos;s rich
              jewellery heritage with modern craftsmanship and complete transparency.
            </p>
            <p className="vj-body vj-mb-lg">
              Over two decades, that vision has grown into one of Jaipur&apos;s most
              trusted names in gold, diamond, and silver jewellery — serving
              thousands of families with hallmark certified pieces and honest
              pricing.
            </p>

            <blockquote className="vj-quote">
              &quot;We don&apos;t just sell jewellery — we earn trust, one family at a time.&quot;
            </blockquote>

            <div className="vj-stats-row">
              <Stat value="20+" label="Years of Trust" />
              <Divider />
              <Stat value="10K+" label="Happy Families" />
              <Divider />
              <Stat value="100%" label="Hallmark Certified" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---- SECTION 2: Vinayak Assurance -------------------------------------------

const assurances = [
  { icon: "💎", title: "100% Certified", desc: "Hallmark verified gold & diamonds" },
  { icon: "🛡️", title: "Lifetime Trust", desc: "Buyback & exchange guarantee" },
  { icon: "✨", title: "Pure Quality", desc: "BIS hallmarked purity always" },
  { icon: "🤝", title: "Honest Pricing", desc: "Transparent making charges" },
  { icon: "🎁", title: "Custom Design", desc: "Bespoke pieces made to order" },
];

function AssuranceSection() {
  return (
    <section className="vj-section vj-section--bg">
      <div className="vj-container vj-text-center">
        <h2 className="vj-heading-md">Vinayak Assurance</h2>
        <p className="vj-body vj-mb-xl">Designed with precision, treasured by you.</p>

        <div className="vj-assurance-grid">
          {assurances.map((a) => (
            <div key={a.title} className="vj-assurance-item">
              <div className="vj-assurance-icon">
                <span>{a.icon}</span>
              </div>
              <p className="vj-assurance-title">{a.title}</p>
              <p className="vj-assurance-desc">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- SECTION 3: Important Note ----------------------------------------------

function ImportantNoteSection() {
  return (
    <section className="vj-section vj-section--bg-secondary">
      <div className="vj-container">
        <div className="vj-note-box">
          <div className="vj-note-icon">!</div>
          <h3 className="vj-heading-sm vj-text-center">Important Note</h3>
          <p className="vj-body vj-text-center vj-mb-lg">
            We want to inform our valued customers that Vinayak Jewellers currently
            operates from{" "}
            <strong className="vj-strong">
              a single, authorized showroom located in Vidhyadhar Nagar, Jaipur
            </strong>
            . We do not have any other branches or outlets. To ensure you receive
            genuine products and authentic Vinayak Jewellers service, please visit
            us only at our official address.
          </p>
          <span className="vj-note-divider" />
          <p className="vj-note-address">
            📍 <strong className="vj-strong">Our Only Address:</strong> G-46, Unnati
            Tower, Sector 2, Central Spine, Vidhyadhar Nagar, Jaipur, Rajasthan
          </p>
        </div>
      </div>
    </section>
  );
}

// ---- SECTION 4: Get in Touch form -------------------------------------------

function GetInTouchSection() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    // Wire this up to your lead-capture API route.
    console.log({ name, mobile });
  }

  return (
    <section className="vj-section vj-section--bg">
      <div className="vj-container">
        <div className="vj-cta-box">
          <h3 className="vj-heading-md vj-cta-title">Searching for All Jewellery?</h3>
          <p className="vj-cta-sub">Our specialists are here to help you select the perfect piece!</p>
          <p className="vj-cta-sub vj-mb-xl">Our expert will get in touch with you shortly!</p>

          <form onSubmit={handleSubmit} className="vj-cta-form">
            <div className="vj-field">
              <label className="vj-field-label">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Your Name"
                className="vj-input"
              />
            </div>
            <div className="vj-field">
              <label className="vj-field-label">Mobile/WhatsApp Number</label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter Your Mobile/WhatsApp Number"
                className="vj-input"
              />
            </div>
            <button type="submit" className="vj-cta-btn">
              Get In Touch →
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

// ---- SECTION 5: About Vinayak Jewellers -------------------------------------

const qualityPoints = [
  {
    title: "Hallmark & Certified Excellence",
    desc: "Every piece of jewelry at Vinayak Jewellers comes with proper hallmarking and certification, ensuring you receive only authentic, high-quality products.",
  },
  {
    title: "Curated Collections",
    desc: "Our exclusive collections are carefully selected and crafted to meet the diverse tastes of modern jewelry enthusiasts while honoring traditional craftsmanship techniques.",
  },
];

const differentiators = [
  { title: "Expert Craftsmanship", desc: "Skilled artisans combine time-honored techniques with contemporary design for pieces that are timeless and trendy." },
  { title: "Diverse Range", desc: "From traditional gold to contemporary diamond and silver collections, we cater to every occasion and budget." },
  { title: "Personal Service", desc: "Every customer is family. We take time to understand your preferences to find the perfect piece." },
  { title: "Trust & Transparency", desc: "With certifications, clear pricing, and honest advice, we maintain integrity and customer satisfaction." },
];

function AboutVinayakSection() {
  return (
    <section className="vj-section vj-section--bg">
      <div className="vj-container">
        <h2 className="vj-heading-md vj-text-center vj-mb-2xl">About Vinayak Jewellers</h2>

        {/* Row 1: Heritage text + image 1 */}
        <div className="vj-row vj-mb-2xl">
          <div>
            <h3 className="vj-heading-sm">Our Heritage of Trust and Excellence</h3>
            <p className="vj-body">
              Located in the heart of Vidhyadhar Nagar, Jaipur, Vinayak Jewellers
              has been a beacon of trust and craftsmanship in the world of fine
              jewelry. Our journey began with a simple yet profound vision: to
              create exquisite jewelry pieces that celebrate life&apos;s most precious
              moments while upholding the highest standards of quality and
              authenticity.
            </p>
          </div>
          <img src="/about/1.png" alt="Amber Fort, Jaipur — heritage of Vinayak Jewellers" className="vj-row-img" />
        </div>

        {/* Row 2: image 2 + Vinayak Promise text */}
        <div className="vj-row vj-row--reverse vj-mb-2xl">
          <img src="/about/2.png" alt="Vinayak Jewellers showroom front" className="vj-row-img vj-order-2-mobile" />
          <div className="vj-order-1-mobile">
            <h3 className="vj-heading-sm">The Vinayak Promise</h3>
            <p className="vj-body">
              At Vinayak Jewellers, we understand that jewelry is more than mere
              adornment — it&apos;s a symbol of love, tradition, and personal
              expression. Each piece in our collection tells a story, whether it&apos;s
              a delicate gold chain passed down through generations, a sparkling
              diamond engagement ring marking a new beginning, or a stunning
              silver bracelet celebrating personal achievement.
            </p>
          </div>
        </div>

        {/* Commitment to Quality band */}
        <div className="vj-quality-band">
          <h3 className="vj-heading-sm vj-text-center vj-mb-xl">Our Commitment to Quality</h3>
          <div className="vj-quality-grid">
            {qualityPoints.map((q, i) => (
              <div key={q.title} className={i > 0 ? "vj-quality-item vj-quality-item--bordered" : "vj-quality-item"}>
                <p className="vj-quality-title">{q.title}</p>
                <p className="vj-quality-desc">{q.desc}</p>
              </div>
            ))}
          </div>

          <h4 className="vj-eyebrow-heading vj-text-center">What Sets Us Apart</h4>
          <div className="vj-features-grid">
            {differentiators.map((item, i) => (
              <div key={item.title} className={i > 0 ? "vj-feature vj-feature--bordered" : "vj-feature"}>
                <p className="vj-feature-title">{item.title}</p>
                <p className="vj-feature-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Row 3: Pink City text + image 3 */}
        <div className="vj-row vj-mb-2xl">
          <div>
            <h3 className="vj-heading-sm">Located in the Pink City</h3>
            <p className="vj-body">
              Situated in Vidhyadhar Nagar, one of Jaipur&apos;s well-planned
              residential areas, our showroom offers a comfortable and welcoming
              environment where you can explore our collections at your own pace.
              The location reflects our commitment to being accessible to the
              community we serve.
            </p>
          </div>
          <img src="/about/3.png" alt="Hawa Mahal, Pink City Jaipur" className="vj-row-img" />
        </div>

        {/* Row 4: image 4 + Vision Forward text */}
        <div className="vj-row vj-row--reverse">
          <img src="/about/4.png" alt="Vinayak Jewellers team" className="vj-row-img vj-order-2-mobile" />
          <div className="vj-order-1-mobile">
            <h3 className="vj-heading-sm">Our Vision Forward</h3>
            <p className="vj-body vj-mb-md">
              As we continue to grow, Vinayak Jewellers remains committed to
              evolving with our customers&apos; changing needs while preserving the
              values that have defined us from the beginning: quality,
              authenticity, and exceptional service.
            </p>
            <p className="vj-body">
              At Vinayak Jewellers, we don&apos;t just sell jewelry — we help you
              celebrate life&apos;s beautiful moments with pieces as unique and
              precious as the memories they represent.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---- Page composition --------------------------------------------------------

export default function AboutVinayakPage() {
  return (
    <main className="vj-about-page">
      <AboutVinayakSection />
      <FounderSection />
      <VinayakAssurance />
      <ImportantNoteSection />
      <GetInTouchSection />
      <VisitOurStore />
      <ImageStrip />

      {/* ---------------------------------------------------------------
          SINGLE STYLESHEET — every color/spacing/type value used above
          lives here. `jsx global` so it applies to all sub-components in
          this file (styled-jsx scopes styles to the component that emits
          the <style> tag by default; `global` removes that scoping).
      --------------------------------------------------------------- */}
      <style jsx global>{`
        .vj-about-page {
          --vj-bg: #fff4dc;
          --vj-bg-secondary: #fff6e0;
          --vj-card: #fff6e0;
          --vj-brown: #61311e;
          --vj-heading: #5a2f18;
          --vj-text: #6c4a37;
          --vj-border: #bf9555;
          --vj-light-border: rgba(104, 31, 0, 0.15);
          --vj-font-heading: "Cinzel", serif;
          --vj-font-body: "Mona Sans", sans-serif;

          /* layout tokens */
          --vj-max-width: 1400px;
          --vj-pad-x: 32px;
          --vj-pad-top: 60px;
          --vj-pad-bottom: 60px;

          background-color: var(--vj-bg);
        }

        /* ---------- layout primitives ---------- */
        .vj-section {
          width: 100%;
        }
        .vj-section--bg {
          background-color: var(--vj-bg);
        }
       .vj-section--bg-secondary {
  background-color: #FFEAC5;
}
        .vj-container {
          max-width: var(--vj-max-width);
          margin: 0 auto;
          padding: var(--vj-pad-top) var(--vj-pad-x) var(--vj-pad-bottom);
        }
        .vj-text-center {
          text-align: center;
        }

        /* ---------- typography ---------- */
        .vj-heading-lg {
          font-family: var(--vj-font-heading);
          color: var(--vj-heading);
          font-size: 2.25rem;
          text-transform: uppercase;
          line-height: 1.2;
          margin: 0 0 12px;
        }
        .vj-heading-md {
          font-family: var(--vj-font-heading);
          color: var(--vj-heading);
          font-size: 1.875rem;
             text-transform: uppercase;
          line-height: 1.25;
          margin: 0 0 8px;
        }
        .vj-heading-sm {
          font-family: var(--vj-font-heading);
          color: var(--vj-heading);
          font-size: 1.375rem;
             text-transform: uppercase;
          line-height: 1.3;
          margin: 0 0 16px;
        }
        .vj-eyebrow-heading {
          font-family: var(--vj-font-heading);
          color: var(--vj-heading);
          font-size: 1.375rem;
             text-transform: uppercase;
          letter-spacing: 1.3;
          text-transform: uppercase;
          margin: 0 0 32px;
        }
        .vj-body {
          font-family: var(--vj-font-body);
          color: var(--vj-text);
          font-size: 1rem;
          line-height: 1.7;
          margin: 0;
        }
        .vj-strong {
          color: var(--vj-heading);
        }
        .vj-title-underline {
          display: block;
          width: 356px;
          height: 3px;
          background-color: var(--vj-border);
          margin: 0 0 24px;
        }
        .vj-mb-md { margin-bottom: 16px; }
        .vj-mb-lg { margin-bottom: 24px; }
        .vj-mb-xl { margin-bottom: 40px; }
        .vj-mb-2xl { margin-bottom: 56px; }

        /* ---------- eyebrow ---------- */
        .vj-eyebrow {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          color: var(--vj-border);
          margin-bottom: 40px;
        }
        .vj-eyebrow-line {
          height: 1px;
          width: 40px;
          background-color: var(--vj-border);
        }
        .vj-eyebrow-text {
          font-family: var(--vj-font-body);
          font-size: 11px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          font-weight: 600;
        }

        /* ---------- founder section ---------- */
        .vj-founder-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 154px;
          align-items: center;
        }
        .vj-founder-portrait {
          position: relative;
          width: 100%;
          max-width: 620px;
          margin: 0 auto;
          border-radius: 6px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        }
        .vj-founder-portrait-img {
          aspect-ratio: 3 / 3;
          width: 100%;
          background-size: cover;
          background-position: center;
          background-image: linear-gradient(
              to top,
              rgba(59, 36, 18, 0.92),
              rgba(59, 36, 18, 0.05)
            ),
            url("/about/founder.png");
        }
        .vj-founder-caption {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 20px;
          color: #ffffff;
        }
        .vj-founder-name {
          font-family: var(--vj-font-heading);
          font-size: 1.125rem;
          margin: 0;
        }
        .vj-founder-role {
          font-family: var(--vj-font-body);
          font-size: 0.875rem;
          opacity: 0.9;
          margin: 2px 0 0;
        }
        .vj-founder-address {
          font-family: var(--vj-font-body);
          font-size: 0.75rem;
          opacity: 0.75;
          margin: 2px 0 0;
        }
        .vj-quote {
          font-family: var(--vj-font-heading);
          font-size: 1rem;
          font-style: italic;
          text-transform: uppercase;
          color: var(--vj-heading);
          background-color: #ffeac5;
          border-left: 4px solid var(--vj-border);
          border-radius: 0 6px 6px 0;
          padding: 16px 20px;
          margin: 0 0 32px;
        }
        .vj-stats-row {
          display: flex;
          align-items: center;
          gap: 32px;
          flex-wrap: wrap;
        }
        .vj-stat-value {
          font-family: var(--vj-font-heading);
          color: var(--vj-heading);
          font-size: 1.75rem;
          margin: 0;
        }
        .vj-stat-label {
          font-family: var(--vj-font-body);
          color: var(--vj-text);
          font-size: 11px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin: 4px 0 0;
        }
        .vj-stat-divider {
          height: 32px;
          width: 1px;
          background-color: var(--vj-light-border);
        }

       
        /* ---------- important note ---------- */
        .vj-note-box {
          max-width: 900px;
          margin: 0 auto;
          border-radius: 12px;
          padding: 40px 64px;
          background-color: var(--vj-card);
          border: 1px solid var(--vj-light-border);
        }
        .vj-note-icon {
          width: 44px;
          height: 44px;
          margin: 0 auto 16px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--vj-font-body);
          font-weight: 600;
          font-size: 1.125rem;
          color: var(--vj-brown);
          border: 1px solid var(--vj-brown);
        }
        .vj-note-divider {
          display: block;
          width: 100%;
          height: 1px;
          margin: 0 0 24px;
          background-color: var(--vj-light-border);
        }
        .vj-note-address {
          font-family: var(--vj-font-body);
          font-size: 0.875rem;
          color: var(--vj-heading);
          margin: 0;
          text-align: center;
        }

        /* ---------- get in touch ---------- */
        .vj-cta-box {
          max-width: var(--vj-max-width);
          margin: 0 auto;
          border-radius: 16px;
          padding: 48px 64px;
          text-align: center;
          background: linear-gradient(180deg, var(--vj-brown), #2a150c);
        }
        .vj-cta-title {
          color: #ffffff;
          margin: 0 0 12px;
        }
        .vj-cta-sub {
          font-family: var(--vj-font-body);
          color: rgba(255, 255, 255, 0.85);
          font-size: 1rem;
          margin: 0 0 px;
        }
        .vj-cta-form {
          display: flex;
          flex-direction: row;
          align-items: flex-end;
          gap: 16px;
          max-width: 720px;
          margin: 0 auto;
          text-align: left;
        }
        .vj-field {
          flex: 1;
        }
        .vj-field-label {
          display: block;
          font-family: var(--vj-font-body);
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 4px;
        }
        .vj-input {
          width: 100%;
          border-radius: 8px;
          padding: 12px 16px;
          font-size: 0.875rem;
          font-family: var(--vj-font-body);
          background-color: #ffffff;
          color: var(--vj-heading);
          outline: none;
          border: none;
        }
        .vj-cta-btn {
          border-radius: 999px;
          padding: 12px 24px;
          font-size: 0.875rem;
          font-weight: 600;
          font-family: var(--vj-font-body);
          background-color: var(--vj-card);
          color: var(--vj-brown);
          white-space: nowrap;
          border: none;
          cursor: pointer;
        }

        /* ---------- about vinayak rows ---------- */
        .vj-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: center;
        }
        .vj-row-img {
          width: 100%;
          height: 288px;
          object-fit: cover;
          border-radius: 6px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        }

        /* ---------- quality band ---------- */
        .vj-quality-band {
          border-radius: 16px;
          padding: 48px 0px;
          margin-bottom: 56px;
          background-color: var(--vj-bg-secondary);
        }
        .vj-quality-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          margin-bottom: 40px;
        }
        .vj-quality-item--bordered {
          padding-left: 64px;
          border-left: 1px solid var(--vj-light-border);
        }
        .vj-quality-title {
          font-family: var(--vj-font-body);
          font-weight: 600;
          color: var(--vj-heading);
          margin: 0 0 8px;
        }
        .vj-quality-desc {
          font-family: var(--vj-font-body);
          font-size: 0.875rem;
          line-height: 1.6;
          color: var(--vj-text);
          margin: 0;
        }
        .vj-features-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 32px;
        }
        .vj-feature--bordered {
          padding-left: 24px;
          border-left: 1px solid var(--vj-light-border);
        }
        .vj-feature-title {
          font-family: var(--vj-font-body);
          font-weight: 600;
          font-size: 0.875rem;
          color: var(--vj-heading);
          margin: 0 0 8px;
        }
        .vj-feature-desc {
          font-family: var(--vj-font-body);
          font-size: 0.875rem;
          line-height: 1.6;
          color: var(--vj-text);
          margin: 0;
        }

        /* =====================================================
           MOBILE — everything scaled down, side padding 20px
           ===================================================== */
        @media (max-width: 768px) {
          .vj-about-page {
            --vj-pad-x: 20px;
            --vj-pad-top: 40px;
            --vj-pad-bottom: 40px;
          }

  .vj-feature:nth-child(3){
    border-left: none !important;
    padding-left: 0 !important;
  }

          .vj-heading-lg { font-size: 1.625rem; margin-bottom: 8px; }
          .vj-heading-md { font-size: 1.375rem; margin-bottom: 6px; }
          .vj-heading-sm { font-size: 1.125rem; margin-bottom: 10px; }
          .vj-eyebrow-heading { font-size: 0.75rem; letter-spacing: 0.15em; margin-bottom: 20px; }
          .vj-body { font-size: 0.875rem; line-height: 1.6; }
          .vj-title-underline { width: 260px; height: 2px; margin-bottom: 16px; }
          .vj-mb-md { margin-bottom: 12px; }
          .vj-mb-lg { margin-bottom: 16px; }
          .vj-mb-xl { margin-bottom: 24px; }
          .vj-mb-2xl { margin-bottom: 32px; }

          .vj-eyebrow { gap: 8px; margin-bottom: 8px; }
          .vj-eyebrow-line { width: 24px; }
          .vj-eyebrow-text { font-size: 9px; letter-spacing: 0.18em; }

          .vj-founder-grid { grid-template-columns: 1fr; gap: 32px; }
          .vj-founder-portrait { max-width: 320px; }
          .vj-founder-caption { padding: 14px; }
          .vj-founder-name { font-size: 1rem; }
          .vj-founder-role { font-size: 0.75rem; }
          .vj-founder-address { font-size: 0.6875rem; }

          .vj-quote { font-size: 0.875rem; padding: 12px 16px; margin-bottom: 20px; }

          .vj-stats-row { gap: 20px; }
          .vj-stat-value { font-size: 1.375rem; }
          .vj-stat-label { font-size: 9px; }
          .vj-stat-divider { height: 24px; }

          .vj-assurance-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
          .vj-assurance-icon { width: 44px; height: 44px; font-size: 1rem; margin-bottom: 8px; }
          .vj-assurance-title { font-size: 0.75rem; }
          .vj-assurance-desc { font-size: 0.6875rem; }

          .vj-note-box { padding: 24px 20px; border-radius: 10px; }
          .vj-note-icon { width: 36px; height: 36px; font-size: 1rem; margin-bottom: 12px; }
          .vj-note-divider { margin-bottom: 16px; }
          .vj-note-address { font-size: 0.8125rem; }

          .vj-cta-box { padding: 28px 20px; border-radius: 12px; }
          .vj-cta-sub { font-size: 0.875rem; }
          .vj-cta-form { flex-direction: column; align-items: stretch; gap: 12px; }
          .vj-input { padding: 10px 14px; font-size: 0.8125rem; }
          .vj-cta-btn { padding: 10px 20px; font-size: 0.8125rem; width: 100%; }

          .vj-row { grid-template-columns: 1fr; gap: 16px; }
          .vj-row-img { height: 200px; }
          .vj-order-1-mobile { order: 1; }
          .vj-order-2-mobile { order: 2; }

          .vj-quality-band { padding: 24px 20px; border-radius: 12px; margin-bottom: 32px; }
          .vj-quality-grid { grid-template-columns: 1fr; gap: 20px; margin-bottom: 24px; }
          .vj-quality-item--bordered { padding-left: 0; border-left: none; border-top: 1px solid var(--vj-light-border); padding-top: 20px; }
          .vj-quality-title { font-size: 0.9375rem; margin-bottom: 4px; }
          .vj-quality-desc { font-size: 0.8125rem; }

          .vj-features-grid { grid-template-columns: 1fr 1fr; gap: 16px; }
          .vj-feature--bordered { padding-left: 12px; }
          .vj-feature-title { font-size: 0.8125rem; margin-bottom: 4px; }
          .vj-feature-desc { font-size: 0.75rem; }
        }
      `}</style>
    </main>
  );
}