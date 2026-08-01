import express from "express";
import multer from "multer";
import { requireAuth, requireAdminEmail } from "../middleware/auth.js";
import { getReels, getAllReels, addReel, updateReel, deleteReel } from "../controllers/instagramReelController.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (_req, file, cb) => {
    const videoTypes = ["video/mp4", "video/quicktime", "video/x-msvideo", "video/webm"];
    const imageTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if ([...videoTypes, ...imageTypes].includes(file.mimetype)) return cb(null, true);
    return cb(new Error("Only MP4/MOV/AVI/WEBM videos and JPEG/PNG/WEBP images are allowed"));
  },
});

const uploadFields = upload.fields([
  { name: "video", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
]);

// Public
router.get("/", getReels);

// Admin only
router.get("/all", requireAuth, requireAdminEmail, getAllReels);
router.post("/", requireAuth, requireAdminEmail, uploadFields, addReel);
router.put("/:id", requireAuth, requireAdminEmail, uploadFields, updateReel);
router.delete("/:id", requireAuth, requireAdminEmail, deleteReel);

export default router;
