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

async function createNewAdmin() {
  console.log("🔐 Creating New Admin User...\n");
  
  await connectDB();
  
  // New admin credentials
  const newEmail = "admin@vinayakjewellers.com";
  const newPassword = "Admin@12345";
  
  console.log(`📧 New Admin Email: ${newEmail}`);
  console.log(`🔑 New Admin Password: ${newPassword}\n`);
  
  const email = newEmail.toLowerCase();
  
  // Check if user already exists
  const existing = await User.findOne({ email });
  if (existing) {
    console.log("⚠️  User already exists. Deleting old user...");
    await User.deleteOne({ email });
    console.log("✅ Old user deleted");
  }
  
  // Create new admin user
  const passwordHash = await bcrypt.hash(newPassword, 10);
  await User.create({ email, passwordHash });
  
  console.log("✅ New admin user created successfully!");
  console.log("\n" + "=".repeat(50));
  console.log("📝 NEW ADMIN CREDENTIALS:");
  console.log("=".repeat(50));
  console.log(`📧 Email: ${newEmail}`);
  console.log(`🔑 Password: ${newPassword}`);
  console.log("=".repeat(50));
  console.log("\n💡 Update your .env file with:");
  console.log(`   ADMIN_EMAIL=${newEmail}`);
  console.log(`   ADMIN_PASSWORD=${newPassword}`);
  console.log("\n✅ You can now login with these credentials!");
  
  process.exit(0);
}

createNewAdmin().catch((e) => {
  console.error("❌ Error:", e);
  process.exit(1);
});

