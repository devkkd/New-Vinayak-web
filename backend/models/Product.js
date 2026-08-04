import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true },
    details: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    image: { type: String },
    images: { type: [String], default: [] },
    imagePublicId: { type: String },
    imagePublicIds: { type: [String], default: [] },
    collection: { type: String },
    collections: { type: [String], default: [] },
    category: { type: String },
    subcategory: { type: String },
  },
  { timestamps: true }
);

// Indexes for fast filtering queries
productSchema.index({ collection: 1 });
productSchema.index({ collections: 1 });
productSchema.index({ category: 1 });
productSchema.index({ subcategory: 1 });
productSchema.index({ collection: 1, category: 1 });
productSchema.index({ collection: 1, category: 1, subcategory: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ createdAt: -1 });

productSchema.pre("save", function (next) {
  const hasImage = this.image && this.image.trim() !== "";
  const hasImages = this.images && this.images.length > 0;
  if (!hasImage && !hasImages) {
    return next(new Error("At least one image is required (either 'image' or 'images' array)"));
  }
  next();
});

export default mongoose.model("Product", productSchema);
