import mongoose from "mongoose";

// Helper to generate a URL-safe slug from a string
function generateSlug(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")   // remove special chars
    .replace(/\s+/g, "-")            // spaces to hyphens
    .replace(/-+/g, "-");            // collapse multiple hyphens
}

const productSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true },
    slug: { type: String, unique: true, sparse: true },  // auto-generated from productName
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
// Note: sku and slug indexes are defined via `unique: true` in schema fields above
productSchema.index({ createdAt: -1 });

// Auto-generate slug from productName + sku for uniqueness
productSchema.pre("save", async function (next) {
  // Generate slug if missing or productName changed
  if (!this.slug || this.isModified("productName")) {
    const base = generateSlug(this.productName);
    const skuSuffix = generateSlug(this.sku);
    let candidate = `${base}-${skuSuffix}`;
    // Ensure uniqueness
    const existing = await mongoose.model("Product").findOne({ slug: candidate, _id: { $ne: this._id } });
    if (existing) candidate = `${candidate}-${Date.now()}`;
    this.slug = candidate;
  }

  const hasImage = this.image && this.image.trim() !== "";
  const hasImages = this.images && this.images.length > 0;
  if (!hasImage && !hasImages) {
    return next(new Error("At least one image is required (either 'image' or 'images' array)"));
  }
  next();
});

export default mongoose.model("Product", productSchema);
