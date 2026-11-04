# Debug lab log

## Bug 1

- **What I saw:** A React warning in the browser developer Console on initial page load: `Warning: Each child in a list should have a unique "key" prop. Check the render method of 'CategoryChips'.`
- **Component:** `CategoryChips` (`src/components/CategoryChips.tsx`)
- **How I found it:** Console warning on initial reload.
- **Cause:** Line 8–10 in `CategoryChips.tsx`:
  ```tsx
  {categories.map((category) => (
    <span className="chip">{category}</span>
  ))}
  ```
  The JSX elements produced by mapping over the `categories` array lack a `key` prop, preventing React's reconciliation algorithm from uniquely tracking list items.
- **Fix:** Add a stable unique key (the category string itself):
  ```tsx
  {categories.map((category) => (
    <span key={category} className="chip">{category}</span>
  ))}
  ```

---

## Bug 2

- **What I saw:** The numeral `0` is visually rendered on the cards of sold-out items (such as "Mini Crossbody Bag" and "Wool Scarf") and above the Total in an empty cart, even though no text "0" was intended.
- **Component:** `StockNote` (`src/components/StockNote.tsx`) & `CartPanel` (`src/components/CartPanel.tsx`)
- **How I found it:** Visual inspection of sold-out product cards and inspecting `stock` prop in React DevTools Components tab.
- **Cause:** Line 6 in `StockNote.tsx`:
  ```tsx
  return <p className="stock">{stock && <span>Only {stock} left</span>}</p>;
  ```
  And line 19 in `CartPanel.tsx`:
  ```tsx
  {cart.length && (...)}
  ```
  In JavaScript, `0 && <JSX>` evaluates to the falsy number `0`, not `false`. React treats numbers as valid renderable children, so it writes literal `0` into the DOM.
- **Fix:** Use an explicit boolean comparison:
  ```tsx
  // In StockNote.tsx:
  return <p className="stock">{stock > 0 && <span>Only {stock} left</span>}</p>;

  // In CartPanel.tsx:
  {cart.length > 0 && (...)}
  ```

---

## Bug 3

- **What I saw:** Clicking the heart (♡ -> ♥) on the first item ("Leather Tote Bag"), and then sorting by "Price: low to high", causes the heart to remain on the first item in the grid ("Wool Scarf") instead of following the Leather Tote Bag ($89).
- **Component:** `ProductList` (`src/components/ProductList.tsx`)
- **How I found it:** React DevTools Components tab: inspecting `<ProductCard>` instances revealed `key="0"`, `key="1"`, etc., in the tree.
- **Cause:** Line 18 in `ProductList.tsx`:
  ```tsx
  {shown.map((product, index) => (
    <ProductCard key={index} product={product} onAdd={onAdd} />
  ))}
  ```
  Using array `index` as a key instructs React to associate DOM identity and local component state (`const [saved, setSaved] = useState(false)`) with the slot position (`0`), rather than the product identity.
- **Fix:** Use the persistent unique product ID for the key:
  ```tsx
  {shown.map((product) => (
    <ProductCard key={product.id} product={product} onAdd={onAdd} />
  ))}
  ```

---

## Bug 4

- **What I saw:** After switching the sort dropdown to "Price: low to high", selecting "Featured" does not restore the original featured order; the items remain sorted by price.
- **Component:** `ProductList` (`src/components/ProductList.tsx`)
- **How I found it:** React DevTools Components tab: selected `<ProductList>` and inspected the `products` prop before and after sorting; the original `PRODUCTS` array was mutated.
- **Cause:** Line 13 in `ProductList.tsx`:
  ```tsx
  const shown = sort === "price-asc" ? products.sort((a, b) => a.price - b.price) : products;
  ```
  `Array.prototype.sort()` mutates the source array in place. Because `PRODUCTS` was passed by reference from `App.tsx`, the original array order in module scope was permanently altered.
- **Fix:** Shallow-copy the array before sorting, or use `toSorted()`:
  ```tsx
  const shown = sort === "price-asc"
    ? [...products].sort((a, b) => a.price - b.price)
    : products;
  ```

---

## Bug 5

- **What I saw:** Clicking the `+` button in the cart panel does not increase the quantity displayed on screen.
- **Component:** `CartRow` (`src/components/CartRow.tsx`) and `App` (`src/App.tsx`)
- **How I found it:** React DevTools Components tab + "Highlight updates when components render": clicking `+` produced no highlight renders, but inspecting `item.qty` in DevTools showed the in-memory value had mutated.
- **Cause:** Lines 10–13 in `CartRow.tsx` and Line 35 in `App.tsx`:
  ```tsx
  // CartRow.tsx
  function increase() {
    item.qty = item.qty + 1; // Mutating prop object directly
    onChange();
  }

  // App.tsx
  <CartPanel ... onChange={() => setCart(cart)} />
  ```
  `item.qty` was mutated in-place and `setCart(cart)` received the identical array reference. React performs shallow reference equality (`Object.is(prev, next)`), detects no change in reference, and bails out of re-rendering.
- **Fix:** Treat state and props as immutable. Pass an updater callback from `App` that generates a new array with updated item copies:
  ```tsx
  // In App.tsx:
  function updateQty(id: number, delta: number) {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: item.qty + delta } : item
      )
    );
  }

  // In CartRow.tsx:
  <button type="button" onClick={() => onUpdateQty(item.id, 1)}>+</button>
  ```

