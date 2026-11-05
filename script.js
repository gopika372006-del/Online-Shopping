
"use strict";

// 1. PRODUCT DATA
const products = [
  {
    id: 1,
    name: "Classic Cotton T-Shirt",
    category: "Fashion",
    price: 499,
    oldPrice: 699,
    rating: 4.5,
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    name: "Everyday Backpack",
    category: "Fashion",
    price: 899,
    oldPrice: 1199,
    rating: 4.6,
    badge: "Popular",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    name: "Wireless Headphones",
    category: "Electronics",
    price: 1499,
    oldPrice: 1999,
    rating: 4.8,
    badge: "Top Rated",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    name: "Smart Watch",
    category: "Electronics",
    price: 2299,
    oldPrice: 2999,
    rating: 4.4,
    badge: "Trending",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5,
    name: "Everyday Sneakers",
    category: "Footwear",
    price: 1299,
    oldPrice: 1699,
    rating: 4.5,
    badge: "Popular",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6,
    name: "Minimal Wrist Watch",
    category: "Fashion",
    price: 999,
    oldPrice: 1399,
    rating: 4.3,
    badge: "New",
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 7,
    name: "Travel Coffee Mug",
    category: "Home",
    price: 349,
    oldPrice: 499,
    rating: 4.2,
    badge: "Value Pick",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 8,
    name: "Modern Table Lamp",
    category: "Home",
    price: 1199,
    oldPrice: 1599,
    rating: 4.6,
    badge: "Trending",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 9,
    name: "Classic Sunglasses",
    category: "Fashion",
    price: 599,
    oldPrice: 899,
    rating: 4.1,
    badge: "New",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 10,
    name: "Bluetooth Speaker",
    category: "Electronics",
    price: 1099,
    oldPrice: 1499,
    rating: 4.5,
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 11,
    name: "Comfort Cushion",
    category: "Home",
    price: 449,
    oldPrice: 649,
    rating: 4.3,
    badge: "Value Pick",
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 12,
    name: "Casual Running Shoes",
    category: "Footwear",
    price: 1599,
    oldPrice: 2199,
    rating: 4.7,
    badge: "Top Rated",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"
  }
];

// 2. DOM ELEMENTS
const productGrid = document.getElementById("productGrid");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const categoryList = document.getElementById("categoryList");
const sortSelect = document.getElementById("sortSelect");
const resultCount = document.getElementById("resultCount");
const emptyProducts = document.getElementById("emptyProducts");

const openCartButton = document.getElementById("openCart");
const closeCartButton = document.getElementById("closeCart");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const cartItemsContainer = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartSubtitle = document.getElementById("cartSubtitle");
const cartEmpty = document.getElementById("cartEmpty");
const cartSummary = document.getElementById("cartSummary");
const cartSubtotal = document.getElementById("cartSubtotal");
const shippingCost = document.getElementById("shippingCost");
const cartTotal = document.getElementById("cartTotal");
const shippingNote = document.getElementById("shippingNote");

const checkoutDialog = document.getElementById("checkoutDialog");
const checkoutForm = document.getElementById("checkoutForm");
const checkoutTotal = document.getElementById("checkoutTotal");
const toast = document.getElementById("toast");

// 3. APPLICATION STATE
let selectedCategory = "All";
let searchTerm = "";
let sortMode = "featured";
let cart = loadCart();
let toastTimer;

// 4. HELPER FUNCTIONS
function formatPrice(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

function loadCart() {
  try {
    const savedCart = JSON.parse(localStorage.getItem("shopease-cart"));

    if (!Array.isArray(savedCart)) {
      return [];
    }

    return savedCart
      .filter(item =>
        item &&
        Number.isInteger(item.id) &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0 &&
        products.some(product => product.id === item.id)
      )
      .map(item => ({
        id: item.id,
        quantity: Math.min(item.quantity, 99)
      }));
  } catch (error) {
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem("shopease-cart", JSON.stringify(cart));
  } catch (error) {
    showToast("Could not save cart in this browser.");
  }
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

// 5. DISPLAY PRODUCTS
function renderProducts() {
  let filteredProducts = products.filter(product => {
    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    const searchText =
      `${product.name} ${product.category}`.toLowerCase();

    const matchesSearch = searchText.includes(searchTerm);

    return matchesCategory && matchesSearch;
  });

  if (sortMode === "low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortMode === "high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortMode === "name") {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  }

  resultCount.textContent =
    `${filteredProducts.length} product${filteredProducts.length === 1 ? "" : "s"} found`;

  productGrid.classList.toggle("hidden", filteredProducts.length === 0);
  emptyProducts.classList.toggle("hidden", filteredProducts.length !== 0);

  productGrid.innerHTML = filteredProducts.map(product => `
    <article class="product-card">
      <div class="product-image-wrap">
        <img
          class="product-image"
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
          data-product-image
        >
        <span class="product-badge">${product.badge}</span>
      </div>

      <div class="product-info">
        <p class="product-category">${product.category}</p>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-rating">
          ★★★★★ <span>${product.rating} / 5</span>
        </p>

        <div class="product-price-row">
          <span class="product-price">${formatPrice(product.price)}</span>
          <span class="old-price">${formatPrice(product.oldPrice)}</span>
        </div>

        <button class="add-button" data-add="${product.id}">
          + Add to Cart
        </button>
      </div>
    </article>
  `).join("");
}

// If an external product image fails, show a local visual fallback.
document.addEventListener("error", event => {
  const image = event.target;

  if (
    image instanceof HTMLImageElement &&
    image.hasAttribute("data-product-image") &&
    !image.dataset.fallbackUsed
  ) {
    image.dataset.fallbackUsed = "true";
    image.removeAttribute("src");
    image.alt = "Product image unavailable";
    image.style.display = "none";
    image.parentElement.style.background =
      "linear-gradient(135deg, #eee8ff, #f8f5ff)";
  }
}, true);

// 6. SEARCH PRODUCTS
searchForm.addEventListener("submit", event => {
  event.preventDefault();
  searchTerm = searchInput.value.trim().toLowerCase();
  renderProducts();
  document.getElementById("products").scrollIntoView({
    behavior: "smooth"
  });
});

searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value.trim().toLowerCase();
  renderProducts();
});

// 7. FILTER BY CATEGORY
categoryList.addEventListener("click", event => {
  const button = event.target.closest("[data-category]");

  if (!button) return;

  selectedCategory = button.dataset.category;

  document.querySelectorAll(".category-chip").forEach(chip => {
    chip.classList.toggle("active", chip === button);
  });

  renderProducts();
});

document.querySelectorAll("[data-nav-category]").forEach(link => {
  link.addEventListener("click", () => {
    selectedCategory = link.dataset.navCategory;

    document.querySelectorAll(".category-chip").forEach(chip => {
      chip.classList.toggle(
        "active",
        chip.dataset.category === selectedCategory
      );
    });

    renderProducts();
  });
});

// 8. SORT PRODUCTS
sortSelect.addEventListener("change", () => {
  sortMode = sortSelect.value;
  renderProducts();
});

// 9. RESET SEARCH AND FILTERS
function resetFilters() {
  selectedCategory = "All";
  searchTerm = "";
  sortMode = "featured";

  searchInput.value = "";
  sortSelect.value = "featured";

  document.querySelectorAll(".category-chip").forEach(chip => {
    chip.classList.toggle("active", chip.dataset.category === "All");
  });

  renderProducts();
}

document.getElementById("clearFilters").addEventListener("click", resetFilters);
document.getElementById("resetProducts").addEventListener("click", resetFilters);

// 10. ADD PRODUCTS TO CART
productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");

  if (!button) return;

  const productId = Number(button.dataset.add);
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    if (existingItem.quantity >= 99) {
      showToast("Maximum quantity is 99.");
      return;
    }

    existingItem.quantity += 1;
  } else {
    cart.push({
      id: productId,
      quantity: 1
    });
  }

  saveCart();
  renderCart();
  showToast("Product added to your cart!");
});

// 11. CART CALCULATIONS
function getCartDetails() {
  const items = cart.map(item => {
    const product = products.find(p => p.id === item.id);

    return {
      ...product,
      quantity: item.quantity,
      lineTotal: product.price * item.quantity
    };
  }).filter(item => item.id);

  const itemCount = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const subtotal = items.reduce(
    (total, item) => total + item.lineTotal,
    0
  );

  const shipping = subtotal === 0 || subtotal >= 999 ? 0 : 79;

  return {
    items,
    itemCount,
    subtotal,
    shipping,
    total: subtotal + shipping
  };
}

// 12. DISPLAY CART
function renderCart() {
  const details = getCartDetails();

  cartCount.textContent = details.itemCount;
  cartSubtitle.textContent =
    `${details.itemCount} item${details.itemCount === 1 ? "" : "s"}`;

  cartEmpty.classList.toggle("hidden", details.items.length > 0);
  cartSummary.classList.toggle("hidden", details.items.length === 0);

  cartItemsContainer.innerHTML = details.items.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div>
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-price">${formatPrice(item.lineTotal)}</p>

        <div class="cart-item-actions">
          <div class="quantity-control">
            <button
              data-quantity="${item.id}"
              data-change="-1"
              aria-label="Decrease ${item.name} quantity"
            >−</button>

            <span>${item.quantity}</span>

            <button
              data-quantity="${item.id}"
              data-change="1"
              aria-label="Increase ${item.name} quantity"
              ${item.quantity >= 99 ? "disabled" : ""}
            >+</button>
          </div>

          <button class="remove-button" data-remove="${item.id}">
            Remove
          </button>
        </div>
      </div>
    </div>
  `).join("");

  cartSubtotal.textContent = formatPrice(details.subtotal);
  shippingCost.textContent =
    details.shipping === 0 && details.subtotal > 0
      ? "FREE"
      : formatPrice(details.shipping);

  cartTotal.textContent = formatPrice(details.total);

  shippingNote.textContent =
    details.subtotal === 0
      ? ""
      : details.subtotal >= 999
        ? "🎉 Your order qualifies for free shipping!"
        : `Add ${formatPrice(999 - details.subtotal)} more for free shipping.`;

  checkoutTotal.textContent = formatPrice(details.total);
}

// 13. CHANGE QUANTITY OR REMOVE ITEMS
cartItemsContainer.addEventListener("click", event => {
  const quantityButton = event.target.closest("[data-quantity]");
  const removeButton = event.target.closest("[data-remove]");

  if (quantityButton) {
    const id = Number(quantityButton.dataset.quantity);
    const change = Number(quantityButton.dataset.change);
    const item = cart.find(cartItem => cartItem.id === id);

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
      cart = cart.filter(cartItem => cartItem.id !== id);
    } else if (item.quantity > 99) {
      item.quantity = 99;
    }

    saveCart();
    renderCart();
    return;
  }

  if (removeButton) {
    const id = Number(removeButton.dataset.remove);

    cart = cart.filter(item => item.id !== id);

    saveCart();
    renderCart();
    showToast("Product removed from cart.");
  }
});

// 14. OPEN AND CLOSE CART
function openCart() {
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  overlay.classList.remove("hidden");
  document.body.classList.add("drawer-open");
  closeCartButton.focus();
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  overlay.classList.add("hidden");
  document.body.classList.remove("drawer-open");
  openCartButton.focus();
}

openCartButton.addEventListener("click", openCart);
closeCartButton.addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

document.getElementById("continueShopping").addEventListener("click", () => {
  closeCart();
  document.getElementById("products").scrollIntoView({
    behavior: "smooth"
  });
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    if (cartDrawer.classList.contains("open")) {
      closeCart();
    }

    if (checkoutDialog.open) {
      checkoutDialog.close();
    }
  }
});

// 15. DEMO CHECKOUT
document.getElementById("checkoutButton").addEventListener("click", () => {
  if (cart.length === 0) {
    showToast("Your cart is empty.");
    return;
  }

  checkoutTotal.textContent = formatPrice(getCartDetails().total);
  checkoutDialog.showModal();
});

document.getElementById("closeCheckout").addEventListener("click", () => {
  checkoutDialog.close();
});

checkoutForm.addEventListener("submit", event => {
  event.preventDefault();

  if (!checkoutForm.reportValidity()) return;

  if (cart.length === 0) {
    checkoutDialog.close();
    showToast("Your cart is empty.");
    return;
  }

  const orderTotal = getCartDetails().total;
  const orderNumber = "SE" + Date.now().toString().slice(-8);

  // Demo only: do not collect real payment information.
  checkoutForm.reset();
  cart = [];
  saveCart();
  renderCart();
  checkoutDialog.close();
  closeCart();

  showToast(`Demo order ${orderNumber} placed! Total: ${formatPrice(orderTotal)}`);
});

// 16. NEWSLETTER DEMO
document.getElementById("newsletterForm").addEventListener("submit", event => {
  event.preventDefault();

  const emailInput = document.getElementById("emailInput");

  if (!emailInput.reportValidity()) return;

  showToast("Thanks for subscribing to our demo newsletter!");
  event.target.reset();
});

// 17. FOOTER YEAR
document.getElementById("year").textContent = new Date().getFullYear();

// 18. INITIALIZE THE WEBSITE
renderProducts();
renderCart();
