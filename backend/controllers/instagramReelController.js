import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { r2Client, R2_BUCKET, R2_PUBLIC_URL } from "../config/r2.js";
import InstagramReel from "../models/InstagramReel.js";
import { v4 as uuidv4 } from "uuid";

const MAX_REELS = 7;

// Helper: upload buffer to R2
const uploadToR2 = async (buffer, mimeType, folder = "vinayak_reels") => {
  const ext = mimeType.split("/")[1]?.split(";")[0] || "bin";
  const key = `${folder}/${uuidv4()}.${ext}`;
  await r2Client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
    })
  );
  return { url: `${R2_PUBLIC_URL}/${key}`, key };
};

// Helper: delete from R2
const deleteFromR2 = async (key) => {
  if (!key) return;
  try {
    await r2Client.send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: key }));
  } catch (_) {}
};

// Public: get all active reels
export const getReels = async (_req, res) => {
  try {
    const reels = await InstagramReel.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    return res.json({ success: true, data: reels });
  } catch {
    return res.status(500).json({ success: false, message: "Failed to fetch reels" });
  }
};

// Admin: get all reels
export const getAllReels = async (_req, res) => {
  try {
    const reels = await InstagramReel.find().sort({ order: 1, createdAt: -1 });
    return res.json({ success: true, data: reels });
  } catch {
    return res.status(500).json({ success: false, message: "Failed to fetch reels" });
  }
};

// Admin: add reel
export const addReel = async (req, res) => {
  try {
    if (!req.files?.video?.[0]) {
      return res.status(400).json({ success: false, message: "Video file is required" });
    }

    // Auto-delete oldest if at max
    const count = await InstagramReel.countDocuments();
    if (count >= MAX_REELS) {
      const oldest = await InstagramReel.findOne().sort({ createdAt: 1 });
      if (oldest) {
        await deleteFromR2(oldest.videoPublicId);
        await deleteFromR2(oldest.thumbnailPublicId);
        await InstagramReel.findByIdAndDelete(oldest._id);
      }
    }

    const videoFile = req.files.video[0];
    const videoResult = await uploadToR2(videoFile.buffer, videoFile.mimetype);

    let thumbnailUrl = "", thumbnailPublicId = "";
    if (req.files?.thumbnail?.[0]) {
      const thumbFile = req.files.thumbnail[0];
      const thumbResult = await uploadToR2(thumbFile.buffer, thumbFile.mimetype);
      thumbnailUrl = thumbResult.url;
      thumbnailPublicId = thumbResult.key;
    }

    const reel = await InstagramReel.create({
      videoUrl: videoResult.url,
      videoPublicId: videoResult.key,
      thumbnailUrl,
      thumbnailPublicId,
    });

    return res.status(201).json({ success: true, data: reel });
  } catch (e) {
    return res.status(500).json({ success: false, message: "Failed to add reel", error: e.message });
  }
};

// Admin: update reel
export const updateReel = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body || {};
    const reel = await InstagramReel.findById(id);
    if (!reel) return res.status(404).json({ success: false, message: "Reel not found" });

    if (req.files?.video?.[0]) {
      await deleteFromR2(reel.videoPublicId);
      const videoFile = req.files.video[0];
      const videoResult = await uploadToR2(videoFile.buffer, videoFile.mimetype);
      reel.videoUrl = videoResult.url;
      reel.videoPublicId = videoResult.key;
    }

    if (req.files?.thumbnail?.[0]) {
      await deleteFromR2(reel.thumbnailPublicId);
      const thumbFile = req.files.thumbnail[0];
      const thumbResult = await uploadToR2(thumbFile.buffer, thumbFile.mimetype);
      reel.thumbnailUrl = thumbResult.url;
      reel.thumbnailPublicId = thumbResult.key;
    }

    if (isActive !== undefined) reel.isActive = isActive === "true" || isActive === true;
    await reel.save();
    return res.json({ success: true, data: reel });
  } catch (e) {
    return res.status(500).json({ success: false, message: "Failed to update reel", error: e.message });
  }
};

// Admin: delete reel
export const deleteReel = async (req, res) => {
  try {
    const { id } = req.params;
    const reel = await InstagramReel.findByIdAndDelete(id);
    if (!reel) return res.status(404).json({ success: false, message: "Reel not found" });
    await deleteFromR2(reel.videoPublicId);
    await deleteFromR2(reel.thumbnailPublicId);
    return res.json({ success: true, message: "Reel deleted successfully" });
  } catch {
    return res.status(500).json({ success: false, message: "Failed to delete reel" });
  }
};
