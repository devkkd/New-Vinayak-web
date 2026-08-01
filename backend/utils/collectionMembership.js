/** Shared Gifting ↔ Coins products (silver frames, religious coins, etc.) */

export function isGiftingAndCoinsSharedProduct(product) {
  const name = (product.productName || "").toLowerCase();
  const cat = (product.category || "").toLowerCase();
  const sub = (product.subcategory || "").toLowerCase();
  const coll = (product.collection || "").toLowerCase();
  const details = (product.details || "").toLowerCase();
  const blob = `${name} ${cat} ${sub} ${details}`;

  if (!["gifting", "coins"].includes(coll) && !cat.includes("coin") && !sub.includes("coin")) {
    return false;
  }

  if (/\bcoins?\b/.test(blob)) return true;
  if (/\bsilver\s+frame/.test(blob)) return true;
  if (/\bfine\s+silver/.test(blob) && /\bframe/.test(blob)) return true;
  if (/\b999/.test(blob) && /\bsilver/.test(blob)) return true;
  if (cat.includes("coin") || sub.includes("coin")) return true;
  if (/\b(gold|silver)\s+coins?\b/.test(blob)) return true;

  return false;
}

const coinLikeRegex = /coin|silver\s+frame|fine\s+silver|999\.?0/i;

export function buildLinkedCollectionFilter(collectionName, exactFieldMatch) {
  const target = collectionName.trim();
  const other = target.toLowerCase() === "gifting" ? "Coins" : "Gifting";
  const coinLikeClause = {
    $or: [
      { category: { $regex: coinLikeRegex } },
      { subcategory: { $regex: coinLikeRegex } },
      { productName: { $regex: coinLikeRegex } },
      { details: { $regex: coinLikeRegex } },
    ],
  };

  return {
    $or: [
      { collection: exactFieldMatch(target) },
      { collections: exactFieldMatch(target) },
      {
        $and: [
          { collection: exactFieldMatch(other) },
          coinLikeClause,
        ],
      },
    ],
  };
}

export function syncProductCollections(product) {
  const set = new Set();
  if (product.collection) set.add(product.collection.trim());
  for (const c of product.collections || []) {
    if (c?.trim()) set.add(c.trim());
  }
  if (isGiftingAndCoinsSharedProduct(product)) {
    if (set.has("Gifting")) set.add("Coins");
    if (set.has("Coins")) set.add("Gifting");
  }
  product.collections = [...set];
  return product;
}
