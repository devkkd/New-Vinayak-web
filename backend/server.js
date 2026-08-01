import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import enquiryRoutes from "./routes/enquiryRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import instagramReelRoutes from "./routes/instagramReelRoutes.js";

dotenv.config();
const app = express();

// ✅ Middleware setup
const allowedOrigins = [
  "https://vinayak.kontentkraftdigital.com",
  "https://vinayak-jewellers-frontend.onrender.com",
  "https://vinayakjewellersjaipur.com",
  "https://www.vinayakjewellersjaipur.com",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Postman, curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  })
);

// ✅ Parse JSON
app.use(express.json());

// ✅ Connect MongoDB
connectDB();

// ✅ API Routes
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api/instagram-reels", instagramReelRoutes);

// ✅ Health check route
app.get("/health", (_req, res) => res.json({ ok: true }));

// ✅ Default route
app.get("/", (req, res) => {
  res.send("✅ Vinayak Jewellers Backend is running successfully!");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
