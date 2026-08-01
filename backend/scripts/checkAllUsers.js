import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = join(__dirname, "..", ".env");
dotenv.config({ path: envPath });

async function checkUsers() {
  await connectDB();
  
  console.log("🔍 Checking all users in database...\n");
  
  const allUsers = await User.find({});
  
  if (allUsers.length === 0) {
    console.log("❌ No users found in database!");
    process.exit(1);
  }
  
  console.log(`✅ Found ${allUsers.length} user(s):\n`);
  
  for (const user of allUsers) {
    console.log("=".repeat(50));
    console.log(`📧 Email: ${user.email}`);
    console.log(`🆔 ID: ${user._id}`);
    console.log(`📅 Created: ${user.createdAt}`);
    
    // Test with new password
    const testPassword = "Admin@12345";
    const passwordMatch = await bcrypt.compare(testPassword, user.passwordHash);
    console.log(`🔑 Password "Admin@12345" matches: ${passwordMatch ? "✅ YES" : "❌ NO"}`);
    
    // Test with old password
    const oldPassword = "Kkd12345";
    const oldPasswordMatch = await bcrypt.compare(oldPassword, user.passwordHash);
    console.log(`🔑 Password "Kkd12345" matches: ${oldPasswordMatch ? "✅ YES" : "❌ NO"}`);
    
    console.log("");
  }
  
  // Check specific user
  const adminUser = await User.findOne({ email: "admin@vinayakjewellers.com" });
  if (adminUser) {
    console.log("✅ admin@vinayakjewellers.com user found!");
  } else {
    console.log("❌ admin@vinayakjewellers.com user NOT found!");
  }
  
  process.exit(0);
}

checkUsers().catch((e) => {
  console.error("❌ Error:", e);
  process.exit(1);
});

