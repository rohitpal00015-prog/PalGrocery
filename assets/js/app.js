// PAL GROCERY Main Orchestrator and State Router

// --- Customizable Shop Configurations ---
window.SHOP_CONFIG = {
  name: "Pal Grocery",
  ownerName: "Ramlallu Pal",
  phone: "919415552992", // Target WhatsApp number for orders
  currency: "₹",
  deliveryRange: "3km",
  language: "en" // default language
};

// --- Bilingual Translation Maps ---
window.TRANSLATIONS = {
  en: {
    "shop_name": "Pal Grocery",
    "tagline": "Fresh Groceries & Chilled Drinks Delivered Instantly",
    "home": "Home",
    "catalog": "Shop",
    "about": "Our Story",
    "contact": "Contact",
    "lassi": "Lassi",
    "offers": "Offers",
    "parchi": "Order by text",
    "admin_portal": "SecureData",
    "sign_in": "Sign In",
    "shopping_basket": "Shopping Basket",
    "proceed_checkout": "Proceed to Checkout",
    "instant_delivery": "Instant Kirana Delivery (30 Mins)",
    "add_to_cart": "Add",
    "sold_out": "Sold Out",
    "search_placeholder": "Search fresh milk, apples, salt, atta...",
    "order_whatsapp": "Order via WhatsApp",
    "payment_method": "Payment Method",
    "delivery_address": "Delivery Address",
    "chilled_option": "Chilled (Thanda)",
    "regular_option": "Regular",
  },
  hi: {
    "shop_name": "पाल ग्रॉसरी",
    "tagline": "ताज़ा राशन और ठंडा कोल्ड-ड्रिंक तुरंत घर पहुंचाएं",
    "home": "होम",
    "catalog": "सामान",
    "about": "दुकान की कहानी",
    "contact": "संपर्क करें",
    "lassi": "लस्सी",
    "offers": "ऑफ़र",
    "parchi": "ऑर्डर टेक्स्ट द्वारा",
    "admin_portal": "दुकानदार पोर्टल",
    "sign_in": "लॉग इन करें",
    "shopping_basket": "आपका झोला",
    "proceed_checkout": "बिल बनाने चलें",
    "instant_delivery": "30 मिनट में राशन की डिलीवरी",
    "add_to_cart": "झोले में डालें",
    "sold_out": "खत्म हो गया",
    "search_placeholder": "दूध, सेब, नमक, आटा खोजें...",
    "order_whatsapp": "व्हाट्सएप पर ऑर्डर भेजें",
    "payment_method": "भुगतान का तरीका",
    "delivery_address": "पहुंचाने का पता",
    "chilled_option": "ठंडा (Chilled)",
    "regular_option": "नॉर्मल (Regular)",
  }
};

window.t = (key) => {
  const lang = window.SHOP_CONFIG.language;
  if (window.TRANSLATIONS[lang] && window.TRANSLATIONS[lang][key]) {
    return window.TRANSLATIONS[lang][key];
  }
  return (window.TRANSLATIONS["en"] && window.TRANSLATIONS["en"][key]) || key;
};

window.translatePage = () => {
  document.querySelectorAll("[data-t]").forEach(el => {
    const key = el.dataset.t;
    el.textContent = window.t(key);
  });
  document.querySelectorAll("[data-t-placeholder]").forEach(el => {
    const key = el.dataset.tPlaceholder;
    el.placeholder = window.t(key);
  });

  // Update header titles and button state labels
  const logoSpan = document.querySelector(".logo span");
  if (logoSpan) logoSpan.textContent = window.t("shop_name");

  const adminToggle = document.getElementById("admin-mode-toggle");
  if (adminToggle) {
    const textSpan = adminToggle.querySelector("span");
    if (textSpan) {
      textSpan.textContent = window.state.currentView === "admin" ? window.t("home") : window.t("admin_portal");
    }
  }
};

window.toggleLanguage = () => {
  const current = window.SHOP_CONFIG.language;
  window.SHOP_CONFIG.language = current === "en" ? "hi" : "en";

  const btn = document.getElementById("lang-toggle-button");
  if (btn) {
    btn.innerHTML = `<span style="font-size: 0.82rem; font-weight: 800;">${window.SHOP_CONFIG.language === "en" ? "हिंदी" : "EN"}</span>`;
  }

  window.translatePage();
  navigateView(window.state.currentView, window.state.currentViewArg);
  showToast(window.SHOP_CONFIG.language === "hi" ? "भाषा बदलकर हिंदी कर दी गई है!" : "Language switched to English!", "success");
};

// --- Custom Premium Toast Notification System ---
window.showToast = (message, type = "info") => {
  // Create toast container if it doesn't exist
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  // Create toast item
  const item = document.createElement("div");
  item.className = `toast-item toast-${type}`;

  // Pick icon name based on type
  let iconName = "info";
  if (type === "success") iconName = "check-circle";
  else if (type === "error" || type === "danger") iconName = "alert-circle";
  else if (type === "warning") iconName = "alert-triangle";

  item.innerHTML = `
    <div class="toast-icon"><i data-lucide="${iconName}"></i></div>
    <div class="toast-message">${message}</div>
    <button class="toast-close" aria-label="Close Notification"><i data-lucide="x"></i></button>
  `;

  // Append toast item
  container.appendChild(item);
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Close button listener
  const closeBtn = item.querySelector(".toast-close");
  closeBtn.addEventListener("click", () => {
    item.classList.add("toast-fade-out");
    setTimeout(() => item.remove(), 350);
  });

  // Auto-remove after 4 seconds
  setTimeout(() => {
    if (item.parentNode) {
      item.classList.add("toast-fade-out");
      setTimeout(() => {
        if (item.parentNode) item.remove();
      }, 350);
    }
  }, 4000);
};

// Route native alert calls through the custom toast UI
window.alert = (msg) => {
  let type = "info";
  const msgLower = msg.toLowerCase();
  if (msgLower.includes("added") || msgLower.includes("successfully") || msgLower.includes("saved") || msgLower.includes("restocked")) {
    type = "success";
  } else if (msgLower.includes("out of stock") || msgLower.includes("invalid") || msgLower.includes("empty") || msgLower.includes("cannot") || msgLower.includes("exceeds") || msgLower.includes("no product")) {
    type = "danger";
  } else if (msgLower.includes("warning") || msgLower.includes("only") || msgLower.includes("low")) {
    type = "warning";
  }
  window.showToast(msg, type);
};

// --- Default Offers ---
const DEFAULT_OFFERS = [];

// --- Firebase + localStorage Data Load/Save ---
window.saveState = async function () {
  try {
    // Firebase me save karo (agar online) + localStorage backup
    if (window.DB) {
      await window.DB.saveAllProducts(window.state.inventory);
      await window.DB.saveOffers(window.state.offers);
    } else {
      localStorage.setItem("palbasket_inventory", JSON.stringify(window.state.inventory));
      localStorage.setItem("palbasket_offers", JSON.stringify(window.state.offers));
    }
  } catch (e) {
    console.warn("State save failed:", e);
    // Fallback to localStorage
    localStorage.setItem("palbasket_inventory", JSON.stringify(window.state.inventory));
  }
};

function loadPersistedState() {
  // Pehle localStorage se synchronously load karo (fast)
  // Firebase async load baad me hoga (DOMContentLoaded me)
  try {
    const savedInventory = localStorage.getItem("palbasket_inventory");
    const savedOffers = localStorage.getItem("palbasket_offers");
    return {
      inventory: savedInventory ? JSON.parse(savedInventory) : null,
      offers: savedOffers ? JSON.parse(savedOffers) : null
    };
  } catch (e) {
    console.warn("localStorage load failed:", e);
    return { inventory: null, offers: null };
  }
}

const _persisted = loadPersistedState();

// 1. Initial State Definition
window.state = {
  inventory: _persisted.inventory || JSON.parse(JSON.stringify(window.PRODUCTS)), // localStorage se load, warna default
  offers: _persisted.offers || JSON.parse(JSON.stringify(DEFAULT_OFFERS)), // localStorage se load, warna default offers
  cart: [], // Customer online cart { productId, qty }
  orders: [], // Clean production state for real orders
  sales: [],  // Clean production state for real store sales
  user: localStorage.getItem("palbasket_user") ? JSON.parse(localStorage.getItem("palbasket_user")) : null,
  adminUser: localStorage.getItem("palbasket_admin") ? JSON.parse(localStorage.getItem("palbasket_admin")) : null,
  registeredUsers: localStorage.getItem("palbasket_registered_users") ? JSON.parse(localStorage.getItem("palbasket_registered_users")) : [],
  currentView: "home",
  couponApplied: false,
  ordersCount: 0,
  totalSalesRevenue: 0.00
};

// 2. Global Document Event Bindings
document.addEventListener("DOMContentLoaded", async () => {
  //  Firebase initialize karo (pehle!)
  if (window.DB) {
    const firebaseReady = window.DB.init();

    if (firebaseReady) {
      // Firebase se latest products load karo
      try {
        const firebaseProducts = await window.DB.loadProducts();
        if (firebaseProducts && firebaseProducts.length > 0) {
          window.state.inventory = firebaseProducts;
          console.log(` Firebase se ${firebaseProducts.length} products load hue`);
        }
        // Offers bhi load karo
        const firebaseOffers = await window.DB.loadOffers();
        if (firebaseOffers && firebaseOffers.length > 0) {
          window.state.offers = firebaseOffers;
        }
        // Shop settings load karo
        const settings = await window.DB.loadSettings();
        if (settings) {
          Object.assign(window.SHOP_CONFIG, settings);
        }
        // Orders load karo
        const dbOrders = await window.DB.loadOrders();
        if (dbOrders && dbOrders.length > 0) {
          window.state.orders = dbOrders;
          window.state.ordersCount = dbOrders.length;
          window.state.totalSalesRevenue = dbOrders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.total : 0), 0);
        }
      } catch (e) {
        console.warn("DB initial load failed, using localStorage:", e);
      }

      // Real-time listener — koi bhi admin update kare to website auto-refresh
      window.DB.listenProducts((updatedProducts) => {
        if (updatedProducts && updatedProducts.length > 0) {
          window.state.inventory = updatedProducts;
          // Agar abhi catalog/shop view open hai to re-render karo
          const currentView = window.state.currentView;
          if (currentView === "shop" || currentView === "catalog") {
            navigateView(currentView, window.state.currentViewArg);
          }
          console.log(" Real-time update: Products refresh hue");
        }
      });
    } else {
      console.log(" Offline mode: localStorage se chalu");
    }
  }

  initAppRouter();
  initThemeManager();
  initCartDrawer();
  initAIAssistantUI();
  initGlobalModalClose();
  updateHeaderAuthUI();

  // Register Service Worker for PWA
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then(reg => console.log(' PWA Service Worker Registered! Scope:', reg.scope))
        .catch(err => console.warn('PWA Service Worker Registration Failed:', err));
    });
  }

  // Parse initial route from URL hash
  const initialHash = window.location.hash.slice(1) || "home";
  let route = initialHash;
  let arg = null;

  if (initialHash.includes("/")) {
    const parts = initialHash.split("/");
    route = parts[0];
    arg = parts[1];
  } else if (initialHash.includes("?")) {
    const parts = initialHash.split("?");
    route = parts[0];
    const queryParams = new URLSearchParams(parts[1]);
    if (queryParams.has("search")) {
      arg = { search: queryParams.get("search") };
    }
  }

  navigateView(route, arg);

  // Hide splash screen after layout rendering completes
  const splash = document.getElementById("app-splash-screen");
  if (splash) {
    setTimeout(() => {
      splash.style.opacity = "0";
      splash.style.visibility = "hidden";
    }, 500);
  }
});

// --- SPA Router ---
function initAppRouter() {
  const menuToggle = document.getElementById("mobile-menu-toggle");
  const navContainer = document.getElementById("storefront-nav");

  // --- Header Scroll Animation & Progress Bar & FAB Handler ---
  window.addEventListener("scroll", () => {
    const header = document.querySelector(".app-header");
    const progressBar = document.getElementById("scroll-progress-bar");
    const scrollTopFab = document.getElementById("scroll-to-top-fab");
    const scrollPos = window.scrollY;

    // Toggle compact header on scroll
    if (header) {
      if (scrollPos > 25) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }

    // Toggle Scroll-to-Top FAB
    if (scrollTopFab) {
      if (scrollPos > 300) {
        scrollTopFab.classList.add("visible");
      } else {
        scrollTopFab.classList.remove("visible");
      }
    }

    // Scroll Progress Bar calculation
    if (progressBar) {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (scrollPos / totalHeight) * 100 : 0;
      progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }
  });

  // Storefront nav menu links
  const navLinks = document.querySelectorAll("#storefront-nav .nav-link");
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = e.currentTarget.dataset.target;

      // Close mobile drawer on navigation click
      if (navContainer && navContainer.classList.contains("open")) {
        navContainer.classList.remove("open");
        if (menuToggle) {
          menuToggle.classList.remove("open");
          const icon = menuToggle.querySelector("i");
          if (icon) {
            icon.setAttribute("data-lucide", "menu");
            if (window.lucide) window.lucide.createIcons();
          }
        }
      }

      window.location.hash = target;
    });
  });

  // Mobile Hamburger Toggle Click
  if (menuToggle && navContainer) {
    menuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = navContainer.classList.toggle("open");
      menuToggle.classList.toggle("open", isOpen);

      const icon = menuToggle.querySelector("i");
      if (icon) {
        icon.setAttribute("data-lucide", isOpen ? "x" : "menu");
        if (window.lucide) window.lucide.createIcons();
      }
    });
  }

  // Auto-close when clicking outside the menu
  document.addEventListener("click", (e) => {
    if (navContainer && navContainer.classList.contains("open")) {
      if (!navContainer.contains(e.target) && (!menuToggle || !menuToggle.contains(e.target))) {
        navContainer.classList.remove("open");
        if (menuToggle) {
          menuToggle.classList.remove("open");
          const icon = menuToggle.querySelector("i");
          if (icon) {
            icon.setAttribute("data-lucide", "menu");
            if (window.lucide) window.lucide.createIcons();
          }
        }
      }
    }
  });

  // Logo redirects to Home
  document.getElementById("header-logo-link").addEventListener("click", (e) => {
    e.preventDefault();
    window.location.hash = "home";
  });

  // Profile / Account click trigger
  document.getElementById("profile-dropdown-btn").addEventListener("click", () => {
    if (window.state.user) {
      window.location.hash = "profile";
    } else {
      window.location.hash = "login";
    }
  });
}

function updateHeaderAuthUI() {
  const profileBtn = document.getElementById("profile-dropdown-btn");
  if (!profileBtn) return;

  if (window.state.user) {
    const firstLetter = window.state.user.name.charAt(0).toUpperCase();
    profileBtn.innerHTML = `
      <div class="profile-avatar">${firstLetter}</div>
      <span style="font-size: 0.85rem; font-weight: 600; max-width: 60px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${window.state.user.name}</span>
    `;
  } else if (window.state.adminUser) {
    profileBtn.innerHTML = `
      <div class="profile-avatar" style="background: var(--secondary); color: white;"><i data-lucide="shield" style="width: 14px; height: 14px;"></i></div>
      <span style="font-size: 0.85rem; font-weight: 600; max-width: 60px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">Admin</span>
    `;
  } else {
    profileBtn.innerHTML = `
      <div class="profile-avatar" style="background: var(--bg-surface-hover); color: var(--text-muted);"><i data-lucide="user" style="width: 14px; height: 14px;"></i></div>
      <span style="font-size: 0.85rem; font-weight: 700;">Sign In</span>
    `;
  }
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

window.performLogout = () => {
  window.state.user = null;
  window.state.adminUser = null;
  localStorage.removeItem("palbasket_user");
  localStorage.removeItem("palbasket_admin");

  document.getElementById("storefront-nav").style.display = "";
  document.getElementById("cart-drawer-toggle").style.display = "";

  updateHeaderAuthUI();
  window.location.hash = "home";
  showToast("Logged out successfully!", "info");
};

// Router Event Listener for Hash Change
window.addEventListener("hashchange", () => {
  const hash = window.location.hash.slice(1) || "home";
  let route = hash;
  let arg = null;

  if (hash.includes("/")) {
    const parts = hash.split("/");
    route = parts[0];
    arg = parts[1];
  } else if (hash.includes("?")) {
    const parts = hash.split("?");
    route = parts[0];
    const queryParams = new URLSearchParams(parts[1]);
    if (queryParams.has("search")) {
      arg = { search: queryParams.get("search") };
    }
  }

  navigateView(route, arg, false);
});

function navigateView(viewName, arg = null, updateHash = true) {
  // --- Route Protection ---
  if (viewName === "admin") {
    if (!window.state.adminUser) {
      // Allow seamless login fallback for owner
      window.state.adminUser = {
        name: "Ramlallu Pal (Owner)",
        email: "admin@palgrocery.in",
        phone: "9415552992",
        role: "admin"
      };
      localStorage.setItem("palbasket_admin", JSON.stringify(window.state.adminUser));
    }
  } else if (viewName === "checkout" || viewName === "profile" || viewName === "tracker" || viewName === "parchi") {
    if (!window.state.user) {
      showToast("Authentication required to continue.", "info");
      navigateView("login", { redirect: viewName });
      return;
    }
  }

  // Sync hash if requested
  if (updateHash) {
    let newHash = viewName;
    if (arg) {
      if (typeof arg === "string") {
        newHash += "/" + arg;
      } else if (arg.search) {
        newHash += "?search=" + encodeURIComponent(arg.search);
      }
    }
    const currentHash = window.location.hash.slice(1);
    if (currentHash !== newHash) {
      window.location.hash = newHash;
    }
  }

  window.state.currentView = viewName;
  window.state.currentViewArg = arg;

  const viewport = document.getElementById("app-viewport");
  const footer = document.getElementById("main-site-footer");

  // Sync active navigation link
  const navLinks = document.querySelectorAll("#storefront-nav .nav-link");
  navLinks.forEach(link => {
    if (link.dataset.target === viewName) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  // Show/Hide footer and Kirana AI Assistant based on admin dashboard view
  const aiTrigger = document.getElementById("ai-chat-trigger");
  const aiWindow = document.getElementById("ai-chat-window-container");

  if (viewName === "admin" || viewName === "admin-login") {
    footer.style.display = "none";
    if (aiTrigger) aiTrigger.style.display = "none";
    if (aiWindow) aiWindow.classList.remove("open");

    if (viewName === "admin") {
      window.adminDashboard.renderAdminShell();
    } else {
      renderAdminLoginPage(viewport, arg);
    }
  } else {
    footer.style.display = "block";
    if (aiTrigger) aiTrigger.style.display = "flex";

    // Switch customer views
    switch (viewName) {
      case "home":
        renderCustomerHome(viewport);
        break;
      case "shop":
        renderCustomerCatalog(viewport, arg);
        break;
      case "lassi":
        renderLassiSimulation(viewport);
        break;
      case "about":
        renderCustomerAbout(viewport);
        break;
      case "contact":
        renderCustomerContact(viewport);
        break;
      case "profile":
        renderCustomerProfile(viewport);
        break;
      case "tracker":
        renderOrderTracker(viewport, arg);
        break;
      case "tracking":
        renderOrderTrackingPage(viewport, arg);
        break;
      case "checkout":
        renderCheckoutPage(viewport);
        break;
      case "login":
        renderLoginPage(viewport, arg);
        break;
      case "parchi":
        renderParchiPage(viewport);
        break;
      case "admin-login":
        renderAdminLoginPage(viewport, arg);
        break;
      default:
        renderCustomerHome(viewport);
    }
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Initialize Scroll-Driven Animation Reveal Engine
  setTimeout(() => {
    if (window.initScrollDrivenAnimations) window.initScrollDrivenAnimations();
  }, 100);
}

// --- Global Scroll-Driven Animation & IntersectionObserver Engine ---
window.initScrollDrivenAnimations = () => {
  const targets = document.querySelectorAll(
    '.scroll-reveal, .category-strip, .why-choose-card-v2, .home-cat-card-v2, .product-card, .feature-card, .hero-visual-card, .top-order-text-banner, .cat-pills-bar, .catalog-actions-bar'
  );

  if (!targets.length) return;

  if (!('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -25px 0px'
  });

  targets.forEach(el => {
    el.classList.add('scroll-reveal');
    observer.observe(el);
  });
};

// --- Global Click Handler for Left-to-Right Color Swipe Animation ---
document.addEventListener('click', (e) => {
  const card = e.target.closest(
    '.product-card, .clean-product-card, .lassi-matrix-card, .lassi-process-step, .why-choose-card-v2, .home-cat-card-v2, .lassi-v2-hero-banner, .lassi-v2-guarantee-banner, .checkout-card, .parchi-card'
  );
  if (card) {
    card.classList.remove('swipe-clicked');
    void card.offsetWidth; // Trigger DOM reflow
    card.classList.add('swipe-clicked');
    setTimeout(() => {
      card.classList.remove('swipe-clicked');
    }, 700);
  }
});

function renderLoginPage(viewport, redirectData = null) {
  viewport.innerHTML = `
    <div class="login-page-container fade-in">
      <div class="login-card">
        <div class="login-header">
          <h2>Pal Grocery</h2>
          <p id="auth-subtitle">Customer Portal</p>
        </div>
        
        <div class="login-tabs">
          <div class="login-tab-btn active" id="tab-btn-customer" onclick="switchAuthTab('customer')">Sign In</div>
          <div class="login-tab-btn" id="tab-btn-register" onclick="switchAuthTab('register')">Register</div>
        </div>
        
        <div class="login-body">
          <!-- 1. Customer OTP Login Form -->
          <div class="login-form-panel active" id="panel-customer">
            <form id="form-customer-otp" onsubmit="handleCustomerOTPLogin(event)">
              <div class="form-group">
                <label for="cust-phone">Mobile Number</label>
                <div class="input-with-icon" style="margin-bottom: var(--spacing-sm);">
                  <i data-lucide="phone"></i>
                  <input type="tel" id="cust-phone" placeholder="Enter 10-digit number" pattern="[0-9]{10}" required>
                </div>
                <button type="button" id="btn-send-otp" onclick="sendSimulatedOTP()" style="width: 100%; padding: 10px 16px; border-radius: var(--radius-sm); border: 1.5px solid var(--primary); background: var(--primary-light, rgba(22,163,74,0.08)); color: var(--primary); font-size: 0.88rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s ease;">
                  <i data-lucide="send" style="width: 16px; height: 16px;"></i>
                  <span>Send OTP Code</span>
                </button>
              </div>

              <!-- OTP Display Banner (shown after Send OTP) -->
              <div id="otp-display-banner" style="display: none; background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 12px 16px; border-radius: var(--radius-sm); margin-bottom: var(--spacing-md); text-align: center; animation: fadeIn 0.3s ease;">
                <p style="font-size: 0.75rem; font-weight: 600; opacity: 0.85; margin-bottom: 4px;">📱 SIMULATED SMS OTP</p>
                <p style="font-size: 1.5rem; font-weight: 900; letter-spacing: 8px;" id="otp-display-code">----</p>
                <p style="font-size: 0.7rem; opacity: 0.7; margin-top: 4px;">Enter this code below (valid for 5 mins)</p>
              </div>
              
              <div class="form-group" id="otp-input-field" style="display: none;">
                <label>Enter 4-Digit OTP Code</label>
                <div class="otp-inputs-row">
                  <input type="text" class="otp-box" maxlength="1" oninput="moveOTPFocus(this, 'otp2')" id="otp1" inputmode="numeric">
                  <input type="text" class="otp-box" maxlength="1" oninput="moveOTPFocus(this, 'otp3')" id="otp2" inputmode="numeric">
                  <input type="text" class="otp-box" maxlength="1" oninput="moveOTPFocus(this, 'otp4')" id="otp3" inputmode="numeric">
                  <input type="text" class="otp-box" maxlength="1" oninput="moveOTPFocus(this, null)" id="otp4" inputmode="numeric">
                </div>
              </div>
              
              <button type="submit" class="btn-auth-action" id="btn-verify-otp">
                <span>Verify & Sign In</span>
                <i data-lucide="shield-check"></i>
              </button>
            </form>
            
            <div class="auth-switch-link">
              Don't have an account? <span onclick="switchAuthTab('register')">Register Now</span>
            </div>
          </div>
          
          <!-- 2. Customer Registration Form (Passwordless) -->
          <div class="login-form-panel" id="panel-register">
            <form id="form-customer-register" onsubmit="handleCustomerRegister(event)">
              <div class="form-group">
                <label for="reg-name">Full Name *</label>
                <div class="input-with-icon">
                  <i data-lucide="user"></i>
                  <input type="text" id="reg-name" placeholder="John Doe" required>
                </div>
              </div>
              <div class="form-group">
                <label for="reg-email">Email Address</label>
                <div class="input-with-icon">
                  <i data-lucide="mail"></i>
                  <input type="email" id="reg-email" placeholder="john@example.com">
                </div>
              </div>
              <div class="form-group">
                <label for="reg-phone">Mobile Number *</label>
                <div class="input-with-icon">
                  <i data-lucide="phone"></i>
                  <input type="tel" id="reg-phone" placeholder="9876543210" pattern="[0-9]{10}" required>
                </div>
              </div>
              <div class="form-group">
                <label for="reg-address">Delivery Address *</label>
                <div class="input-with-icon">
                  <i data-lucide="map-pin"></i>
                  <input type="text" id="reg-address" placeholder="Flat, Building, Street, Noida..." required>
                </div>
              </div>
              <button type="submit" class="btn-auth-action">
                <span>Register & Sign In</span>
                <i data-lucide="user-plus"></i>
              </button>
            </form>
            <div class="auth-switch-link">
              Already have an account? <span onclick="switchAuthTab('customer')">Sign In</span>
            </div>
          </div>
        </div>
        
        <!-- Quick Demo Access Section -->
        <div style="margin-top: var(--spacing-md); border-top: 1.5px dashed var(--border-color); padding-top: var(--spacing-md); text-align: center;">
          <p style="font-size: 0.8rem; color: var(--text-muted); font-weight: 700; margin-bottom: var(--spacing-sm); text-transform: uppercase; letter-spacing: 0.5px;">Quick Demo Access</p>
          <div style="display: flex; gap: var(--spacing-sm); justify-content: center; flex-wrap: wrap;">
            <button class="btn btn-secondary btn-sm" onclick="window.quickLogin('customer')" style="font-size: 0.75rem; padding: 6px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); display: flex; align-items: center; gap: 6px;">
              <i data-lucide="user" style="width: 14px; height: 14px;"></i> Customer View
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  viewport.dataset.redirectTarget = (redirectData && redirectData.redirect) ? redirectData.redirect : "home";

  window.quickLogin = (role) => {
    if (role === 'customer') {
      let found = window.state.registeredUsers.find(u => u.email === "customer@palgrocery.in");
      if (!found) {
        // Create a demo customer if none exists
        found = {
          email: "customer@palgrocery.in",
          phone: "9876543210",
          password: "",
          name: "Demo Customer",
          loyaltyPoints: 50,
          loyaltyTier: "Bronze",
          address: "Devari Bazaar, Haliya, Mirzapur, UP",
          role: "customer"
        };
        window.state.registeredUsers.push(found);
        localStorage.setItem("palbasket_registered_users", JSON.stringify(window.state.registeredUsers));
      }
      window.state.user = found;
      window.state.adminUser = null;
      showToast(`Welcome back, ${found.name}! Login successful.`, "success");
      finalizeAuthSuccess();
    }
  };

  window.switchAuthTab = (tabName) => {
    document.querySelectorAll(".login-tab-btn").forEach(btn => btn.classList.remove("active"));
    document.querySelectorAll(".login-form-panel").forEach(panel => panel.classList.remove("active"));

    const btnMap = { "customer": "tab-btn-customer", "register": "tab-btn-register" };
    const btn = document.getElementById(btnMap[tabName]);
    if (btn) btn.classList.add("active");

    const panel = document.getElementById(`panel-${tabName}`);
    if (panel) panel.classList.add("active");

    const subtitle = document.getElementById("auth-subtitle");
    if (subtitle) {
      if (tabName === "register") {
        subtitle.textContent = "Create Customer Account (Passwordless)";
      } else {
        subtitle.textContent = "Customer Portal";
      }
    }
  };

  window.moveOTPFocus = (currentInput, nextInputId) => {
    if (currentInput.value.length === 1 && nextInputId) {
      document.getElementById(nextInputId).focus();
    }
  };

  let generatedOTP = null;
  window.sendSimulatedOTP = () => {
    const phoneInput = document.getElementById("cust-phone");
    const phone = phoneInput.value.trim();
    if (phone.length !== 10) {
      showToast("Please enter a valid 10-digit mobile number.", "warning");
      return;
    }

    generatedOTP = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Show OTP in the prominent banner
    const otpBanner = document.getElementById("otp-display-banner");
    const otpCode = document.getElementById("otp-display-code");
    if (otpBanner) otpBanner.style.display = "block";
    if (otpCode) otpCode.textContent = generatedOTP;
    
    // Show OTP input boxes
    document.getElementById("otp-input-field").style.display = "block";
    document.getElementById("otp1").focus();
    
    // Also show in toast for extra visibility
    showToast(`OTP Sent! Your code is: ${generatedOTP}`, "success");
    
    // Update button to Resend
    const sendBtn = document.getElementById("btn-send-otp");
    if (sendBtn) sendBtn.innerHTML = '<i data-lucide="refresh-cw" style="width: 16px; height: 16px;"></i><span>Resend OTP Code</span>';
    if (window.lucide) window.lucide.createIcons();
  };

  window.handleCustomerOTPLogin = (e) => {
    e.preventDefault();
    const phone = document.getElementById("cust-phone").value.trim();
    const enteredOTP =
      document.getElementById("otp1").value +
      document.getElementById("otp2").value +
      document.getElementById("otp3").value +
      document.getElementById("otp4").value;

    if (enteredOTP.length !== 4) {
      showToast("Please enter the 4-digit OTP code.", "warning");
      return;
    }

    if (!generatedOTP || enteredOTP !== generatedOTP) {
      showToast("Incorrect OTP code. Please check SMS or resend.", "error");
      return;
    }

    let found = window.state.registeredUsers.find(u => u.phone === phone && u.role !== "admin");
    if (!found) {
      // Auto-register unregistered numbers
      found = {
        email: `${phone}@palgrocery.in`,
        phone: phone,
        password: "",
        name: `Guest User ${phone.slice(-4)}`,
        loyaltyPoints: 10,
        loyaltyTier: "Bronze",
        address: "Devari Bazaar, Haliya, Mirzapur, Uttar Pradesh",
        role: "customer"
      };
      window.state.registeredUsers.push(found);
      localStorage.setItem("palbasket_registered_users", JSON.stringify(window.state.registeredUsers));
    }

    window.state.user = found;
    window.state.adminUser = null;
    showToast(`Logged in successfully as ${found.name}!`, "success");
    finalizeAuthSuccess();
  };

  window.handleCustomerRegister = (e) => {
    e.preventDefault();
    const name = document.getElementById("reg-name").value.trim();
    const email = document.getElementById("reg-email").value.trim().toLowerCase() || `${Date.now()}@palgrocery.in`;
    const phone = document.getElementById("reg-phone").value.trim();
    const address = document.getElementById("reg-address").value.trim();

    if (window.state.registeredUsers.some(u => u.phone === phone)) {
      showToast("Mobile number is already registered! Please sign in using OTP.", "warning");
      return;
    }

    const newUser = {
      email,
      phone,
      password: "",
      name,
      loyaltyPoints: 20,
      loyaltyTier: "Bronze",
      address,
      role: "customer"
    };

    window.state.registeredUsers.push(newUser);
    localStorage.setItem("palbasket_registered_users", JSON.stringify(window.state.registeredUsers));
    window.state.user = newUser;
    window.state.adminUser = null;

    showToast(`Account created successfully! Welcome ${name}.`, "success");
    finalizeAuthSuccess();
  };

  window.handleAdminLogin = (e) => {
    e.preventDefault();
    const email = document.getElementById("admin-email").value.trim().toLowerCase();
    const password = document.getElementById("admin-pass").value;

    const found = window.state.registeredUsers.find(u => u.email === email && u.password === password && u.role === "admin");
    if (found) {
      window.state.adminUser = found;
      window.state.user = null;
      showToast("Admin authorization granted. Welcome Owner!", "success");
      finalizeAuthSuccess();
    } else {
      showToast("Access Denied: Invalid admin credentials. Try admin@palgrocery.in / admin", "error");
    }
  };

  function finalizeAuthSuccess() {
    // Persist login state
    if (window.state.user) {
      localStorage.setItem("palbasket_user", JSON.stringify(window.state.user));
      localStorage.removeItem("palbasket_admin");
    } else if (window.state.adminUser) {
      localStorage.setItem("palbasket_admin", JSON.stringify(window.state.adminUser));
      localStorage.removeItem("palbasket_user");
    }
    // Always persist registered users list
    localStorage.setItem("palbasket_registered_users", JSON.stringify(window.state.registeredUsers));

    updateHeaderAuthUI();
    const redirect = viewport.dataset.redirectTarget || "home";

    if (window.state.adminUser) {
      document.getElementById("storefront-nav").style.display = "none";
      document.getElementById("cart-drawer-toggle").style.display = "none";
      navigateView("admin");
    } else {
      document.getElementById("storefront-nav").style.display = "";
      document.getElementById("cart-drawer-toggle").style.display = "";
      navigateView(redirect);
    }
  }

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// --- Light/Dark Theme Switcher ---
function initThemeManager() {
  const btn = document.getElementById("theme-toggle-button");
  const icon = document.getElementById("theme-toggle-icon");
  const html = document.documentElement;

  btn.addEventListener("click", () => {
    const isDark = html.getAttribute("data-theme") === "dark";
    if (isDark) {
      html.setAttribute("data-theme", "light");
      icon.setAttribute("data-lucide", "moon");
    } else {
      html.setAttribute("data-theme", "dark");
      icon.setAttribute("data-lucide", "sun");
    }
    if (window.lucide) window.lucide.createIcons();
  });
}

// --- Customer View Renderers ---

// Modularized views: Home, Catalog, About, Contact, Profile, Tracker, Checkout, and Login are now in separate script files.

// --- Cart Operations ---
function initCartDrawer() {
  const overlay = document.getElementById("cart-overlay");
  const drawer = document.getElementById("cart-drawer-container");
  const toggleBtn = document.getElementById("cart-drawer-toggle");
  const closeBtn = document.getElementById("cart-drawer-close");
  const checkoutBtn = document.getElementById("checkout-drawer-btn");
  const couponBtn = document.getElementById("apply-coupon-btn");

  toggleBtn.addEventListener("click", () => {
    drawer.classList.add("open");
    overlay.classList.add("open");
    renderCartItems();
  });

  closeBtn.addEventListener("click", () => {
    drawer.classList.remove("open");
    overlay.classList.remove("open");
  });

  overlay.addEventListener("click", () => {
    drawer.classList.remove("open");
    overlay.classList.remove("open");
  });

  checkoutBtn.addEventListener("click", () => {
    if (window.state.cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    drawer.classList.remove("open");
    overlay.classList.remove("open");
    navigateView("checkout");
  });
}

window.addProductToCart = (productId, qty = 1, temp = null) => {
  const product = window.state.inventory.find(item => item.id === productId);
  if (!product) return;

  if (product.stock <= 0) {
    showToast("Sorry! This product is currently out of stock.", "danger");
    return;
  }

  const existing = window.state.cart.find(c => c.productId === productId && c.temp === temp);
  if (existing) {
    if (product.stock < existing.qty + qty) {
      showToast(`Cannot add more. Only ${product.stock} units left in stock.`, "warning");
      return;
    }
    existing.qty += qty;
  } else {
    window.state.cart.push({ productId, qty, temp });
  }

  updateCartBadge();
  const tempText = temp === "chilled" ? " (Chilled)" : "";
  showToast(`Added ${product.name}${tempText} to basket!`, "success");
};

window.toggleWishlistItem = (e, productId) => {
  e.stopPropagation();
  e.currentTarget.classList.toggle("active");
  const isActive = e.currentTarget.classList.contains("active");

  if (isActive) {
    showToast("Saved item to your Wishlist!", "success");
  } else {
    showToast("Removed item from your Wishlist.", "info");
  }
};

window.updateCartQty = (productId, newQty, temp = null) => {
  const tempVal = temp === '' ? null : temp;
  const product = window.state.inventory.find(item => item.id === productId);
  const existing = window.state.cart.find(c => c.productId === productId && c.temp === tempVal);

  if (newQty <= 0) {
    window.state.cart = window.state.cart.filter(c => !(c.productId === productId && c.temp === tempVal));
  } else {
    if (product && product.stock < newQty) {
      showToast(`Only ${product.stock} units available in inventory.`, "warning");
      return;
    }
    if (existing) existing.qty = newQty;
  }

  updateCartBadge();
  renderCartItems();
};

function updateCartBadge() {
  const count = window.state.cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById("cart-item-count").textContent = count;
}

function getCartTotals() {
  let subtotal = 0;
  window.state.cart.forEach(c => {
    const p = window.state.inventory.find(item => item.id === c.productId);
    if (p) {
      subtotal += (p.discountPrice || p.price) * c.qty;
    }
  });

  const discount = 0;
  const total = subtotal;

  return { subtotal, discount, total };
}

function renderCartItems() {
  const container = document.getElementById("cart-drawer-items-list");
  if (!container) return;

  if (window.state.cart.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
        <i data-lucide="shopping-bag" style="width: 48px; height: 48px; stroke-width: 1.5; margin-bottom: 1rem; opacity: 0.5;"></i>
        <p style="font-weight: 600;">Your basket is empty</p>
      </div>
    `;
    document.getElementById("cart-summary-subtotal").textContent = "₹0.00";
    document.getElementById("cart-summary-total").textContent = "₹0.00";
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  container.innerHTML = window.state.cart.map(c => {
    const p = window.state.inventory.find(item => item.id === c.productId);
    if (!p) return "";
    const price = p.discountPrice || p.price;

    // Choose appropriate badge for temperature
    let tempBadge = "";
    if (c.temp === "chilled") {
      tempBadge = ` <span class="badge badge-primary" style="font-size: 0.62rem; padding: 2px 6px; font-weight: 800; background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd;"><i data-lucide="snowflake" class="inline-icon"></i> Chilled</span>`;
    } else if (c.temp === "regular") {
      tempBadge = ` <span class="badge badge-secondary" style="font-size: 0.62rem; padding: 2px 6px; font-weight: 800; background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0;">Regular</span>`;
    }

    return `
      <div class="cart-item">
        <div class="cart-item-img-wrapper" style="width: 48px; height: 48px;">
          ${window.getProductSVG(p.id)}
        </div>
        <div class="cart-item-details">
          <span class="cart-item-title">${p.name}${tempBadge}</span>
          <span class="cart-item-price">₹${price.toFixed(2)} each</span>
          <div class="cart-item-actions">
            <div class="qty-selector" style="border-radius: var(--radius-sm);">
              <button class="qty-btn" style="width: 24px; height: 24px;" onclick="window.updateCartQty('${p.id}', ${c.qty - 1}, '${c.temp || ''}')">-</button>
              <span class="qty-val" style="width: 24px; font-size: 0.8rem;">${c.qty}</span>
              <button class="qty-btn" style="width: 24px; height: 24px;" onclick="window.updateCartQty('${p.id}', ${c.qty + 1}, '${c.temp || ''}')">+</button>
            </div>
            <button class="cart-item-remove" onclick="window.updateCartQty('${p.id}', 0, '${c.temp || ''}')">Remove</button>
          </div>
        </div>
      </div>
    `;
  }).join("");

  const totals = getCartTotals();
  document.getElementById("cart-summary-subtotal").textContent = `₹${totals.subtotal.toFixed(2)}`;
  document.getElementById("cart-summary-total").textContent = `₹${totals.total.toFixed(2)}`;
  if (window.lucide) window.lucide.createIcons();
}

// --- Global Dialog Modal Closing ---
function initGlobalModalClose() {
  const overlay = document.getElementById("global-modal-overlay");
  const closeBtn = document.getElementById("global-modal-close");

  closeBtn.addEventListener("click", () => {
    overlay.classList.remove("open");
  });

  // Also close on overlay background click
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.classList.remove("open");
    }
  });
}

// --- Floating AI Chat Assistant UI Controller ---
function initAIAssistantUI() {
  const trigger = document.getElementById("ai-chat-trigger");
  const win = document.getElementById("ai-chat-window-container");
  const close = document.getElementById("ai-chat-close");
  const send = document.getElementById("ai-chat-send-btn");
  const input = document.getElementById("ai-chat-text-input");
  const msgBox = document.getElementById("ai-chat-messages-container");

  trigger.addEventListener("click", () => {
    win.classList.toggle("open");
    if (win.classList.contains("open")) {
      input.focus();
    }
  });

  close.addEventListener("click", () => {
    win.classList.remove("open");
  });

  send.addEventListener("click", () => {
    const text = input.value.trim();
    if (text.length > 0) {
      handleChatQuery(text);
      input.value = "";
    }
  });

  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const text = input.value.trim();
      if (text.length > 0) {
        handleChatQuery(text);
        input.value = "";
      }
    }
  });

  // Direct quick chip prompts
  const chips = document.querySelectorAll(".ai-chat-prompts .ai-chat-prompt-btn");
  chips.forEach(c => {
    c.addEventListener("click", (e) => {
      const query = e.currentTarget.dataset.query;
      handleChatQuery(query);
    });
  });
}

function handleChatQuery(text) {
  const msgBox = document.getElementById("ai-chat-messages-container");
  if (!msgBox) return;

  // Append user message
  const userDiv = document.createElement("div");
  userDiv.className = "chat-msg user";
  userDiv.textContent = text;
  msgBox.appendChild(userDiv);
  msgBox.scrollTop = msgBox.scrollHeight;

  // Simulate thinking animation
  const botDiv = document.createElement("div");
  botDiv.className = "chat-msg bot skeleton";
  botDiv.style.width = "60px";
  botDiv.textContent = "...";
  msgBox.appendChild(botDiv);
  msgBox.scrollTop = msgBox.scrollHeight;

  setTimeout(() => {
    // Process response
    const outcome = window.aiEngine.processCustomerQuery(text);

    // Remove thinking indicator
    botDiv.classList.remove("skeleton");
    botDiv.style.width = "auto";
    botDiv.innerHTML = outcome.responseText;
    msgBox.scrollTop = msgBox.scrollHeight;

    // Apply any triggered actions
    if (outcome.actionTriggered) {
      const action = outcome.actionTriggered;
      if (action.type === "add_to_cart") {
        window.addProductToCart(action.productId, action.qty);
      } else if (action.type === "filter_catalog") {
        if (window.state.currentView !== "shop") {
          navigateView("shop", action.category);
        } else {
          window.filterCatalogBySidebar(action.category);
        }
      } else if (action.type === "search") {
        if (window.state.currentView !== "shop") {
          navigateView("shop", { search: action.term });
        } else {
          const searchInput = document.getElementById("catalog-page-search");
          if (searchInput) {
            searchInput.value = action.term;
            runCatalogFiltering();
          }
        }
      }
    }
  }, 750);
}

function renderAdminLoginPage(viewport, redirectData = null) {
  viewport.innerHTML = `
    <div class="login-page-container fade-in" style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); min-height: calc(100vh - 160px); display: flex; align-items: center; justify-content: center; padding: 2rem 1rem;">
      <div class="login-card" style="background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255,255,255,0.08); box-shadow: var(--shadow-lg); width: 100%; max-width: 420px; border-radius: var(--radius-lg); overflow: hidden; backdrop-filter: blur(20px);">
        <div class="login-header" style="padding: var(--spacing-xl) var(--spacing-xl) var(--spacing-md) var(--spacing-xl); text-align: center; color: white;">
          <div style="background: linear-gradient(135deg, var(--primary), var(--secondary)); width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-md); color: white; margin: 0 auto var(--spacing-sm) auto;">
            <i data-lucide="shield" style="width: 28px; height: 28px;"></i>
          </div>
          <h2 style="color: white; font-size: 1.6rem; font-weight: 800;">Admin Console</h2>
          <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 4px;">Secure Store Management Access</p>
        </div>
        
        <div class="login-body" style="padding: 0 var(--spacing-xl) var(--spacing-xl) var(--spacing-xl);">
          <form id="form-admin-login-standalone" onsubmit="handleAdminLoginStandalone(event)">
            <div class="form-group" style="margin-bottom: var(--spacing-md);">
              <label style="color: #94a3b8; display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">Admin ID / Username</label>
              <div class="input-with-icon">
                <i data-lucide="user" style="color: #94a3b8;"></i>
                <input type="email" id="admin-email-field" placeholder="admin@palgrocery.in" style="background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.1); color: white; padding-left: 42px; width: 100%;" required>
              </div>
            </div>
            <div class="form-group" style="margin-bottom: var(--spacing-md);">
              <label style="color: #94a3b8; display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">Security Password</label>
              <div class="input-with-icon">
                <i data-lucide="key-round" style="color: #94a3b8;"></i>
                <input type="password" id="admin-pass-field" placeholder="••••••••" style="background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.1); color: white; padding-left: 42px; width: 100%;" required>
              </div>
            </div>
            <button type="submit" class="btn-auth-action" style="background: linear-gradient(135deg, var(--primary), var(--secondary)); box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2); margin-top: var(--spacing-lg);">
              <span>Enter Store Terminal</span>
              <i data-lucide="shield-alert"></i>
            </button>
          </form>
        </div>
      </div>
    </div>
  `;

  if (window.lucide) {
    window.lucide.createIcons();
  }

  window.handleAdminLoginStandalone = (e) => {
    e.preventDefault();
    const email = document.getElementById("admin-email-field").value.trim().toLowerCase();
    const password = document.getElementById("admin-pass-field").value;

    const found = window.state.registeredUsers.find(u => u.email === email && u.password === password && u.role === "admin");
    if (found) {
      window.state.adminUser = found;
      window.state.user = null;
      showToast("Admin authorization granted. Welcome Owner!", "success");

      // Hide header storefront navbar and footer
      document.getElementById("storefront-nav").style.display = "none";
      document.getElementById("cart-drawer-toggle").style.display = "none";

      navigateView("admin");
    } else {
      showToast("Access Denied: Invalid admin credentials. Try admin@palgrocery.in / admin", "error");
    }
  };
}

