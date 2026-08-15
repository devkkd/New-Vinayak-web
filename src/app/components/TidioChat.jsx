"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";

export default function TidioChat() {
  const pathname = usePathname();

  // Admin panel pe chat widget hide karo
  if (pathname?.startsWith("/admin")) return null;

  return (
    <Script
      src="//code.tidio.co/4c9jove3ahjr9moev5get2yiofmnzfxt.js"
      strategy="afterInteractive"
    />
  );
}
