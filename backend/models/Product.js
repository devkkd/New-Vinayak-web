import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true },
    details: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    // Support both single image (for backward compatibility) and multiple images
    image: { type: String }, // Single image URL (legacy)
    images: { type: [String], default: [] }, // Array of image URLs
    // Cloudinary public ids for deletion/updates
    imagePublicId: { type: String }, // Single image public id (legacy)
    imagePublicIds: { type: [String], default: [] }, // Array of public ids
    collection: { type: String }, // primary: Gold, Silver, Gifting, Coins, …
    collections: { type: [String], default: [] }, // extra pages (e.g. Gifting + Coins)
    category: { type: String },
    subcategory: { type: String },
  },
  { timestamps: true }
);

// Custom validation: at least one image must exist (either image or images array)
productSchema.pre("save", function (next) {
  const hasImage = this.image && this.image.trim() !== "";
  const hasImages = this.images && this.images.length > 0;
  
  if (!hasImage && !hasImages) {
    return next(new Error("At least one image is required (either 'image' or 'images' array)"));
  }
  
  next();
});

export default mongoose.model("Product", productSchema);
