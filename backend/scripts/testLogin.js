import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import axios from "axios";

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

async function testLogin() {
  console.log("🧪 Testing Login API...\n");
  
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    console.error("❌ Missing ADMIN_EMAIL or ADMIN_PASSWORD in .env");
    process.exit(1);
  }
  
  // Test with new admin credentials
  const email = "admin@vinayakjewellers.com";
  const password = "Admin@12345";
  const apiUrl = "https://vinayak-jewellers-1.onrender.com/api/auth/login";
  
  console.log(`📧 Email: ${email}`);
  console.log(`🔗 API URL: ${apiUrl}\n`);
  
  try {
    console.log("⏳ Sending login request...");
    const response = await axios.post(apiUrl, { email, password });
    
    console.log("✅ Login successful!");
    console.log("Response:", JSON.stringify(response.data, null, 2));
    
    if (response.data.token) {
      console.log("\n🎉 Token received! Length:", response.data.token.length);
    }
  } catch (error) {
    console.error("\n❌ Login failed!");
    
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Message: ${error.response.data?.message || "Unknown error"}`);
      console.error(`Full response:`, JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error("❌ No response from server!");
      console.error("   Make sure backend server is running:");
      console.error("   cd backend && npm run dev");
    } else {
      console.error("Error:", error.message);
    }
    
    process.exit(1);
  }
}

testLogin();


