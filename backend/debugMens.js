import dns from "dns";
dns.setDefaultResultOrder("ipv4first"); // Force IPv4 DNS resolution
dns.setServers(["8.8.8.8", "8.8.4.4"]); // Use Google DNS for reliable SRV lookups

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const normalizeMatchValue = (value) => String(value || "").trim().replace(/[’']/g, "").replace(/\s+/g, " ").trim();

const buildCollectionMatch = (value) => {
  const normalized = normalizeMatchValue(value);
  if (!normalized) return null;

  const singular = normalized.replace(/s$/i, "");
  const plural = normalized.endsWith("s") ? normalized : `${normalized}s`;
  const variants = [...new Set([normalized, singular, plural])].filter(Boolean);

  if (variants.length === 0) return null;
  return new RegExp(`^(?:${variants.map((v) => escapeRegex(v)).join("|")})$`, "i");
};

const main = async () => {
  try {
    await mongoose.connect("mongodb+srv://vinayakjewellersjaipur12_db_user:SiQMVE20gmna0aHf@cluster0.fby24xy.mongodb.net/vinayakjewellers?retryWrites=true&w=majority", { ssl: true, tls: true, family: 4 });
    
    const collection = "Mens";
    const collMatch = buildCollectionMatch(collection);
    
    const filter = {
      $or: [
        { collection: collMatch },
        { collections: collMatch },
      ],
    };
    
    console.log("Filter used:", JSON.stringify(filter, (k, v) => v instanceof RegExp ? v.toString() : v));
    
    const results = await Product.find(filter).lean();
    console.log("Found products count:", results.length);
    console.log(results.map(p => ({ sku: p.sku, collection: p.collection, collections: p.collections })));
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
};

main();
