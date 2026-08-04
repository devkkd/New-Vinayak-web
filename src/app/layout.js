import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PageLoader from "./components/PageLoader";
import Script from "next/script";

export const metadata = {
  title: "Vinayak Jewellery",
  description: "Premium Jewellery Shop",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" style={{ background: "#fff6de" }}>
      <head>
        <link rel="icon" href="/images/Headerlogo.png" />

        {/* Critical inline CSS — sets background before first paint, prevents FOUC */}
        <style dangerouslySetInnerHTML={{ __html: `
          html { background: #fff6de !important; }
          body { background: #fff6de !important; color: #681f00; margin: 0; padding: 0; }
        ` }} />

        {/* Font preconnects */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

        {/* Cinzel + Mona Sans */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Mona+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* Tiro Devanagari */}
        <link
          href="https://fonts.googleapis.com/css2?family=Tiro+Devanagari+Hindi:ital@0;1&display=swap"
          rel="stylesheet"
        />

        {/* Font Awesome */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />

        {/* Backend preconnect */}
        <link rel="preconnect" href="https://vinayak-jewellers-1.onrender.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://vinayak-jewellers-1.onrender.com" />

        {/* Preload hero images */}
        <link rel="preload" as="image" href="/home/hero1.png" />
        <link rel="preload" as="image" href="/home/hero6.png" />
      </head>

      <body style={{ background: "#fff6de", margin: 0, padding: 0 }}>
        {/* Client-only loader — no hydration mismatch */}
        <PageLoader />

        <Header />
        {children}
        <Footer />

        <Script
          src="//code.tidio.co/4c9jove3ahjr9moev5get2yiofmnzfxt.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
