import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import connectDB from "../config/db.js";
import Category from "../models/Category.js";

// Get the directory of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from the backend root directory
const envPath = join(__dirname, "..", ".env");
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error(`❌ Error loading .env file from: ${envPath}`);
  process.exit(1);
}

// Categories data - All collections with their categories (matching menu submenu items)
const categoriesData = {
  "Gold": [
    { category: "Ring", subcategories: [] },
    { category: "Earrings", subcategories: [] },
    { category: "Necklace - 22 karat - 18 karat", subcategories: [] },
    { category: "Bangles", subcategories: [] },
    { category: "Mangalsutra", subcategories: [] },
    { category: "Chains", subcategories: [] },
    { category: "Bracelet", subcategories: [] },
    { category: "Pendal set", subcategories: [] },
    { category: "Pendant", subcategories: [] },
  ],
  "Silver": [
    { category: "Utensils", subcategories: [] },
    { category: "Anklets / payals", subcategories: [] },
    { category: "Kamar belt or satka", subcategories: [] },
    { category: "Pooja articles", subcategories: [] },
    { category: "Ring", subcategories: [] },
    { category: "Earrings", subcategories: [] },
    { category: "Pendant", subcategories: [] },
    { category: "Chains", subcategories: [] },
    { category: "Pendal set", subcategories: [] },
    { category: "Necklace", subcategories: [] },
    { category: "Bangles", subcategories: [] },
    { category: "Bracelet", subcategories: [] },
    { category: "Mangalsutra", subcategories: [] },
    { category: "Watches", subcategories: [] },
  ],
  "Diamond": [
    { category: "Ring", subcategories: [] },
    { category: "Earrings", subcategories: [] },
    { category: "Necklace", subcategories: [] },
    { category: "Bangles", subcategories: [] },
    { category: "Mangalsutra", subcategories: [] },
    { category: "Pendal set", subcategories: [] },
    { category: "Pendant", subcategories: [] },
    { category: "Men's", subcategories: [] },
  ],
  "Gifting": [
    { category: "Starting from 250-500", subcategories: [] },
    { category: "500-1000", subcategories: [] },
    { category: "1k-2k", subcategories: [] },
    { category: "2k-5k", subcategories: [] },
    { category: "5k-10k", subcategories: [] },
    { category: "10k-15k", subcategories: [] },
    { category: "15k-20k", subcategories: [] },
    { category: "20k or Above 20k", subcategories: [] },
    { category: "Exclusive", subcategories: [] },
  ],
  "Wedding Collection": [
    { category: "Gold Wedding", subcategories: [] },
    { category: "Gold Traditional", subcategories: [] },
    { category: "Gold rajasthani collection", subcategories: [] },
    { category: "Rose gold collection", subcategories: [] },
    { category: "Diamond Wedding collection", subcategories: [] },
    { category: "Traditional Gold", subcategories: [] },
    { category: "Traditional Silver", subcategories: [] },
    { category: "Hamel", subcategories: [] },
  ],
  "Birth Stones": [
    { category: "Rashi Ratan", subcategories: [] },
    { category: "Emerald", subcategories: [] },
    { category: "PukhRaj", subcategories: [] },
  ],
  "Coins": [
    { category: "Gold", subcategories: [] },
    { category: "Silver", subcategories: [] },
  ],
  "Mens": [
    { category: "Gold", subcategories: ["Gold Rings", "Gold Chains", "Gold Kadas/Bracelet"] },
    { category: "Silver", subcategories: ["Silver Rings", "Silver Chains", "Silver Kadas/Bracelet", "Others"] },
    { category: "Diamond", subcategories: ["Diamond Rings", "Diamond Bracelet", "Others"] },
  ],
};

async function seedCategories() {
  try {
    console.log("📁 Loading .env from:", envPath);
    await connectDB();
    console.log("✅ Connected to database");

    let added = 0;
    let skipped = 0;

    for (const [collection, categories] of Object.entries(categoriesData)) {
      console.log(`\n📦 Processing collection: ${collection}`);
      
      for (const catData of categories) {
        try {
          // Check if category already exists
          const existing = await Category.findOne({
            collection: collection,
            category: catData.category,
          });

          if (existing) {
            console.log(`   ⏭️  Skipped: ${catData.category} (already exists)`);
            skipped++;
            continue;
          }

          // Create new category
          await Category.create({
            collection: collection,
            category: catData.category,
            subcategories: catData.subcategories || [],
          });

          console.log(`   ✅ Added: ${catData.category}${catData.subcategories.length > 0 ? ` (${catData.subcategories.length} subcategories)` : ""}`);
          added++;
        } catch (error) {
          if (error.code === 11000) {
            console.log(`   ⏭️  Skipped: ${catData.category} (duplicate)`);
            skipped++;
          } else {
            console.error(`   ❌ Error adding ${catData.category}:`, error.message);
          }
        }
      }
    }

    console.log(`\n✅ Seeding completed!`);
    console.log(`   Added: ${added} categories`);
    console.log(`   Skipped: ${skipped} categories (already exist)`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
    process.exit(1);
  }
}

seedCategories();

