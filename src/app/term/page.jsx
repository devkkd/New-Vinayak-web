import Link from "next/link";
import ContactCTA from "../components/ContactCTA";
import VisitOurStore from "../components/Visitourstore";
import ImageStrip from "../components/Imagestrip";

export const metadata = {
  title: "Terms & Conditions | Vinayak Jewellers",
};

export default function TermsAndConditionsPage() {
  return (
    <main className="tc-root">
      {/* 1 — HERO (dark) */}
      <section className="tc-section tc-bg-a">
        <div className="tc-container tc-hero">
          <h1 className="tc-h1">Terms &amp; Conditions</h1>
          <p className="tc-lead">
            Welcome to <strong>Vinayak Jewellers</strong>. By accessing and
            using our website, you agree to abide by our terms and
            conditions outlined below. Please read them carefully before
            proceeding with any purchase or browsing our collections.
          </p>
        </div>
      </section>

      {/* 2 — GENERAL TERMS OF USE (light) */}
      <section className="tc-section tc-bg-b">
        <div className="tc-container">
          <h2 className="tc-h2 tc-center">General Terms of Use</h2>
          <p className="tc-para tc-center">
            By using our website, you acknowledge that you have read,
            understood, and agreed to our terms of use. Vinayak Jewellers
            reserves the right to update or modify these terms at any time
            without prior notice. Please revisit this page periodically to
            stay informed of any updates.
          </p>
          <div className="tc-grid">
            <div className="tc-card">
              <h3 className="tc-h3">Product Information</h3>
              <p className="tc-para">
                All products displayed on our website are handcrafted and
                may vary slightly in color, weight, or design. We ensure
                accuracy in descriptions, dimensions, and certifications
                for your confidence and satisfaction.
              </p>
            </div>
            <div className="tc-card">
              <h3 className="tc-h3">Pricing &amp; Availability</h3>
              <p className="tc-para">
                Prices are subject to real-time market fluctuations in
                gold, silver, and diamond rates. While we strive for
                precision, minor errors may occur. Vinayak Jewellers
                reserves the right to correct such discrepancies prior to
                order confirmation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 — ORDERS & PAYMENTS (dark) */}
      <section className="tc-section tc-bg-a">
        <div className="tc-container">
          <h2 className="tc-h2 tc-center">Orders &amp; Payments</h2>
          <div className="tc-grid">
            <div className="tc-card">
              <h3 className="tc-h3">Order Confirmation</h3>
              <p className="tc-para">
                Upon placing your order, a confirmation email or message
                will be sent to you. Orders are processed after successful
                payment verification. In case of unavailability, our team
                will promptly inform you and offer alternatives or a full
                refund.
              </p>
            </div>
            <div className="tc-card">
              <h3 className="tc-h3">Payment Security</h3>
              <p className="tc-para">
                Your online transactions are fully protected with encrypted
                gateways. We do not store your payment information. You can
                shop securely knowing your data is handled with the
                highest level of confidentiality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 — RETURNS, EXCHANGES & REPAIRS (light) */}
      <section className="tc-section tc-bg-b">
        <div className="tc-container">
          <h2 className="tc-h2 tc-center">Returns, Exchanges &amp; Repairs</h2>
          <p className="tc-para tc-center">
            We take pride in the craftsmanship of every piece. If you are
            not fully satisfied, exchanges or returns are accepted within 7
            days of purchase, provided the item is unused and accompanied
            by the original invoice. Custom-made or personalized items are
            non-returnable. For resizing or repairs, please visit our store
            or contact our support team.
          </p>
        </div>
      </section>

      {/* 5 — INTELLECTUAL PROPERTY (dark) */}
      <section className="tc-section tc-bg-a">
        <div className="tc-container">
          <h2 className="tc-h2 tc-center">Intellectual Property</h2>
          <p className="tc-para tc-center">
            All content, imagery, and designs featured on this website are
            the intellectual property of Vinayak Jewellers. Unauthorized
            reproduction, modification, or distribution in any form without
            prior written consent is strictly prohibited.
          </p>
        </div>
      </section>

      {/* 6 — CONTACT & LEGAL COMPLIANCE (light) */}
      <section className="tc-section tc-bg-b">
        <div className="tc-container">
          <h2 className="tc-h2 tc-center">Contact &amp; Legal Compliance</h2>
          <p className="tc-para tc-center">
            For clarifications or legal concerns related to these Terms
            &amp; Conditions, please connect with us through our{" "}
            <Link href="/contact" className="tc-link">
              contact page
            </Link>{" "}
            or visit our showroom at Vidhyadhar Nagar, Jaipur.
          </p>
          <p className="tc-para tc-center">
            By continuing to use this website, you accept these Terms &amp;
            Conditions along with our Privacy Policy.
          </p>
        </div>
      </section>
<ContactCTA />
<VisitOurStore />
<ImageStrip />
      <style >{`
        .tc-root {
          font-family: "Mona Sans", sans-serif;
          color: #5d2b17;
        }
        .tc-section {
          padding: 80px 24px;
        }
        .tc-bg-a {
          background: #fff4dc;
        }
        .tc-bg-b {
          background: #fff8ed;
        }
        .tc-container {
          max-width: 1100px;
          margin: 0 auto;
        }
        .tc-hero {
          text-align: center;
        }
        .tc-h1 {
          font-family: "Mona Sans", sans-serif;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 30px;
          letter-spacing: 1px;
          margin-bottom: 24px;
          color: #5d2b17;
        }
        .tc-lead {
          font-size: 16px;
          line-height: 1.7;
          max-width: 780px;
          margin: 0 auto;
          color: #6b4230;
        }
        .tc-h2 {
          font-size: 30px;
          font-weight: 600;
          margin-bottom: 28px;
          color: #5d2b17;
        }
        .tc-h3 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 14px;
          color: #5d2b17;
        }
        .tc-para {
          font-size: 16px;
          line-height: 1.75;
          color: #6b4230;
          max-width: 900px;
          margin-bottom: 16px;
        }
        .tc-para:last-child {
          margin-bottom: 0;
        }
        .tc-center {
          text-align: center;
          margin-left: auto;
          margin-right: auto;
        }
        .tc-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-top: 32px;
        }
        .tc-card {
          background: #fffdf6;
          border: 1px solid rgba(93, 43, 23, 0.1);
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 4px 14px rgba(93, 43, 23, 0.05);
        }
        .tc-link {
          color: #5d2b17;
          font-weight: 700;
          text-decoration: underline;
        }

        /* ---------- TABLET ---------- */
        @media (max-width: 900px) {
          .tc-section {
            padding: 56px 20px;
          }
          .tc-h1 {
            font-size: 40px;
          }
          .tc-h2 {
            font-size: 28px;
          }
          .tc-grid {
            grid-template-columns: 1fr;
          }
        }

        /* ---------- MOBILE ---------- */
        @media (max-width: 520px) {
          .tc-section {
            padding: 40px 16px;
          }
          .tc-h1 {
            font-size: 20px;
            letter-spacing: 0.5px;
          }
          .tc-lead {
            font-size: 14px;
            line-height: 1.6;
          }
          .tc-h2 {
            font-size: 20px;
            margin-bottom: 18px;
          }
          .tc-h3 {
            font-size: 16px;
          }
          .tc-para {
            font-size: 14px;
            line-height: 1.6;
          }
          .tc-card {
            padding: 20px;
            border-radius: 12px;
          }
        }
      `}</style>
    </main>
  );
}