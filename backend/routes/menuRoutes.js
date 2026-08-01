import express from "express";
import { requireAuth, requireAdminEmail } from "../middleware/auth.js";
import {
  createMenu,
  listMenus,
  getMenuById,
  updateMenu,
  deleteMenu,
  addSubmenuItem,
  updateSubmenuItem,
  deleteSubmenuItem,
  addNestedCategory,
  addNestedCategoryItem,
  deleteNestedCategory,
  deleteNestedCategoryItem,
} from "../controllers/menuController.js";

const router = express.Router();

// Public routes (for frontend display)
router.get("/", listMenus);
router.get("/:id", getMenuById);

// Protected routes (admin only)
router.post("/", requireAuth, requireAdminEmail, createMenu);
router.put("/:id", requireAuth, requireAdminEmail, updateMenu);
router.delete("/:id", requireAuth, requireAdminEmail, deleteMenu);

// Submenu operations
router.post("/:id/submenu", requireAuth, requireAdminEmail, addSubmenuItem);
router.put("/:id/submenu", requireAuth, requireAdminEmail, updateSubmenuItem);
router.delete("/:id/submenu", requireAuth, requireAdminEmail, deleteSubmenuItem);

// Nested category operations
router.post("/:id/nested-category", requireAuth, requireAdminEmail, addNestedCategory);
router.post("/:id/nested-category/item", requireAuth, requireAdminEmail, addNestedCategoryItem);
router.delete("/:id/nested-category", requireAuth, requireAdminEmail, deleteNestedCategory);
router.delete("/:id/nested-category/item", requireAuth, requireAdminEmail, deleteNestedCategoryItem);

export default router;


