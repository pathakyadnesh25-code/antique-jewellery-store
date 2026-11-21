
/* ==========================================
   AURA ANTI-TARNISH JEWELLERY
   Main JavaScript - Version 1.0
========================================== */

// ==========================================
// 1. BUSINESS SETTINGS
// ==========================================

const BUSINESS = {
  name: "AURA Anti-Tarnish Jewellery",

  // Replace with your sister's WhatsApp number.
  // Use country code + mobile number, without + or spaces.
  whatsapp: "91XXXXXXXXXX",

  // Replace with your Instagram profile.
  instagram: "https://www.instagram.com/"
};


// ==========================================
// 2. PRODUCT DATABASE (DEMO PRODUCTS)
// ==========================================

const products = [
  {
    id: 1,
    name: "Golden Elegance Necklace",
    category: "Necklaces",
    price: 799,
    oldPrice: 1099,
    tag: "BESTSELLER",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=700&q=85",
    description: "An elegant everyday necklace."
  },
  {
    id: 2,
    name: "Classic Pearl Earrings",
    category: "Earrings",
    price: 499,
    oldPrice: 699,
    tag: "POPULAR",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=700&q=85",
    description: "Beautiful pearl-inspired earrings."
  },
  {
    id: 3,
    name: "Golden Charm Bracelet",
    category: "Bracelets",
    price: 599,
    oldPrice: 799,
    tag: "NEW",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=700&q=85",
    description: "A delicate bracelet for everyday styling."
  },
  {
    id: 4,
    name: "Elegant Minimal Ring",
    category: "Rings",
    price: 399,
    oldPrice: 599,
    tag: "TRENDING",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=700&q=85",
    description: "A minimal ring with a timeless look."
  },
  {
    id: 5,
    name: "Statement Gold Necklace",
    category: "Necklaces",
    price: 999,
    oldPrice: 1299,
    tag: "NEW",
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=700&q=85",
    description: "A statement necklace for special occasions."
  },
  {
    id: 6,
    name: "Traditional Gold Jhumkas",
    category: "Earrings",
    price: 649,
    oldPrice: 849,
    tag: "POPULAR",
    image: "https://images.unsplash.com/photo-1635767798638-3665a2c2b7b3?auto=format&fit=crop&w=700&q=85",
    description: "Traditional-inspired statement earrings."
  },
  {
    id: 7,
    name: "Classic Chain Bracelet",
    category: "Bracelets",
    price: 549,
    oldPrice: 749,
    tag: "BESTSELLER",
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=700&q=85",
    description: "A versatile chain bracelet."
  },
  {
    id: 8,
    name: "Premium Stone Ring",
    category: "Rings",
    price: 699,
    oldPrice: 899,
    tag: "NEW",
    image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=700&q=85",
    description: "A beautiful stone-inspired ring."
  }
];


// ==========================================
// 3. APPLICATION STATE
// ==========================================

function loadSavedData(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch (error) {
    return [];
  }
}

let cart = loadSavedData("aura_cart");
let wishlist = loadSavedData("aura_wishlist");

let activeCategory = "All";
let searchTerm = "";


// ==========================================
// 4. ELEMENT REFERENCES
// ==========================================

const productGrid = document.getElementById("productGrid");
const cartDrawer = document.getElementById("cartDrawer");
const wishlistDrawer = document.getElementById("wishlistDrawer");
const overlay = document.getElementById("overlay");

const cartItems = document.getElementById("cartItems");
const wishlistItems = document.getElementById("wishlistItems");

const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

const toast = document.getElementById("toast");


// ==========================================
// 5. HELPER FUNCTIONS
// ==========================================

function formatPrice(price) {
  return "₹" + Number(price).toLocaleString("en-IN");
}

function saveData() {
  localStorage.setItem("aura_cart", JSON.stringify(cart));
  localStorage.setItem("aura_wishlist", JSON.stringify(wishlist));
}

let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

function getProduct(id) {
  return products.find(product => product.id === Number(id));
}


// ==========================================
// 6. DISPLAY PRODUCTS
// ==========================================

function renderProducts() {
  if (!productGrid) return;

  let filteredProducts = [...products];

  if (activeCategory !== "All") {
    filteredProducts = filteredProducts.filter(
      product => product.category === activeCategory
    );
  }

  if (searchTerm) {
    filteredProducts = filteredProducts.filter(product => {
      const searchableText =
        `${product.name} ${product.category} ${product.description}`;

      return searchableText.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }

  const sortValue = document.getElementById("sortProducts").value;

  if (sortValue === "low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  }

  if (sortValue === "high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  if (sortValue === "name") {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (filteredProducts.length === 0) {
    productGrid.innerHTML = `
      <div class="no-products">
        <h3>No jewellery found.</h3>
        <p>Try another category or search term.</p>
      </div>
    `;
    return;
  }

  productGrid.innerHTML = filteredProducts.map(product => {

    const isWishlisted = wishlist.includes(product.id);

    return `
      <article class="product-card">

        <div class="product-image">

          <img
            src="${product.image}"
            alt="${product.name}"
            loading="lazy"
            onerror="this.src='https://placehold.co/500x600/f4e8df/35251e?text=AURA+Jewellery'"
          >

          <span class="product-tag">${product.tag}</span>

          <button
            class="wishlist-btn ${isWishlisted ? "selected" : ""}"
            data-action="wishlist"
            data-id="${product.id}"
            aria-label="Add ${product.name} to wishlist"
          >
            ${isWishlisted ? "♥" : "♡"}
          </button>

        </div>

        <div class="product-info">

          <p class="product-category">${product.category}</p>

          <h3>${product.name}</h3>

          <p class="product-price">
            ${formatPrice(product.price)}
            <span class="old-price">${formatPrice(product.oldPrice)}</span>
          </p>

          <button
            class="add-cart-btn"
            data-action="add"
            data-id="${product.id}"
          >
            ADD TO BAG +
          </button>

        </div>

      </article>
    `;
  }).join("");
}


// ==========================================
// 7. CATEGORY FILTERS
// ==========================================

document.getElementById("categoryFilters")
  .addEventListener("click", event => {

    const button = event.target.closest(".filter-btn");

    if (!button) return;

    activeCategory = button.dataset.category;

    document.querySelectorAll(".filter-btn").forEach(btn => {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    renderProducts();
  });


// Collection cards
document.querySelectorAll(".collection-card").forEach(card => {

  card.addEventListener("click", () => {

    activeCategory = card.dataset.category;
    searchTerm = "";

    document.getElementById("searchInput").value = "";

    document.querySelectorAll(".filter-btn").forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.category === activeCategory
      );
    });

    renderProducts();

    document.getElementById("products").scrollIntoView({
      behavior: "smooth"
    });

  });

});


// ==========================================
// 8. PRODUCT SORTING
// ==========================================

document.getElementById("sortProducts")
  .addEventListener("change", renderProducts);


// ==========================================
// 9. PRODUCT SEARCH
// ==========================================

document.getElementById("searchToggle")
  .addEventListener("click", () => {

    document.getElementById("searchPanel").classList.toggle("show");

    document.getElementById("searchInput").focus();

  });

function performSearch() {

  searchTerm = document.getElementById("searchInput").value.trim();

  activeCategory = "All";

  document.querySelectorAll(".filter-btn").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.category === "All"
    );
  });

  renderProducts();

  document.getElementById("products").scrollIntoView({
    behavior: "smooth"
  });

}

document.getElementById("searchButton")
  .addEventListener("click", performSearch);

document.getElementById("searchInput")
  .addEventListener("keydown", event => {

    if (event.key === "Enter") {
      performSearch();
    }

  });


// ==========================================
// 10. ADD TO CART
// ==========================================

function addToCart(id) {

  const product = getProduct(id);

  if (!product) return;

  const existingItem = cart.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      quantity: 1
    });
  }

  saveData();
  renderCart();

  showToast(product.name + " added to your bag!");
}


// ==========================================
// 11. CART QUANTITY MANAGEMENT
// ==========================================

function updateQuantity(id, change) {

  const item = cart.find(item => item.id === Number(id));

  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    cart = cart.filter(item => item.id !== Number(id));
  }

  saveData();
  renderCart();
}


function removeFromCart(id) {

  cart = cart.filter(item => item.id !== Number(id));

  saveData();
  renderCart();

  showToast("Product removed from bag.");

}


// ==========================================
// 12. DISPLAY CART
// ==========================================

function renderCart() {

  const totalQuantity = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  cartCount.textContent = totalQuantity;

  let total = 0;

  if (cart.length === 0) {

    cartItems.innerHTML = `
      <div class="empty-message">
        <h3>Your bag is waiting!</h3>
        <p>Add your favourite jewellery to get started.</p>
      </div>
    `;

  } else {

    cartItems.innerHTML = cart.map(item => {

      const product = getProduct(item.id);

      if (!product) return "";

      total += product.price * item.quantity;

      return `
        <div class="cart-item">

          <img src="${product.image}" alt="${product.name}">

          <div>
            <h4>${product.name}</h4>
            <p>${formatPrice(product.price)}</p>

            <div class="quantity-controls">

              <button data-action="decrease" data-id="${product.id}">−</button>

              <span>${item.quantity}</span>

              <button data-action="increase" data-id="${product.id}">+</button>

            </div>
          </div>

          <button
            class="remove-item"
            data-action="remove"
            data-id="${product.id}"
          >
            Remove
          </button>

        </div>
      `;

    }).join("");

  }

  cartTotal.textContent = formatPrice(total);

}


// ==========================================
// 13. CART BUTTON EVENTS
// ==========================================

cartItems.addEventListener("click", event => {

  const button = event.target.closest("[data-action]");

  if (!button) return;

  const id = Number(button.dataset.id);
  const action = button.dataset.action;

  if (action === "increase") updateQuantity(id, 1);

  if (action === "decrease") updateQuantity(id, -1);

  if (action === "remove") removeFromCart(id);

});


// Product grid actions
productGrid.addEventListener("click", event => {

  const button = event.target.closest("[data-action]");

  if (!button) return;

  const id = Number(button.dataset.id);

  if (button.dataset.action === "add") {
    addToCart(id);
  }

  if (button.dataset.action === "wishlist") {
    toggleWishlist(id);
  }

});


// ==========================================
// 14. WISHLIST
// ==========================================

function toggleWishlist(id) {

  if (wishlist.includes(id)) {

    wishlist = wishlist.filter(item => item !== id);

    showToast("Removed from wishlist.");

  } else {

    wishlist.push(id);

    showToast("Added to wishlist!");

  }

  saveData();
  renderProducts();
  renderWishlist();

}


function renderWishlist() {

  if (wishlist.length === 0) {

    wishlistItems.innerHTML = `
      <div class="empty-message">
        <h3>Your wishlist is empty.</h3>
        <p>Save the jewellery you love.</p>
      </div>
    `;

    return;
  }

  wishlistItems.innerHTML = wishlist.map(id => {

    const product = getProduct(id);

    if (!product) return "";

    return `
      <div class="wishlist-item">

        <img src="${product.image}" alt="${product.name}">

        <div>
          <strong>${product.name}</strong>
          <p>${formatPrice(product.price)}</p>
        </div>

        <button data-wishlist-remove="${product.id}">
          Remove
        </button>

      </div>
    `;

  }).join("");

}


wishlistItems.addEventListener("click", event => {

  const button = event.target.closest("[data-wishlist-remove]");

  if (!button) return;

  toggleWishlist(Number(button.dataset.wishlistRemove));

});


// ==========================================
// 15. OPEN AND CLOSE DRAWERS
// ==========================================

function openDrawer(drawer) {

  cartDrawer.classList.remove("open");
  wishlistDrawer.classList.remove("open");

  drawer.classList.add("open");
  overlay.classList.add("show");

}

function closeDrawers() {

  cartDrawer.classList.remove("open");
  wishlistDrawer.classList.remove("open");

  overlay.classList.remove("show");

}

document.getElementById("cartToggle").addEventListener("click", () => {
  openDrawer(cartDrawer);
});

document.getElementById("wishlistToggle").addEventListener("click", () => {
  renderWishlist();
  openDrawer(wishlistDrawer);
});

document.getElementById("closeCart").addEventListener("click", closeDrawers);

document.getElementById("closeWishlist").addEventListener("click", closeDrawers);

document.getElementById("continueShopping").addEventListener("click", closeDrawers);

overlay.addEventListener("click", closeDrawers);

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeDrawers();
});


// ==========================================
// 16. WHATSAPP CHECKOUT
// ==========================================

function checkoutOnWhatsApp() {

  if (cart.length === 0) {
    showToast("Your shopping bag is empty!");
    return;
  }

  if (!/^91\d{10}$/.test(BUSINESS.whatsapp)) {
    showToast("Please configure the business WhatsApp number in script.js.");
    return;
  }

  let total = 0;

  let message = `Hello ${BUSINESS.name}!\n\nI would like to order:\n\n`;

  cart.forEach(item => {

    const product = getProduct(item.id);

    if (!product) return;

    const subtotal = product.price * item.quantity;

    total += subtotal;

    message +=
      `${product.name}\n` +
      `Quantity: ${item.quantity}\n` +
      `Price: ${formatPrice(product.price)}\n` +
      `Subtotal: ${formatPrice(subtotal)}\n\n`;

  });

  message +=
    `Total: ${formatPrice(total)}\n\n` +
    `Please share the ordering and delivery details.`;

  const url =
    "https://wa.me/" +
    BUSINESS.whatsapp +
    "?text=" +
    encodeURIComponent(message);

  window.open(url, "_blank", "noopener,noreferrer");

}

document.getElementById("checkoutButton")
  .addEventListener("click", checkoutOnWhatsApp);


// ==========================================
// 17. MOBILE NAVIGATION
// ==========================================

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

menuToggle.addEventListener("click", () => {

  mainNav.classList.toggle("open");

  menuToggle.textContent =
    mainNav.classList.contains("open") ? "×" : "☰";

});

mainNav.querySelectorAll("a").forEach(link => {

  link.addEventListener("click", () => {

    mainNav.classList.remove("open");
    menuToggle.textContent = "☰";

  });

});


// ==========================================
// 18. FOOTER LINKS AND BRAND DETAILS
// ==========================================

document.getElementById("year").textContent =
  new Date().getFullYear();

document.getElementById("footerWhatsApp").href =
  "https://wa.me/" + BUSINESS.whatsapp;

document.getElementById("footerInstagram").href =
  BUSINESS.instagram;

document.getElementById("shippingLink").addEventListener("click", event => {
  event.preventDefault();
  showToast("Shipping details will be updated soon.");
});

document.getElementById("policyLink").addEventListener("click", event => {
  event.preventDefault();
  showToast("Privacy policy page is coming soon.");
});


// ==========================================
// 19. INITIALIZE WEBSITE
// ==========================================

function initializeWebsite() {

  renderProducts();

  renderCart();

  renderWishlist();

  console.log("AURA Jewellery website initialized successfully.");

}

initializeWebsite();
