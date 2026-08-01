# Design Document: Collections Dynamic Filter

## Overview

This design replaces the static, hardcoded data on `src/app/[category]/page.jsx` (specifically the `/collections` route) with live data fetched from the Express/MongoDB backend. A three-level hierarchical filter — collection → category → subcategory — is driven entirely by API data. Products are fetched server-side on each filter change using the existing `listProductsApi`. Categories are fetched once on mount using `listCategoriesGroupedApi` and cached in component state for the session.

The work is scoped to a single file: `src/app/[category]/page.jsx`. The backend already supports all required query parameters (`collection`, `category`, `subcategory`) on `GET /api/products`. No backend changes are needed.

---

## Architecture

The feature lives entirely on the frontend. The component is already a Client Component (`"use client"`), so all state, effects, and fetch calls run in the browser.

```mermaid
flowchart TD
    subgraph Browser
        A[CategoryPage mounts] -->|category === "collections"| B[useEffect - parallel fetch]
        B --> C[listCategoriesGroupedApi]
        B --> D[listProductsApi - no params]
        C --> E[groupedCategories state]
        D --> F[products state]
        E --> G[Filter_Panel renders collection list]
        F --> H[Product_Grid renders cards]

        G -->|user clicks collection| I[setActiveCollection]
        I --> J[reset category + subcategory]
        J --> K[listProductsApi - collection param]
        K --> F

        G -->|user clicks category| L[setActiveCategory]
        L --> M[reset subcategory]
        M --> N[listProductsApi - collection + category params]
        N --> F

        G -->|user clicks subcategory pill| O[setActiveSubcategory]
        O --> P[listProductsApi - all 3 params]
        P --> F
    end

    subgraph Backend
        K & N & P --> Q[GET /api/products?collection=&category=&subcategory=]
        C --> R[GET /api/categories/grouped]
    end
```

**Key decisions:**

- **`listCategoriesGroupedApi`** is used instead of `listCategoriesApi` because the grouped endpoint returns `{ collectionName: [{ category, subcategories }] }` — this is exactly the shape needed to derive all three filter levels in one call, avoiding a second API call.
- **No client-side filtering** — the filter state is passed directly as query parameters to `listProductsApi`. The backend already handles all three filter dimensions.
- **Parallel initial fetch** — categories and initial products are fetched concurrently with `Promise.all` to minimise time-to-first-render.
- **Result cache** — a `useRef` map keyed by serialised filter state avoids re-fetching the same combination during a session.

---

## Components and Interfaces

### State Shape

```js
// Filter state
const [activeCollection, setActiveCollection] = useState(null); // null = "All Jewellery"
const [activeCategory, setActiveCategory]     = useState(null); // null = "All"
const [activeSubcategory, setActiveSubcategory] = useState(null);

// Data state
const [groupedCategories, setGroupedCategories] = useState({}); // { "Gold": [{category, subcategories}], ... }
const [products, setProducts]                   = useState([]);

// UI state
const [loading, setLoading]     = useState(true);
const [error, setError]         = useState(null); // null | "products" | "both"

// Cache
const fetchCache = useRef({}); // { "cacheKey": product[] }
```

### Filter State → API Params

```js
function buildParams(collection, category, subcategory) {
  const params = {};
  if (collection)   params.collection  = collection;
  if (category)     params.category    = category;
  if (subcategory)  params.subcategory = subcategory;
  return params;
}

function cacheKey(params) {
  return JSON.stringify(params);
}
```

### Filter Panel (Collections-specific)

The filter panel is only rendered when `category === "collections"`. For other category routes, the existing pills behaviour is preserved.

**Desktop (>900px):** Vertical sidebar with three sections stacked:
1. Collection list — buttons (All Jewellery + one per collection key from `groupedCategories`)
2. Category list — buttons filtered to `activeCollection` (or all when null)
3. Subcategory pills — pills from `subcategories[]` of the active category record

**Mobile (≤900px):** The sidebar collapses to a horizontal scroll row. All three levels become a single flat scrollable row of pills showing the currently relevant level (collection by default, advancing to category/subcategory as selections are made), or all three levels stacked as scrollable rows.

### Product Card

The card reads live API data. Key field mapping from static to dynamic:

| Old (static)       | New (API)             |
|--------------------|-----------------------|
| `p.id`             | `p._id`               |
| `p.title`          | `p.productName`       |
| `p.images[0]`      | `p.images?.[0] \|\| p.image` |
| `/product/${p.slug}` | `/product/${p.sku}` |

---

## Data Models

### API Response — `listCategoriesGroupedApi`

```js
// GET /api/categories/grouped
{
  success: true,
  data: {
    "Gold":              [{ _id: "...", category: "Neckwear",  subcategories: ["Gold Chains", "Necklaces"] }],
    "Silver":            [{ _id: "...", category: "Earrings",  subcategories: [] }],
    "Diamond":           [...],
    "Gifting":           [...],
    "Wedding Collection":[...],
    "Birth Stones":      [...],
    "Coins":             [...],
    "Mens":              [...]
  }
}
```

### API Response — `listProductsApi`

```js
// GET /api/products?collection=Gold&category=Neckwear&subcategory=Gold%20Chains
{
  success: true,
  data: [
    {
      _id:          "64f1a2...",
      productName:  "22K Gold Chain",
      sku:          "VJ-001",
      image:        "https://cdn.example.com/...",
      images:       ["https://cdn.example.com/..."],
      collection:   "Gold",
      category:     "Neckwear",
      subcategory:  "Gold Chains",
      details:      "...",
      createdAt:    "2024-01-01T00:00:00.000Z"
    }
  ],
  count: 1
}
```

### Derived Filter Data (component state)

```js
// Derived from groupedCategories
const collectionNames = Object.keys(groupedCategories); // ["Gold", "Silver", ...]

const categoriesForActiveCollection =
  activeCollection === null
    ? Object.values(groupedCategories).flat()          // all categories
    : groupedCategories[activeCollection] ?? [];

const subcategoriesForActiveCategory =
  activeCategory === null
    ? []
    : categoriesForActiveCollection
        .find(c => c.category === activeCategory)
        ?.subcategories ?? [];
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Filter options match API category data

*For any* grouped categories response, the collection filter buttons rendered by the Filter_Panel shall contain exactly the keys present in the response — no more, no fewer — including the "All Jewellery" default option.

**Validates: Requirements 1.2, 2.2**

---

### Property 2: Collection selection resets dependent filters

*For any* current filter state where category and/or subcategory are active, selecting any collection (including "All Jewellery") shall reset both `activeCategory` and `activeSubcategory` to null.

**Validates: Requirements 2.6**

---

### Property 3: Category filter shows only its collection's categories

*For any* active collection selected from the Filter_Panel, the categories displayed shall be exactly those associated with that collection in the cached grouped categories data — no categories from other collections shall appear.

**Validates: Requirements 3.1**

---

### Property 4: Category selection resets subcategory

*For any* filter state where a subcategory is active, selecting any category shall reset `activeSubcategory` to null.

**Validates: Requirements 3.4**

---

### Property 5: Subcategory pills match category record

*For any* active category, the subcategory pills rendered shall contain exactly the strings in that category's `subcategories` array from the cached data. When the array is empty, no pill row is rendered.

**Validates: Requirements 4.1, 4.3**

---

### Property 6: Filter change triggers single API call with correct params

*For any* combination of (collection, category, subcategory) filter state, changing any filter dimension shall result in exactly one call to `listProductsApi` carrying the current filter values as query parameters — and no client-side filtering of a cached full product list.

**Validates: Requirements 5.2**

---

### Property 7: Categories fetched exactly once per session

*For any* sequence of filter interactions within a page session, `listCategoriesGroupedApi` shall be called exactly once (on mount) regardless of how many times filters are changed.

**Validates: Requirements 5.1**

---

### Property 8: Duplicate filter state does not re-fetch

*For any* filter state (collection, category, subcategory) that has been fetched once, selecting the same combination again shall not trigger a second `listProductsApi` call — the cached result shall be used instead.

**Validates: Requirements 5.4**

---

### Property 9: Product card image fallback is correct

*For any* product from the API response, the image rendered in the Product_Card shall be `product.images[0]` if `product.images` is a non-empty array, and `product.image` otherwise.

**Validates: Requirements 6.1**

---

### Property 10: Enquiry cart deduplication uses _id

*For any* product added to the enquiry cart, adding the same product a second time shall leave the cart with exactly one entry for that product, identified by `product._id`.

**Validates: Requirements 6.3, 6.4**

---

### Property 11: Retry re-executes failed API calls

*For any* initial load failure, clicking the "Try again" button shall re-invoke both `listProductsApi` and `listCategoriesGroupedApi`.

**Validates: Requirements 8.4**

---

## Error Handling

| Scenario | Behaviour |
|---|---|
| `listProductsApi` fails on mount | Show error banner; categories still render if that succeeded; "Try again" button re-runs the product fetch |
| Both APIs fail on mount | Show full-page error with "Try again" button that re-runs both in parallel |
| `listProductsApi` fails on filter change | Show error banner in product grid area; preserve current filter selection; offer retry |
| API returns `success: false` | Treat same as network failure — show error state |
| Empty product list (`data: []`) | Show "No products found for this filter." in the grid area (not an error state) |
| `listCategoriesGroupedApi` returns empty `{}` | Filter panel shows only "All Jewellery" with no sub-options; products still load |

Error state is stored as a string enum in component state: `null | "products" | "categories" | "both"`. This allows the retry logic to re-run only the failed calls.

---

## Testing Strategy

This feature involves UI rendering, client-side state transitions, and fetch orchestration. Property-based testing is applicable for the filter logic and data-mapping properties. The testing library is **fast-check** (JavaScript PBT library compatible with Jest/Vitest).

### Unit / Example Tests

- Initial render shows "All Jewellery" selected
- Loading spinner appears during product fetch
- "No products found for this filter." message shown when `data` is empty
- Error banner and retry button shown when both APIs fail
- Product card renders `productName`, correct image, and link to `/product/[sku]`
- Selecting a subcategory pill triggers fetch with all three params

### Property-Based Tests (fast-check)

Each property test uses a minimum of 100 iterations.

**Feature: collections-dynamic-filter, Property 1**: Filter options match API category data
```js
// Arbitrary: fc.dictionary of collection names to arrays of category records
// Assert: rendered collection buttons === Object.keys(groupedData) + ["All Jewellery"]
```

**Feature: collections-dynamic-filter, Property 2**: Collection selection resets dependent filters
```js
// Arbitrary: any (collection, category, subcategory) starting state, any new collection
// Assert: after setActiveCollection, both activeCategory and activeSubcategory are null
```

**Feature: collections-dynamic-filter, Property 3**: Category filter shows only its collection's categories
```js
// Arbitrary: groupedCategories data, any collection key
// Assert: rendered category buttons === groupedCategories[collection].map(c => c.category)
```

**Feature: collections-dynamic-filter, Property 4**: Category selection resets subcategory
```js
// Arbitrary: any (category, subcategory) state, any new category value
// Assert: after setActiveCategory, activeSubcategory is null
```

**Feature: collections-dynamic-filter, Property 5**: Subcategory pills match category record
```js
// Arbitrary: any category record with subcategories array
// Assert: rendered pills === category.subcategories (or no row if empty)
```

**Feature: collections-dynamic-filter, Property 6**: Filter change triggers single API call with correct params
```js
// Arbitrary: any filter (collection?, category?, subcategory?) combination
// Assert: listProductsApi called once with exactly those params (mocked)
```

**Feature: collections-dynamic-filter, Property 7**: Categories fetched exactly once per session
```js
// Arbitrary: any sequence of N filter changes (N drawn from 1..20)
// Assert: listCategoriesGroupedApi call count === 1
```

**Feature: collections-dynamic-filter, Property 8**: Duplicate filter state does not re-fetch
```js
// Arbitrary: any filter state applied twice
// Assert: listProductsApi total call count === 1
```

**Feature: collections-dynamic-filter, Property 9**: Product card image fallback is correct
```js
// Arbitrary: product with fc.oneof(empty images array + image field, non-empty images array)
// Assert: rendered img src === expected fallback value
```

**Feature: collections-dynamic-filter, Property 10**: Enquiry cart deduplication uses _id
```js
// Arbitrary: any product, add it twice to cart
// Assert: cart.filter(i => i._id === product._id).length === 1
```

**Feature: collections-dynamic-filter, Property 11**: Retry re-executes failed API calls
```js
// Arbitrary: any error state ("products" | "categories" | "both")
// Assert: clicking retry triggers the appropriate API calls again
```

### Integration Tests

- Verify categories and initial products fetches are initiated concurrently (both fetch calls fire within the same event loop tick using `Promise.all`)
- Verify the page renders correctly end-to-end against the real backend (smoke test in CI)
