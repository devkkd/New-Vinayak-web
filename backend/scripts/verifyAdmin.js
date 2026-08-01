import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// Get the directory of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from the backend root directory
const envPath = join(__dirname, "..", ".env");
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error(`❌ Error loading .env file: ${result.error.message}`);
  process.exit(1);
}

async function verify() {
  console.log("🔍 Verifying Admin User...\n");
  
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    console.error("❌ Missing ADMIN_EMAIL or ADMIN_PASSWORD in .env");
    process.exit(1);
  }
  
  await connectDB();
  
  const email = process.env.ADMIN_EMAIL.toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  
  console.log(`📧 Looking for user: ${email}`);
  
  const user = await User.findOne({ email });
  
  if (!user) {
    console.error("❌ User NOT found in database!");
    console.log("\n💡 Run this command to create admin user:");
    console.log("   npm run seed:admin");
    process.exit(1);
  }
  
  console.log("✅ User found in database");
  console.log(`   Email: ${user.email}`);
  console.log(`   Created: ${user.createdAt}`);
  
  // Test password
  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  
  if (passwordMatch) {
    console.log("✅ Password matches!");
    console.log("\n🎉 Admin user is ready!");
    console.log("\n📝 Login Credentials:");
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
  } else {
    console.error("❌ Password does NOT match!");
    console.log("\n💡 Possible issues:");
    console.log("   1. .env file में ADMIN_PASSWORD गलत है");
    console.log("   2. User create करते समय different password use हुआ था");
    console.log("\n💡 Solution:");
    console.log("   Option 1: .env में सही password set करें");
    console.log("   Option 2: Database से user delete करें और फिर से seed करें");
  }
  
  // Check ADMIN_EMAIL match
  if (user.email.toLowerCase() !== process.env.ADMIN_EMAIL.toLowerCase()) {
    console.warn("⚠️  Warning: User email doesn't match ADMIN_EMAIL in .env");
  }
  
  process.exit(0);
}

verify().catch((e) => {
  console.error("❌ Error:", e);
  process.exit(1);
});


