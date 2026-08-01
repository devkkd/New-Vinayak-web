import Menu from "../models/Menu.js";

// Create a new menu item
export const createMenu = async (req, res) => {
  try {
    const { name, link, icon, order, sub, nestedSub, hasNestedStructure } = req.body || {};
    
    if (!name || !link || !icon) {
      return res.status(400).json({ 
        success: false, 
        message: "Name, link, and icon are required" 
      });
    }

    const doc = await Menu.create({ 
      name, 
      link, 
      icon,
      order: order || 0,
      sub: sub || [],
      nestedSub: nestedSub || [],
      hasNestedStructure: hasNestedStructure || false,
    });
    
    return res.status(201).json({ success: true, data: doc });
  } catch (e) {
    if (e.code === 11000) {
      return res.status(409).json({ 
        success: false, 
        message: "Menu item with this name already exists" 
      });
    }
    return res.status(500).json({ 
      success: false, 
      message: "Failed to create menu item",
      error: e.message 
    });
  }
};

// List all menu items (ordered)
export const listMenus = async (_req, res) => {
  try {
    const rows = await Menu.find({}).sort({ order: 1, name: 1 });
    return res.json({ success: true, data: rows });
  } catch (e) {
    return res.status(500).json({ 
      success: false, 
      message: "Failed to fetch menus",
      error: e.message 
    });
  }
};

// Get single menu item
export const getMenuById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Menu.findById(id);
    
    if (!doc) {
      return res.status(404).json({ 
        success: false, 
        message: "Menu item not found" 
      });
    }
    
    return res.json({ success: true, data: doc });
  } catch (e) {
    return res.status(500).json({ 
      success: false, 
      message: "Failed to fetch menu item",
      error: e.message 
    });
  }
};

// Update menu item
export const updateMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, link, icon, order, sub, nestedSub, hasNestedStructure } = req.body || {};

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (link !== undefined) updateData.link = link;
    if (icon !== undefined) updateData.icon = icon;
    if (order !== undefined) updateData.order = order;
    if (sub !== undefined) updateData.sub = sub;
    if (nestedSub !== undefined) updateData.nestedSub = nestedSub;
    if (hasNestedStructure !== undefined) updateData.hasNestedStructure = hasNestedStructure;

    const doc = await Menu.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!doc) {
      return res.status(404).json({ 
        success: false, 
        message: "Menu item not found" 
      });
    }

    return res.json({ success: true, data: doc });
  } catch (e) {
    if (e.code === 11000) {
      return res.status(409).json({ 
        success: false, 
        message: "Menu item with this name already exists" 
      });
    }
    return res.status(500).json({ 
      success: false, 
      message: "Failed to update menu item",
      error: e.message 
    });
  }
};

// Delete menu item
export const deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Menu.findByIdAndDelete(id);
    
    if (!doc) {
      return res.status(404).json({ 
        success: false, 
        message: "Menu item not found" 
      });
    }

    return res.json({ success: true, message: "Menu item deleted successfully" });
  } catch (e) {
    return res.status(500).json({ 
      success: false, 
      message: "Failed to delete menu item",
      error: e.message 
    });
  }
};

// Add submenu item to menu
export const addSubmenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, link } = req.body || {};
    
    if (!name || !link) {
      return res.status(400).json({ 
        success: false, 
        message: "Name and link are required" 
      });
    }

    const menu = await Menu.findById(id);
    if (!menu) {
      return res.status(404).json({ 
        success: false, 
        message: "Menu item not found" 
      });
    }

    // Check if submenu item already exists
    const exists = menu.sub.some(item => item.name === name && item.link === link);
    if (exists) {
      return res.status(409).json({ 
        success: false, 
        message: "Submenu item already exists" 
      });
    }

    menu.sub.push({ name, link });
    await menu.save();

    return res.json({ success: true, data: menu });
  } catch (e) {
    return res.status(500).json({ 
      success: false, 
      message: "Failed to add submenu item",
      error: e.message 
    });
  }
};

// Update submenu item
export const updateSubmenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { index, name, link } = req.body || {};
    
    if (index === undefined || !name || !link) {
      return res.status(400).json({ 
        success: false, 
        message: "Index, name, and link are required" 
      });
    }

    const menu = await Menu.findById(id);
    if (!menu) {
      return res.status(404).json({ 
        success: false, 
        message: "Menu item not found" 
      });
    }

    if (index < 0 || index >= menu.sub.length) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid submenu index" 
      });
    }

    menu.sub[index] = { name, link };
    await menu.save();

    return res.json({ success: true, data: menu });
  } catch (e) {
    return res.status(500).json({ 
      success: false, 
      message: "Failed to update submenu item",
      error: e.message 
    });
  }
};

// Delete submenu item
export const deleteSubmenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { index } = req.body || {};
    
    if (index === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: "Index is required" 
      });
    }

    const menu = await Menu.findById(id);
    if (!menu) {
      return res.status(404).json({ 
        success: false, 
        message: "Menu item not found" 
      });
    }

    if (index < 0 || index >= menu.sub.length) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid submenu index" 
      });
    }

    menu.sub.splice(index, 1);
    await menu.save();

    return res.json({ success: true, data: menu });
  } catch (e) {
    return res.status(500).json({ 
      success: false, 
      message: "Failed to delete submenu item",
      error: e.message 
    });
  }
};

// Add nested category (for Mens type structure)
export const addNestedCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, items } = req.body || {};
    
    if (!category) {
      return res.status(400).json({ 
        success: false, 
        message: "Category name is required" 
      });
    }

    const menu = await Menu.findById(id);
    if (!menu) {
      return res.status(404).json({ 
        success: false, 
        message: "Menu item not found" 
      });
    }

    // Check if category already exists
    const exists = menu.nestedSub.some(item => item.category === category);
    if (exists) {
      return res.status(409).json({ 
        success: false, 
        message: "Nested category already exists" 
      });
    }

    menu.nestedSub.push({ 
      category, 
      items: items || [] 
    });
    menu.hasNestedStructure = true;
    await menu.save();

    return res.json({ success: true, data: menu });
  } catch (e) {
    return res.status(500).json({ 
      success: false, 
      message: "Failed to add nested category",
      error: e.message 
    });
  }
};

// Add item to nested category
export const addNestedCategoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryIndex, name, link } = req.body || {};
    
    if (categoryIndex === undefined || !name || !link) {
      return res.status(400).json({ 
        success: false, 
        message: "Category index, name, and link are required" 
      });
    }

    const menu = await Menu.findById(id);
    if (!menu) {
      return res.status(404).json({ 
        success: false, 
        message: "Menu item not found" 
      });
    }

    if (categoryIndex < 0 || categoryIndex >= menu.nestedSub.length) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid category index" 
      });
    }

    menu.nestedSub[categoryIndex].items.push({ name, link });
    await menu.save();

    return res.json({ success: true, data: menu });
  } catch (e) {
    return res.status(500).json({ 
      success: false, 
      message: "Failed to add item to nested category",
      error: e.message 
    });
  }
};

// Delete nested category
export const deleteNestedCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryIndex } = req.body || {};
    
    if (categoryIndex === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: "Category index is required" 
      });
    }

    const menu = await Menu.findById(id);
    if (!menu) {
      return res.status(404).json({ 
        success: false, 
        message: "Menu item not found" 
      });
    }

    if (categoryIndex < 0 || categoryIndex >= menu.nestedSub.length) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid category index" 
      });
    }

    menu.nestedSub.splice(categoryIndex, 1);
    if (menu.nestedSub.length === 0) {
      menu.hasNestedStructure = false;
    }
    await menu.save();

    return res.json({ success: true, data: menu });
  } catch (e) {
    return res.status(500).json({ 
      success: false, 
      message: "Failed to delete nested category",
      error: e.message 
    });
  }
};

// Delete item from nested category
export const deleteNestedCategoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryIndex, itemIndex } = req.body || {};
    
    if (categoryIndex === undefined || itemIndex === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: "Category index and item index are required" 
      });
    }

    const menu = await Menu.findById(id);
    if (!menu) {
      return res.status(404).json({ 
        success: false, 
        message: "Menu item not found" 
      });
    }

    if (categoryIndex < 0 || categoryIndex >= menu.nestedSub.length) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid category index" 
      });
    }

    const category = menu.nestedSub[categoryIndex];
    if (itemIndex < 0 || itemIndex >= category.items.length) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid item index" 
      });
    }

    category.items.splice(itemIndex, 1);
    await menu.save();

    return res.json({ success: true, data: menu });
  } catch (e) {
    return res.status(500).json({ 
      success: false, 
      message: "Failed to delete nested category item",
      error: e.message 
    });
  }
};


