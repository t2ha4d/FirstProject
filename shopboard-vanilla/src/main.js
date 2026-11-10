// Application orchestrator: connects state, logic, and UI. No direct DOM access here.

import { products } from "./products.js";
import {
  searchProducts,
  filterByCategory,
  sortProducts,
  getCategories,
} from "./logic.js";
import {
  loadCart,
  saveCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  calculateCartTotals,
} from "./state.js";
import {
  initUI,
  renderProducts,
  renderCategoryButtons,
  renderCatalogCount,
  renderCart,
  toggleCartDrawer,
  updateActiveCategoryUI,
  showMessage,
  bindProductGrid,
  bindCartList,
  bindSearch,
  bindCategoryFilters,
  bindSort,
  bindCartDrawer,
  bindCheckout,
  bindClearCart,
  bindQuickSearch,
  bindSignupForm,
} from "./ui.js";

// Application State
let cart = loadCart();
let activeCategory = "all";
let searchQuery = "";
let sortOrder = "default";

/**
 * Updates the catalog display through the pure logic pipeline.
 */
function updateCatalog() {
  let list = searchProducts(products, searchQuery);
  list = filterByCategory(list, activeCategory);
  list = sortProducts(list, sortOrder);

  renderProducts(list);
  renderCatalogCount(list.length);
}

/**
 * Recalculates cart totals, updates UI, and persists to localStorage.
 */
function updateCart() {
  const totals = calculateCartTotals(cart, products);
  renderCart(cart, products, totals);
  saveCart(cart);
}

/**
 * Changes active category across buttons and triggers catalog re-render.
 * @param {string} category - Selected category.
 */
function handleCategoryChange(category) {
  activeCategory = category || "all";
  updateActiveCategoryUI(activeCategory);
  updateCatalog();
}

/**
 * Adds one unit of a product to the cart.
 * @param {number} id - Product ID.
 */
function handleAddToCart(id) {
  cart = addToCart(cart, id, 1);
  updateCart();
}

/**
 * Applies a cart drawer action (increment, decrement, remove) to one item.
 * @param {string} action - Action name.
 * @param {number} id - Product ID.
 */
function handleCartAction(action, id) {
  const currentItem = cart.find((i) => i.id === id);
  const currentQty = currentItem ? currentItem.qty || 1 : 1;

  if (action === "increment") {
    cart = updateQuantity(cart, id, currentQty + 1);
    updateCart();
  } else if (action === "decrement") {
    cart = updateQuantity(cart, id, currentQty - 1);
    updateCart();
  } else if (action === "remove") {
    cart = removeFromCart(cart, id);
    updateCart();
  }
}

/**
 * Checkout simulation: confirms the order, then empties the cart.
 */
function handleCheckout() {
  if (cart.length === 0) {
    showMessage(
      "Your wardrobe bag is currently empty. Please select pieces first.",
    );
    return;
  }
  const totals = calculateCartTotals(cart, products);
  showMessage(
    `Order Confirmed!\nTotal: $${totals.subtotal.toFixed(2)} for ${totals.count} item(s).\nThank you for choosing NAVE Autumn Essentials!`,
  );
  cart = clearCart();
  updateCart();
  toggleCartDrawer(false);
}

/**
 * Empties the cart, saves it, and resets the count and total.
 */
function handleClearCart() {
  cart = clearCart();
  updateCart();
}

/**
 * Connects UI events to the handlers above.
 */
function setupEventBindings() {
  bindProductGrid(handleAddToCart);
  bindCartList(handleCartAction);
  bindSearch((query) => {
    searchQuery = query;
    updateCatalog();
  });
  bindCategoryFilters(handleCategoryChange);
  bindSort((order) => {
    sortOrder = order;
    updateCatalog();
  });
  bindCartDrawer();
  bindCheckout(handleCheckout);
  bindClearCart(handleClearCart);
  bindQuickSearch();
  bindSignupForm(() => {
    showMessage("Thank you for subscribing to NAVE Autumn!");
  });
}

/**
 * Initializes the application.
 */
function init() {
  initUI();
  renderCategoryButtons(getCategories(products), activeCategory);
  setupEventBindings();
  updateCatalog();
  updateCart();
}

// Boot application
init();
