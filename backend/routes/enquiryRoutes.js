import express from "express";
import { createEnquiry, listEnquiries } from "../controllers/enquiryController.js";
import { requireAuth, requireAdminEmail } from "../middleware/auth.js";

const router = express.Router();

router.post("/", createEnquiry);
router.get("/", requireAuth, requireAdminEmail, listEnquiries);

export default router;


