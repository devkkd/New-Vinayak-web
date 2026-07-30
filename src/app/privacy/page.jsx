import Link from "next/link";
import ContactCTA from "../components/ContactCTA";
import VisitOurStore from "../components/Visitourstore";
import ImageStrip from "../components/Imagestrip";

export const metadata = {
  title: "Privacy Policy | Vinayak Jewellers",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="pp-root">
      {/* 1 — HERO */}
      <section className="pp-section pp-bg-a">
        <div className="pp-container pp-hero">
          <h1 className="pp-h1">Privacy Policy</h1>
          <p className="pp-lead">
            At <strong>Vinayak Jewellers</strong>, your privacy is of utmost
            importance to us. This policy outlines how we collect, use, and
            protect your personal information when you interact with our
            website or visit our store.
          </p>
        </div>
      </section>

      {/* 2 — INFORMATION WE COLLECT */}
      <section className="pp-section pp-bg-b">
        <div className="pp-container">
          <h2 className="pp-h2 pp-center">Information We Collect</h2>
          <p className="pp-para pp-center">
            We may collect personal details such as your name, contact
            information, billing address, and email when you make a
            purchase, sign up for our newsletter, or fill out a form. We
            also collect non-personal data like browser type, IP address,
            and browsing behavior to enhance user experience.
          </p>
        </div>
      </section>

      {/* 3 — HOW WE USE YOUR INFORMATION */}
      <section className="pp-section pp-bg-a">
        <div className="pp-container">
          <h2 className="pp-h2 pp-center">How We Use Your Information</h2>
          <div className="pp-grid">
            <div className="pp-card">
              <h3 className="pp-h3">To Enhance Experience</h3>
              <p className="pp-para">
                Your data helps us personalize your shopping experience,
                recommend relevant products, and provide seamless service.
                It also enables us to respond efficiently to your queries
                or requests.
              </p>
            </div>
            <div className="pp-card">
              <h3 className="pp-h3">To Improve Our Website</h3>
              <p className="pp-para">
                We analyze aggregated usage data to improve website
                functionality, navigation, and design, ensuring a smoother
                and more enjoyable browsing experience for every visitor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 — DATA PROTECTION & SECURITY */}
      <section className="pp-section pp-bg-b">
        <div className="pp-container">
          <h2 className="pp-h2 pp-center">Data Protection &amp; Security</h2>
          <div className="pp-grid">
            <div className="pp-card">
              <h3 className="pp-h3">Secure Transactions</h3>
              <p className="pp-para">
                We use encrypted payment gateways and secure data storage to
                safeguard your information. We never store sensitive
                details like credit or debit card numbers on our servers.
              </p>
            </div>
            <div className="pp-card">
              <h3 className="pp-h3">Third-Party Services</h3>
              <p className="pp-para">
                We may partner with trusted third-party providers for
                payment, analytics, or delivery services. These partners
                are bound by strict confidentiality and data protection
                agreements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5 — COOKIES & TRACKING TECHNOLOGIES */}
      <section className="pp-section pp-bg-a">
        <div className="pp-container">
          <h2 className="pp-h2 pp-center">Cookies &amp; Tracking Technologies</h2>
          <p className="pp-para pp-center">
            Our website uses cookies to enhance your browsing experience.
            Cookies help remember your preferences and track website
            analytics. You can disable cookies through your browser
            settings, though some features may not function properly
            without them.
          </p>
        </div>
      </section>

      {/* 6 — YOUR RIGHTS & CHOICES */}
      <section className="pp-section pp-bg-b">
        <div className="pp-container">
          <h2 className="pp-h2 pp-center">Your Rights &amp; Choices</h2>
          <p className="pp-para pp-center">
            You have full control over your personal data. You may request
            to view, modify, or delete your information at any time. To do
            so, please contact our support team through our Contact Page.
          </p>
        </div>
      </section>

      {/* 7 — POLICY UPDATES & CONTACT */}
      <section className="pp-section pp-bg-a">
        <div className="pp-container">
          <h2 className="pp-h2 pp-center">Policy Updates &amp; Contact</h2>
          <p className="pp-para pp-center">
            We may periodically update this Privacy Policy to reflect
            changes in our business practices or legal requirements. Any
            revisions will be posted here with an updated effective date.
          </p>
          <p className="pp-para pp-center">
            For questions, requests, or feedback regarding our policy,
            please reach out via our{" "}
            <Link href="/contact" className="pp-link">
              contact page
            </Link>{" "}
            or visit our showroom in Vidhyadhar Nagar, Jaipur.
          </p>
        </div>
      </section>
<ContactCTA />
<VisitOurStore />
<ImageStrip />
      <style >{`
        .pp-root {
          font-family: "Mona Sans", sans-serif;
          color: #5d2b17;
        }
        .pp-section {
          padding: 80px 24px;
        }
        .pp-bg-a {
          background: #fff4dc;
        }
        .pp-bg-b {
          background: #fff8ed;
        }
        .pp-container {
          max-width: 1100px;
          margin: 0 auto;
        }
        .pp-hero {
          text-align: center;
        }
        .pp-h1 {
          font-family: "Mona Sans", sans-serif;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 30px;
          letter-spacing: 1px;
          margin-bottom: 24px;
          color: #5d2b17;
        }
        .pp-lead {
          font-size: 16px;
          line-height: 1.7;
          max-width: 780px;
          margin: 0 auto;
          color: #6b4230;
        }
        .pp-h2 {
          font-size: 30px;
          font-weight: 700;
          margin-bottom: 28px;
          color: #5d2b17;
        }
        .pp-h3 {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 14px;
          color: #5d2b17;
        }
        .pp-para {
          font-size: 16px;
          line-height: 1.75;
          color: #6b4230;
          max-width: 900px;
        }
        .pp-center {
          text-align: center;
          margin-left: auto;
          margin-right: auto;
        }
        .pp-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        .pp-card {
          background: #fffdf6;
          border: 1px solid rgba(93, 43, 23, 0.1);
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 4px 14px rgba(93, 43, 23, 0.05);
        }
        .pp-link {
          color: #5d2b17;
          font-weight: 700;
          text-decoration: underline;
        }

        /* ---------- TABLET ---------- */
        @media (max-width: 900px) {
          .pp-section {
            padding: 56px 20px;
          }
          .pp-h1 {
            font-size: 30px;
          }
          .pp-h2 {
            font-size: 26px;
          }
          .pp-grid {
            grid-template-columns: 1fr;
          }
        }

        /* ---------- MOBILE ---------- */
        @media (max-width: 520px) {
          .pp-section {
            padding: 40px 16px;
          }
          .pp-h1 {
            font-size: 20px;
            letter-spacing: 0.5px;
          }
          .pp-lead {
            font-size: 14px;
            line-height: 1.6;
          }
          .pp-h2 {
            font-size: 20px;
            margin-bottom: 18px;
          }
          .pp-h3 {
            font-size: 16px;
          }
          .pp-para {
            font-size: 14px;
            line-height: 1.6;
          }
          .pp-card {
            padding: 20px;
            border-radius: 12px;
          }
        }
      `}</style>
    </main>
  );
}