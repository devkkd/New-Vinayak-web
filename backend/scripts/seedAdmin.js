import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// Get the directory of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from the backend root directory (parent of scripts)
const envPath = join(__dirname, "..", ".env");
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error(`❌ Error loading .env file from: ${envPath}`);
  console.error(`   Make sure .env file exists in the backend directory`);
  console.error(`   Error: ${result.error.message}`);
  process.exit(1);
}

async function run() {
  console.log(`📁 Loading .env from: ${envPath}`);
  
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    console.error("❌ Missing ADMIN_EMAIL or ADMIN_PASSWORD in .env");
    console.error("   Please add these to your .env file:");
    console.error("   ADMIN_EMAIL=your-email@example.com");
    console.error("   ADMIN_PASSWORD=your-secure-password");
    process.exit(1);
  }
  
  console.log(`✅ Found ADMIN_EMAIL: ${process.env.ADMIN_EMAIL}`);
  await connectDB();
  const email = process.env.ADMIN_EMAIL.toLowerCase();
  const existing = await User.findOne({ email });
  if (existing) {
    console.log("Admin user already exists:", email);
    process.exit(0);
  }
  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
  await User.create({ email, passwordHash });
  console.log("Admin user created:", email);
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});


