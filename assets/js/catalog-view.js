// Pal Grocery - Product Catalog View Module

function renderCustomerCatalog(viewport, filters = null) {
  let initialCategory = "all";
  let searchWord = "";

  if (typeof filters === "string") {
    initialCategory = filters;
  } else if (filters && filters.search) {
    searchWord = filters.search;
  }

  viewport.innerHTML = `
    <div class="container fade-in">
      <!-- TOP STYLISH SHINING ORDER TO TEXT HERO BANNER -->
      <style>
        .top-order-text-banner {
          background: linear-gradient(135deg, rgba(14, 165, 233, 0.12) 0%, rgba(56, 189, 248, 0.06) 100%);
          border: 1.5px solid rgba(56, 189, 248, 0.4);
          border-radius: 24px;
          padding: 18px 28px;
          margin-top: 1.5rem;
          margin-bottom: 1.8rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 12px 35px rgba(14, 165, 233, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          flex-wrap: wrap;
        }

        .top-order-text-banner::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -60%;
          width: 40%;
          height: 200%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.5) 50%,
            transparent 100%
          );
          transform: rotate(25deg);
          animation: sweepingBeam 3.5s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes sweepingBeam {
          0% { left: -60%; }
          40% { left: 140%; }
          100% { left: 140%; }
        }

        .shine-order-text-btn {
          position: relative;
          background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
          color: #ffffff;
          padding: 13px 28px;
          border-radius: 30px;
          font-size: 0.96rem;
          font-weight: 800;
          letter-spacing: 0.3px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          border: 1px solid rgba(255, 255, 255, 0.4);
          outline: none;
          box-shadow: 0 8px 25px rgba(14, 165, 233, 0.45), 0 0 20px rgba(56, 189, 248, 0.35);
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .shine-order-text-btn::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 60%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.75),
            transparent
          );
          transform: skewX(-20deg);
          animation: btnShineFlash 2.5s infinite;
        }

        @keyframes btnShineFlash {
          0% { left: -100%; }
          35% { left: 200%; }
          100% { left: 200%; }
        }

        .shine-order-text-btn:hover {
          transform: translateY(-3px) scale(1.04);
          box-shadow: 0 14px 38px rgba(14, 165, 233, 0.65), 0 0 30px rgba(56, 189, 248, 0.6);
        }

        .shine-pulse-dot {
          width: 9px;
          height: 9px;
          background: #38bdf8;
          border-radius: 50%;
          box-shadow: 0 0 10px #38bdf8, 0 0 20px #38bdf8;
          animation: dotPulse 1.5s ease-in-out infinite alternate;
          display: inline-block;
        }

        @keyframes dotPulse {
          0% { transform: scale(0.8); opacity: 0.6; }
          100% { transform: scale(1.4); opacity: 1; }
        }
      </style>

      <div class="top-order-text-banner">
        <div style="display: flex; align-items: center; gap: 16px; z-index: 1;">
          <div style="width: 52px; height: 52px; border-radius: 18px; background: linear-gradient(135deg, #0ea5e9, #0284c7); display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 8px 20px rgba(14, 165, 233, 0.45); flex-shrink: 0;">
            <i data-lucide="sparkles" style="width: 26px; height: 26px;"></i>
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: 10px;">
              <h2 style="font-size: 1.7rem; font-weight: 900; letter-spacing: -0.5px; margin: 0; background: linear-gradient(135deg, var(--text-main), #0ea5e9); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                Product Catalog
              </h2>
              <span class="shine-pulse-dot" title="Active Order by text engine"></span>
            </div>
            <p style="color: var(--text-muted); font-size: 0.92rem; margin-top: 3px;">
              ${window.SHOP_CONFIG && window.SHOP_CONFIG.language === 'hi' 
                ? 'सामान चुनें या ऊपर की बटन से अपनी लिस्ट टाइप करके तुरंत ऑर्डर करें' 
                : 'Browse fresh groceries or send your text list for instant local delivery'}
            </p>
          </div>
        </div>

        <button class="shine-order-text-btn" onclick="window.openOrderByTextModal()" title="Open Order to text Air Movement Popup">
          <i data-lucide="wind" style="width: 20px; height: 20px;"></i>
          <span>${window.SHOP_CONFIG && window.SHOP_CONFIG.language === 'hi' ? 'ऑर्डर लिस्ट (Text)' : 'Order to text'}</span>
          <i data-lucide="arrow-right" style="width: 16px; height: 16px; opacity: 0.85;"></i>
        </button>
      </div>

      <!-- CATEGORY PILLS HORIZONTAL BAR -->
      <style>
        .cat-pills-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          overflow-x: auto;
          padding: 6px 2px 14px 2px;
          margin-bottom: 16px;
          scrollbar-width: none;
        }
        .cat-pills-bar::-webkit-scrollbar {
          display: none;
        }
        .cat-pill-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 30px;
          border: 1.5px solid var(--border-color);
          background: var(--bg-surface);
          color: var(--text-main);
          font-size: 0.88rem;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
        }
        .cat-pill-btn:hover {
          border-color: #0ea5e9;
          color: #0ea5e9;
          background: rgba(14, 165, 233, 0.08);
          transform: translateY(-2px);
        }
        .cat-pill-btn.active {
          background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
          color: #ffffff;
          border-color: transparent;
          box-shadow: 0 6px 18px rgba(14, 165, 233, 0.35);
        }

        .catalog-actions-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          flex-wrap: wrap;
          background: var(--bg-surface);
          border: 1.5px solid var(--border-color);
          border-radius: 18px;
          padding: 12px 18px;
          margin-bottom: 24px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.03);
        }

        .catalog-search-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--bg-base);
          border: 1.5px solid var(--border-color);
          border-radius: 12px;
          padding: 8px 14px;
          flex: 1;
          min-width: 220px;
          transition: border-color 0.25s, box-shadow 0.25s;
        }
        .catalog-search-wrapper:focus-within {
          border-color: #0ea5e9;
          box-shadow: 0 0 12px rgba(14, 165, 233, 0.25);
        }

        .chip-toggle-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 20px;
          border: 1.5px solid var(--border-color);
          background: var(--bg-base);
          color: var(--text-main);
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          user-select: none;
          transition: all 0.2s;
        }
        .chip-toggle-btn:hover {
          border-color: #0ea5e9;
        }
        .chip-toggle-btn input[type="checkbox"] {
          accent-color: #0ea5e9;
          cursor: pointer;
        }
      </style>

      <div class="cat-pills-bar">
        <button class="cat-pill-btn ${initialCategory === 'all' ? 'active' : ''}" data-cat="all" onclick="selectCatalogCategory('all')">
          <i data-lucide="layout-grid" style="width: 16px;"></i> ${window.SHOP_CONFIG && window.SHOP_CONFIG.language === 'hi' ? 'सभी सामान' : 'All Products'}
        </button>
        <button class="cat-pill-btn ${initialCategory === 'snacks' ? 'active' : ''}" data-cat="snacks" onclick="selectCatalogCategory('snacks')">
          <i data-lucide="cookie" style="width: 16px;"></i> ${window.SHOP_CONFIG && window.SHOP_CONFIG.language === 'hi' ? 'स्नैक्स' : 'Snacks'}
        </button>
        <button class="cat-pill-btn ${initialCategory === 'groceries' ? 'active' : ''}" data-cat="groceries" onclick="selectCatalogCategory('groceries')">
          <i data-lucide="shopping-bag" style="width: 16px;"></i> ${window.SHOP_CONFIG && window.SHOP_CONFIG.language === 'hi' ? 'ग्रॉसरी राशन' : 'Groceries'}
        </button>
        <button class="cat-pill-btn ${initialCategory === 'cold_drink' ? 'active' : ''}" data-cat="cold_drink" onclick="selectCatalogCategory('cold_drink')">
          <i data-lucide="cup-soda" style="width: 16px;"></i> ${window.SHOP_CONFIG && window.SHOP_CONFIG.language === 'hi' ? 'कोल्ड ड्रिंक्स' : 'Cold Drinks'}
        </button>
        <button class="cat-pill-btn ${initialCategory === 'lassi' ? 'active' : ''}" data-cat="lassi" onclick="selectCatalogCategory('lassi')">
          <i data-lucide="glass-water" style="width: 16px;"></i> ${window.SHOP_CONFIG && window.SHOP_CONFIG.language === 'hi' ? 'लस्सी' : 'Lassi'}
        </button>
        <button class="cat-pill-btn ${initialCategory === 'essentials' ? 'active' : ''}" data-cat="essentials" onclick="selectCatalogCategory('essentials')">
          <i data-lucide="sparkles" style="width: 16px;"></i> ${window.SHOP_CONFIG && window.SHOP_CONFIG.language === 'hi' ? 'डेली राशन' : 'Daily Essentials'}
        </button>
      </div>

      <div class="catalog-layout" style="display: block; width: 100%;">
        <!-- Full Width Product Grid Area -->
        <section style="width: 100%;">
          <div class="catalog-actions-bar">
            <!-- Catalog Search Bar -->
            <div class="catalog-search-wrapper">
              <i data-lucide="search" style="color: var(--text-muted); width: 18px;"></i>
              <input type="text" id="catalog-page-search" placeholder="${window.SHOP_CONFIG && window.SHOP_CONFIG.language === 'hi' ? 'सामान खोजें...' : 'Search groceries, snacks...'}" value="${searchWord}" oninput="runCatalogFiltering()">
            </div>

            <!-- Quick Filter Chips -->
            <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
              <label class="chip-toggle-btn">
                <input type="checkbox" id="filter-deals-chip" onchange="runCatalogFiltering()">
                <span>🏷️ ${window.SHOP_CONFIG && window.SHOP_CONFIG.language === 'hi' ? 'डिस्काउंट' : 'Deals'}</span>
              </label>
              <label class="chip-toggle-btn">
                <input type="checkbox" id="filter-instock-chip" onchange="runCatalogFiltering()">
                <span>📦 ${window.SHOP_CONFIG && window.SHOP_CONFIG.language === 'hi' ? 'स्टॉक में' : 'In Stock'}</span>
              </label>
            </div>

            <!-- Sorting selector -->
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 700;">Sort By:</span>
              <select class="sort-dropdown" id="catalog-sort" onchange="runCatalogFiltering()" style="border-radius: 12px; padding: 6px 12px; border: 1.5px solid var(--border-color); background: var(--bg-base); font-size: 0.85rem; font-weight: 700; color: var(--text-main);">
                <option value="popularity">Popularity</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>

          <div class="products-grid" id="catalog-products-grid">
            <!-- Rendered by runCatalogFiltering -->
          </div>
        </section>
      </div>
    </div>
  `;

  // Bind category selection helper
  window.selectCatalogCategory = (cat) => {
    document.querySelectorAll('.cat-pill-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.cat === cat);
    });
    runCatalogFiltering();
  };

  // Legacy wrapper for internal calls from other views
  window.filterCatalogBySidebar = (cat) => {
    window.selectCatalogCategory(cat);
  };

  runCatalogFiltering();
}

function runCatalogFiltering() {
  const searchInput = document.getElementById("catalog-page-search");
  const sortSelect = document.getElementById("catalog-sort");
  const dealsCheck = document.getElementById("filter-deals-chip");
  const stockCheck = document.getElementById("filter-instock-chip");
  const grid = document.getElementById("catalog-products-grid");

  if (!grid) return;

  const search = searchInput ? searchInput.value.toLowerCase().trim() : "";
  const sort = sortSelect ? sortSelect.value : "popularity";
  const dealsOnly = dealsCheck ? dealsCheck.checked : false;
  const inStockOnly = stockCheck ? stockCheck.checked : false;

  // Find active category from top pill button
  let activeCat = "all";
  const activePill = document.querySelector('.cat-pill-btn.active');
  if (activePill && activePill.dataset.cat) {
    activeCat = activePill.dataset.cat;
  }

  // Perform filters
  let filtered = window.state.inventory.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search) || p.description.toLowerCase().includes(search);
    const matchesCategory = activeCat === "all" || p.category === activeCat;
    const matchesDeals = !dealsOnly || p.discountPrice !== null;
    const matchesStock = !inStockOnly || p.stock > 0;
    const matchesStatus = p.status !== "hidden";
    return matchesSearch && matchesCategory && matchesDeals && matchesStock && matchesStatus;
  });

  // Perform Sorts
  if (sort === "price-low") {
    filtered.sort((a,b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
  } else if (sort === "price-high") {
    filtered.sort((a,b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
  } else if (sort === "rating") {
    filtered.sort((a,b) => b.rating - a.rating);
  }

  grid.innerHTML = renderProductsListMarkup(filtered);
  if (window.lucide) window.lucide.createIcons();
}

// Markup builder for catalog
function renderProductsListMarkup(products) {
  if (products.length === 0) {
    return `
      <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
        <i data-lucide="search-code" style="width: 48px; height: 48px; margin-bottom: 1rem; opacity: 0.5;"></i>
        <p style="font-weight: 700;">No Products Found</p>
        <p style="font-size: 0.85rem; margin-top: 4px;">Try searching for something else or clearing filters.</p>
      </div>
    `;
  }

  return products.map(p => {
    const priceStr = p.discountPrice ? `
      <span class="price-actual">₹${p.discountPrice.toFixed(2)}</span>
      <span class="price-discounted">₹${p.price.toFixed(2)}</span>
    ` : `
      <span class="price-actual">₹${p.price.toFixed(2)}</span>
    `;

    const isOutOfStock = p.stock === 0;

    return `
      <div class="product-card">
        <button class="product-card-wishlist" aria-label="Add to Wishlist" onclick="toggleWishlistItem(event, '${p.id}')">
          <i data-lucide="heart"></i>
        </button>
        ${p.discountPrice ? `<span class="badge badge-danger product-card-badge">${Math.round(((p.price - p.discountPrice) / p.price) * 100)}% OFF</span>` : ""}
        <div class="product-card-img-wrapper" onclick="showProductDetails('${p.id}')">
          <div class="product-card-img-container">
            ${window.getProductSVG(p)}
          </div>
        </div>
        <div class="product-card-info">
          <span class="product-card-category">${p.category}</span>
          <h3 class="product-card-title" onclick="showProductDetails('${p.id}')">${p.name}</h3>
          
          <div class="product-card-rating">
            <div class="rating-badge">
              <i data-lucide="star" style="fill: var(--warning); stroke: var(--warning); width: 12px; height: 12px;"></i>
              <span>${p.rating.toFixed(1)}</span>
            </div>
            <span class="reviews-count">(${p.reviewsCount})</span>
          </div>

          <div class="product-card-stock">
            <span class="stock-dot ${p.stock === 0 ? 'out-of-stock' : (p.stock <= 10 ? 'low-stock' : 'in-stock')}"></span>
            <span class="stock-text">${p.stock === 0 ? 'Out of Stock' : (p.stock <= 10 ? `Only ${p.stock} left!` : `In Stock (${p.stock})`)}</span>
          </div>

          <div class="product-card-footer" style="flex-direction: column; align-items: stretch; margin-top: auto; gap: 8px;">
            <div class="product-card-price" style="flex-direction: row; align-items: baseline; gap: 8px; justify-content: flex-start;">
              ${priceStr}
            </div>
            
            ${isOutOfStock ? `
              <button class="btn btn-secondary btn-sm btn-add-to-cart" disabled>Sold Out</button>
            ` : `
              <button class="btn btn-primary btn-sm btn-add-to-cart" onclick="addProductToCart('${p.id}')">
                <i data-lucide="shopping-cart" style="width: 14px;"></i> Add to Cart
              </button>
            `}
          </div>
        </div>
      </div>
    `;
  }).join("");
}

// 3. Product Details Modal View
window.showProductDetails = (id) => {
  const p = window.state.inventory.find(item => item.id === id);
  if (!p) return;

  const content = document.getElementById("global-modal-content");
  const overlay = document.getElementById("global-modal-overlay");

  const priceStr = p.discountPrice ? `
    <span class="details-price-actual">₹${p.discountPrice.toFixed(2)}</span>
    <span class="details-price-discounted">₹${p.price.toFixed(2)}</span>
  ` : `
    <span class="details-price-actual">₹${p.price.toFixed(2)}</span>
  `;

  const isBeverageOrDairy = p.category === "dairy" || p.category === "beverages";
  const chilledSelectorHTML = isBeverageOrDairy ? `
    <div class="form-group" style="margin-bottom: var(--spacing-md); width: 100%;">
      <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px; text-align: left;">Temperature Choice / तापमान पसंद :</label>
      <div style="display: flex; gap: 10px;">
        <label style="flex: 1; border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 8px 12px; display: flex; align-items: center; justify-content: center; gap: 6px; cursor: pointer; font-size: 0.82rem; font-weight: 700; background: var(--bg-base);">
          <input type="radio" name="temp-choice" value="regular" checked style="accent-color: var(--primary);">
          <span>Regular / नॉर्मल</span>
        </label>
        <label style="flex: 1; border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 8px 12px; display: flex; align-items: center; justify-content: center; gap: 6px; cursor: pointer; font-size: 0.82rem; font-weight: 700; background: var(--bg-base);">
          <input type="radio" name="temp-choice" value="chilled" style="accent-color: var(--primary);">
          <span>Chilled / ठंडा <i data-lucide="snowflake" class="inline-icon"></i></span>
        </label>
      </div>
    </div>
  ` : "";

  content.innerHTML = `
    <div class="product-details-container" style="box-shadow: none; border: none; padding: 0;">
      <div class="details-gallery" style="aspect-ratio: 1.1; padding: 0;">
        <div style="width: 100%; height: 100%;">
          ${window.getProductSVG(p)}
        </div>
      </div>
      <div class="details-info" style="justify-content: center;">
        <span class="badge badge-primary" style="width: fit-content; text-transform: uppercase; margin-bottom: var(--spacing-sm);">${p.category}</span>
        <h2 class="details-title" style="font-size: 1.6rem; margin-bottom: 4px;">${p.name}</h2>
        <div class="product-card-rating" style="margin-bottom: var(--spacing-sm);">
          <i data-lucide="star" style="fill: var(--warning); width: 16px; height: 16px;"></i>
          <span style="font-size: 0.9rem; font-weight: 700;">${p.rating} (${p.reviewsCount} reviews)</span>
        </div>
        <p style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600; margin-bottom: var(--spacing-sm);">Supplier: ${p.supplier}</p>
        
        <div class="details-price-row">
          ${priceStr}
        </div>
        <p class="details-desc" style="font-size: 0.85rem; line-height: 1.4; margin-bottom: var(--spacing-md);">${p.description}</p>
        
        ${chilledSelectorHTML}
        
        <div style="display: flex; gap: var(--spacing-md); align-items: center; width: 100%;">
          <button class="btn btn-primary" onclick="window.handleDetailsAddToCart('${p.id}')" style="flex: 1;">
            <i data-lucide="shopping-cart"></i> Add to Basket
          </button>
        </div>
      </div>
    </div>
  `;

  window.handleDetailsAddToCart = (productId) => {
    const tempEl = document.querySelector('input[name="temp-choice"]:checked');
    const tempVal = tempEl ? tempEl.value : null;
    window.addProductToCart(productId, 1, tempVal);
    document.getElementById('global-modal-overlay').classList.remove('open');
  };

  overlay.classList.add("open");
  if (window.lucide) window.lucide.createIcons();
};
