#  Pal Grocery

> A Premium, AI-Powered Smart Kirana Store & Retail Management Platform.

---

##  Project Vision
To transform a traditional Indian neighborhood Kirana store into a premium digital retail business. This platform allows customers to browse items, add them to their shopping basket, translate content instantly to Hindi, and chat with an AI assistant, while enabling the shop owner to manage inventory, POS billing, and sales analytics.

---

##  Key Features

### 1. Customer Storefront
- **Responsive Catalog**: Browse products across various categories (Fruits & Veggies, Dairy, Snacks, Groceries, Beverages).
- **Interactive Cart**: Manage items, apply coupons (e.g., `KIRANA10`), and select temperature options (Regular vs. Chilled ).
- **3D Glassmorphic Popup**: Tap on any product to reveal a premium, translucent glassmorphism popup with realistic 3D perspective spring animation and parallax floating layers.
- **Bilingual Support**: Instant toggle button to translate the entire website (including the founder's journey and product details) between **English** and **Hindi**.
- **Hash-Based Routing**: Clean URL navigation (e.g. `#/home`, `#/shop`, `#/about`, `#/contact`) with support for page reloads, deep linking, and browser back/forward buttons.

### 2. Kirana AI Assistant
- Interactive floating assistant that processes customer queries (e.g., "Add 2 apples to cart", "Show organic items", "Is there a discount running?").
- Simulates natural conversation, supports quick prompt chips, and automates cart and catalog filtering operations.

### 3. Admin & POS Billing Portal
- **Real-Time Analytics**: Visual sales revenue metrics, checkout totals, payment type distribution, and order logs.
- **POS Billing Terminal**: Add items to an active customer bill, apply loyalty points, select payment methods, and simulate thermal printer receipt printing.
- **Inventory Predictor**: Predictive stock thresholds alerting shopkeepers about low stock or items nearing expiry dates.

---

##  Folder Structure

```markdown
palbasket/
├── assets/
│   ├── css/
│   │   └── style.css            # Custom premium CSS system (themes, variables, layouts)
│   └── js/
│       ├── products.js          # Mock product database
│       ├── ai-assistant.js      # AI natural language parsing logic
│       ├── admin.js             # Owner terminal, POS, and sales charts
│       ├── pos.js               # POS barcode and billing helpers
│       ├── home-view.js         # Home view renderer and voice simulation
│       ├── catalog-view.js      # Catalog listing and details modal controller
│       ├── about-view.js        # Bilingual founder story renderer
│       ├── contact-view.js      # Contact form and Mirzapur locator map
│       ├── profile-view.js      # Customer loyalty account and order history
│       ├── tracker-view.js      # Delivery tracking timeline
│       ├── checkout-view.js     # Checkout payment and billing gateway simulator
│       ├── login-view.js        # Auth tabs and simulated Mobile OTP login
│       └── app.js               # Orchestrator & Hash-based router
├── index.html                   # Core single-page HTML layout
└── readme.md                    # Project documentation
```

---

##  How to Run Locally

Since this is a static Single Page Application (SPA) built using pure Vanilla HTML, JS, and CSS, it can be launched using any local web server:

### Option 1: Python Web Server
If you have Python installed, run this command in the project directory:
```bash
python -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

### Option 2: VS Code Live Server
Right-click on `index.html` and select **Open with Live Server**.
