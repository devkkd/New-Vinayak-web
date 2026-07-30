// lib/data.js
// ============================================================
// SINGLE SOURCE OF DATA — categories, subcategories, products
// Add more products here later, same structure repeats.
// ============================================================

export const categories = [
  { slug: "collections",  label: "Collections",  heading: "Collections",       type: "sidebar" },
  { slug: "gold",         label: "Gold",          heading: "Gold Jewellery",    type: "pills" },
  { slug: "diamond",      label: "Diamond",       heading: "Diamond Jewellery", type: "pills",
    note: "Ladies collections below. Men's diamond jewellery is under Men's or the Mens section." },
  { slug: "silver",       label: "Silver",        heading: "Silver Jewellery",  type: "pills" },
  { slug: "mens",         label: "Mens",          heading: "Mens Jewellery",    type: "pills" },
  { slug: "coins",        label: "Coins",         heading: "Coins Collection",  type: "pills-center" },
  { slug: "gifting",      label: "Gifting",       heading: "Gifting",           type: "pills" },
  { slug: "birth-stones", label: "Birth Stones",  heading: "Birth Stones",      type: "none" },
];

// subcategory pills shown per category page (like your screenshots)
export const subCategoriesByCategory = {
  gold: ["Ring","Earrings","Necklace - 22 karat - 18 karat","Bangles","Mangalsutra","Chains","Bracelet","Pendal set","Pendant set","Pendant","Necklaces","Neckwear"],
  diamond: ["Rings","Earrings","Necklaces","Bangles","Mangalsutra","Pendant","Pendant set","Men's","Bracelets"],
  silver: ["Utensils","Anklets / payals","Kamar belt or satka","Kamarbandh/ Satka","Pooja articles","Ring","Earrings","Pendant","Chains","Pendant set","Pendal set","Necklace","Bangles","Bracelet","Mangalsutra","Watches","Kamar belt or Kamarbandh"],
  mens: ["Gold","Silver","Diamond","Chains","Watches"],
  coins: ["Gold","Silver"],
  gifting: [],
  "birth-stones": [],
};

// left sidebar shown only on /collections
export const collectionSidebar = [
  "All Jewellery","Gold","Silver","Diamond","Wedding Collection","Gifting","Birth Stones","Mens","Coins",
];

// ============================================================
// PRODUCTS — dummy data, 9 products (images 1.jpeg → 9.jpeg)
// ============================================================
export const products = [
  {
    id: 1,
    slug: "traditional-gold-plated-kundan-pendant-necklace-set",
    title: "Traditional Gold-Plated Kundan Pendant Necklace Set with Ruby Beads | Ethnic Bridal Jewellery Set for Women",
    images: ["/products/1.jpeg"],
    category: "gold",
    subCategory: "Necklace - 22 karat - 18 karat",
    collectionTag: "Wedding Collection",
    sku: "VJ45",
    description:
      "Make every celebration unforgettable with this Traditional Gold-Plated Kundan Pendant Necklace Set, designed to showcase the timeless beauty of Indian craftsmanship. Adorned with sparkling Kundan stones, multicolour crystal accents, and elegant ruby-coloured bead drops. Comes with matching statement earrings, finished with a premium gold-plated polish and an adjustable handcrafted dori closure. Ideal for weddings, receptions, engagements and festive occasions.",
  },
  {
    id: 2,
    slug: "premium-kundan-green-beaded-pendant-necklace-set",
    title: "Premium Kundan & Green Beaded Pendant Necklace Set with Earrings | Gold-Plated Traditional Bridal Jewellery for Women",
    images: ["/products/2.jpeg"],
    category: "gold",
    subCategory: "Necklace - 22 karat - 18 karat",
    collectionTag: "Wedding Collection",
    sku: "VJ46",
    description:
      "A regal Kundan necklace set finished with green beaded accents and gold-plated detailing, complete with matching earrings. Designed for brides and festive occasions, pairs beautifully with sarees, lehengas and Anarkalis.",
  },
  {
    id: 3,
    slug: "premium-kundan-pearl-choker-necklace-set",
    title: "Premium Kundan Pearl Choker Necklace Set with Ruby Beads | Gold-Plated Traditional Bridal Jewellery for Women",
    images: ["/products/3.jpeg"],
    category: "gold",
    subCategory: "Necklaces",
    collectionTag: "Wedding Collection",
    sku: "VJ47",
    description:
      "A layered Kundan pearl choker necklace set finished with ruby beads and multiple pearl strands for a rich traditional look. Comes with matching earrings — perfect for weddings and festive wear.",
  },
  {
    id: 4,
    slug: "elegant-gold-plated-stone-choker-necklace-set",
    title: "Elegant Gold-Plated Stone Choker Necklace Set with Matching Earrings | Traditional Bridal & Festive Jewellery for Women",
    images: ["/products/4.jpeg"],
    category: "gold",
    subCategory: "Necklaces",
    collectionTag: "Wedding Collection",
    sku: "VJ48",
    description:
      "An elegant gold-plated stone choker necklace set studded with coloured stones and finished with a coin-style border, with matching drop earrings for a complete festive look.",
  },
  {
    id: 5,
    slug: "traditional-gold-necklace-intricate-detailing",
    title: "Traditional Gold Necklace with Intricate Detailing",
    images: ["/products/5.jpeg"],
    category: "gold",
    subCategory: "Necklaces",
    sku: "F75",
    description:
      "A handcrafted gold necklace featuring intricate traditional detailing — ideal for daily elegance as well as special occasions.",
  },
  {
    id: 6,
    slug: "elegant-gold-bangles-set-ethnic-occasions",
    title: "Elegant Gold Bangles Set for Ethnic Occasions",
    images: ["/products/6.jpeg"],
    category: "gold",
    subCategory: "Bangles",
    sku: "F76",
    description:
      "This elegant gold bangle set is crafted for ethnic occasions, combining traditional motifs with a comfortable everyday fit.",
  },
  {
    id: 7,
    slug: "statement-gold-bangles-bold-fashion-style",
    title: "Statement Gold Bangles for Bold Fashion Style",
    images: ["/products/7.jpeg"],
    category: "gold",
    subCategory: "Bangles",
    sku: "F78",
    description:
      "Bold and stylish bangles designed to stand out. Ideal for special occasions where you want to make a strong fashion impression.",
  },
  {
    id: 8,
    slug: "traditional-gold-bangles-gehru-finish",
    title: "Traditional Gold Bangles with Gehru Finish",
    images: ["/products/8.jpeg"],
    category: "gold",
    subCategory: "Bangles",
    sku: "F79",
    description:
      "These traditional gold bangles feature a classic gehru finish, offering timeless texture and shine for everyday and festive wear.",
  },
  {
    id: 9,
    slug: "diamond-petals-bracelet",
    title: "Diamond Petals Bracelet",
    images: ["/products/9.jpeg"],
    category: "diamond",
    subCategory: "Bracelets",
    sku: "D101",
    description:
      "The Diamond Petals Bracelet features a delicate petal-inspired design set with sparkling diamonds — perfect for everyday elegance or gifting.",
  },
];

// ============================================================
// Helper functions used by pages
// ============================================================
export function getCategory(slug) {
  return categories.find((c) => c.slug === slug);
}

export function getProductsByCategory(slug) {
  if (slug === "collections") return products;
  return products.filter((p) => p.category === slug);
}

export function getProductBySlug(slug) {
  return products.find((p) => p.slug === slug);
}