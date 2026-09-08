"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaPinterestP,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  const [openSection, setOpenSection] = useState("");

  return (
    <footer className="ftr-root">
      {/* Footer Main */}
      <section className="ftr-main">
        <div className="ftr-container">
          <div className="ftr-grid">
            {/* Brand Column */}
            <div className="ftr-brand-col">
              <Image
                src="/logo1.png"
                alt="Vinayak Jewellers"
                width={260}
                height={110}
                className="ftr-logo"
              />

              <p className="ftr-brand-desc">
                Crafting timeless elegance with exquisite jewellery collections.
                Your trusted destination for gold, diamond, and silver ornaments.
              </p>

              <h5 className="ftr-follow-title">Follow Us</h5>

              <div className="ftr-social-icons">
                <a href="#"><FaInstagram /></a>
                <a href="#"><FaFacebookF /></a>
                <a href="#"><FaYoutube /></a>
                <a href="#"><FaPinterestP /></a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="ftr-col">
              <h5>Quick Links</h5>
              <ul>
                <li><Link href="/">→ Home</Link></li>
                <li><Link href="/about">→ About Us</Link></li>
                <li><Link href="/collections">→ Collections</Link></li>
                <li><Link href="/contact">→ Contact Us</Link></li>
                <li><Link href="/enquiry-cart">→ Enquiry Cart</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
           <div className="ftr-col">
  <h5>Contact Info</h5>

  <div className="ftr-info-item">
    <FaMapMarkerAlt className="ftr-info-icon" />

    <div>
      <strong>Address</strong>

      <p>
        Vinayak Jewellers G-46, Unnati Tower,
        Sector 2, Central Spine,
        Vidyadhar Nagar,
        Jaipur, Rajasthan 302039
      </p>
    </div>
  </div>

  <div className="ftr-info-item">
    <FaPhoneAlt className="ftr-info-icon" />

    <div>
      <strong>Phone</strong>

      <p>
        +91 9414156451
        <br />
        0141-2337548
      </p>
    </div>
  </div>

  <div className="ftr-info-item">
    <FaEnvelope className="ftr-info-icon" />

    <div>
      <strong>Email</strong>

      <p>info@vinayakjewellers.com</p>
    </div>
  </div>

</div>

            {/* Legal + Buttons */}
            <div className="ftr-col">
              <h5>Legal</h5>
              <ul>
             <li>
  <Link href="/term">→ Terms & Conditions</Link>
</li>

<li>
  <Link href="/privacy">→ Privacy Policy</Link>
</li>

<li>
  <Link href="/disclaimer">→ Disclaimer</Link>
</li>
              </ul>

              <Link
                href="/contact"
                className="ftr-enquire-btn"
                style={{
                  width: "100%",
                  height: "46px",
                  marginTop: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#61311e",
                  color: "#fff",
                  borderRadius: "16px",
                  textDecoration: "none",
                  fontSize: "16px",
                  fontWeight: "500",
                  border: "none"
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#4f2818"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#61311e"; }}
              >
                Enquire Now
              </Link>

              {/* <Link
                href="/admin"
                className="ftr-admin-btn"
                style={{
                  width: "100%",
                  height: "46px",
                  marginTop: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#fff6e0",
                  color: "#61311e",
                  border: "2px solid #bf9555",
                  borderRadius: "16px",
                  textDecoration: "none",
                  fontSize: "16px",
                  fontWeight: "500"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "#61311e";
                  e.currentTarget.style.color = "#fff";
                  e.currentTarget.style.borderColor = "#61311e";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "#fff6e0";
                  e.currentTarget.style.color = "#61311e";
                  e.currentTarget.style.borderColor = "#bf9555";
                }}
              >
                Admin Login
              </Link> */}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Brand */}
      <div className="ftr-mobile-brand">
        <Image
          src="/logo1.png"
          alt="Vinayak Jewellers"
          width={260}
          height={130}
          className="ftr-logo"
        />
        <p className="ftr-brand-desc">
          Crafting timeless elegance with exquisite jewellery collections. Your
          trusted destination for gold, diamond, and silver ornaments.
        </p>
      </div>

      {/* Mobile Footer */}
      <div className="ftr-mobile-footer">
        {/* Quick Links Accordion */}
        <div className="ftr-accordion-item">
          <button
            className="ftr-accordion-btn"
            onClick={() => setOpenSection(openSection === "quick" ? "" : "quick")}
          >
            <span>Quick Links</span>
            <span>{openSection === "quick" ? "−" : "+"}</span>
          </button>
          {openSection === "quick" && (
            <div className="ftr-accordion-content">
              <ul>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/about">About Us</Link></li>
                <li><Link href="/collections">Collections</Link></li>
                <li><Link href="/contact">Contact Us</Link></li>
                <li><Link href="/enquiry-cart">Enquiry Cart</Link></li>
              </ul>
            </div>
          )}
        </div>

        {/* Contact Accordion */}
        <div className="ftr-accordion-item">
          <button
            className="ftr-accordion-btn"
            onClick={() => setOpenSection(openSection === "contact" ? "" : "contact")}
          >
            <span>Contact Info</span>
            <span>{openSection === "contact" ? "−" : "+"}</span>
          </button>
          {openSection === "contact" && (
            <div className="ftr-accordion-content">
              <p className="ftr-address">
                <strong>Address</strong><br />
                Vinayak Jewellers<br />
                G-46, Unnati Tower,<br />
                Sector 2, Central Spine,<br />
                Vidhyadhar Nagar,<br />
                Jaipur, Rajasthan 302039
              </p>
              <p className="ftr-contact">
                <strong>Phone</strong><br />
                +91 9414156451<br />
                0141-2337548
              </p>
              <p className="ftr-contact">
                <strong>Email</strong><br />
                info@vinayakjewellers.com
              </p>
            </div>
          )}
        </div>

        {/* Legal Accordion */}
        <div className="ftr-accordion-item">
          <button
            className="ftr-accordion-btn"
            onClick={() => setOpenSection(openSection === "legal" ? "" : "legal")}
          >
            <span>Legal</span>
            <span>{openSection === "legal" ? "−" : "+"}</span>
          </button>
          {openSection === "legal" && (
            <div className="ftr-accordion-content">
             <ul>
  <li>
    <Link href="/terms">Terms & Conditions</Link>
  </li>

  <li>
    <Link href="/privacy">Privacy Policy</Link>
  </li>

  <li>
    <Link href="/disclaimer">Disclaimer</Link>
  </li>
</ul>
            </div>
          )}
        </div>

        {/* Mobile Buttons */}
        <div className="ftr-mobile-footer-buttons">
          <Link
            href="/contact"
            style={{
              width: "100%",
              height: "46px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#61311e",
              color: "#fff",
              borderRadius: "16px",
              textDecoration: "none",
              fontSize: "16px",
              fontWeight: "500",
              marginBottom: "16px"
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#4f2818"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#61311e"; }}
          >
            Enquire Now
          </Link>

          {/* <Link
            href="/admin"
            style={{
              width: "100%",
              height: "46px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#fff6e0",
              color: "#61311e",
              border: "2px solid #bf9555",
              borderRadius: "16px",
              textDecoration: "none",
              fontSize: "16px",
              fontWeight: "500"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "#61311e";
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.borderColor = "#61311e";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "#fff6e0";
              e.currentTarget.style.color = "#61311e";
              e.currentTarget.style.borderColor = "#bf9555";
            }}
          >
            Admin Login
          </Link> */}
        </div>

        {/* Mobile Follow Us */}
        <div className="ftr-mobile-follow">
          <h5>Follow Us</h5>
          <div className="ftr-social-icons">
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaYoutube /></a>
            <a href="#"><FaPinterestP /></a>
          </div>
        </div>
      </div>

      {/* Footer Banner */}
      <div className="ftr-banner">
        <Image
          src="/fl.svg"
          alt="Footer Banner"
          width={1540}
          height={200}
          className="ftr-banner-img"
        />
      </div>

      {/* Bottom Section */}
      <section className="ftr-bottom">
        <div className="ftr-container ftr-bottom-row">
          <p>© 2025 Vinayak Jewellers. All Rights Reserved.</p>
          <p>
            Crafted by :{" "}
            <a
              href="https://www.kontentkraftdigital.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="ftr-kkd-link"
            >
              <strong style={{ color: "#fff4dc" }}>Kontent Kraft Digital</strong>
            </a>
          </p>
        </div>
      </section>

      <style>{`
        /* ====================== RESET / BASE ====================== */
        .ftr-root, .ftr-root * {
          box-sizing: border-box;
        }

        .ftr-root {
          background: #fff4dc;
          color: #5c311d;
          font-family: "Mona Sans", sans-serif;
        }

        .ftr-container {
          max-width: 1400px;
          width: 100%;
          margin: 0 auto;
          padding: 0 32px;
        }

        .ftr-logo {
          width: 180px;
          height: auto;
          margin-bottom: 20px;
        }

        .ftr-brand-desc {
          font-size: 16px;
          line-height: 1.6;
          margin: 30px 0;
          color: #6c4a37;
        }

        .ftr-social-icons {
          display: flex;
          gap: 12px;
          margin-top: 10px;
        }

        .ftr-social-icons a {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 20px;
          flex-shrink: 0;
        }

        .ftr-social-icons a:nth-child(1) { background: #e1306c; }
        .ftr-social-icons a:nth-child(2) { background: #1877f2; }
        .ftr-social-icons a:nth-child(3) { background: #ff0000; }
    .ftr-social-icons a:nth-child(4){
  background:#ff3040;
}

        /* ====================== DESKTOP ====================== */
        .ftr-main {
          padding-top: 80px;
          padding-bottom: 20px;
        }

        .ftr-grid {
          display: grid;
          grid-template-columns: 340px 1fr 1fr 1fr;
          gap: 60px;
          align-items: flex-start;
        }

        .ftr-follow-title {
          font-size: 14px;
          font-weight: 600;
          margin: 0 0 20px;
        }

      .ftr-col h5{
  position:relative;
  display:inline-block;
  font-size:18px;
  font-weight:600;
  margin:0 0 16px;
  color:#5a2f18;
  padding-bottom:10px;
}

.ftr-col h5::after{
  content:"";
  position:absolute;
  left:0;
  bottom:0;
  width:100px;
  height:2px;
  background:#bf9555;
  border-radius:10px;
}
.ftr-col:nth-child(2) h5::after{
  width:105px;   /* Quick Links */
}

.ftr-col:nth-child(3) h5::after{
  width:110px;   /* Contact Info */
}

.ftr-col:nth-child(4) h5::after{
  width:53px;    /* Legal */
}
        .ftr-col ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .ftr-col ul li {
          margin-bottom: 10px;
        }

        .ftr-col ul li a {
          display: inline-block;
          font-family: "Mona Sans", sans-serif;
          font-size: 14px;
          font-weight: 400;
          line-height: 1.6;
          color: #6c4a37;
          text-decoration: none;
        }

        .ftr-col ul li a:hover {
          color: #61311e;
        }

        .ftr-address, .ftr-contact {
          font-size: 14px;
          line-height: 1.6;
          color: #6c4a37;
          margin: 20px 0 0;
        }
          .ftr-info-item{
  display:flex;
  align-items:flex-start;
  gap:15px;
  margin-bottom:12px;
}

.ftr-info-icon{
  font-size:16px;
  color:#b88949;
  margin-top:4px;
  flex-shrink:0;
}

.ftr-info-item strong{
  display:block;
  font-size:14px;
  font-weight:600;
  color:#5a2f18;
  margin-bottom:2px;
}

.ftr-info-item p{
  margin:0;
  font-size:14px;
  line-height:1.8;
  color:#6c4a37;
}

        .ftr-banner {
          width: 100%;
          overflow: hidden;
          padding-top: 40px;
        }

        .ftr-banner-img {
          width: 100%;
          height: 280px;
          object-fit: cover;
          display: block;
        }

        /* ====================== BOTTOM ====================== */
        .ftr-bottom {
          padding: 20px 0;
          background: #61311e;
        }

        .ftr-bottom-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .ftr-bottom-row p {
          font-size: 12px;
          color: #fff4dc;
          margin: 0;
        }

        .ftr-kkd-link {
          color: #111;
          font-weight: 700;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .ftr-kkd-link:hover {
          color: #649933;
          text-decoration: underline;
        }

        /* ====================== MOBILE (default hidden) ====================== */
        .ftr-mobile-brand,
        .ftr-mobile-footer {
          display: none;
        }

        /* ====================== TABLET ====================== */
        @media (max-width: 1024px) {
          .ftr-container {
            padding: 0 24px;
          }

          .ftr-grid {
            grid-template-columns: 280px 1fr 1fr 1fr;
            gap: 32px;
          }

          .ftr-logo {
            width: 200px;
          }
        }

        /* ====================== MOBILE ====================== */
        @media (max-width: 768px) {
          .ftr-main,
          .ftr-grid {
            display: none;
          }

          .ftr-mobile-brand {
            display: block;
            padding: 0 20px 30px;
            text-align: center;
          }

          .ftr-mobile-brand .ftr-logo {
            width: 180px;
            margin: 0 auto 20px;
            display: block;
          }

          .ftr-mobile-brand .ftr-brand-desc {
            font-size: 13px;
            line-height: 1.5;
            margin: 0;
            color: #6c4a37;
          }

          .ftr-mobile-footer {
            display: block;
            padding: 0 20px;
          }

          .ftr-accordion-item {
            border-bottom: 1px solid rgba(104, 31, 0, 0.15);
          }

          .ftr-accordion-btn {
            width: 100%;
            background: none;
            border: none;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 0;
            color: #681f00;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
          }

          .ftr-accordion-content {
            padding: 0 0 16px;
          }

          .ftr-accordion-content ul {
            list-style: none;
            margin: 0;
            padding: 0;
          }

          .ftr-accordion-content li {
            margin-bottom: 12px;
          }

          .ftr-accordion-content li a {
            text-decoration: none;
            color: #6c4a37;
            font-size: 13px;
          }

          .ftr-mobile-footer-buttons {
            margin-top: 20px;
            display: flex;
            flex-direction: column;
            gap: 14px;
          }

          .ftr-mobile-follow {
            margin-top: 28px;
            text-align: center;
          }

          .ftr-mobile-follow h5 {
            font-size: 12px;
            margin: 0 0 14px;
          }

          .ftr-mobile-follow .ftr-social-icons {
            justify-content: center;
          }

          .ftr-mobile-follow .ftr-social-icons a {
            width: 40px;
            height: 40px;
            font-size: 18px;
          }

          .ftr-address,
          .ftr-contact {
            margin-top: 14px;
            color: #6c4a37;
            line-height: 1.7;
            font-size: 13px;
          }
            .ftr-col h5::after{
  display:none;
}


.ftr-info-item{
  gap:14px;
  margin-bottom:22px;
}

.ftr-info-icon{
  font-size:20px;
}

.ftr-info-item strong{
  font-size:16px;
}

.ftr-info-item p{
  font-size:14px;
}

          .ftr-banner-img {
            height: 90px;
          }

          .ftr-bottom-row {
            flex-direction: column;
            text-align: center;
            gap: 8px;
          }

          .ftr-bottom-row p {
            font-size: 11px;
          }
        }


        /* ====================== SMALL MOBILE ====================== */
        @media (max-width: 480px) {
          .ftr-container {
            padding: 0 16px;
          }

          .ftr-mobile-footer {
            padding: 0 16px;
          }

          .ftr-mobile-brand .ftr-logo {
            width: 140px;
          }

          .ftr-mobile-brand .ftr-brand-desc {
            font-size: 12px;
          }

          .ftr-accordion-btn {
            font-size: 13px;
          }

          .ftr-accordion-content li a {
            font-size: 13px;
          }

          .ftr-address,
          .ftr-contact {
            font-size: 12px;
          }

          .ftr-banner-img {
            height: 70px;
          }
        }
      `}</style>
    </footer>
  );
}