import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { r2Client, R2_BUCKET, R2_PUBLIC_URL } from "../config/r2.js";
import Product from "../models/Product.js";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import {
  buildLinkedCollectionFilter,
  syncProductCollections,
} from "../utils/collectionMembership.js";

const uploadToR2 = async (buffer, mimeType, folder = "vinayak_jewellers") => {
  const ext = mimeType.split("/")[1] || "bin";
  const key = `${folder}/${uuidv4()}.${ext}`;
  await r2Client.send(new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, Body: buffer, ContentType: mimeType }));
  return { url: `${R2_PUBLIC_URL}/${key}`, key };
};

const deleteFromR2 = async (key) => {
  if (!key) return;
  try { await r2Client.send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: key })); } catch (_) {}
};

export const uploadProduct = async (req, res) => {
  try {
    let { productName, details, sku, collection, collections: extraCollections, category, subcategory } = req.body;
    if (productName) productName = productName.trim();
    if (details) details = details.trim();
    if (sku) sku = sku.trim();
    if (collection) collection = collection.trim();
    ({ category, subcategory } = normalizeTaxonomy({ category, subcategory }));
    if (!productName || !details || !sku) return res.status(400).json({ success: false, message: "productName, details and sku are required" });
    const files = req.files?.length > 0 ? req.files : req.file ? [req.file] : [];
    if (files.length === 0) return res.status(400).json({ success: false, message: "At least one image file is required" });
    const uploadResults = [];
    for (const file of files) uploadResults.push(await uploadToR2(file.buffer, file.mimetype));
    const imageUrls = uploadResults.map((r) => r.url);
    const imagePublicIds = uploadResults.map((r) => r.key);
    // Parse extra collections
    let parsedCollections = [];
    if (extraCollections !== undefined) {
      try {
        if (Array.isArray(extraCollections)) {
          parsedCollections = extraCollections;
        } else if (typeof extraCollections === "string" && extraCollections.trim() !== "") {
          const trimmed = extraCollections.trim();
          parsedCollections = trimmed.startsWith("[") ? JSON.parse(trimmed) : [trimmed];
        }
      } catch {
        parsedCollections = [extraCollections].filter(Boolean);
      }
    }
    const draft = {
      productName,
      details,
      sku,
      collection: collection || undefined,
      collections: parsedCollections.filter(Boolean).map(c => c.trim()),
      category: category || undefined,
      subcategory: subcategory || undefined,
    };
    syncProductCollections(draft);
    const product = await Product.create({
      ...draft,
      image: imageUrls[0],
      imagePublicId: imagePublicIds[0],
      images: imageUrls,
      imagePublicIds,
    });
    return res.status(201).json({ success: true, message: "✅ Product uploaded successfully!", data: product });
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ success: false, message: "Product with this SKU already exists" });
    return res.status(500).json({ success: false, message: "Upload failed", error: error.message });
  }
};

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const exactFieldMatch = (value) => {
  const trimmed = String(value || "").trim();
  if (!trimmed) return null;
  const singular = trimmed.replace(/s$/i, "");
  const plural = trimmed.endsWith("s") ? trimmed : `${trimmed}s`;
  const patterns = [...new Set([trimmed, singular, plural])].map(
    (v) => new RegExp(`^${escapeRegex(v)}$`, "i")
  );
  return { $in: patterns };
};

/** Category required for catalog; subcategory optional */
const normalizeTaxonomy = ({ category, subcategory }) => {
  const cat = category?.trim() || undefined;
  const sub = subcategory?.trim() || undefined;
  return { category: cat, subcategory: sub || undefined };
};

export const listProducts = async (req, res) => {
  try {
    const { collection, category, subcategory } = req.query;
    const clauses = [];
    if (collection) {
      const collKey = collection.trim().toLowerCase();
      if (collKey === "gifting" || collKey === "coins") {
        clauses.push(buildLinkedCollectionFilter(collection, exactFieldMatch));
      } else {
        const collMatch = exactFieldMatch(collection);
        clauses.push({
          $or: [
            { collection: collMatch },
            { collections: collMatch },
          ],
        });
      }
    }
    if (category) clauses.push({ category: exactFieldMatch(category) });
    if (subcategory) {
      const typeMatch = exactFieldMatch(subcategory);
      const emptySub = {
        $or: [
          { subcategory: { $exists: false } },
          { subcategory: null },
          { subcategory: "" },
        ],
      };
      clauses.push({
        $or: [
          { subcategory: typeMatch },
          { $and: [{ category: typeMatch }, emptySub] },
        ],
      });
    }
    const filter =
      clauses.length === 0 ? {} : clauses.length === 1 ? clauses[0] : { $and: clauses };
    const products = await Product.find(filter)
      .select("productName sku image images collection collections category subcategory details createdAt")
      .sort({ createdAt: -1 })
      .lean();

    // Cache public product lists for 60s at CDN/browser level
    // Admin requests get no-cache header
    const isAdminRequest = req.headers.authorization;
    if (isAdminRequest) {
      res.set("Cache-Control", "no-store");
    } else {
      res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
    }
    return res.json({ success: true, data: products, count: products.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch products", error: error.message });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q?.trim()) return res.status(400).json({ success: false, message: "Search query is required" });
    const products = await Product.find({ $or: [{ productName: { $regex: q.trim(), $options: "i" } }, { category: { $regex: q.trim(), $options: "i" } }, { subcategory: { $regex: q.trim(), $options: "i" } }, { collection: { $regex: q.trim(), $options: "i" } }, { details: { $regex: q.trim(), $options: "i" } }] }).sort({ createdAt: -1 });
    return res.json({ success: true, data: products, count: products.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Search failed", error: error.message });
  }
};

export const getProductsBySubmenu = async (req, res) => {
  try {
    const { submenuName, menuLink, collection } = req.query;
    if (!submenuName && !menuLink) return res.status(400).json({ success: false, message: "submenuName or menuLink is required" });
    const filter = {};
    if (collection) filter.collection = { $regex: collection, $options: "i" };
    if (submenuName) filter.subcategory = { $regex: submenuName, $options: "i" };
    else if (menuLink) { const parts = menuLink.split("/").filter(Boolean); if (parts.length > 1) filter.subcategory = { $regex: parts[parts.length - 1].replace(/-/g, " "), $options: "i" }; }
    const products = await Product.find(filter).sort({ createdAt: -1 });
    return res.json({ success: true, data: products, count: products.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch products", error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    let product = null;

    // 1. Try MongoDB _id (24-char hex)
    const isObjectId = /^[a-f\d]{24}$/i.test(id);
    if (isObjectId) {
      product = await Product.findById(id);
    }
    // 2. Try slug
    if (!product) {
      product = await Product.findOne({ slug: id });
    }
    // 3. Try exact SKU
    if (!product) {
      product = await Product.findOne({ sku: id });
    }
    // 4. Try case-insensitive SKU (handles partial matches like "109" vs "T 109")
    if (!product) {
      product = await Product.findOne({ sku: { $regex: new RegExp(`^${id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") } });
    }

    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    return res.json({ success: true, data: product });
  } catch (err) {
    return res.status(400).json({ success: false, message: "Invalid id", error: err.message });
  }
};

// GET /api/products/slug/:slug — fetch product by slug
export const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug });
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    return res.json({ success: true, data: product });
  } catch (err) {
    return res.status(400).json({ success: false, message: "Invalid slug", error: err.message });
  }
};

// POST /api/products/generate-slugs — one-time migration to add slugs to existing products
export const generateSlugsForExisting = async (req, res) => {
  try {
    const products = await Product.find({ slug: { $in: [null, undefined, ""] } });
    let updated = 0;
    for (const p of products) {
      // trigger pre-save hook to generate slug
      p.markModified("productName");
      await p.save();
      updated++;
    }
    return res.json({ success: true, message: `✅ Generated slugs for ${updated} products` });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Migration failed", error: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { productName, details, sku, collection, collections: extraCollections, category, subcategory } = req.body;

    // Support both _id and SKU lookup
    const paramId = req.params.id;
    let product = null;
    const isObjectId = /^[a-f\d]{24}$/i.test(paramId);
    if (isObjectId) {
      product = await Product.findById(paramId);
    }
    if (!product) {
      product = await Product.findOne({ sku: paramId });
    }
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    const files = req.files?.length > 0 ? req.files : req.file ? [req.file] : [];
    if (files.length > 0) {
      const oldKeys = product.imagePublicIds?.length > 0 ? product.imagePublicIds : product.imagePublicId ? [product.imagePublicId] : [];
      for (const key of oldKeys) await deleteFromR2(key);
      const uploadResults = [];
      for (const file of files) uploadResults.push(await uploadToR2(file.buffer, file.mimetype));
      product.image = uploadResults[0].url;
      product.imagePublicId = uploadResults[0].key;
      product.images = uploadResults.map((r) => r.url);
      product.imagePublicIds = uploadResults.map((r) => r.key);
    }
    if (productName !== undefined) product.productName = productName.trim();
    if (details !== undefined && details.trim()) product.details = details.trim();
    if (sku !== undefined) product.sku = sku.trim();
    if (collection !== undefined) product.collection = collection?.trim() || undefined;
    // Handle extra collections array from frontend (multi-collection support)
    if (extraCollections !== undefined) {
      let parsed = [];
      try {
        if (Array.isArray(extraCollections)) {
          parsed = extraCollections;
        } else if (typeof extraCollections === "string" && extraCollections.trim() !== "") {
          const trimmed = extraCollections.trim();
          // Could be a JSON array string like '["Silver","Mens"]' or a single value
          if (trimmed.startsWith("[")) {
            parsed = JSON.parse(trimmed);
          } else {
            parsed = [trimmed];
          }
        }
      } catch {
        parsed = Array.isArray(extraCollections) ? extraCollections : [extraCollections].filter(Boolean);
      }
      product.collections = parsed.filter(Boolean).map(c => String(c).trim());
    }
    if (category !== undefined || subcategory !== undefined) {
      const tax = normalizeTaxonomy({
        category: category !== undefined ? category : product.category,
        subcategory: subcategory !== undefined ? subcategory : product.subcategory,
      });
      product.category = tax.category;
      product.subcategory = tax.subcategory;
    }
    syncProductCollections(product);
    await product.save();
    return res.json({ success: true, message: "✅ Product updated", data: product });
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ success: false, message: "SKU already exists" });
    return res.status(500).json({ success: false, message: "Update failed", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    const keys = product.imagePublicIds?.length > 0 ? product.imagePublicIds : product.imagePublicId ? [product.imagePublicId] : [];
    for (const key of keys) await deleteFromR2(key);
    await Product.deleteOne({ _id: product._id });
    return res.json({ success: true, message: "🗑️ Product deleted" });
  } catch (error) {
    return res.status(400).json({ success: false, message: "Deletion failed", error: error.message });
  }
};

export const bulkUploadProducts = async (req, res) => {
  try {
    const { products } = req.body;
    if (!Array.isArray(products) || products.length === 0) return res.status(400).json({ success: false, message: "Products array is required" });
    const results = [], errors = [];
    for (const item of products) {
      try {
        const productName = item["Product Name"]?.trim();
        const sku = item["SKU"]?.trim();
        const details = item["Description"]?.trim();
        const collection = item["Collection"]?.trim();
        const { category, subcategory } = normalizeTaxonomy({
          category: item["Category"],
          subcategory: item["Subcategory"],
        });
        if (!productName || !sku || !details) { errors.push({ row: item, error: "Missing required fields" }); continue; }
        const rawUrls = [item["Image URL"], item["Image URL 2"], item["Image URL 3"]].filter(Boolean);
        if (rawUrls.length === 0) { errors.push({ row: item, error: "At least one Image URL required" }); continue; }
        const imageUrls = [], imagePublicIds = [];
        for (const imgUrl of rawUrls) {
          try {
            const resp = await axios.get(imgUrl, { responseType: "arraybuffer", timeout: 30000 });
            const result = await uploadToR2(Buffer.from(resp.data), resp.headers["content-type"] || "image/jpeg");
            imageUrls.push(result.url); imagePublicIds.push(result.key);
          } catch (e) { console.error(`Image upload failed: ${imgUrl}`, e.message); }
        }
        if (imageUrls.length === 0) { errors.push({ row: item, error: "Failed to upload any images" }); continue; }
        const draft = {
          productName,
          details,
          sku,
          collection: collection || undefined,
          category: category || undefined,
          subcategory: subcategory || undefined,
        };
        syncProductCollections(draft);
        const product = await Product.create({
          ...draft,
          image: imageUrls[0],
          imagePublicId: imagePublicIds[0],
          images: imageUrls,
          imagePublicIds,
        });
        results.push(product);
      } catch (err) {
        errors.push({ row: item, error: err?.code === 11000 ? "SKU already exists" : err.message });
      }
    }
    return res.json({ success: true, count: results.length, errors: errors.length ? errors : undefined, message: `Uploaded ${results.length} products${errors.length ? `, ${errors.length} failed` : ""}` });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Bulk upload failed", error: error.message });
  }
};

export const uploadProductJson = async (req, res) => {
  try {
    let { productName, details, sku, imageUrl, imageBase64, mimeType, collection, category, subcategory } = req.body || {};
    if (productName) productName = productName.trim();
    if (details) details = details.trim();
    if (sku) sku = sku.trim();
    if (!productName || !details || !sku) return res.status(400).json({ success: false, message: "productName, details and sku are required" });
    if (!imageUrl && !imageBase64) return res.status(400).json({ success: false, message: "Provide either imageUrl or imageBase64" });
    let buffer, mime;
    if (imageUrl) {
      const resp = await axios.get(imageUrl, { responseType: "arraybuffer", timeout: 30000 });
      buffer = Buffer.from(resp.data); mime = resp.headers["content-type"] || "image/jpeg";
    } else {
      const base64Data = imageBase64.startsWith("data:") ? imageBase64.split(",")[1] : imageBase64;
      buffer = Buffer.from(base64Data, "base64"); mime = mimeType || "image/jpeg";
    }
    const result = await uploadToR2(buffer, mime);
    const tax = normalizeTaxonomy({ category, subcategory });
    const draft = {
      productName,
      details,
      sku,
      collection: collection?.trim() || undefined,
      category: tax.category,
      subcategory: tax.subcategory,
    };
    syncProductCollections(draft);
    const product = await Product.create({
      ...draft,
      image: result.url,
      imagePublicId: result.key,
    });
    return res.status(201).json({ success: true, message: "✅ Product uploaded successfully!", data: product });
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ success: false, message: "SKU already exists" });
    return res.status(500).json({ success: false, message: "Upload failed", error: error.message });
  }
};
