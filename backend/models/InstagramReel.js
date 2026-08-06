import mongoose from "mongoose";

const instagramReelSchema = new mongoose.Schema(
  {
    videoUrl: { type: String, required: true },
    videoPublicId: { type: String, default: "" },
    thumbnailUrl: { type: String, default: "" },
    thumbnailPublicId: { type: String, default: "" },
    reelLink: { type: String, default: "" },  // Instagram reel URL
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("InstagramReel", instagramReelSchema);
