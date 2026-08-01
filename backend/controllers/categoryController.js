import Category from "../models/Category.js";

// Create a new category
export const createCategory = async (req, res) => {
  try {
    const { collection, category, subcategories } = req.body || {};
    
    if (!collection || !category) {
      return res.status(400).json({ 
        success: false, 
        message: "Collection and category are required" 
      });
    }

    const doc = await Category.create({ 
      collection, 
      category, 
      subcategories: subcategories || [] 
    });
    
    return res.status(201).json({ success: true, data: doc });
  } catch (e) {
    if (e.code === 11000) {
      return res.status(409).json({ 
        success: false, 
        message: "Category already exists in this collection" 
      });
    }
    return res.status(500).json({ 
      success: false, 
      message: "Failed to create category",
      error: e.message 
    });
  }
};

// List all categories (optionally filtered by collection)
export const listCategories = async (req, res) => {
  try {
    const { collection } = req.query;
    const query = collection ? { collection } : {};
    const rows = await Category.find(query).sort({ collection: 1, category: 1 });
    return res.json({ success: true, data: rows });
  } catch (e) {
    return res.status(500).json({ 
      success: false, 
      message: "Failed to fetch categories" 
    });
  }
};

// Get categories grouped by collection
export const getCategoriesByCollection = async (_req, res) => {
  try {
    const rows = await Category.find({}).sort({ collection: 1, category: 1 });
    
    // Group by collection, include _id
    const grouped = {};
    rows.forEach((cat) => {
      if (!grouped[cat.collection]) {
        grouped[cat.collection] = [];
      }
      grouped[cat.collection].push({
        _id: cat._id,
        category: cat.category,
        subcategories: cat.subcategories || []
      });
    });
    
    return res.json({ success: true, data: grouped });
  } catch (e) {
    return res.status(500).json({ 
      success: false, 
      message: "Failed to fetch categories" 
    });
  }
};

// Add subcategory to existing category
export const addSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { subcategory } = req.body || {};
    
    if (!subcategory) {
      return res.status(400).json({ 
        success: false, 
        message: "Subcategory name is required" 
      });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ 
        success: false, 
        message: "Category not found" 
      });
    }

    // Check if subcategory already exists
    if (category.subcategories.includes(subcategory)) {
      return res.status(409).json({ 
        success: false, 
        message: "Subcategory already exists" 
      });
    }

    category.subcategories.push(subcategory);
    await category.save();

    return res.json({ success: true, data: category });
  } catch (e) {
    return res.status(500).json({ 
      success: false, 
      message: "Failed to add subcategory",
      error: e.message 
    });
  }
};

// Update category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { collection, category, subcategories } = req.body || {};

    const update = {};
    if (collection !== undefined) update.collection = collection;
    if (category !== undefined) update.category = category;
    if (subcategories !== undefined) update.subcategories = subcategories;

    const doc = await Category.findByIdAndUpdate(
      id,
      update,
      { new: true, runValidators: true }
    );

    if (!doc) {
      return res.status(404).json({ 
        success: false, 
        message: "Category not found" 
      });
    }

    return res.json({ success: true, data: doc });
  } catch (e) {
    if (e.code === 11000) {
      return res.status(409).json({ 
        success: false, 
        message: "Category already exists in this collection" 
      });
    }
    return res.status(500).json({ 
      success: false, 
      message: "Failed to update category",
      error: e.message 
    });
  }
};

// Delete category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Category.findByIdAndDelete(id);
    
    if (!doc) {
      return res.status(404).json({ 
        success: false, 
        message: "Category not found" 
      });
    }

    return res.json({ success: true, message: "Category deleted successfully" });
  } catch (e) {
    return res.status(500).json({ 
      success: false, 
      message: "Failed to delete category" 
    });
  }
};

// Delete subcategory
export const deleteSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { subcategory } = req.body || {};
    
    if (!subcategory) {
      return res.status(400).json({ 
        success: false, 
        message: "Subcategory name is required" 
      });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ 
        success: false, 
        message: "Category not found" 
      });
    }

    category.subcategories = category.subcategories.filter(
      (sub) => sub !== subcategory
    );
    await category.save();

    return res.json({ success: true, data: category });
  } catch (e) {
    return res.status(500).json({ 
      success: false, 
      message: "Failed to delete subcategory",
      error: e.message 
    });
  }
};

