import express from "express";
import { requireAuth, requireAdminEmail } from "../middleware/auth.js";
import {
  createCategory,
  listCategories,
  getCategoriesByCollection,
  addSubcategory,
  updateCategory,
  deleteCategory,
  deleteSubcategory,
} from "../controllers/categoryController.js";

const router = express.Router();

// Public routes (for frontend display)
router.get("/", listCategories);
router.get("/grouped", getCategoriesByCollection);

// Protected routes (admin only)
router.post("/", requireAuth, requireAdminEmail, createCategory);
router.put("/:id", requireAuth, requireAdminEmail, updateCategory);
router.delete("/:id", requireAuth, requireAdminEmail, deleteCategory);
router.post("/:id/subcategory", requireAuth, requireAdminEmail, addSubcategory);
router.delete("/:id/subcategory", requireAuth, requireAdminEmail, deleteSubcategory);

export default router;

