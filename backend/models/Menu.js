import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  link: { type: String, required: true },
}, { _id: false });

const nestedCategorySchema = new mongoose.Schema({
  category: { type: String, required: true }, // e.g., "Gold", "Silver", "Diamond"
  items: { type: [menuItemSchema], default: [] }, // Array of menu items
}, { _id: false });

const menuSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // e.g., "Home", "Collections", "Gold", "Mens"
    link: { type: String, required: true }, // e.g., "/", "/alljewellery", "/gold"
    icon: { type: String, required: true }, // Path to icon image
    order: { type: Number, default: 0 }, // For ordering menu items
    // Simple submenu structure (for most categories)
    sub: {
      type: [menuItemSchema],
      default: [],
    },
    // Nested structure (for Mens category)
    nestedSub: {
      type: [nestedCategorySchema],
      default: [],
    },
    // Flag to determine which structure to use
    hasNestedStructure: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Index for ordering
menuSchema.index({ order: 1 });

export default mongoose.model("Menu", menuSchema);


