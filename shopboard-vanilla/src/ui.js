// UI layer: the only module that touches the DOM (element queries, rendering, and event listeners).

// Cached static DOM elements, filled once by initUI().
const el = {};

/**
 * Queries and caches all static DOM elements. Call once before anything else.
 */
export function initUI() {
  el.productsGrid = document.querySelector("#products-grid");
  el.catalogCountBadge = document.querySelector("#catalog-count-badge");
  el.catalogSection = document.querySelector("#catalog");
  el.searchInput = document.querySelector("#search-input");
  el.categoryButtonsGroup = document.querySelector("#category-buttons");
  el.categoryCircles = document.querySelectorAll(".category-circle-item");
  el.sortSelect = document.querySelector("#sort-select");

  el.headerCartBadge = document.querySelector("#header-cart-badge");
  el.openCartBtn = document.querySelector("#open-cart-btn");
  el.closeCartBtn = document.querySelector("#close-cart-btn");
  el.cartBackdrop = document.querySelector("#cart-drawer-backdrop");
  el.drawerItemsList = document.querySelector("#drawer-items-list");
  el.drawerSubtotalVal = document.querySelector("#drawer-subtotal-val");
  el.checkoutActionBtn = document.querySelector("#checkout-action-btn");
  el.clearCartBtn = document.querySelector("#clear-cart-btn");
  el.quickSearchTrigger = document.querySelector("#quick-search-trigger");

  el.signupForm = document.querySelector("#signup-form");
}

/**
 * Generates an HTML card string for a single product object.
 * @param {Object} item - Product item.
 * @returns {string} HTML markup.
 */
function createProductCardHTML(item) {
  return `
    <article class="apparel-card" data-id="${item.id}">
      <div class="apparel-media-frame">
        <span class="apparel-tag-chip">${item.category}</span>
        <button type="button" class="wishlist-heart-btn" aria-label="Add ${item.name} to wishlist" data-action="wishlist" data-id="${item.id}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
        <img src="${item.image}" alt="${item.name}" class="apparel-img" loading="lazy" />
      </div>
      <div class="apparel-body-info">
        <h3 class="apparel-item-title">${item.name}</h3>
        <span class="apparel-color-label">${item.color || item.category}</span>
        <div class="apparel-footer-action">
          <span class="apparel-price-val">$${item.price}</span>
          <button type="button" class="apparel-add-btn" data-action="add" data-add-id="${item.id}">
            Add to Bag
          </button>
        </div>
      </div>
    </article>
  `;
}

/**
 * Renders products into the products grid.
 * @param {Array} list - Array of products to render.
 */
export function renderProducts(list) {
  const container = el.productsGrid;
  if (!container) return;

  if (!list || list.length === 0) {
    container.innerHTML = `
      <div class="catalog-empty-state">
        <p class="catalog-empty-title">No Pieces Found</p>
        <p class="catalog-empty-text">Try refining your search terms or selecting another category.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(createProductCardHTML).join("");
}

/**
 * Renders the category filter buttons: "All Pieces" first, then one per category.
 * @param {Array<string>} categories - Unique category names.
 * @param {string} [activeCategory="all"] - Currently selected category.
 */
export function renderCategoryButtons(categories, activeCategory = "all") {
  const container = el.categoryButtonsGroup;
  if (!container) return;
  const options = [
    { value: "all", label: "ALL PIECES" },
    ...categories.map((c) => ({ value: c, label: c.toUpperCase() })),
  ];
  container.innerHTML = options
    .map(
      ({ value, label }) =>
        `<button type="button" class="cat-filter-btn${value === activeCategory ? " active" : ""}" data-category="${value}">${label}</button>`,
    )
    .join("");
}

/**
 * Updates the catalog count badge.
 * @param {number} count - Number of visible items.
 */
export function renderCatalogCount(count) {
  const badgeEl = el.catalogCountBadge;
  if (!badgeEl) return;
  badgeEl.textContent = `${count} ${count === 1 ? "PIECE" : "PIECES"} AVAILABLE`;
}

/**
 * Renders the cart drawer list, badge count, and subtotal.
 * Uses clean event delegation attributes for quantity and removal.
 * @param {Array} cart - Cart array [{ id, qty }].
 * @param {Array} products - Catalog products array.
 * @param {{ count: number, subtotal: number }} totals - Calculated totals.
 */
export function renderCart(cart, products, totals) {
  const badgeEl = el.headerCartBadge;
  const listEl = el.drawerItemsList;
  const subtotalEl = el.drawerSubtotalVal;

  // 1. Update header badge count
  if (badgeEl) {
    badgeEl.textContent = totals.count;
  }

  // 2. Update subtotal amount
  if (subtotalEl) {
    subtotalEl.textContent = `$${totals.subtotal.toFixed(2)}`;
  }

  // 3. Render items list
  if (listEl) {
    if (!cart || cart.length === 0) {
      listEl.innerHTML = `
        <p class="cart-empty-msg">Your wardrobe bag is currently empty.<br />Select pieces from the collection to proceed.</p>
      `;
      return;
    }

    listEl.innerHTML = cart
      .map((item) => {
        const product = products.find((p) => p.id === item.id);
        if (!product) return "";
        const itemQty = item.qty || 1;
        const lineTotal = (product.price * itemQty).toFixed(2);

        return `
          <div class="cart-item-card" data-id="${item.id}">
            <img src="${product.image}" alt="${product.name}" class="cart-item-thumb" />
            <div class="cart-item-info">
              <h4 class="cart-item-name">${product.name}</h4>
              <span class="cart-item-meta">$${product.price} each &bull; $${lineTotal}</span>
              <div class="cart-qty-row">
                <button type="button" class="cart-qty-btn" data-action="decrement" data-id="${item.id}" aria-label="Decrease quantity">&minus;</button>
                <span class="cart-qty-value">${itemQty}</span>
                <button type="button" class="cart-qty-btn" data-action="increment" data-id="${item.id}" aria-label="Increase quantity">&#43;</button>
              </div>
            </div>
            <button type="button" class="cart-item-remove-btn" data-action="remove" data-id="${item.id}" aria-label="Remove item">&times;</button>
          </div>
        `;
      })
      .join("");
  }
}

/**
 * Opens or closes the slide-over cart drawer.
 * @param {boolean} isOpen - Whether drawer is open.
 */
export function toggleCartDrawer(isOpen) {
  const backdrop = el.cartBackdrop;
  if (!backdrop) return;
  if (isOpen) {
    backdrop.classList.add("active");
    backdrop.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  } else {
    backdrop.classList.remove("active");
    backdrop.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
}

/**
 * Provides temporary positive feedback on a button.
 * @param {HTMLElement} button - Target button.
 * @param {string} feedbackText - Temporary text.
 * @param {string} originalText - Reverted text.
 * @param {number} [duration=900] - Duration in ms.
 */
function flashButtonSuccess(
  button,
  feedbackText,
  originalText,
  duration = 900,
) {
  if (!button) return;
  button.classList.add("success-flash");
  button.textContent = feedbackText;
  setTimeout(() => {
    button.classList.remove("success-flash");
    button.textContent = originalText;
  }, duration);
}

/**
 * Synchronizes active category CSS classes on filter buttons and circles.
 * @param {string} activeCategory - Selected category.
 */
export function updateActiveCategoryUI(activeCategory) {
  if (el.categoryButtonsGroup) {
    el.categoryButtonsGroup
      .querySelectorAll(".cat-filter-btn")
      .forEach((btn) => {
        const match =
          (btn.dataset.category || "all").toLowerCase() ===
          activeCategory.toLowerCase();
        btn.classList.toggle("active", match);
      });
  }

  if (el.categoryCircles) {
    el.categoryCircles.forEach((circle) => {
      const match =
        (circle.dataset.category || "").toLowerCase() ===
        activeCategory.toLowerCase();
      circle.classList.toggle("active", match);
    });
  }
}

/**
 * Shows a message to the user.
 * @param {string} message - Message text.
 */
export function showMessage(message) {
  alert(message);
}

/**
 * Smoothly scrolls the catalog section into view.
 */
function scrollToCatalog() {
  if (el.catalogSection) {
    el.catalogSection.scrollIntoView({ behavior: "smooth" });
  }
}

/**
 * Products grid (delegated): "Add to Bag" calls onAdd(id); wishlist hearts toggle.
 * @param {(id: number) => void} onAdd - Called with the product ID.
 */
export function bindProductGrid(onAdd) {
  if (!el.productsGrid) return;
  el.productsGrid.addEventListener("click", (e) => {
    // Add to Bag action
    const addBtn = e.target.closest('[data-action="add"]');
    if (addBtn) {
      const id = Number(addBtn.dataset.addId);
      if (id) {
        onAdd(id);
        flashButtonSuccess(addBtn, "Added ✓", "Add to Bag", 900);
      }
      return;
    }

    // Wishlist Heart action
    const wishBtn = e.target.closest('[data-action="wishlist"]');
    if (wishBtn) {
      wishBtn.classList.toggle("active");
    }
  });
}

/**
 * Cart drawer list (delegated): quantity and remove buttons.
 * @param {(action: string, id: number) => void} onAction - Called with action and product ID.
 */
export function bindCartList(onAction) {
  if (!el.drawerItemsList) return;
  el.drawerItemsList.addEventListener("click", (e) => {
    const actionBtn = e.target.closest("[data-action]");
    if (!actionBtn) return;

    const id = Number(actionBtn.dataset.id);
    if (!id) return;

    onAction(actionBtn.dataset.action, id);
  });
}

/**
 * Search input.
 * @param {(query: string) => void} onSearch - Called with the current text.
 */
export function bindSearch(onSearch) {
  if (!el.searchInput) return;
  el.searchInput.addEventListener("input", (e) => {
    onSearch(e.target.value);
  });
}

/**
 * Category filter buttons (delegated) and circular category thumbnails.
 * @param {(category: string) => void} onChange - Called with the chosen category.
 */
export function bindCategoryFilters(onChange) {
  if (el.categoryButtonsGroup) {
    el.categoryButtonsGroup.addEventListener("click", (e) => {
      const btn = e.target.closest(".cat-filter-btn");
      if (btn) {
        onChange(btn.dataset.category || "all");
      }
    });
  }

  el.categoryCircles.forEach((circle) => {
    circle.addEventListener("click", () => {
      const cat = circle.dataset.category;
      if (cat) {
        onChange(cat);
        scrollToCatalog();
      }
    });
  });
}

/**
 * Sort select dropdown.
 * @param {(order: string) => void} onSort - Called with the selected sort value.
 */
export function bindSort(onSort) {
  if (!el.sortSelect) return;
  el.sortSelect.addEventListener("change", (e) => {
    onSort(e.target.value);
  });
}

/**
 * Cart drawer open/close controls: open button, close button, backdrop click, Escape key.
 */
export function bindCartDrawer() {
  if (el.openCartBtn) {
    el.openCartBtn.addEventListener("click", () => toggleCartDrawer(true));
  }
  if (el.closeCartBtn) {
    el.closeCartBtn.addEventListener("click", () => toggleCartDrawer(false));
  }
  if (el.cartBackdrop) {
    el.cartBackdrop.addEventListener("click", (e) => {
      if (e.target === el.cartBackdrop) {
        toggleCartDrawer(false);
      }
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && el.cartBackdrop?.classList.contains("active")) {
      toggleCartDrawer(false);
    }
  });
}

/**
 * Checkout button.
 * @param {() => void} onCheckout - Called on click.
 */
export function bindCheckout(onCheckout) {
  if (!el.checkoutActionBtn) return;
  el.checkoutActionBtn.addEventListener("click", onCheckout);
}

/**
 * Clear cart button.
 * @param {() => void} onClear - Called on click.
 */
export function bindClearCart(onClear) {
  if (!el.clearCartBtn) return;
  el.clearCartBtn.addEventListener("click", onClear);
}

/**
 * Header search icon: scrolls to the catalog and focuses the search input.
 */
export function bindQuickSearch() {
  if (!el.quickSearchTrigger || !el.searchInput) return;
  el.quickSearchTrigger.addEventListener("click", () => {
    scrollToCatalog();
    setTimeout(() => el.searchInput.focus(), 350);
  });
}

/**
 * Sign-up form submit. The browser validates required/type/minlength first.
 * @param {() => void} onSubmit - Called after a valid submit.
 */
export function bindSignupForm(onSubmit) {
  if (!el.signupForm) return;
  el.signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    onSubmit();
  });
}
