import express from "express";
import { login, signup, me } from "../controllers/authController.js";
import { requireAuth, requireAdminEmail } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", requireAuth, requireAdminEmail, me);

export default router;


