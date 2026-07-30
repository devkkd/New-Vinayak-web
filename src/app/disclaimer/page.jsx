import Link from "next/link";
import ContactCTA from "../components/ContactCTA";
import VisitOurStore from "../components/Visitourstore";
import ImageStrip from "../components/Imagestrip";

export const metadata = {
  title: "Disclaimer | Vinayak Jewellers",
};

export default function DisclaimerPage() {
  return (
    <main className="dc-root">
      {/* 1 — HERO (dark) */}
      <section className="dc-section dc-bg-a">
        <div className="dc-container dc-hero">
          <h1 className="dc-h1">Disclaimer</h1>
          <p className="dc-lead">
            Welcome to Vinayak Jewellers. The following disclaimer outlines
            the limitations of liability and use of information on our
            website.
          </p>
        </div>
      </section>

      {/* 2 — ACCURACY OF INFORMATION (light) */}
      <section className="dc-section dc-bg-b">
        <div className="dc-container">
          <h2 className="dc-h2">Accuracy of Information</h2>
          <p className="dc-para">
            While we make every effort to ensure that the details on our
            website are accurate and up to date, occasional discrepancies
            may occur. Product images, descriptions, and pricing are
            subject to change without prior notice. We are not liable for
            any typographical or data errors.
          </p>
        </div>
      </section>

      {/* 3 — LIMITATION OF LIABILITY (dark) */}
      <section className="dc-section dc-bg-a">
        <div className="dc-container">
          <h2 className="dc-h2">Limitation of Liability</h2>
          <p className="dc-para">
            Vinayak Jewellers shall not be held responsible for any direct,
            indirect, incidental, or consequential damages arising from the
            use of this website or reliance on any information provided
            herein. All purchases made are subject to our{" "}
            <Link href="/term" className="dc-link">
              Terms &amp; Conditions
            </Link>
            .
          </p>
        </div>
      </section>

      {/* 4 — EXTERNAL LINKS (light) */}
      <section className="dc-section dc-bg-b">
        <div className="dc-container">
          <h2 className="dc-h2">External Links</h2>
          <p className="dc-para">
            Our website may contain links to external sites for your
            convenience. Vinayak Jewellers does not endorse, control, or
            assume responsibility for the content or policies of these
            third-party websites. We encourage users to review their
            respective privacy policies and disclaimers.
          </p>
        </div>
      </section>

      {/* 5 — COPYRIGHT NOTICE (dark) */}
      <section className="dc-section dc-bg-a">
        <div className="dc-container">
          <h2 className="dc-h2">Copyright Notice</h2>
          <p className="dc-para">
            All content, including text, graphics, logos, and product
            images on this website, are the property of Vinayak Jewellers
            unless otherwise stated. Unauthorized reproduction or
            distribution is prohibited and may result in legal action.
          </p>
        </div>
      </section>

      {/* 6 — CONTACT & CLARIFICATIONS (light) */}
      <section className="dc-section dc-bg-b">
        <div className="dc-container dc-hero">
          <h2 className="dc-h2">Contact &amp; Clarifications</h2>
          <p className="dc-para dc-center">
            For any concerns or clarifications regarding this disclaimer,
            please reach out through our{" "}
            <Link href="/contact" className="dc-link">
              Contact Page
            </Link>{" "}
            or visit our showroom in Vidhyadhar Nagar, Jaipur.
          </p>
        </div>
      </section>
<ContactCTA />
<VisitOurStore />
<ImageStrip />
      <style >{`
        .dc-root {
          font-family: "Mona Sans", sans-serif;
          color: #5d2b17;
        }
        .dc-section {
          padding: 80px 24px;
        }
        .dc-bg-a {
          background: #fff4dc;
        }
        .dc-bg-b {
          background: #fff8ed;
        }
        .dc-container {
          max-width: 1100px;
          margin: 0 auto;
        }
        .dc-hero {
          text-align: center;
        }
        .dc-h1 {
          font-family: "Mona Sans", sans-serif;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 30px;
          letter-spacing: 1px;
          margin-bottom: 24px;
          color: #5d2b17;
        }
        .dc-lead {
          font-size: 16px;
          line-height: 1.7;
          max-width: 780px;
          margin: 0 auto;
          color: #6b4230;
        }
        .dc-h2 {
          font-size: 30px;
          font-weight: 700;
          margin-bottom: 28px;
          color: #5d2b17;
        }
        .dc-para {
          font-size: 16px;
          line-height: 1.75;
          color: #6b4230;
          max-width: 900px;
        }
        .dc-center {
          text-align: center;
          margin-left: auto;
          margin-right: auto;
        }
        .dc-link {
          color: #5d2b17;
          font-weight: 700;
          text-decoration: underline;
        }

        /* ---------- TABLET ---------- */
        @media (max-width: 900px) {
          .dc-section {
            padding: 56px 20px;
          }
          .dc-h1 {
            font-size: 40px;
          }
          .dc-h2 {
            font-size: 28px;
          }
        }

        /* ---------- MOBILE ---------- */
        @media (max-width: 520px) {
          .dc-section {
            padding: 40px 16px;
          }
          .dc-h1 {
            font-size: 22px;
            letter-spacing: 0.5px;
          }
          .dc-lead {
            font-size: 14px;
            line-height: 1.6;
          }
          .dc-h2 {
            font-size: 20px;
            margin-bottom: 18px;
          }
          .dc-para {
            font-size: 14px;
            line-height: 1.6;
          }
        }
      `}</style>
    </main>
  );
}