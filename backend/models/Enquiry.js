import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    productName: { type: String },
    productImage: { type: String },
    source: { type: String, default: "website" },
  },
  { timestamps: true }
);

export default mongoose.model("Enquiry", enquirySchema);


