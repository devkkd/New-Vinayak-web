import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Script from "next/script";

export const metadata = {
  title: "Vinayak Jewellery",
  description: "Premium Jewellery Shop",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/Headerlogo.png" />

        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />

        <link
          rel="preconnect"
          href="https://vinayak-jewellers-1.onrender.com"
          crossOrigin=""
        />

        <link
          rel="dns-prefetch"
          href="https://vinayak-jewellers-1.onrender.com"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Tiro+Devanagari+Hindi:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>

      <body>
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