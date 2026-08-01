# Implementation Plan: Collections Dynamic Filter

## Overview

Convert `src/app/[category]/page.jsx` from static data to a live API-driven page with a three-level (collection → category → subcategory) filter. All work is scoped to that one file plus lightweight test files. `listCategoriesGroupedApi` and `listProductsApi` already exist in `src/lib/adminApi.js` and require no changes.

## Tasks

- [ ] 1. Add state, cache ref, and helper utilities for the collections route
  - [ ] 1.1 Add filter state, data state, UI state, and cache ref inside `CategoryPage`
    - Declare `activeCollection`, `activeCategory`, `activeSubcategory` (all `useState(null)`)
    - Declare `groupedCategories` (`useState({})`), `products` (`useState([])`), `loading` (`useState(true)`), `error` (`useState(null)`)
    - Declare `fetchCache` as `useRef({})` for session-level result caching
    - Add imports: `useRef` (extend existing React import), `listProductsApi`, `listCategoriesGroupedApi` from `@/lib/adminApi`
    - _Requirements: 1.1, 1.3, 5.1, 5.4_

  - [ ] 1.2 Implement `buildParams` and `cacheKey` helper functions inside the component
    - `buildParams(collection, category, subcategory)` — returns an object with only the truthy keys
    - `cacheKey(params)` — returns `JSON.stringify(params)` for cache lookup
    - _Requirements: 5.2, 5.4_

  - [ ]* 1.3 Write property tests for `buildParams` and `cacheKey`
    - Use **fast-check** (`fc.option(fc.string())` for each param)
    - **Property 6 (partial):** `buildParams` must omit falsy values so only truthy params appear in the result object
    - **Validates: Requirements 5.2**
    - Place tests in `src/app/[category]/__tests__/filterHelpers.test.js`

- [ ] 2. Implement parallel initial fetch and derived filter data for the collections route
  - [ ] 2.1 Add `useEffect` that fires on mount when `category === "collections"`, fetching categories and products concurrently with `Promise.all`
    - Call `Promise.all([listCategoriesGroupedApi(), listProductsApi({})])` in a single effect
    - On success: set `groupedCategories` from `data.data`, set `products` from products response, prime `fetchCache.current["{}"]` with the initial products, set `loading(false)`
    - On partial failure (only products fail): set `error("products")`, still populate `groupedCategories`
    - On full failure (both fail): set `error("both")`
    - _Requirements: 1.1, 1.2, 5.1, 5.5, 8.1, 8.3_

  - [ ] 2.2 Add `useMemo` derivations for `collectionNames`, `categoriesForActive`, and `subcategoriesForActive`
    - `collectionNames` — `Object.keys(groupedCategories)`
    - `categoriesForActive` — all flattened when `activeCollection` is null, otherwise `groupedCategories[activeCollection] ?? []`
    - `subcategoriesForActive` — empty array when `activeCategory` is null, otherwise the `subcategories` array of the matching category record
    - _Requirements: 2.2, 3.1, 3.2, 4.1_

  - [ ]* 2.3 Write property tests for filter derivation logic (pure functions extracted from the memos)
    - Extract derivation logic into pure functions `deriveCategories(grouped, activeCollection)` and `deriveSubcategories(categoriesForActive, activeCategory)` for testability
    - **Property 1:** For any `fc.dictionary(fc.string(), fc.array(...))` grouped data, `Object.keys(grouped)` equals the collection names list — **Validates: Requirements 1.2, 2.2**
    - **Property 3:** `deriveCategories(grouped, col)` returns exactly `grouped[col]` entries when a collection is active — **Validates: Requirements 3.1**
    - **Property 5:** `deriveSubcategories` returns exactly the `subcategories` array of the matched record, or `[]` when none match — **Validates: Requirements 4.1, 4.3**
    - Place tests in `src/app/[category]/__tests__/filterDerivations.test.js`

- [ ] 3. Implement filter change handlers with cascade resets and cached fetching
  - [ ] 3.1 Implement `handleCollectionSelect(col)` handler
    - Sets `activeCollection` to `col` (or `null` for "All Jewellery")
    - Resets `activeCategory` and `activeSubcategory` to `null`
    - Calls `fetchProducts({ collection: col })` (skip if `col` is null)
    - _Requirements: 2.3, 2.4, 2.6_

  - [ ] 3.2 Implement `handleCategorySelect(cat)` handler
    - Sets `activeCategory` to `cat` (or `null` for "All")
    - Resets `activeSubcategory` to `null`
    - Calls `fetchProducts({ collection: activeCollection, category: cat })`
    - _Requirements: 3.3, 3.4_

  - [ ] 3.3 Implement `handleSubcategorySelect(sub)` handler
    - Sets `activeSubcategory` to `sub` (or `null` to clear)
    - Calls `fetchProducts({ collection: activeCollection, category: activeCategory, subcategory: sub })`
    - _Requirements: 4.2, 4.4_

  - [ ] 3.4 Implement `fetchProducts(params)` — the shared fetch helper used by all three handlers
    - Compute `key = cacheKey(buildParams(...))` and return cached result early if hit (no API call)
    - Set `loading(true)`, `error(null)`, call `listProductsApi(params)`
    - On success: store result in `fetchCache.current[key]`, set `products`, set `loading(false)`
    - On failure: set `error("products")`, set `loading(false)`
    - _Requirements: 2.5, 5.2, 5.4, 8.1_

  - [ ]* 3.5 Write property tests for filter state cascade resets
    - **Property 2:** For any `(activeCategory, activeSubcategory)` state, calling `handleCollectionSelect` with any value sets both to `null` — **Validates: Requirements 2.6**
    - **Property 4:** For any `activeSubcategory` state, calling `handleCategorySelect` with any value sets `activeSubcategory` to `null` — **Validates: Requirements 3.4**
    - Test using React Testing Library with `renderHook` or by rendering the component with mocked API
    - Place tests in `src/app/[category]/__tests__/filterHandlers.test.js`

  - [ ]* 3.6 Write property tests for cache behaviour
    - **Property 7:** After mount, `listCategoriesGroupedApi` call count is 1 regardless of N filter changes (`fc.integer({ min: 1, max: 20 })`) — **Validates: Requirements 5.1**
    - **Property 8:** Applying the same filter state twice results in `listProductsApi` being called exactly once — **Validates: Requirements 5.4**
    - Place tests in `src/app/[category]/__tests__/fetchCache.test.js`

- [ ] 4. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Replace the collections sidebar UI with dynamic filter panel
  - [ ] 5.1 Replace the static `collectionSidebar.map(...)` block with the three-section dynamic filter panel
    - Section 1 (Collections): "All Jewellery" button + `collectionNames.map(...)` buttons, active state driven by `activeCollection`
    - Section 2 (Categories): "All" button + `categoriesForActive.map(c => c.category)` buttons, active state driven by `activeCategory`; only rendered when `collectionNames.length > 0`
    - Section 3 (Subcategory pills): `subcategoriesForActive.map(...)` pill buttons; the whole row hidden when `subcategoriesForActive.length === 0`
    - Wire `onClick` handlers to `handleCollectionSelect`, `handleCategorySelect`, `handleSubcategorySelect`
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 4.1, 4.3, 7.1, 7.3_

  - [ ] 5.2 Apply responsive sidebar-to-pills layout for mobile
    - Desktop (>900px): existing `.cat-sidebar-list` vertical column layout
    - Mobile (≤900px): existing horizontal scroll row, `scrollbar-width: none` / `overflow-x: auto` — already handled by existing media queries; verify sections stack correctly at ≤900px
    - _Requirements: 7.1, 7.2, 7.4_

  - [ ]* 5.3 Write unit tests for Filter_Panel rendering from grouped data
    - Render the collections page with mocked `listCategoriesGroupedApi` returning known data
    - Assert "All Jewellery" is always the first button
    - Assert the number of collection buttons equals `Object.keys(groupedData).length + 1`
    - Assert category buttons update when a collection is clicked
    - Assert subcategory pill row is hidden when `subcategories` is empty
    - _Requirements: 2.1, 2.2, 4.3_

- [ ] 6. Update product card to use live API field mapping
  - [ ] 6.1 Update the product grid render inside the `category === "collections"` branch to use API field names
    - Replace `p.id` → `p._id` as React key and for cart deduplication
    - Replace `p.title` → `p.productName` for card title display
    - Replace `p.images[0]` → `p.images?.[0] || p.image` for the `<Image>` src
    - Replace `/product/${p.slug}` → `/product/${p.sku}` for the `<Link>` href
    - _Requirements: 6.1, 6.2, 6.3, 6.5_

  - [ ] 6.2 Update enquiry popup and cart logic to use `p._id` instead of `p.id`
    - Change `oldCart.some(item => item.id === selectedProduct.id)` → `item._id === selectedProduct._id`
    - Change `enquiryCart.some(item => item.id === p.id)` → `item._id === p._id`
    - _Requirements: 6.3, 6.4_

  - [ ]* 6.3 Write property tests for product card image fallback and cart deduplication
    - **Property 9:** For any product with `fc.oneof(fc.constant([]), fc.array(fc.string(), { minLength: 1 }))` for `images` and a string `image` field, the resolved image is `images[0]` when non-empty, else `image` — **Validates: Requirements 6.1**
    - **Property 10:** Adding the same product (`_id` as key) twice leaves the cart with exactly one entry for that `_id` — **Validates: Requirements 6.3, 6.4**
    - Place tests in `src/app/[category]/__tests__/productCard.test.js`

- [ ] 7. Implement loading, error, and empty states in the product grid
  - [ ] 7.1 Add loading skeleton/spinner inside the `cat-grid-wrap` section, shown when `loading === true`
    - Display a spinner or a set of skeleton `<div>` placeholders in place of the product grid while `loading` is true
    - Hide spinner and show grid (or empty/error state) when `loading` is false
    - _Requirements: 2.5, 8.1_

  - [ ] 7.2 Add error state UI inside the product grid area
    - When `error === "products"` or `error === "both"`: show a user-friendly error message
    - Include a "Try again" `<button>` that re-invokes the appropriate fetch calls
    - When `error === "both"`, re-run `Promise.all([listCategoriesGroupedApi(), listProductsApi({})])` on retry
    - When `error === "products"`, re-run only `fetchProducts(buildParams(activeCollection, activeCategory, activeSubcategory))` on retry
    - _Requirements: 1.5, 8.3, 8.4_

  - [ ] 7.3 Show "No products found for this filter." message when `loading` is false, `error` is null, and `products.length === 0`
    - Replace the current `cat-no-products` static text with this conditional render
    - _Requirements: 1.4, 8.2_

  - [ ]* 7.4 Write unit tests for loading, error, and empty states
    - Mock `listProductsApi` to return a rejected promise → assert error banner and "Try again" button render
    - Mock both APIs to reject → assert full-page error renders
    - Mock `listProductsApi` to resolve with `{ success: true, data: [] }` → assert "No products found for this filter." renders
    - Mock APIs with a pending promise → assert loading indicator is visible
    - _Requirements: 1.4, 1.5, 8.1, 8.2, 8.3_

  - [ ]* 7.5 Write property test for retry behaviour
    - **Property 11:** For any error state (`"products"` | `"categories"` | `"both"`), clicking "Try again" re-invokes the appropriate API function(s) — **Validates: Requirements 8.4**
    - Place test in `src/app/[category]/__tests__/retryBehaviour.test.js`

- [ ] 8. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- All test files go under `src/app/[category]/__tests__/`; use **Vitest** (already in the project via Next.js) with **@testing-library/react** and **fast-check**
- `listCategoriesGroupedApi` already exists in `adminApi.js` — no API file changes needed
- The non-collections routes (`/gold`, `/silver`, etc.) must remain completely unaffected; guard all new logic behind `if (category === "collections")`
- The existing popup, enquiry cart, and responsive styles are reused with minimal changes

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["1.3", "2.1", "2.2"] },
    { "id": 2, "tasks": ["2.3", "3.1", "3.2", "3.3", "3.4"] },
    { "id": 3, "tasks": ["3.5", "3.6", "5.1"] },
    { "id": 4, "tasks": ["5.2", "5.3", "6.1", "6.2"] },
    { "id": 5, "tasks": ["6.3", "7.1", "7.2", "7.3"] },
    { "id": 6, "tasks": ["7.4", "7.5"] }
  ]
}
```
