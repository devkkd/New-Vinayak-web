# Requirements Document

## Introduction

This feature replaces the static, hardcoded product and category data on the `/collections` page (and all category pages served by `[category]/page.jsx`) with dynamic data fetched from the live backend API. It adds a robust, performant filter system — by collection, category, and subcategory — that derives its filter options directly from the real data rather than a hardcoded list. Products and categories load fast by reusing the existing `listProductsApi` and `listCategoriesApi` fetch utilities in `src/lib/adminApi.js`, avoiding any redundant API calls.

## Glossary

- **Collections_Page**: The Next.js page rendered at `/collections`, currently using static data from `lib/data.js`, identified by `category === "collections"` in `[category]/page.jsx`.
- **Category_Page**: Any page under `[category]/page.jsx` that renders jewellery by type (gold, silver, diamond, etc.).
- **Filter_Panel**: The UI element (sidebar on desktop, horizontal scroll pills on mobile) that presents filter options to the visitor.
- **Active_Filter**: The currently selected filter value used to narrow the visible product grid.
- **Product_Grid**: The responsive grid section displaying product cards.
- **Filter_State**: The combination of active collection, category, and subcategory values at any given time.
- **API_Client**: The functions in `src/lib/adminApi.js` — specifically `listProductsApi` and `listCategoriesApi` — used to talk to the Express/MongoDB backend.
- **Collection**: A top-level grouping of products (e.g., Gold, Silver, Diamond, Gifting, Coins, Wedding Collection, Birth Stones, Mens).
- **Category**: A mid-level grouping within a collection (e.g., Neckwear, Earrings, Rings).
- **Subcategory**: An optional further grouping within a category (e.g., Gold Chains, Necklaces, Mangalsutras).
- **Product_Card**: A single product item displayed in the Product_Grid, showing image, name, and an enquiry button.
- **Enquiry_Cart**: The localStorage-backed cart for adding products before submitting an enquiry.

---

## Requirements

### Requirement 1: Replace Static Data with Live API Data on the Collections Page

**User Story:** As a visitor, I want the `/collections` page to show real products from the store's catalogue, so that the products and filter options always reflect what is actually in stock.

#### Acceptance Criteria

1. WHEN the `/collections` page is loaded, THE Collections_Page SHALL fetch all products from the backend using `listProductsApi` and display them in the Product_Grid.
2. WHEN the `/collections` page is loaded, THE Collections_Page SHALL fetch all available categories from the backend using `listCategoriesApi` (or `listCategoriesGroupedApi`) and derive the Filter_Panel options from the response.
3. THE Collections_Page SHALL replace all references to static `products` and `collectionSidebar` arrays from `lib/data.js` with data fetched from the API_Client.
4. WHEN the API_Client returns an empty product array, THE Collections_Page SHALL display a "No products found" message in the Product_Grid area.
5. IF the `listProductsApi` call fails, THEN THE Collections_Page SHALL display an error state indicating products could not be loaded, without crashing the page.

---

### Requirement 2: Dynamic Collection Filter (Sidebar)

**User Story:** As a visitor on the `/collections` page, I want to filter products by collection (Gold, Silver, Diamond, etc.) using the sidebar, so that I can narrow down to the jewellery type I am interested in.

#### Acceptance Criteria

1. THE Filter_Panel SHALL display an "All Jewellery" option as the default selected filter when the page first loads.
2. WHEN the backend returns category data, THE Filter_Panel SHALL populate the collection filter options dynamically from the distinct collection values present in the category data — not from a hardcoded array.
3. WHEN a visitor clicks a collection filter option, THE Collections_Page SHALL update the Product_Grid to show only products belonging to that collection, using the `collection` query parameter supported by `listProductsApi`.
4. WHEN the "All Jewellery" filter is active, THE Collections_Page SHALL display all products without any collection filter applied.
5. WHILE a filtered product fetch is in progress, THE Collections_Page SHALL display a loading indicator in the Product_Grid area.
6. WHEN the active collection filter changes, THE Collections_Page SHALL reset the active category and subcategory filter to their default (unfiltered) state.

---

### Requirement 3: Dynamic Category Filter

**User Story:** As a visitor, I want to further filter products by category within a selected collection, so that I can find specific types of jewellery (e.g., Rings, Earrings) quickly.

#### Acceptance Criteria

1. WHEN a collection filter is active, THE Filter_Panel SHALL display the category options available within that collection, derived from the API-fetched category data.
2. WHEN "All Jewellery" is the active collection filter, THE Filter_Panel SHALL display all distinct categories across all collections.
3. WHEN a visitor selects a category, THE Collections_Page SHALL fetch products filtered by both the active collection and the selected category using the `category` query parameter of `listProductsApi`.
4. WHEN the active category filter changes, THE Collections_Page SHALL reset the active subcategory filter to its default (unfiltered) state.
5. IF a collection has no associated categories in the backend data, THEN THE Filter_Panel SHALL display only the "All" category option for that collection, without any visual distinction from a collection that does have categories.

---

### Requirement 4: Dynamic Subcategory Filter (Pills)

**User Story:** As a visitor, I want to filter by subcategory (e.g., Gold Chains, Mangalsutra) within a selected category, so that I can pinpoint exactly the product type I want.

#### Acceptance Criteria

1. WHEN a category filter is active, THE Filter_Panel SHALL display subcategory pill buttons derived from the `subcategories` array of the selected category record returned by the API.
2. WHEN a visitor clicks a subcategory pill, THE Collections_Page SHALL fetch products filtered by the active collection, active category, and selected subcategory, using the `subcategory` query parameter of `listProductsApi`.
3. WHEN a category has no subcategories in the backend data, THE Filter_Panel SHALL hide the subcategory pill row entirely.
4. WHEN no subcategory is selected, THE Collections_Page SHALL display all products matching only the active collection and category filters.

---

### Requirement 5: Efficient Data Fetching — No Redundant API Calls

**User Story:** As a developer, I want the filter feature to reuse existing fetch logic and minimise unnecessary API requests, so that the page loads fast and the backend is not overloaded.

#### Acceptance Criteria

1. THE Collections_Page SHALL fetch categories exactly once on initial page mount and cache the result in component state for the lifetime of the page session, without refetching on filter changes.
2. WHEN a filter is changed, THE Collections_Page SHALL fetch products using the updated filter parameters in a single `listProductsApi` call — not by fetching all products and filtering client-side.
3. THE Collections_Page SHALL use the existing `listProductsApi` and `listCategoriesApi` functions from `src/lib/adminApi.js` as the sole data-fetching mechanism — no new fetch wrappers or duplicate API call logic SHALL be introduced.
4. WHEN the same Filter_State is selected a second time within a page session, THE Collections_Page SHALL not make a duplicate API call if the data was already fetched for that combination.
5. THE Collections_Page SHALL initiate the categories fetch and the initial products fetch in parallel (concurrently), not sequentially.

---

### Requirement 6: Product Card Integration with Live Data

**User Story:** As a visitor, I want each product card to display the real product image, name, and enquiry button correctly using live data, so that the browsing experience is accurate and functional.

#### Acceptance Criteria

1. THE Product_Card SHALL display the first image from the product's `images` array, falling back to the `image` field if `images` is empty.
2. THE Product_Card SHALL display `productName` as the card title, sourced from the API response.
3. THE Product_Card SHALL use the product's `_id` field (MongoDB ObjectId string) as the unique identifier for enquiry cart operations, replacing the static `id` field.
4. WHEN a visitor clicks "Enquiry Now" on a Product_Card, THE Enquiry_Cart SHALL store the product using its `_id` as the key for deduplication.
5. THE Product_Card SHALL link to `/product/[sku]` or `/product/[_id]` for individual product detail navigation, consistent with the existing product detail page routing.

---

### Requirement 7: Responsive Filter UI

**User Story:** As a visitor on a mobile device, I want the filter options to be accessible and usable without taking up excessive screen space, so that I can filter products comfortably on a small screen.

#### Acceptance Criteria

1. THE Filter_Panel SHALL render as a vertical sidebar on screens wider than 900px.
2. THE Filter_Panel SHALL render as a horizontally scrollable pill row on screens 900px wide or narrower.
3. THE Filter_Panel SHALL maintain the existing visual design system — using the `#681f00` brand colour for active states and `#fdeccb` for inactive states — matching the current styling in `[category]/page.jsx`.
4. WHEN the Filter_Panel is in horizontal scroll mode, THE Filter_Panel SHALL hide the scrollbar visually while remaining scrollable, consistent with the existing `.cat-sidebar-list` scroll behaviour.

---

### Requirement 8: Loading and Empty States

**User Story:** As a visitor, I want clear visual feedback when products are loading or unavailable, so that I am not confused by a blank or broken page.

#### Acceptance Criteria

1. WHEN a product fetch is in progress, THE Collections_Page SHALL display a loading skeleton or spinner within the Product_Grid area.
2. WHEN the product fetch completes with zero results for the active Filter_State, THE Collections_Page SHALL display the message "No products found for this filter." in the Product_Grid area.
3. IF the initial page load fetch fails for both products and categories, THEN THE Collections_Page SHALL display a user-friendly error message with a "Try again" button that retriggers the fetch.
4. WHEN a retry is triggered, THE Collections_Page SHALL re-execute the failed API calls using the same `listProductsApi` and `listCategoriesApi` functions.
