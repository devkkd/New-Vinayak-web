import Enquiry from "../models/Enquiry.js";
import Product from "../models/Product.js";

export const createEnquiry = async (req, res) => {
  try {
    let { name, phone, productId, productName, productImage } = req.body || {};
    if (!name || !phone) return res.status(400).json({ success: false, message: "Name and phone required" });
    
    // If productId is provided but productName is missing, fetch from database
    if (productId && !productName) {
      try {
        const product = await Product.findById(productId);
        if (product) {
          productName = product.productName;
          // Also get image if productImage is missing
          if (!productImage) {
            productImage = product.images && product.images.length > 0 ? product.images[0] : product.image;
          }
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        // Continue without product name if fetch fails
      }
    }
    
    const doc = await Enquiry.create({ name, phone, productId, productName, productImage });
    return res.status(201).json({ success: true, data: doc });
  } catch (e) {
    return res.status(500).json({ success: false, message: "Failed to submit enquiry" });
  }
};

export const listEnquiries = async (_req, res) => {
  try {
    const rows = await Enquiry.find({}).sort({ createdAt: -1 });
    
    // Populate product names for enquiries that have productId but missing productName
    const enrichedRows = await Promise.all(
      rows.map(async (enquiry) => {
        if (enquiry.productId && !enquiry.productName) {
          try {
            const product = await Product.findById(enquiry.productId);
            if (product) {
              enquiry.productName = product.productName;
              if (!enquiry.productImage && (product.images?.length > 0 || product.image)) {
                enquiry.productImage = product.images?.[0] || product.image;
              }
            }
          } catch (err) {
            console.error("Error populating product:", err);
          }
        }
        return enquiry;
      })
    );
    
    return res.json({ success: true, data: enrichedRows });
  } catch (e) {
    return res.status(500).json({ success: false, message: "Failed to fetch enquiries" });
  }
};


