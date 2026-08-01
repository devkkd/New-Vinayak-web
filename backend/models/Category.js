import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    collection: { 
      type: String, 
      required: true,
      enum: ["Gold", "Silver", "Diamond", "Gifting", "Wedding Collection", "Birth Stones", "Coins", "Mens"]
    },
    category: { type: String, required: true }, // e.g., "Neckwear", "Earrings", "Rings"
    subcategories: { type: [String], default: [] }, // e.g., ["Gold Chains", "Necklaces", "Mangalsutras"]
  },
  { timestamps: true }
);

// Compound unique index to prevent duplicate category within same collection
categorySchema.index({ collection: 1, category: 1 }, { unique: true });

export default mongoose.model("Category", categorySchema);

