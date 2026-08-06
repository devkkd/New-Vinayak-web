import express from "express";
import multer from "multer";
import {
  uploadProduct,
  listProducts,
  searchProducts,
  uploadProductJson,
  getProductById,
  getProductBySlug,
  generateSlugsForExisting,
  updateProduct,
  deleteProduct,
  bulkUploadProducts,
  getProductsBySubmenu,
} from "../controllers/productController.js";

const router = express.Router();

// Use in-memory storage for file uploads with validation
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (allowed.includes(file.mimetype)) return cb(null, true);
    return cb(new Error("Only JPEG/PNG/WEBP images are allowed"));
  },
});

// Bulk upload route (Excel parsed products)
router.post("/bulk-upload", express.json({ limit: "10mb" }), bulkUploadProducts);

// Upload route - supports both single and multiple images
router.post("/upload", upload.array("image", 10), uploadProduct);

// JSON upload route (imageUrl or imageBase64)
router.post("/upload-json", uploadProductJson);

// Search products (must be before /:id route)
router.get("/search", searchProducts);

// Get products by submenu (must be before /:id route)
router.get("/by-submenu", getProductsBySubmenu);

// Get product by slug (must be before /:id route)
router.get("/slug/:slug", getProductBySlug);

// One-time migration: generate slugs for existing products
router.post("/generate-slugs", generateSlugsForExisting);

// List products (with optional filtering: ?collection=Gold&category=Rings&subcategory=Gold Rings)
router.get("/", listProducts);

// Get single product
router.get("/:id", getProductById);

// Update product — smart middleware: FormData with file OR plain JSON
const updateMiddleware = (req, res, next) => {
  const contentType = req.headers["content-type"] || "";
  if (contentType.includes("multipart/form-data")) {
    // File upload — use multer
    upload.array("image", 10)(req, res, next);
  } else {
    // JSON body — use express.json()
    express.json()(req, res, next);
  }
};
router.put("/:id", updateMiddleware, updateProduct);

// Delete product
router.delete("/:id", deleteProduct);

export default router;
