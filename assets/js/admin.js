// Pal Grocery Admin Dashboard and Control Center Panel

class KiranaAdmin {
  constructor() {
    this.activeTab = "dashboard";
  }

  // Inject the Admin Shell into main viewport
  renderAdminShell() {
    const viewport = document.getElementById("app-viewport");
    if (!viewport) return;

    viewport.innerHTML = `
      <div class="admin-layout">
        <!-- Sidebar Navigation Menu -->
        <aside class="admin-sidebar">
          <!-- Admin User Profile Card -->
          <div class="admin-profile-card" style="padding: var(--spacing-md); border-bottom: 1px solid var(--border-color); display: flex; align-items: center; gap: var(--spacing-sm); margin-bottom: var(--spacing-sm);">
            <div style="background: var(--primary); width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: white; font-size: 1.1rem;">R</div>
            <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              <h4 style="font-size: 0.88rem; font-weight: 800; color: var(--text-main); margin-bottom: 2px;">Ramlallu Pal</h4>
              <span style="font-size: 0.7rem; color: var(--primary); font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">Store Owner (दुकानदार)</span>
            </div>
          </div>

          <div class="admin-menu-item active" data-tab="dashboard">
            <i data-lucide="layout-grid"></i>
            <span>Dashboard Overview</span>
          </div>
          <div class="admin-menu-item" data-tab="orders">
            <i data-lucide="shopping-bag"></i>
            <span>Orders / ऑर्डर्स</span>
          </div>
          <div class="admin-menu-item" data-tab="inventory">
            <i data-lucide="box"></i>
            <span>Products & Stock (सामान व स्टॉक)</span>
          </div>
          <div class="admin-menu-item" data-tab="customers">
            <i data-lucide="users"></i>
            <span>Customers & Khata (ग्राहक व खाता)</span>
          </div>
          <div class="admin-menu-item" data-tab="pos">
            <i data-lucide="scan-barcode"></i>
            <span>Billing / POS Counter</span>
          </div>
          <div class="admin-menu-item" data-tab="reports">
            <i data-lucide="trending-up"></i>
            <span>Sales Reports (बिक्री रिपोर्ट)</span>
          </div>
          <div class="admin-menu-item" data-tab="settings">
            <i data-lucide="settings"></i>
            <span>Store Settings (सेटिंग्स)</span>
          </div>
          <div class="admin-menu-item" style="margin-top: 1.5rem; color: var(--danger);" onclick="window.performLogout()">
            <i data-lucide="log-out"></i>
            <span>Logout</span>
          </div>
        </aside>

        <!-- Dynamic Admin Content Panel -->
        <section class="admin-content-pane" id="admin-sub-viewport">
          <!-- Loaded Pane via JS -->
        </section>
      </div>
    `;

    // Hook tab click events
    const tabs = document.querySelectorAll(".admin-sidebar .admin-menu-item");
    tabs.forEach(t => {
      t.addEventListener("click", (e) => {
        const item = e.currentTarget;
        tabs.forEach(x => x.classList.remove("active"));
        item.classList.add("active");
        this.activeTab = item.dataset.tab;
        this.renderActiveAdminPane();
      });
    });

    this.renderActiveAdminPane();
  }

  // Render sub panels
  renderActiveAdminPane() {
    const pane = document.getElementById("admin-sub-viewport");
    if (!pane) return;

    if (this.activeTab === "dashboard") {
      this.renderDashboard(pane);
    } else if (this.activeTab === "orders") {
      this.renderOrders(pane);
    } else if (this.activeTab === "inventory") {
      this.renderInventory(pane);
    } else if (this.activeTab === "customers") {
      this.renderKhataBook(pane);
    } else if (this.activeTab === "pos") {
      this.renderPOS(pane);
    } else if (this.activeTab === "reports") {
      this.renderReports(pane);
    } else if (this.activeTab === "settings") {
      this.renderSettings(pane);
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // PANE 1: Dashboard Overview
  renderDashboard(container) {
    const lowStockCount = window.state.inventory.filter(p => p.stock <= 10).length;
    const today = new Date().toISOString().split("T")[0];
    const todaysTransactions = window.state.sales.filter(s => s.date === today);
    const todaysSalesVal = todaysTransactions.reduce((sum, s) => sum + s.total, 0);

    container.innerHTML = `
      <div class="fade-in">
        <h2 style="font-size: 1.6rem; font-weight: 800; margin-bottom: var(--spacing-lg);">Dashboard Overview</h2>
        
        <!-- KPI Row -->
        <div class="admin-kpis">
          <div class="kpi-card">
            <div class="kpi-left">
              <h4>Today's Sales</h4>
              <div class="kpi-val">₹${todaysSalesVal.toFixed(2)}</div>
              <div class="kpi-trend" style="color: var(--success);">+14.5% vs yesterday</div>
            </div>
            <div class="kpi-icon"><i data-lucide="indian-rupee"></i></div>
          </div>
          <div class="kpi-card">
            <div class="kpi-left">
              <h4>Transactions</h4>
              <div class="kpi-val">${todaysTransactions.length}</div>
              <div class="kpi-trend" style="color: var(--success);">${window.state.ordersCount} total orders</div>
            </div>
            <div class="kpi-icon" style="background: var(--info-light); color: var(--info);"><i data-lucide="receipt"></i></div>
          </div>
          <div class="kpi-card">
            <div class="kpi-left">
              <h4>Total Revenue</h4>
              <div class="kpi-val">₹${window.state.totalSalesRevenue.toFixed(2)}</div>
              <div class="kpi-trend" style="color: var(--success);">Store active</div>
            </div>
            <div class="kpi-icon" style="background: var(--success-light); color: var(--success);"><i data-lucide="trending-up"></i></div>
          </div>
          <div class="kpi-card" onclick="window.adminDashboard.switchTab('ai-insights')" style="cursor: pointer; border-color: var(--primary);">
            <div class="kpi-left">
              <h4>Low Stock Alerts</h4>
              <div class="kpi-val" style="color: ${lowStockCount > 0 ? 'var(--danger)' : 'var(--success)'};">${lowStockCount} Items</div>
              <div class="kpi-trend" style="color: var(--warning);">Restock forecast loaded</div>
            </div>
            <div class="kpi-icon" style="background: var(--warning-light); color: var(--warning);"><i data-lucide="alert-triangle"></i></div>
          </div>
        </div>

        <!-- Alerts and Quick Logs Grid -->
        <div class="admin-charts-grid" style="grid-template-columns: 1fr 1fr;">
          <!-- Stock Risk Warnings -->
          <div class="chart-card">
            <h3 style="font-weight: 800; font-size: 1.1rem; display: flex; align-items: center; gap: 8px;">
              <i data-lucide="bell-ring" style="color: var(--danger);"></i> Shelf Risk Alerts
            </h3>
            <div style="margin-top: var(--spacing-md); display: flex; flex-direction: column; gap: var(--spacing-sm);" id="dash-alerts-list">
              <!-- Filled dynamically by AI predictions -->
            </div>
          </div>
          
          <!-- Recent Transactions list -->
          <div class="chart-card">
            <h3 style="font-weight: 800; font-size: 1.1rem;">Recent Store Transactions</h3>
            <div style="margin-top: var(--spacing-md); overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
                <thead>
                  <tr style="border-bottom: 2px solid var(--border-color); color: var(--text-muted);">
                    <th style="padding-bottom: 8px;">Txn ID</th>
                    <th style="padding-bottom: 8px;">Channel</th>
                    <th style="padding-bottom: 8px;">Method</th>
                    <th style="padding-bottom: 8px; text-align: right;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${window.state.sales.slice(0, 5).map(s => `
                    <tr style="border-bottom: 1px solid var(--border-color);">
                      <td style="padding: 10px 0; font-weight: 700;">${s.id}</td>
                      <td><span class="badge ${s.type === 'Online' ? 'badge-primary' : 'badge-success'}">${s.type}</span></td>
                      <td style="color: var(--text-muted);">${s.paymentMethod}</td>
                      <td style="text-align: right; font-weight: 800;">₹${s.total.toFixed(2)}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;

    // Populate dashboard stock & expiry warnings from the AI Restock generator
    const alertsBox = document.getElementById("dash-alerts-list");
    if (alertsBox) {
      const forecasts = window.aiEngine.generateRestockPredictions(window.state.inventory);
      const criticalAlerts = forecasts.filter(f => f.type === "danger" || f.type === "warning").slice(0, 4);

      if (criticalAlerts.length === 0) {
        alertsBox.innerHTML = `
          <div style="text-align: center; color: var(--text-muted); padding: var(--spacing-lg) 0;">
            <i data-lucide="check-circle" style="color: var(--success); width: 36px; height: 36px; margin-bottom: var(--spacing-xs);"></i>
            <p>All stock levels are optimal. Expiry logs clear.</p>
          </div>
        `;
      } else {
        alertsBox.innerHTML = criticalAlerts.map(a => `
          <div style="background: ${a.type === 'danger' ? 'var(--danger-light)' : 'var(--warning-light)'}; border-left: 4px solid ${a.type === 'danger' ? 'var(--danger)' : 'var(--warning)'}; padding: 0.8rem; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: space-between;">
            <div>
              <div style="font-weight: 800; font-size: 0.8rem; color: ${a.type === 'danger' ? 'var(--danger)' : 'var(--warning)'};">${a.title}</div>
              <div style="font-weight: 700; font-size: 0.9rem; margin: 2px 0;">${a.name}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${a.message}</div>
            </div>
            <button class="btn btn-secondary btn-sm" style="font-size: 0.75rem; padding: 4px 8px; border-radius: 4px;" onclick="window.adminDashboard.executeQuickAction('${a.productId}', '${a.action}')">Resolve</button>
          </div>
        `).join("");
      }
    }
  }

  // Switching tab helper
  switchTab(tabName) {
    const tabEl = document.querySelector(`.admin-sidebar [data-tab="${tabName}"]`);
    if (tabEl) {
      tabEl.click();
    }
  }

  // Quick Resolve stock trigger
  executeQuickAction(productId, actionText) {
    if (productId === "system-insight") {
      alert("Weekend pre-orders successfully generated and sent to suppliers!");
      return;
    }

    const prod = window.state.inventory.find(p => p.id === productId);
    if (!prod) return;

    if (actionText.includes("Order")) {
      // Restocking action
      const match = actionText.match(/\+(\d+)/);
      const units = match ? parseInt(match[1]) : 30;
      prod.stock += units;
      alert(`Restocked ${prod.name} with +${units} units from supplier!`);
    } else if (actionText.includes("Discount")) {
      // Apply discount
      prod.discountPrice = Math.round(prod.price * 0.7); // 30% off
      alert(`Applied 30% Flash Discount to ${prod.name}! Storefront is updated.`);
    } else if (actionText.includes("Write off")) {
      // Discard expired
      prod.stock = 0;
      alert(`Removed expired batch of ${prod.name} from active inventory.`);
    }

    this.renderActiveAdminPane();
  }

  // PANE 2: Inventory CRUD
  renderInventory(container) {
    container.innerHTML = `
      <div class="fade-in">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-lg); flex-wrap: wrap; gap: var(--spacing-md);">
          <h2 style="font-size: 1.6rem; font-weight: 800;">Inventory Control</h2>
          <button class="btn btn-primary" onclick="window.adminDashboard.showAddProductModal()">
            <i data-lucide="plus-circle"></i> Add New Product
          </button>
        </div>

        <div class="admin-table-container">
          <div class="admin-table-actions">
            <div class="hero-search-wrapper" style="width: 320px; box-shadow: none; padding: 0.2rem 0.5rem; background: var(--bg-base);">
              <i data-lucide="search" style="width: 18px;"></i>
              <input type="text" class="hero-search-input" id="inventory-search" placeholder="Search by title, barcode..." style="padding: 0.4rem; font-size: 0.85rem;" oninput="window.adminDashboard.filterInventoryTable()">
            </div>
            <select class="sort-dropdown" id="inventory-filter-cat" onchange="window.adminDashboard.filterInventoryTable()">
              <option value="all">All Categories</option>
              <option value="snacks">Snacks & Munchies</option>
              <option value="groceries">Groceries</option>
              <option value="cold_drink">Cold Drinks</option>
              <option value="lassi">Lassi</option>
              <option value="essentials">Daily Essentials</option>
            </select>
          </div>

          <table class="admin-table">
            <thead>
              <tr>
                <th>Product Details</th>
                <th>Category</th>
                <th>Retail Price (₹)</th>
                <th>Stock & Status</th>
                <th>Visibility</th>
                <th>Expiry Date</th>
                <th>Barcode</th>
                <th style="text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody id="inventory-table-body">
              <!-- Rendered via renderInventoryRows -->
            </tbody>
          </table>
        </div>
      </div>
    `;

    this.renderInventoryRows(window.state.inventory);
  }

  renderInventoryRows(productsList) {
    const tbody = document.getElementById("inventory-table-body");
    if (!tbody) return;

    if (productsList.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; padding: 3rem; color: var(--text-muted);">
            <i data-lucide="package-open" style="width: 48px; height: 48px; margin-bottom: 8px;"></i>
            <p>No products match the criteria</p>
          </td>
        </tr>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    tbody.innerHTML = productsList.map(p => {
      const isLowStock = p.stock <= 10 && p.stock > 0;
      const isOutOfStock = p.stock === 0;
      const daysLeft = window.aiEngine.checkDaysRemaining(p.expiryDate);
      let expiryBadge = `<span style="font-weight: 600;">${p.expiryDate}</span>`;
      
      if (daysLeft < 0) {
        expiryBadge = `<span class="badge badge-danger">Expired (${p.expiryDate})</span>`;
      } else if (daysLeft <= 5) {
        expiryBadge = `<span class="badge badge-warning">${p.expiryDate} (${daysLeft}d left)</span>`;
      }

      return `
        <tr>
          <td style="display: flex; align-items: center; gap: var(--spacing-sm);">
            <div style="width: 44px; height: 44px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); background: var(--bg-base); overflow: hidden; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              ${window.getProductSVG(p)}
            </div>
            <div>
              <div style="font-weight: 700; color: var(--text-main);">${p.name}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${p.supplier}</div>
            </div>
          </td>
          <td><span style="text-transform: capitalize; font-weight: 600;">${p.category}</span></td>
          <td>
            ${p.discountPrice ? `
              <div style="font-weight: 800; color: var(--primary);">₹${p.discountPrice.toFixed(2)}</div>
              <div style="font-size: 0.75rem; text-decoration: line-through; color: var(--text-muted);">₹${p.price.toFixed(2)}</div>
            ` : `
              <div style="font-weight: 800;">₹${p.price.toFixed(2)}</div>
            `}
          </td>
          <td>
            <div style="display: flex; align-items: center; gap: 8px;">
              <input type="number" value="${p.stock}" min="0" style="width: 60px; padding: 4px; border: 1px solid var(--border-color); border-radius: 4px; text-align: center; font-weight: 700; background: var(--bg-base);" onchange="window.adminDashboard.updateStockCount('${p.id}', this.value)">
              <button class="btn ${isOutOfStock ? 'btn-danger' : 'btn-secondary'}" 
                      style="padding: 2px 6px; font-size: 0.65rem; border-radius: var(--radius-sm); font-weight: 800; text-transform: uppercase; border-color: transparent;" 
                      onclick="window.adminDashboard.toggleOutOfStock('${p.id}')">
                ${isOutOfStock ? "Out of Stock" : "In Stock"}
              </button>
              ${isLowStock ? `<i data-lucide="alert-triangle" style="color: var(--danger); width: 16px; height: 16px;" title="Low stock warning!"></i>` : ""}
            </div>
          </td>
          <td>
            <button class="btn ${p.status !== 'hidden' ? 'btn-primary' : 'btn-secondary'}" 
                    style="padding: 4px 8px; font-size: 0.65rem; border-radius: var(--radius-full); font-weight: 800; display: flex; align-items: center; gap: 4px; border-color: transparent;"
                    onclick="window.adminDashboard.toggleVisibility('${p.id}')">
              <i data-lucide="${p.status !== 'hidden' ? 'eye' : 'eye-off'}" style="width: 12px; height: 12px;"></i>
              ${p.status !== 'hidden' ? "Visible" : "Hidden"}
            </button>
          </td>
          <td>${expiryBadge}</td>
          <td><code style="font-family: monospace; font-size: 0.8rem; background: var(--bg-surface-hover); padding: 2px 6px; border-radius: 4px;">${p.barcode}</code></td>
          <td style="text-align: right; white-space: nowrap;">
            <button class="btn btn-secondary btn-sm" onclick="window.adminDashboard.showEditProductModal('${p.id}')" style="color: var(--primary); border-color: transparent; padding: 4px 8px; margin-right: 4px;">
              <i data-lucide="edit-3"></i>
            </button>
            <button class="btn btn-secondary btn-sm" onclick="window.adminDashboard.deleteProduct('${p.id}')" style="color: var(--danger); border-color: transparent; padding: 4px 8px;">
              <i data-lucide="trash-2"></i>
            </button>
          </td>
        </tr>
      `;
    }).join("");
    if (window.lucide) window.lucide.createIcons();
  }

  filterInventoryTable() {
    const search = document.getElementById("inventory-search").value.toLowerCase().trim();
    const category = document.getElementById("inventory-filter-cat").value;

    const filtered = window.state.inventory.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search) || p.barcode.includes(search) || p.supplier.toLowerCase().includes(search);
      const matchCat = category === "all" || p.category === category;
      return matchSearch && matchCat;
    });

    this.renderInventoryRows(filtered);
  }

  updateStockCount(productId, newVal) {
    const val = parseInt(newVal);
    if (isNaN(val) || val < 0) return;

    const prod = window.state.inventory.find(p => p.id === productId);
    if (prod) {
      prod.stock = val;
      //  Firebase me save karo
      if (window.DB) {
        window.DB.saveProduct(prod).catch(err => console.warn("Stock save error:", err));
      } else {
        window.saveState();
      }
    }
  }

  deleteProduct(productId) {
    if (confirm("Are you sure you want to delete this product from the inventory database?")) {
      const prodName = (window.state.inventory.find(p => p.id === productId) || {}).name || productId;
      //  Firebase se delete karo
      window.state.inventory = window.state.inventory.filter(p => p.id !== productId);
      if (window.DB) {
        window.DB.deleteProduct(productId)
          .then(() => {
            showToast(`"${prodName}" successfully deleted from store!`, "success");
          })
          .catch(err => {
            console.warn("Delete error:", err);
            showToast(`"${prodName}" deleted (offline mode)!`, "success");
          });
      } else {
        window.saveState();
        showToast("Product successfully deleted from store!", "success");
      }
      this.renderInventory(document.getElementById("admin-sub-viewport"));
    }
  }

  // Image Upload Handlers for Admin Product Forms
  handleImageUpload(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      this.currentUploadImageData = dataUrl;
      
      const imgPreview = document.getElementById("new-p-img-preview");
      const previewBox = document.getElementById("new-p-img-preview-box");
      const infoText = document.getElementById("new-p-img-info");

      if (imgPreview) imgPreview.src = dataUrl;
      if (previewBox) previewBox.style.display = "flex";
      if (infoText) infoText.textContent = `${file.name} (${Math.round(file.size / 1024)} KB)`;
    };
    reader.readAsDataURL(file);
  }

  handleImageUrlChange(e) {
    const url = e.target.value.trim();
    if (url) {
      this.currentUploadImageData = url;
      const imgPreview = document.getElementById("new-p-img-preview");
      const previewBox = document.getElementById("new-p-img-preview-box");
      const infoText = document.getElementById("new-p-img-info");

      if (imgPreview) imgPreview.src = url;
      if (previewBox) previewBox.style.display = "flex";
      if (infoText) infoText.textContent = "Web Image URL attached";
    } else {
      const fileInput = document.getElementById("new-p-image-file");
      if (!fileInput || !fileInput.files || !fileInput.files.length) {
        this.removeSelectedImage();
      }
    }
  }

  removeSelectedImage() {
    this.currentUploadImageData = null;
    const fileInput = document.getElementById("new-p-image-file");
    const urlInput = document.getElementById("new-p-image-url");
    const previewBox = document.getElementById("new-p-img-preview-box");
    const imgPreview = document.getElementById("new-p-img-preview");

    if (fileInput) fileInput.value = "";
    if (urlInput) urlInput.value = "";
    if (imgPreview) imgPreview.src = "";
    if (previewBox) previewBox.style.display = "none";
  }

  showAddProductModal() {
    const overlay = document.getElementById("global-modal-overlay");
    const modalBox = document.getElementById("global-modal-content");
    this.currentUploadImageData = null;

    modalBox.innerHTML = `
      <div>
        <h2 style="font-size: 1.4rem; font-weight: 800; margin-bottom: var(--spacing-lg); color: var(--primary); display: flex; align-items: center; gap: 8px;">
          <i data-lucide="plus-circle"></i> Add New Product to Kirana
        </h2>
        
        <form id="add-product-form" onsubmit="window.adminDashboard.addNewProduct(event)" style="display: flex; flex-direction: column; gap: var(--spacing-md);">
          <div class="form-field">
            <label for="new-p-name">Product Name *</label>
            <input type="text" id="new-p-name" required placeholder="e.g. Britannia Marie Gold (250g)">
          </div>
          
          <div class="form-row">
            <div class="form-field">
              <label for="new-p-cat">Category *</label>
              <select id="new-p-cat" required>
                <option value="snacks">Snacks & Munchies</option>
                <option value="groceries">Groceries</option>
                <option value="cold_drink">Cold Drinks</option>
                <option value="lassi">Lassi</option>
                <option value="essentials">Daily Essentials</option>
              </select>
            </div>
            <div class="form-field">
              <label for="new-p-supplier">Supplier Name</label>
              <input type="text" id="new-p-supplier" value="Pal Grocery" placeholder="Pal Grocery">
            </div>
          </div>

          <div class="form-row">
            <div class="form-field">
              <label for="new-p-price">Retail Price (₹) *</label>
              <input type="number" id="new-p-price" min="1" required placeholder="120">
            </div>
            <div class="form-field">
              <label for="new-p-stock">Opening Stock *</label>
              <input type="number" id="new-p-stock" min="1" required placeholder="30">
            </div>
          </div>

          <div class="form-row">
            <div class="form-field">
              <label for="new-p-expiry">Expiry Date (Optional)</label>
              <input type="date" id="new-p-expiry" value="">
            </div>
            <div class="form-field">
              <label for="new-p-barcode">Barcode EAN (Optional)</label>
              <input type="text" id="new-p-barcode" placeholder="e.g. 8901234567890">
            </div>
          </div>
          
          <div class="form-field">
            <label for="new-p-desc">Product Description</label>
            <textarea id="new-p-desc" rows="2" style="background: var(--bg-base); border: 1px solid var(--border-color); padding: 0.6rem; border-radius: 4px; color: var(--text-main);" placeholder="Brief details about product size, grade..."></textarea>
          </div>

          <!-- Product Image Upload Section -->
          <div class="form-field" style="border: 1px dashed var(--primary); border-radius: var(--radius-md); padding: 12px; background: var(--bg-surface-hover);">
            <label style="font-weight: 700; font-size: 0.85rem; display: flex; align-items: center; gap: 6px; margin-bottom: 8px; color: var(--text-main);">
              <i data-lucide="image" style="width: 16px; color: var(--primary);"></i> Product Image (उत्पाद की फोटो)
            </label>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <div>
                <label for="new-p-image-file" style="font-size: 0.75rem; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 4px;">Upload Image File (फाइल/गैलरी से फोटो अपलोड करें):</label>
                <input type="file" id="new-p-image-file" accept="image/*" onchange="window.adminDashboard.handleImageUpload(event)" style="width: 100%; font-size: 0.8rem; padding: 6px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-base); cursor: pointer;">
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700; white-space: nowrap;">OR Image URL:</span>
                <input type="url" id="new-p-image-url" placeholder="https://example.com/photo.jpg" style="flex: 1; font-size: 0.8rem; padding: 6px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-base);" oninput="window.adminDashboard.handleImageUrlChange(event)">
              </div>
            </div>
            <!-- Image Preview Box -->
            <div id="new-p-img-preview-box" style="margin-top: 10px; display: none; align-items: center; gap: 12px; background: var(--bg-base); padding: 8px; border-radius: 6px; border: 1px solid var(--border-color);">
              <div style="width: 60px; height: 60px; border-radius: 6px; overflow: hidden; background: #f8fafc; border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: center;">
                <img id="new-p-img-preview" src="" alt="Product Preview" style="width: 100%; height: 100%; object-fit: cover;">
              </div>
              <div style="flex: 1;">
                <span style="font-size: 0.8rem; font-weight: 700; color: var(--primary); display: block;">Image Attached / फोटो चुनी गई है</span>
                <span style="font-size: 0.75rem; color: var(--text-muted);" id="new-p-img-info">Ready to display on Index Page</span>
              </div>
              <button type="button" class="btn btn-secondary btn-sm" onclick="window.adminDashboard.removeSelectedImage()" style="color: var(--danger); font-size: 0.75rem; padding: 4px 8px;">Remove</button>
            </div>
          </div>

          <div style="display: flex; gap: var(--spacing-md); margin-top: var(--spacing-sm);">
            <button type="button" class="btn btn-secondary" style="flex: 1;" onclick="document.getElementById('global-modal-overlay').classList.remove('open')">Cancel</button>
            <button type="submit" class="btn btn-primary" style="flex: 1;">Add Product</button>
          </div>
        </form>
      </div>
    `;

    overlay.classList.add("open");
    if (window.lucide) window.lucide.createIcons();
  }

  addNewProduct(e) {
    e.preventDefault();
    const name = document.getElementById("new-p-name").value.trim();
    const category = document.getElementById("new-p-cat").value;
    const supplier = document.getElementById("new-p-supplier").value.trim() || "Pal Grocery";
    const price = parseFloat(document.getElementById("new-p-price").value);
    const stock = parseInt(document.getElementById("new-p-stock").value);
    const expiryDate = document.getElementById("new-p-expiry").value || null;
    const barcode = document.getElementById("new-p-barcode").value.trim() || null;
    const description = document.getElementById("new-p-desc").value.trim() || `${name} sourced with high quality standards.`;
    const image = this.currentUploadImageData || document.getElementById("new-p-image-url")?.value.trim() || null;

    const newProd = {
      id: "prod-" + (window.state.inventory.length + 1) + "-" + Math.floor(100 + Math.random() * 900),
      name,
      category,
      price,
      discountPrice: null,
      rating: 5.0,
      reviewsCount: 1,
      stock,
      expiryDate,
      supplier,
      barcode,
      description,
      image
    };

    this.currentUploadImageData = null;
    window.state.inventory.push(newProd);

    //  Firebase / Database me add karo
    if (window.DB) {
      window.DB.addProduct(newProd)
        .then(() => {
          showToast(`"${name}" added to database!`, "success");
        })
        .catch(err => {
          console.warn("Database add error:", err);
          window.saveState();
          showToast(`"${name}" added locally (offline)!`, "success");
        });
    } else {
      window.saveState();
      showToast(`"${name}" added to store successfully!`, "success");
    }

    document.getElementById("global-modal-overlay").classList.remove("open");
    this.renderInventory(document.getElementById("admin-sub-viewport"));
  }

  showEditProductModal(productId) {
    const prod = window.state.inventory.find(p => p.id === productId);
    if (!prod) return;

    const overlay = document.getElementById("global-modal-overlay");
    const modalBox = document.getElementById("global-modal-content");
    this.currentUploadImageData = prod.image || null;

    modalBox.innerHTML = `
      <div>
        <h2 style="font-size: 1.4rem; font-weight: 800; margin-bottom: var(--spacing-lg); color: var(--primary); display: flex; align-items: center; gap: 8px;">
          <i data-lucide="edit"></i> Edit Product - ${prod.name}
        </h2>
        
        <form id="edit-product-form" onsubmit="window.adminDashboard.saveEditProduct(event, '${prod.id}')" style="display: flex; flex-direction: column; gap: var(--spacing-md);">
          <div class="form-field">
            <label for="edit-p-name">Product Name *</label>
            <input type="text" id="edit-p-name" required value="${prod.name}">
          </div>
          
          <div class="form-row">
            <div class="form-field">
              <label for="edit-p-cat">Category *</label>
              <select id="edit-p-cat" required>
                <option value="snacks" ${prod.category === 'snacks' ? 'selected' : ''}>Snacks & Munchies</option>
                <option value="groceries" ${prod.category === 'groceries' ? 'selected' : ''}>Groceries</option>
                <option value="cold_drink" ${prod.category === 'cold_drink' ? 'selected' : ''}>Cold Drinks</option>
                <option value="lassi" ${prod.category === 'lassi' ? 'selected' : ''}>Lassi</option>
                <option value="essentials" ${prod.category === 'essentials' ? 'selected' : ''}>Daily Essentials</option>
              </select>
            </div>
            <div class="form-field">
              <label for="edit-p-supplier">Supplier Name</label>
              <input type="text" id="edit-p-supplier" value="${prod.supplier || 'Pal Grocery'}" placeholder="Pal Grocery">
            </div>
          </div>

          <div class="form-row">
            <div class="form-field">
              <label for="edit-p-price">Retail Price (₹) *</label>
              <input type="number" id="edit-p-price" min="1" required value="${prod.price}">
            </div>
            <div class="form-field">
              <label for="edit-p-stock">Stock *</label>
              <input type="number" id="edit-p-stock" min="0" required value="${prod.stock}">
            </div>
          </div>

          <div class="form-row">
            <div class="form-field">
              <label for="edit-p-expiry">Expiry Date (Optional)</label>
              <input type="date" id="edit-p-expiry" value="${prod.expiryDate || ''}">
            </div>
            <div class="form-field">
              <label for="edit-p-barcode">Barcode EAN (Optional)</label>
              <input type="text" id="edit-p-barcode" value="${prod.barcode || ''}" placeholder="e.g. 8901234567890">
            </div>
          </div>
          
          <div class="form-field">
            <label for="edit-p-desc">Product Description</label>
            <textarea id="edit-p-desc" rows="2" style="background: var(--bg-base); border: 1px solid var(--border-color); padding: 0.6rem; border-radius: 4px; color: var(--text-main);">${prod.description || ''}</textarea>
          </div>

          <!-- Product Image Upload / Edit Section -->
          <div class="form-field" style="border: 1px dashed var(--primary); border-radius: var(--radius-md); padding: 12px; background: var(--bg-surface-hover);">
            <label style="font-weight: 700; font-size: 0.85rem; display: flex; align-items: center; gap: 6px; margin-bottom: 8px; color: var(--text-main);">
              <i data-lucide="image" style="width: 16px; color: var(--primary);"></i> Product Image (उत्पाद की फोटो)
            </label>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <div>
                <label for="new-p-image-file" style="font-size: 0.75rem; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 4px;">Upload Image File (फाइल/गैलरी से फोटो बदलें):</label>
                <input type="file" id="new-p-image-file" accept="image/*" onchange="window.adminDashboard.handleImageUpload(event)" style="width: 100%; font-size: 0.8rem; padding: 6px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-base); cursor: pointer;">
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700; white-space: nowrap;">OR Image URL:</span>
                <input type="url" id="new-p-image-url" value="${prod.image && !prod.image.startsWith('data:') ? prod.image : ''}" placeholder="https://example.com/photo.jpg" style="flex: 1; font-size: 0.8rem; padding: 6px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-base);" oninput="window.adminDashboard.handleImageUrlChange(event)">
              </div>
            </div>
            <div id="new-p-img-preview-box" style="margin-top: 10px; display: ${prod.image ? 'flex' : 'none'}; align-items: center; gap: 12px; background: var(--bg-base); padding: 8px; border-radius: 6px; border: 1px solid var(--border-color);">
              <div style="width: 60px; height: 60px; border-radius: 6px; overflow: hidden; background: #f8fafc; border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: center;">
                <img id="new-p-img-preview" src="${prod.image || ''}" alt="Product Preview" style="width: 100%; height: 100%; object-fit: cover;">
              </div>
              <div style="flex: 1;">
                <span style="font-size: 0.8rem; font-weight: 700; color: var(--primary); display: block;">Image Attached / फोटो लगी हुई है</span>
                <span style="font-size: 0.75rem; color: var(--text-muted);" id="new-p-img-info">${prod.image ? 'Photo available' : ''}</span>
              </div>
              <button type="button" class="btn btn-secondary btn-sm" onclick="window.adminDashboard.removeSelectedImage()" style="color: var(--danger); font-size: 0.75rem; padding: 4px 8px;">Remove</button>
            </div>
          </div>

          <div style="display: flex; gap: var(--spacing-md); margin-top: var(--spacing-sm);">
            <button type="button" class="btn btn-secondary" style="flex: 1;" onclick="document.getElementById('global-modal-overlay').classList.remove('open')">Cancel</button>
            <button type="submit" class="btn btn-primary" style="flex: 1;">Save Changes</button>
          </div>
        </form>
      </div>
    `;

    overlay.classList.add("open");
    if (window.lucide) window.lucide.createIcons();
  }

  saveEditProduct(e, productId) {
    e.preventDefault();
    const prod = window.state.inventory.find(p => p.id === productId);
    if (!prod) return;

    prod.name = document.getElementById("edit-p-name").value.trim();
    prod.category = document.getElementById("edit-p-cat").value;
    prod.supplier = document.getElementById("edit-p-supplier").value.trim() || "Pal Grocery";
    prod.price = parseFloat(document.getElementById("edit-p-price").value);
    prod.stock = parseInt(document.getElementById("edit-p-stock").value);
    prod.expiryDate = document.getElementById("edit-p-expiry").value || null;
    prod.barcode = document.getElementById("edit-p-barcode").value.trim() || null;
    prod.description = document.getElementById("edit-p-desc").value.trim();
    prod.image = this.currentUploadImageData || document.getElementById("new-p-image-url")?.value.trim() || null;

    this.currentUploadImageData = null;

    if (window.DB) {
      window.DB.saveProduct(prod)
        .then(() => showToast(`"${prod.name}" updated successfully!`, "success"))
        .catch(err => {
          window.saveState();
          showToast(`"${prod.name}" updated locally!`, "success");
        });
    } else {
      window.saveState();
      showToast(`"${prod.name}" updated successfully!`, "success");
    }

    document.getElementById("global-modal-overlay").classList.remove("open");
    this.renderInventory(document.getElementById("admin-sub-viewport"));
  }

  // PANE 3: Cashier POS Billing Terminal Screen
  renderPOS(container) {
    container.innerHTML = `
      <div class="fade-in pos-layout">
        <!-- Catalog selection Left Panel -->
        <div class="pos-catalog">
          <div class="pos-catalog-header">
            <div class="hero-search-wrapper" style="flex: 1; box-shadow: none; padding: 0.2rem 0.5rem; background: var(--bg-base);">
              <i data-lucide="scan-barcode" style="width: 18px;"></i>
              <input type="text" class="hero-search-input" id="pos-barcode-lookup" placeholder="Scan barcode or type name... (Press Enter to Scan)" style="padding: 0.4rem; font-size: 0.85rem;" onkeypress="window.adminDashboard.handleBarcodeScan(event)">
            </div>
            <select class="sort-dropdown" id="pos-cat-filter" onchange="window.adminDashboard.filterPosCatalog()">
              <option value="all">All Categories</option>
              <option value="snacks">Snacks & Munchies</option>
              <option value="groceries">Groceries</option>
              <option value="cold_drink">Cold Drinks</option>
              <option value="lassi">Lassi</option>
              <option value="essentials">Daily Essentials</option>
            </select>
          </div>

          <div class="pos-products-grid" id="pos-products-grid-list">
            <!-- Filled via renderPosProductsGrid -->
          </div>
        </div>

        <!-- Checkout Bill Invoice Right Panel -->
        <div class="pos-billing-panel">
          <div style="padding: var(--spacing-md); border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; background: var(--bg-base);">
            <span style="font-weight: 800; font-size: 1rem;">Active Customer Bill</span>
            <span class="badge badge-primary">Vishal (Cashier)</span>
          </div>

          <div class="pos-billing-items" id="pos-bill-items-list">
            <!-- Active invoice bill items from posSystem -->
          </div>

          <div class="pos-billing-totals">
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 4px;">
              <span style="color: var(--text-muted);">GST Tax (18%)</span>
              <span id="pos-tax-val">₹0.00</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 8px;">
              <span style="color: var(--text-muted);">Subtotal</span>
              <span id="pos-subtotal-val">₹0.00</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 1.2rem; font-weight: 800; border-top: 1.5px solid var(--border-color); padding-top: 8px; margin-bottom: var(--spacing-md);">
              <span>Bill Net Total</span>
              <span id="pos-total-val" style="color: var(--primary);">₹0.00</span>
            </div>

            <button class="btn btn-primary" id="pos-checkout-btn" style="width: 100%; display: flex; justify-content: center; gap: 8px;" disabled onclick="window.posSystem.checkoutPosBill()">
              <i data-lucide="banknote"></i> Pay & Generate Receipt
            </button>
          </div>
        </div>
      </div>
    `;

    this.renderPosProductsGrid(window.state.inventory);
    window.posSystem.renderPosBill();
  }

  renderPosProductsGrid(products) {
    const grid = document.getElementById("pos-products-grid-list");
    if (!grid) return;

    grid.innerHTML = products.map(p => `
      <div class="pos-product-card" onclick="window.posSystem.addToBill('${p.id}')">
        <div style="width: 100%; height: 75px; border-radius: 6px; overflow: hidden; margin-bottom: 6px; background: var(--bg-surface-hover);">
          ${window.getProductSVG(p)}
        </div>
        <div class="pos-product-card-title">${p.name}</div>
        <div class="pos-product-card-price">₹${(p.discountPrice || p.price).toFixed(2)}</div>
        <div class="pos-product-card-stock" style="color: ${p.stock <= 10 ? 'var(--danger)' : 'var(--text-muted)'}; font-weight: ${p.stock <= 10 ? '700' : '500'};">Stock: ${p.stock}</div>
      </div>
    `).join("");
  }

  filterPosCatalog() {
    const cat = document.getElementById("pos-cat-filter").value;
    const filtered = window.state.inventory.filter(p => cat === "all" || p.category === cat);
    this.renderPosProductsGrid(filtered);
  }

  // Handle barcode simulation (Cashier presses Enter)
  handleBarcodeScan(e) {
    if (e.key === "Enter") {
      const val = e.target.value.trim();
      if (val.length === 0) return;

      const product = window.state.inventory.find(p => p.barcode === val || p.name.toLowerCase().includes(val.toLowerCase()));
      if (product) {
        window.posSystem.addToBill(product.id);
        e.target.value = "";
        // Show success mini-alert or flash border
        e.target.style.borderColor = "var(--primary)";
        setTimeout(() => e.target.style.borderColor = "", 400);
      } else {
        alert(`No product found in store matching "${val}".`);
      }
    }
  }

  // PANE 4: Analytics custom SVG drawings
  renderAnalytics(container) {
    container.innerHTML = `
      <div class="fade-in">
        <h2 style="font-size: 1.6rem; font-weight: 800; margin-bottom: var(--spacing-lg);">Store Analytics</h2>
        
        <div class="admin-charts-grid">
          <!-- 1. Daily Sales Line Chart (Pure SVG) -->
          <div class="chart-card">
            <h3 style="font-weight: 800; font-size: 1.1rem; margin-bottom: var(--spacing-lg);">Daily Sales Revenue Trend (Last 7 Days)</h3>
            <div class="svg-chart-container" id="svg-trend-chart-box">
              <!-- Inline programmatic SVG inserted here -->
            </div>
          </div>

          <!-- 2. Categories Breakdown (Pure SVG Bars) -->
          <div class="chart-card">
            <h3 style="font-weight: 800; font-size: 1.1rem; margin-bottom: var(--spacing-lg);">Sales Share by Category</h3>
            <div class="svg-chart-container" id="svg-bar-chart-box" style="display: flex; flex-direction: column; justify-content: center; gap: var(--spacing-md);">
              <!-- Custom Category Bar chart rows -->
            </div>
          </div>
        </div>

        <!-- Analytics Table -->
        <div class="admin-table-container">
          <div style="padding: var(--spacing-md); font-weight: 800; border-bottom: 1px solid var(--border-color);">Store Sales Transaction Ledgers</div>
          <table class="admin-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Date / Time</th>
                <th>Source Channel</th>
                <th>Payment Mode</th>
                <th>Items Bought</th>
                <th style="text-align: right;">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              ${window.state.sales.map(s => `
                <tr>
                  <td><code style="font-family: monospace; font-weight: 700;">${s.id}</code></td>
                  <td>${s.date} ${s.time || ''}</td>
                  <td><span class="badge ${s.type === 'Online' ? 'badge-primary' : 'badge-success'}">${s.type}</span></td>
                  <td>${s.paymentMethod}</td>
                  <td>${s.itemsCount} items</td>
                  <td style="text-align: right; font-weight: 800; color: var(--primary);">₹${s.total.toFixed(2)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;

    this.drawTrendChart();
    this.drawCategoryChart();
  }

  drawTrendChart() {
    const box = document.getElementById("svg-trend-chart-box");
    if (!box) return;

    // Get aggregated sales over past dates
    const salesMap = {};
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const str = d.toISOString().split("T")[0];
      dates.push(str);
      salesMap[str] = 0;
    }

    window.state.sales.forEach(s => {
      if (salesMap[s.date] !== undefined) {
        salesMap[s.date] += s.total;
      }
    });

    const values = dates.map(d => salesMap[d]);
    const maxVal = Math.max(500, Math.ceil(Math.max(...values) / 500) * 500);

    // Grid coordinates: width = 500, height = 200
    // Generate coordinate coordinates
    const points = values.map((val, idx) => {
      const x = 40 + idx * 70;
      const y = 180 - (val / maxVal) * 150;
      return { x, y, val, date: dates[idx].slice(8, 10) };
    });

    const pathD = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(" ");
    const areaD = `${pathD} L ${points[points.length-1].x} 180 L ${points[0].x} 180 Z`;

    box.innerHTML = `
      <svg viewBox="0 0 500 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--primary)" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="var(--primary)" stop-opacity="0"/>
          </linearGradient>
        </defs>
        
        <!-- Y Gridlines -->
        <line x1="30" y1="30" x2="480" y2="30" stroke="var(--border-color)" stroke-dasharray="4 4" />
        <text x="25" y="34" font-size="8" fill="var(--text-muted)" text-anchor="end">₹${maxVal}</text>
        
        <line x1="30" y1="105" x2="480" y2="105" stroke="var(--border-color)" stroke-dasharray="4 4" />
        <text x="25" y="109" font-size="8" fill="var(--text-muted)" text-anchor="end">₹${maxVal/2}</text>

        <line x1="30" y1="180" x2="480" y2="180" stroke="var(--text-muted)" stroke-width="1" />
        <text x="25" y="184" font-size="8" fill="var(--text-muted)" text-anchor="end">₹0</text>

        <!-- Area fill under line -->
        <path d="${areaD}" fill="url(#chart-glow)"/>
        
        <!-- Connected line -->
        <path d="${pathD}" fill="none" stroke="var(--primary)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        
        <!-- Node dots -->
        ${points.map(p => `
          <circle cx="${p.x}" cy="${p.y}" r="5" fill="var(--bg-surface)" stroke="var(--primary)" stroke-width="2"/>
          <text x="${p.x}" y="${p.y - 10}" font-size="8" font-weight="700" fill="var(--text-main)" text-anchor="middle">₹${Math.round(p.val)}</text>
          <text x="${p.x}" y="194" font-size="8" fill="var(--text-muted)" text-anchor="middle">${p.date} Jun</text>
        `).join("")}
      </svg>
    `;
  }

  drawCategoryChart() {
    const box = document.getElementById("svg-bar-chart-box");
    if (!box) return;

    // Standard Category items breakdown
    const catSales = { fruits: 450, dairy: 890, snacks: 650, groceries: 1200, beverages: 350 };
    
    // Add real inventory category sales if we can simulate
    const totalSales = Object.values(catSales).reduce((a,b)=>a+b, 0);

    const categories = [
      { name: "Kitchen Groceries", key: "groceries", color: "#3b82f6", val: catSales.groceries },
      { name: "Dairy & Eggs", key: "dairy", color: "#10b981", val: catSales.dairy },
      { name: "Snacks & Munchies", key: "snacks", color: "#f59e0b", val: catSales.snacks },
      { name: "Fruits & Vegetables", key: "fruits", color: "#ec4899", val: catSales.fruits },
      { name: "Cold Beverages", key: "beverages", color: "#8b5cf6", val: catSales.beverages }
    ];

    box.innerHTML = categories.map(c => {
      const percentage = (c.val / totalSales) * 100;
      return `
        <div>
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700; margin-bottom: 4px;">
            <span>${c.name}</span>
            <span style="color: var(--text-muted);">₹${c.val} (${percentage.toFixed(1)}%)</span>
          </div>
          <div style="background: var(--bg-base); height: 10px; border-radius: var(--radius-full); overflow: hidden;">
            <div style="background: ${c.color}; width: ${percentage}%; height: 100%; border-radius: var(--radius-full);"></div>
          </div>
        </div>
      `;
    }).join("");
  }

  // PANE 5: Customer List
  renderCustomers(container) {
    const customers = [
      { name: "Vishal Kumar", phone: "9876543210", email: "vishal@example.com", tier: "Gold", points: window.state.user.loyaltyPoints, totalPurchased: 4890 },
      { name: "Priya Sharma", phone: "9812345678", email: "priya@gmail.com", tier: "Silver", points: 140, totalPurchased: 2100 },
      { name: "Ramesh Gupta", phone: "9988776655", email: "ramesh.g@yahoo.com", tier: "Bronze", points: 45, totalPurchased: 890 },
      { name: "Sunita Devi", phone: "9560403020", email: "sunita@outlook.com", tier: "Gold", points: 310, totalPurchased: 6540 }
    ];

    container.innerHTML = `
      <div class="fade-in">
        <h2 style="font-size: 1.6rem; font-weight: 800; margin-bottom: var(--spacing-lg);">Customer Management</h2>
        
        <div class="admin-table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Phone Number</th>
                <th>Email Address</th>
                <th>Membership Tier</th>
                <th>Accrued Points</th>
                <th style="text-align: right;">Total Purchase (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${customers.map(c => `
                <tr>
                  <td style="font-weight: 700;">${c.name}</td>
                  <td>${c.phone}</td>
                  <td>${c.email}</td>
                  <td><span class="badge ${c.tier === 'Gold' ? 'badge-primary' : c.tier === 'Silver' ? 'badge-success' : 'badge-warning'}">${c.tier}</span></td>
                  <td style="font-weight: 700; color: var(--primary);">${c.points} pts</td>
                  <td style="text-align: right; font-weight: 800;">₹${c.totalPurchased.toFixed(2)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // PANE 6: AI Analytics and RESTOCK alerts
  renderAIInsights(container) {
    const alerts = window.aiEngine.generateRestockPredictions(window.state.inventory);

    container.innerHTML = `
      <div class="fade-in">
        <h2 style="font-size: 1.6rem; font-weight: 800; margin-bottom: var(--spacing-sm);">Kirana AI Forecast Panel</h2>
        <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: var(--spacing-lg);">System automatically analyzes stock rates, category thresholds, and expiry dates to recommend restocking.</p>
        
        <div style="display: flex; flex-direction: column; gap: var(--spacing-md);">
          ${alerts.map(a => {
            const cardColor = a.type === "danger" ? "border-color: var(--danger);" : a.type === "warning" ? "border-color: var(--warning);" : "border-color: var(--info);";
            const icon = a.type === "danger" ? "alert-octagon" : a.type === "warning" ? "alert-triangle" : "trending-up";
            const btnClass = a.type === "danger" ? "btn-danger" : a.type === "warning" ? "btn-primary" : "btn-secondary";

            return `
              <div class="glass-card" style="padding: var(--spacing-lg); ${cardColor} display: flex; align-items: center; justify-content: space-between; gap: var(--spacing-md); flex-wrap: wrap;">
                <div style="display: flex; align-items: center; gap: var(--spacing-md);">
                  <div class="kpi-icon" style="flex-shrink: 0; background: ${a.type === 'danger' ? 'var(--danger-light)' : a.type === 'warning' ? 'var(--warning-light)' : 'var(--success-light)'}; color: ${a.type === 'danger' ? 'var(--danger)' : a.type === 'warning' ? 'var(--warning)' : 'var(--primary)'};">
                    <i data-lucide="${icon}"></i>
                  </div>
                  <div>
                    <h3 style="font-size: 1rem; font-weight: 800; color: ${a.type === 'danger' ? 'var(--danger)' : a.type === 'warning' ? 'var(--warning)' : 'var(--info)'};">${a.title}</h3>
                    <h4 style="font-size: 1.05rem; font-weight: 700; margin: 4px 0 2px 0;">${a.name}</h4>
                    <p style="font-size: 0.85rem; color: var(--text-muted);">${a.message}</p>
                  </div>
                </div>
                <button class="btn ${btnClass} btn-sm" onclick="window.adminDashboard.executeQuickAction('${a.productId}', '${a.action}')">${a.action}</button>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
  }

  // PANE 7: Digital Khata Book (Udhaar Ledger)
  renderKhataBook(container) {
    // Lazy initialize database of accounts if not present
    if (!window.state.khataAccounts) {
      window.state.khataAccounts = [
        {
          id: "kh-1",
          name: "Ramesh Kumar",
          phone: "9876501234",
          balance: 1250.00,
          history: [
            { date: "2026-06-20", type: "Credit", amount: 850.00, desc: "Groceries (Atta, Rice)" },
            { date: "2026-06-22", type: "Credit", amount: 400.00, desc: "Cold Drinks (Party pack)" }
          ]
        },
        {
          id: "kh-2",
          name: "Sanjay Singh",
          phone: "9812345678",
          balance: 450.00,
          history: [
            { date: "2026-06-25", type: "Credit", amount: 750.00, desc: "Amul Butter & Ghee" },
            { date: "2026-06-26", type: "Payment", amount: 300.00, desc: "Paid cash" }
          ]
        },
        {
          id: "kh-3",
          name: "Sunita Devi",
          phone: "9988776655",
          balance: 0.00,
          history: [
            { date: "2026-06-18", type: "Credit", amount: 200.00, desc: "Cold Drinks" },
            { date: "2026-06-19", type: "Payment", amount: 200.00, desc: "Cleared via UPI" }
          ]
        }
      ];
    }

    const totalUdhaar = window.state.khataAccounts.reduce((sum, item) => sum + item.balance, 0);
    const activeAccounts = window.state.khataAccounts.filter(item => item.balance > 0).length;

    container.innerHTML = `
      <div class="fade-in">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-lg); flex-wrap: wrap; gap: var(--spacing-md);">
          <div>
            <h2 style="font-size: 1.6rem; font-weight: 800;">Digital Khata Book (उधार खाता)</h2>
            <p style="color: var(--text-muted); font-size: 0.9rem;">Track customer credit accounts, log payments, and send WhatsApp payment reminders.</p>
          </div>
          <button class="btn btn-primary" onclick="window.adminDashboard.showAddKhataCustomerModal()">
            <i data-lucide="user-plus"></i> Add Account / नया खाता
          </button>
        </div>

        <!-- Summary KPIs -->
        <div class="admin-kpis">
          <div class="kpi-card" style="border-left: 4px solid var(--danger);">
            <div class="kpi-left">
              <h4>Total Outstanding Udhaar</h4>
              <div class="kpi-val" style="color: var(--danger);">₹${totalUdhaar.toFixed(2)}</div>
            </div>
            <div class="kpi-icon" style="background: var(--danger-light); color: var(--danger);">
              <i data-lucide="notebook-tabs"></i>
            </div>
          </div>
          <div class="kpi-card" style="border-left: 4px solid var(--warning);">
            <div class="kpi-left">
              <h4>Active Debtors</h4>
              <div class="kpi-val">${activeAccounts} Accounts</div>
            </div>
            <div class="kpi-icon" style="background: var(--warning-light); color: var(--warning);">
              <i data-lucide="users-round"></i>
            </div>
          </div>
        </div>

        <!-- Ledger Table -->
        <div class="admin-table-container">
          <div class="admin-table-actions">
            <h3 style="font-size: 1.05rem; font-weight: 800;">Ledger Accounts / खातेदार सूची</h3>
            <input type="text" placeholder="Search customer..." id="khata-search" class="sort-dropdown" style="padding: 6px 12px; width: 220px; border: 1px solid var(--border-color); border-radius: var(--radius-sm);" oninput="window.adminDashboard.filterKhataTable()">
          </div>
          <table class="admin-table" id="khata-ledger-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Phone Number</th>
                <th>Current Balance</th>
                <th>Last Update</th>
                <th style="text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${window.state.khataAccounts.map(acc => {
                const date = acc.history.length > 0 ? acc.history[acc.history.length - 1].date : "N/A";
                const isOverlimit = acc.balance >= 5000; 
                const rowWarning = isOverlimit ? `style="background: #fff5f5;"` : "";
                
                return `
                  <tr ${rowWarning} data-name="${acc.name.toLowerCase()}">
                    <td>
                      <div style="font-weight: 700;">${acc.name}</div>
                      ${isOverlimit ? `<span style="font-size: 0.65rem; color: var(--danger); font-weight: 800;"><i data-lucide="alert-triangle" style="width: 12px;"></i> CREDIT OVER LIMIT (₹5K)</span>` : ""}
                    </td>
                    <td>${acc.phone}</td>
                    <td style="font-weight: 800; color: ${acc.balance > 0 ? 'var(--danger)' : 'var(--text-muted)'};">
                      ₹${acc.balance.toFixed(2)}
                    </td>
                    <td>${date}</td>
                    <td style="text-align: right;">
                      <div style="display: flex; justify-content: flex-end; gap: 8px; flex-wrap: wrap;">
                        <button class="btn btn-secondary btn-sm" onclick="window.adminDashboard.showKhataHistoryModal('${acc.id}')" title="View History">
                          <i data-lucide="eye" style="width: 14px;"></i>
                        </button>
                        <button class="btn btn-primary btn-sm" onclick="window.adminDashboard.showKhataLedgerActionModal('${acc.id}', 'Credit')" style="background: var(--danger); border: none; font-size: 0.75rem;" title="Add Udhaar (+)">
                          <i data-lucide="plus" style="width: 12px;"></i> Udhaar
                        </button>
                        <button class="btn btn-secondary btn-sm" onclick="window.adminDashboard.showKhataLedgerActionModal('${acc.id}', 'Payment')" style="border-color: var(--success); color: var(--success); font-size: 0.75rem;" title="Log Payment (-)">
                          <i data-lucide="check" style="width: 12px;"></i> Jumma
                        </button>
                        ${acc.balance > 0 ? `
                          <button class="btn btn-secondary btn-sm" onclick="window.adminDashboard.sendKhataWhatsAppReminder('${acc.id}')" style="border-color: #25d366; color: #25d366;" title="WhatsApp Reminder">
                            <i data-lucide="bell" style="width: 14px;"></i>
                          </button>
                        ` : ""}
                      </div>
                    </td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
  }

  filterKhataTable() {
    const term = document.getElementById("khata-search").value.toLowerCase().trim();
    const rows = document.querySelectorAll("#khata-ledger-table tbody tr");
    rows.forEach(r => {
      const name = r.dataset.name;
      if (name.includes(term)) {
        r.style.display = "";
      } else {
        r.style.display = "none";
      }
    });
  }

  showAddKhataCustomerModal() {
    const content = document.getElementById("global-modal-content");
    const overlay = document.getElementById("global-modal-overlay");

    content.innerHTML = `
      <div>
        <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: var(--spacing-md); display: flex; align-items: center; gap: 8px;">
          <i data-lucide="user-plus" style="color: var(--primary);"></i> Add Khata Account / नया खाता
        </h3>
        <form onsubmit="window.adminDashboard.performAddKhataCustomer(event)">
          <div class="form-group" style="margin-bottom: var(--spacing-sm);">
            <label style="display:block; font-size:0.8rem; font-weight:700; margin-bottom:4px;">Customer Full Name *</label>
            <input type="text" id="khata-new-name" required placeholder="Ramesh Shah" style="width: 100%; border: 1px solid var(--border-color); padding: 10px; border-radius: var(--radius-sm); background: var(--bg-base); color: var(--text-main);">
          </div>
          <div class="form-group" style="margin-bottom: var(--spacing-sm);">
            <label style="display:block; font-size:0.8rem; font-weight:700; margin-bottom:4px;">WhatsApp Number *</label>
            <input type="tel" id="khata-new-phone" required placeholder="9876543210" pattern="[0-9]{10}" style="width: 100%; border: 1px solid var(--border-color); padding: 10px; border-radius: var(--radius-sm); background: var(--bg-base); color: var(--text-main);">
          </div>
          <div class="form-group" style="margin-bottom: var(--spacing-md);">
            <label style="display:block; font-size:0.8rem; font-weight:700; margin-bottom:4px;">Initial Credit Balance (उधार / पुराना कर्ज)</label>
            <input type="number" id="khata-new-balance" placeholder="0" min="0" style="width: 100%; border: 1px solid var(--border-color); padding: 10px; border-radius: var(--radius-sm); background: var(--bg-base); color: var(--text-main);">
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%;">Create Account</button>
        </form>
      </div>
    `;
    overlay.classList.add("open");
    if (window.lucide) window.lucide.createIcons();
  }

  performAddKhataCustomer(e) {
    e.preventDefault();
    const name = document.getElementById("khata-new-name").value.trim();
    const phone = document.getElementById("khata-new-phone").value.trim();
    const balInput = document.getElementById("khata-new-balance").value;
    const initialBal = balInput ? parseFloat(balInput) : 0.00;

    const newAcc = {
      id: "kh-" + (window.state.khataAccounts.length + 1),
      name: name,
      phone: phone,
      balance: initialBal,
      history: initialBal > 0 ? [
        { date: new Date().toISOString().split("T")[0], type: "Credit", amount: initialBal, desc: "Opening credit balance" }
      ] : []
    };

    window.state.khataAccounts.push(newAcc);
    document.getElementById("global-modal-overlay").classList.remove("open");
    showToast(`Account successfully created for ${name}!`, "success");
    
    const pane = document.getElementById("admin-sub-viewport");
    this.renderKhataBook(pane);
  }

  showKhataHistoryModal(customerId) {
    const acc = window.state.khataAccounts.find(item => item.id === customerId);
    if (!acc) return;

    const content = document.getElementById("global-modal-content");
    const overlay = document.getElementById("global-modal-overlay");

    content.innerHTML = `
      <div>
        <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: var(--spacing-xs);">${acc.name} - Ledger History</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: var(--spacing-md);">Phone: ${acc.phone} | Outstanding Balance: <strong style="color: var(--danger);">₹${acc.balance.toFixed(2)}</strong></p>
        
        <div style="max-height: 250px; overflow-y: auto; margin-bottom: var(--spacing-md); border: 1px solid var(--border-color); border-radius: var(--radius-sm);">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.8rem; text-align: left;">
            <thead>
              <tr style="background: var(--bg-base); border-bottom: 1px solid var(--border-color); font-weight: 700;">
                <th style="padding: 8px;">Date</th>
                <th style="padding: 8px;">Type</th>
                <th style="padding: 8px;">Description</th>
                <th style="padding: 8px; text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${acc.history.length === 0 ? `
                <tr><td colspan="4" style="text-align: center; padding: var(--spacing-md); color: var(--text-muted);">No transaction logs available</td></tr>
              ` : acc.history.map(h => `
                <tr style="border-bottom: 1px solid var(--border-color);">
                  <td style="padding: 8px;">${h.date}</td>
                  <td style="padding: 8px; font-weight: 700; color: ${h.type === 'Credit' ? 'var(--danger)' : 'var(--success)'};">${h.type}</td>
                  <td style="padding: 8px; color: var(--text-muted);">${h.desc}</td>
                  <td style="padding: 8px; text-align: right; font-weight: 800; color: ${h.type === 'Credit' ? 'var(--danger)' : 'var(--success)'};">${h.type === 'Credit' ? '+' : '-'}₹${h.amount.toFixed(2)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
        <button class="btn btn-secondary" style="width: 100%;" onclick="document.getElementById('global-modal-overlay').classList.remove('open')">Close</button>
      </div>
    `;
    overlay.classList.add("open");
    if (window.lucide) window.lucide.createIcons();
  }

  showKhataLedgerActionModal(customerId, actionType) {
    const acc = window.state.khataAccounts.find(item => item.id === customerId);
    if (!acc) return;

    const content = document.getElementById("global-modal-content");
    const overlay = document.getElementById("global-modal-overlay");

    const title = actionType === "Credit" ? "Log Credit Purchase (उधार जोड़े)" : "Receive Jumma Payment (पैसे जमा करें)";
    const label = actionType === "Credit" ? "Credit Amount (उधार राशि) *" : "Payment Amount (जमा राशि) *";
    const btnColor = actionType === "Credit" ? "background: var(--danger);" : "background: var(--success);";
    const btnText = actionType === "Credit" ? "Record Credit (उधार दर्ज करें)" : "Record Payment (भुगतान जमा करें)";

    content.innerHTML = `
      <div>
        <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: var(--spacing-xs);">${title}</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: var(--spacing-md);">Customer: <strong>${acc.name}</strong> | Current Balance: ₹${acc.balance.toFixed(2)}</p>
        
        <form onsubmit="window.adminDashboard.performKhataLedgerAction(event, '${acc.id}', '${actionType}')">
          <div class="form-group" style="margin-bottom: var(--spacing-sm);">
            <label style="display:block; font-size:0.8rem; font-weight:700; margin-bottom:4px;">${label}</label>
            <input type="number" id="khata-action-amount" required min="1" step="0.5" style="width: 100%; border: 1px solid var(--border-color); padding: 10px; border-radius: var(--radius-sm); background: var(--bg-base); color: var(--text-main); font-size: 1.1rem; font-weight: 800;">
          </div>
          <div class="form-group" style="margin-bottom: var(--spacing-md);">
            <label style="display:block; font-size:0.8rem; font-weight:700; margin-bottom:4px;">Details / Description (विवरण) *</label>
            <input type="text" id="khata-action-desc" required placeholder="${actionType === 'Credit' ? 'e.g. Atta, sugar & cold drinks' : 'e.g. Paid cash / QR payment'}" style="width: 100%; border: 1px solid var(--border-color); padding: 10px; border-radius: var(--radius-sm); background: var(--bg-base); color: var(--text-main);">
          </div>
          <button type="submit" class="btn btn-primary" style="${btnColor} border: none; width: 100%;">${btnText}</button>
        </form>
      </div>
    `;
    overlay.classList.add("open");
    if (window.lucide) window.lucide.createIcons();
  }

  performKhataLedgerAction(e, customerId, actionType) {
    e.preventDefault();
    const amount = parseFloat(document.getElementById("khata-action-amount").value);
    const desc = document.getElementById("khata-action-desc").value.trim();
    
    const acc = window.state.khataAccounts.find(item => item.id === customerId);
    if (!acc) return;

    if (actionType === "Credit") {
      acc.balance += amount;
      acc.history.push({
        date: new Date().toISOString().split("T")[0],
        type: "Credit",
        amount: amount,
        desc: desc
      });
      showToast(`Logged ₹${amount} credit purchase for ${acc.name}.`, "success");
    } else {
      acc.balance = Math.max(0, acc.balance - amount);
      acc.history.push({
        date: new Date().toISOString().split("T")[0],
        type: "Payment",
        amount: amount,
        desc: desc
      });
      showToast(`Logged ₹${amount} payment received from ${acc.name}.`, "success");
    }

    document.getElementById("global-modal-overlay").classList.remove("open");
    
    const pane = document.getElementById("admin-sub-viewport");
    this.renderKhataBook(pane);
  }

  sendKhataWhatsAppReminder(customerId) {
    const acc = window.state.khataAccounts.find(item => item.id === customerId);
    if (!acc) return;

    const shopName = window.SHOP_CONFIG.name;
    const msg = `Namaste ${acc.name}!\nThis is a friendly reminder from *${shopName}* regarding your outstanding balance of *₹${acc.balance.toFixed(2)}*.\nKindly clear it at your convenience via Cash or UPI QR scan.\n\nThank you!`;

    const encodedText = encodeURIComponent(msg);
    const waUrl = `https://api.whatsapp.com/send?phone=91${acc.phone}&text=${encodedText}`;
    
    window.open(waUrl, "_blank");
    showToast(`Opening WhatsApp to send payment reminder to ${acc.name}...`, "success");
  }

  toggleOutOfStock(productId) {
    const prod = window.state.inventory.find(p => p.id === productId);
    if (prod) {
      if (prod.stock > 0) {
        prod._lastStock = prod.stock;
        prod.stock = 0;
        showToast(`"${prod.name}" marked as Out of Stock!`, "info");
      } else {
        prod.stock = prod._lastStock || 30;
        showToast(`"${prod.name}" marked as In Stock (${prod.stock} units)!`, "success");
      }
      //  Firebase me save karo
      if (window.DB) {
        window.DB.saveProduct(prod).catch(err => console.warn("Save error:", err));
      } else {
        window.saveState();
      }
      this.filterInventoryTable();
    }
  }

  toggleVisibility(productId) {
    const prod = window.state.inventory.find(p => p.id === productId);
    if (prod) {
      prod.status = prod.status === "hidden" ? "active" : "hidden";
      const stateName = prod.status === "hidden" ? "Hidden from Customer Shop" : "Visible in Customer Shop";
      const statusType = prod.status === "hidden" ? "info" : "success";
      //  Firebase me save karo
      if (window.DB) {
        window.DB.saveProduct(prod).catch(err => console.warn("Save error:", err));
      } else {
        window.saveState();
      }
      showToast(`"${prod.name}" status updated: ${stateName}!`, statusType);
      this.filterInventoryTable();
    }
  }

  showEditProductModal(productId) {
    const prod = window.state.inventory.find(p => p.id === productId);
    if (!prod) return;

    const overlay = document.getElementById("global-modal-overlay");
    const modalBox = document.getElementById("global-modal-content");

    modalBox.innerHTML = `
      <div>
        <h2 style="font-size: 1.4rem; font-weight: 800; margin-bottom: var(--spacing-lg); color: var(--primary); display: flex; align-items: center; gap: 8px;">
          <i data-lucide="edit-3"></i> Edit Product - ${prod.name}
        </h2>
        
        <form id="edit-product-form" onsubmit="window.adminDashboard.updateProductDetails(event, '${prod.id}')" style="display: flex; flex-direction: column; gap: var(--spacing-md);">
          <div class="form-field">
            <label for="edit-p-name">Product Name *</label>
            <input type="text" id="edit-p-name" required value="${prod.name}">
          </div>
          
          <div class="form-row">
            <div class="form-field">
              <label for="edit-p-cat">Category *</label>
              <select id="edit-p-cat" required>
                <option value="fruits" ${prod.category === 'fruits' ? 'selected' : ''}>Fruits & Veggies</option>
                <option value="dairy" ${prod.category === 'dairy' ? 'selected' : ''}>Dairy & Eggs</option>
                <option value="snacks" ${prod.category === 'snacks' ? 'selected' : ''}>Snacks & Munchies</option>
                <option value="groceries" ${prod.category === 'groceries' ? 'selected' : ''}>Groceries</option>
                <option value="beverages" ${prod.category === 'beverages' ? 'selected' : ''}>Cold Beverages</option>
              </select>
            </div>
            <div class="form-field">
              <label for="edit-p-supplier">Supplier Name</label>
              <input type="text" id="edit-p-supplier" value="${prod.supplier || ''}">
            </div>
          </div>

          <div class="form-row">
            <div class="form-field">
              <label for="edit-p-price">Retail Price (₹) *</label>
              <input type="number" id="edit-p-price" min="1" required value="${prod.price}">
            </div>
            <div class="form-field">
              <label for="edit-p-discount">Discount Price (₹) (Optional)</label>
              <input type="number" id="edit-p-discount" min="0" value="${prod.discountPrice || ''}">
            </div>
          </div>

          <div class="form-row">
            <div class="form-field">
              <label for="edit-p-stock">Stock *</label>
              <input type="number" id="edit-p-stock" min="0" required value="${prod.stock}">
            </div>
            <div class="form-field">
              <label for="edit-p-expiry">Expiry Date</label>
              <input type="date" id="edit-p-expiry" value="${prod.expiryDate || '2026-12-31'}">
            </div>
          </div>
          
          <div class="form-field">
            <label for="edit-p-desc">Product Description</label>
            <textarea id="edit-p-desc" rows="2" style="background: var(--bg-base); border: 1px solid var(--border-color); padding: 0.6rem; border-radius: 4px; color: var(--text-main);">${prod.description || ''}</textarea>
          </div>

          <div style="display: flex; gap: var(--spacing-md); margin-top: var(--spacing-sm);">
            <button type="button" class="btn btn-secondary" style="flex: 1;" onclick="document.getElementById('global-modal-overlay').classList.remove('open')">Cancel</button>
            <button type="submit" class="btn btn-primary" style="flex: 1;">Save Changes</button>
          </div>
        </form>
      </div>
    `;

    overlay.classList.add("open");
    if (window.lucide) window.lucide.createIcons();
  }

  updateProductDetails(e, productId) {
    e.preventDefault();
    const prod = window.state.inventory.find(p => p.id === productId);
    if (!prod) return;

    prod.name = document.getElementById("edit-p-name").value.trim();
    prod.category = document.getElementById("edit-p-cat").value;
    prod.supplier = document.getElementById("edit-p-supplier").value.trim() || "Pal Grocery";
    prod.price = parseFloat(document.getElementById("edit-p-price").value);
    
    const discVal = document.getElementById("edit-p-discount").value;
    prod.discountPrice = discVal ? parseFloat(discVal) : null;
    
    prod.stock = parseInt(document.getElementById("edit-p-stock").value);
    prod.expiryDate = document.getElementById("edit-p-expiry").value || null;
    prod.description = document.getElementById("edit-p-desc").value.trim();

    //  Firebase me save karo
    if (window.DB) {
      window.DB.saveProduct(prod)
        .then(() => {
          showToast(`Product "${prod.name}" details updated in Firebase!`, "success");
        })
        .catch(err => {
          console.warn("Firebase save error:", err);
          window.saveState();
          showToast(`Product "${prod.name}" updated locally!`, "success");
        });
    } else {
      window.saveState();
      showToast(`Product "${prod.name}" details updated successfully!`, "success");
    }
    document.getElementById("global-modal-overlay").classList.remove("open");
    this.renderInventory(document.getElementById("admin-sub-viewport"));
  }

  renderOrders(container) {
    // Show a loading skeleton
    container.innerHTML = `
      <div class="fade-in" style="padding: 4rem 0; text-align: center;">
        <div style="width: 40px; height: 40px; border: 3px solid var(--border-color); border-top-color: var(--primary); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1.5rem auto;"></div>
        <p style="color: var(--text-muted); font-size: 0.9rem;">Fetching store orders from database...</p>
      </div>
    `;

    const fetchAndRender = async () => {
      let orders = [];
      if (window.DB) {
        orders = await window.DB.loadOrders();
        window.state.orders = orders;
      } else {
        orders = window.state.orders || [];
      }

      // If still empty and no offline items, show default placeholders
      if (orders.length === 0) {
        orders = [
          { id: "ORD-9821", name: "Ramesh Kumar", phone: "9812345678", date: "2026-06-28", status: "Delivered", total: 450.00, items: [] },
          { id: "ORD-9822", name: "Sunita Sharma", phone: "9876543210", date: "2026-06-28", status: "Shipped", total: 185.00, items: [] }
        ];
        window.state.orders = orders;
      }
      
      this.drawOrdersTable(container, orders);
    };

    fetchAndRender();
  }

  drawOrdersTable(container, orders) {
    let currentFilter = "all";
    let searchQuery = "";

    const renderConsole = () => {
      let filteredOrders = orders.filter(o => {
        if (currentFilter === "pending") return o.status === "Pending" || o.status === "Placed" || o.status === "Pending Estimation";
        if (currentFilter === "shipped") return o.status === "Shipped" || o.status === "Out for Delivery";
        if (currentFilter === "delivered") return o.status === "Delivered" || o.status === "Completed";
        if (currentFilter === "cancelled") return o.status === "Cancelled";
        return true;
      });

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        filteredOrders = filteredOrders.filter(o =>
          (o.id && o.id.toLowerCase().includes(q)) ||
          (o.name && o.name.toLowerCase().includes(q)) ||
          (o.phone && o.phone.toLowerCase().includes(q)) ||
          (o.address && o.address.toLowerCase().includes(q))
        );
      }

      container.innerHTML = `
        <div class="fade-in">
          <!-- Top Control Header -->
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px; margin-bottom: var(--spacing-lg);">
            <div>
              <h2 style="font-size: 1.7rem; font-weight: 900; color: var(--text-main); margin: 0; border: none; padding: 0;">
                <i data-lucide="shopping-bag" style="color: var(--primary); display: inline-block; vertical-align: middle; margin-right: 6px;"></i>
                ऑर्डर प्रबंधन केंद्र (Order Management Console)
              </h2>
              <p style="font-size: 0.86rem; color: var(--text-muted); margin-top: 4px;">
                दुकानदार कंट्रोल पैनल: यहाँ से आने वाले सभी ग्राहकों के ऑर्डर्स देखें, स्थिति बदलें, बिल प्रिंट करें और व्हाट्सएप अपडेट भेजें।
              </p>
            </div>
            <span class="badge badge-primary" style="font-size: 0.9rem; padding: 8px 16px; border-radius: 20px; font-weight: 800;">
              ${orders.length} कुल ऑर्डर्स (Total Orders)
            </span>
          </div>

          <!-- Filter & Search Toolbar -->
          <div style="background: var(--bg-surface); border: 1.5px solid var(--border-color); border-radius: 22px; padding: 18px; margin-bottom: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
            <!-- Filter Tabs -->
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <button class="btn ${currentFilter === 'all' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="window.adminFilterOrders('all')" style="border-radius: 18px; font-weight: 700;">
                सभी (${orders.length})
              </button>
              <button class="btn ${currentFilter === 'pending' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="window.adminFilterOrders('pending')" style="border-radius: 18px; font-weight: 700;">
                ⏳ लंबित (${orders.filter(o => o.status === 'Pending' || o.status === 'Placed' || o.status === 'Pending Estimation').length})
              </button>
              <button class="btn ${currentFilter === 'shipped' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="window.adminFilterOrders('shipped')" style="border-radius: 18px; font-weight: 700;">
                🚚 रवाना हुआ (${orders.filter(o => o.status === 'Shipped' || o.status === 'Out for Delivery').length})
              </button>
              <button class="btn ${currentFilter === 'delivered' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="window.adminFilterOrders('delivered')" style="border-radius: 18px; font-weight: 700;">
                ✅ पूरा हुआ (${orders.filter(o => o.status === 'Delivered' || o.status === 'Completed').length})
              </button>
            </div>

            <!-- Search Field -->
            <div style="display: flex; align-items: center; gap: 8px; background: var(--bg-surface-hover); border: 1px solid var(--border-color); padding: 6px 14px; border-radius: 20px; width: 280px;">
              <i data-lucide="search" style="width: 16px; color: var(--text-muted);"></i>
              <input type="text" id="admin-order-search" placeholder="खोजें (ID, नाम, फोन...)" value="${searchQuery}" onkeyup="window.adminSearchOrders(this.value)" style="border: none; background: transparent; color: var(--text-main); font-size: 0.85rem; width: 100%; outline: none;">
            </div>
          </div>

          <!-- Orders Cards Stack -->
          <div style="display: flex; flex-direction: column; gap: 20px;">
            ${filteredOrders.length === 0 ? `
              <div style="text-align: center; padding: 4rem 1rem; background: var(--bg-surface); border: 1.5px dashed var(--border-color); border-radius: 22px; color: var(--text-muted);">
                <i data-lucide="inbox" style="width: 54px; height: 54px; opacity: 0.4; margin-bottom: 12px;"></i>
                <h3 style="font-size: 1.1rem; font-weight: 800; color: var(--text-main);">कोई ऑर्डर नहीं मिला (No Orders Found)</h3>
                <p style="font-size: 0.85rem;">ग्राहक द्वारा ऑनलाइन ऑर्डर करने पर यहाँ सभी जानकारी दिखाई देगी।</p>
              </div>
            ` : filteredOrders.map(o => {
              const isParchiPending = o.isParchi && o.total === 0;
              const photoUrl = o.parchiImage || o.image;
              const statusBadgeClass = (o.status === 'Delivered' || o.status === 'Completed') ? 'badge-success' : (o.status === 'Shipped' || o.status === 'Out for Delivery') ? 'badge-primary' : 'badge-warning';

              // Items table
              const itemsListHtml = (o.items && o.items.length > 0) ? `
                <div style="margin-top: 10px; background: var(--bg-surface-hover); border: 1px solid var(--border-color); border-radius: 14px; padding: 12px;">
                  <strong style="font-size: 0.82rem; color: var(--text-muted); display: block; margin-bottom: 6px;">ऑर्डर किए गए सामान (Ordered Items):</strong>
                  <table style="width: 100%; font-size: 0.84rem; border-collapse: collapse;">
                    ${o.items.map(i => `
                      <tr style="border-bottom: 1px dashed var(--border-color);">
                        <td style="padding: 5px 0; font-weight: 700; color: var(--text-main);">${i.name || i.title} ${i.temp === 'chilled' ? '<span style="color:#0ea5e9; font-size:0.75rem;">(Chilled)</span>' : ''}</td>
                        <td style="padding: 5px 0; text-align: center; color: var(--text-muted);">x${i.qty || 1}</td>
                        <td style="padding: 5px 0; text-align: right; font-weight: 800; color: var(--primary);">₹${(((i.price || 0) * (i.qty || 1))).toFixed(2)}</td>
                      </tr>
                    `).join('')}
                  </table>
                </div>
              ` : (o.itemsText ? `
                <div style="margin-top: 10px; background: var(--bg-surface-hover); border: 1px dashed var(--border-color); border-radius: 14px; padding: 12px; font-size: 0.84rem; white-space: pre-wrap;">
                  <strong style="color: var(--primary);"><i data-lucide="file-text" class="inline-icon"></i> पर्ची लिस्ट (Parchi List):</strong><br>${o.itemsText}
                </div>
              ` : '');

              const photoBtnHtml = photoUrl ? `
                <button class="btn btn-secondary btn-sm" onclick="window.adminDashboard.showParchiPhotoModal('${o.id}')" style="margin-top: 8px; font-size: 0.78rem; padding: 5px 12px; border-color: var(--primary); color: var(--primary); font-weight: 700; border-radius: 14px;">
                  <i data-lucide="image" style="width: 14px; height: 14px;"></i> पर्ची फोटो देखें (View Image)
                </button>
              ` : '';

              return `
                <div style="background: var(--bg-surface); border: 1.5px solid var(--border-color); border-radius: 24px; padding: 22px; box-shadow: 0 8px 24px rgba(0,0,0,0.03); transition: border-color 0.3s ease;">
                  <!-- Card Header: ID, Date, Status -->
                  <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px; margin-bottom: 14px;">
                    <div>
                      <span style="font-size: 1.1rem; font-weight: 900; color: var(--primary); font-family: monospace;">${o.id}</span>
                      <span style="font-size: 0.8rem; color: var(--text-muted); margin-left: 10px;">📅 ${o.date || ''} ${o.time || ''}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span class="badge ${statusBadgeClass}" style="font-size: 0.85rem; padding: 6px 14px; border-radius: 20px; font-weight: 800;">
                        ${o.status}
                      </span>
                    </div>
                  </div>

                  <!-- Grid: Customer Info & Order Items -->
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <!-- Left: Customer Details -->
                    <div>
                      <div style="font-size: 0.98rem; font-weight: 800; color: var(--text-main); margin-bottom: 4px;">
                        <i data-lucide="user" style="width: 16px; height: 16px; color: var(--primary); display: inline-block; vertical-align: middle;"></i>
                        ${o.name || o.customerName || 'Customer'}
                      </div>
                      <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 6px;">
                        📞 <strong>${o.phone || o.customerPhone || 'N/A'}</strong>
                      </div>
                      <div style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.45; background: var(--bg-surface-hover); padding: 8px 12px; border-radius: 12px; border: 1px solid var(--border-color);">
                        📍 <strong>पता (Delivery Address):</strong><br>
                        ${o.address || 'Devari Bazar Store Pickup'}
                      </div>

                      <!-- Contact Action Buttons -->
                      <div style="display: flex; gap: 8px; margin-top: 10px;">
                        <a href="tel:${o.phone || '9415552992'}" class="btn btn-secondary btn-sm" style="border-radius: 14px; font-size: 0.78rem; font-weight: 700; gap: 4px;">
                          <i data-lucide="phone-call" style="width: 14px;"></i> कॉल करें (Call)
                        </a>
                        <button class="btn btn-secondary btn-sm" onclick="window.adminDashboard.sendWhatsAppCustomerUpdate('${o.id}')" style="border-radius: 14px; font-size: 0.78rem; font-weight: 700; color: #22c55e; border-color: #22c55e; gap: 4px;">
                          <i data-lucide="message-circle" style="width: 14px;"></i> व्हाट्सएप अपडेट (WhatsApp)
                        </button>
                      </div>
                    </div>

                    <!-- Right: Items & Totals -->
                    <div>
                      ${itemsListHtml}
                      ${photoBtnHtml}

                      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 14px; padding-top: 10px; border-top: 1px solid var(--border-color);">
                        <div>
                          <span style="font-size: 0.78rem; color: var(--text-muted); display: block;">भुगतान का माध्यम (Payment):</span>
                          <strong style="font-size: 0.85rem; color: var(--text-main);">${o.paymentMethod || 'Cash on Delivery (COD)'}</strong>
                        </div>
                        <div style="text-align: right;">
                          <span style="font-size: 0.78rem; color: var(--text-muted); display: block;">कुल राशि (Total Amount):</span>
                          <strong style="font-size: 1.35rem; color: var(--primary); font-weight: 900;">₹${(o.total || 0).toFixed(2)}</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Card Footer: Shopkeeper Controls -->
                  <div style="margin-top: 16px; padding-top: 14px; border-top: 1.5px dashed var(--border-color); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <label style="font-size: 0.85rem; font-weight: 800; color: var(--text-main);">ऑर्डर स्थिति बदलें (Change Status):</label>
                      <button class="btn btn-primary btn-sm" onclick="window.adminDashboard.changeOrderStatus('${o.id}')" style="border-radius: 16px; font-weight: 800; padding: 6px 16px;">
                        अगली स्थिति (Next Status ➔)
                      </button>
                    </div>

                    <div style="display: flex; gap: 8px;">
                      <button class="btn btn-secondary btn-sm" onclick="window.adminDashboard.printOrderInvoice('${o.id}')" style="border-radius: 16px; font-size: 0.8rem; font-weight: 700; gap: 4px;">
                        <i data-lucide="printer" style="width: 14px;"></i> बिल पर्ची प्रिंट (Print Bill)
                      </button>
                      <button class="btn btn-secondary btn-sm" onclick="window.adminDashboard.cancelOrder('${o.id}')" style="border-radius: 16px; font-size: 0.8rem; font-weight: 700; color: var(--danger); border-color: var(--danger); gap: 4px;">
                        <i data-lucide="trash-2" style="width: 14px;"></i> रद्द करें (Cancel)
                      </button>
                    </div>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      `;

      if (window.lucide) window.lucide.createIcons();
    };

    window.adminFilterOrders = (filter) => {
      currentFilter = filter;
      renderConsole();
    };

    window.adminSearchOrders = (val) => {
      searchQuery = val;
      renderConsole();
    };

    window.adminDashboard.changeOrderStatus = async (orderId) => {
      const o = window.state.orders.find(ord => ord.id === orderId);
      if (!o) return;
      let nextStatus = o.status;
      
      if (o.status === "Placed" || o.status === "Pending") nextStatus = "Shipped";
      else if (o.status === "Pending Estimation") nextStatus = "Shipped";
      else if (o.status === "Shipped" || o.status === "Out for Delivery") nextStatus = "Delivered";
      else {
        showToast("Order already delivered!", "info");
        return;
      }
      
      if (window.DB) {
        const ok = await window.DB.updateOrderStatus(orderId, nextStatus);
        if (ok) {
          o.status = nextStatus;
          showToast(`Order status updated to ${nextStatus} in database!`, "success");
        } else {
          showToast("Failed to update status on server.", "danger");
        }
      } else {
        o.status = nextStatus;
        showToast(`Order status updated to ${nextStatus} (offline)!`, "success");
      }
      renderConsole();
    };

    window.adminDashboard.printOrderInvoice = (orderId) => {
      const o = window.state.orders.find(ord => ord.id === orderId);
      if (!o) return;

      const printWin = window.open('', '_blank', 'width=450,height=600');
      const itemsHtml = (o.items && o.items.length > 0) ? o.items.map(i => `
        <tr>
          <td style="padding:4px 0;">${i.name || i.title} ${i.temp === 'chilled' ? '(Chilled)' : ''} x${i.qty || 1}</td>
          <td style="text-align:right; padding:4px 0;">₹${(((i.price || 0) * (i.qty || 1))).toFixed(2)}</td>
        </tr>
      `).join('') : `<tr><td colspan="2" style="white-space:pre-wrap;">${o.itemsText || 'General Kirana Items'}</td></tr>`;

      printWin.document.write(`
        <html>
          <head>
            <title>Invoice - ${o.id}</title>
            <style>
              body { font-family: monospace; font-size: 13px; padding: 15px; margin: 0; line-height: 1.4; }
              .center { text-align: center; }
              .bold { font-weight: bold; }
              hr { border-top: 1px dashed #000; margin: 8px 0; }
              table { width: 100%; border-collapse: collapse; }
            </style>
          </head>
          <body>
            <div class="center bold" style="font-size:16px;">PAL GENERAL STORE</div>
            <div class="center" style="font-size:11px;">Devari Bazar, Haliya, Mirzapur (UP)</div>
            <div class="center" style="font-size:11px;">Phone: +91 94155 52992</div>
            <hr>
            <div><strong>Order ID:</strong> ${o.id}</div>
            <div><strong>Date/Time:</strong> ${o.date || ''} ${o.time || ''}</div>
            <div><strong>Customer:</strong> ${o.name || o.customerName || 'Guest'}</div>
            <div><strong>Phone:</strong> ${o.phone || ''}</div>
            <div><strong>Address:</strong> ${o.address || 'Devari Bazar Store Pickup'}</div>
            <div><strong>Payment:</strong> ${o.paymentMethod || 'COD'}</div>
            <hr>
            <table>
              <thead>
                <tr style="text-align:left; border-bottom:1px solid #000;">
                  <th>Item</th>
                  <th style="text-align:right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            <hr>
            <div style="display:flex; justify-content:space-between; font-weight:bold; font-size:15px;">
              <span>Total Amount:</span>
              <span>₹${(o.total || 0).toFixed(2)}</span>
            </div>
            <hr>
            <div class="center" style="font-size:11px; margin-top:10px;">
              Order prepared within 30 mins.<br>Thank you for shopping at Pal Store!
            </div>
            <script>
              window.onload = function() { window.print(); }
            </script>
          </body>
        </html>
      `);
      printWin.document.close();
    };

    window.adminDashboard.sendWhatsAppCustomerUpdate = (orderId) => {
      const o = window.state.orders.find(ord => ord.id === orderId);
      if (!o || !o.phone) {
        showToast("Customer phone number not available!", "warning");
        return;
      }
      const cleanPhone = o.phone.replace(/[^0-9]/g, '');
      const targetPhone = cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone;
      const msg = encodeURIComponent(`नमस्ते ${o.name || 'ग्राहक जी'}, आपके ऑर्डर ID: ${o.id} की स्थिति बदल कर "${o.status}" कर दी गई है। देवरी बाज़ार पाल जनरल स्टोर से जुड़ने के लिए धन्यवाद!`);
      window.open(`https://wa.me/${targetPhone}?text=${msg}`, '_blank');
    };

    window.adminDashboard.cancelOrder = (orderId) => {
      if (confirm(`Cancel order ${orderId}?`)) {
        if (window.DB) {
          window.DB.updateOrderStatus(orderId, "Cancelled").then(() => {
            window.state.orders = window.state.orders.filter(ord => ord.id !== orderId);
            renderConsole();
            showToast(`Order ${orderId} cancelled!`, "warning");
          });
        } else {
          window.state.orders = window.state.orders.filter(ord => ord.id !== orderId);
          renderConsole();
          showToast(`Order ${orderId} cancelled locally!`, "warning");
        }
      }
    };

    renderConsole();
  }

  showParchiPhotoModal(orderId) {
    const order = window.state.orders.find(o => o.id === orderId);
    if (!order) return;
    const photoUrl = order.parchiImage || order.image;
    if (!photoUrl) {
      showToast("No photo attached to this order.", "info");
      return;
    }

    const overlay = document.getElementById("global-modal-overlay");
    const modalBox = document.getElementById("global-modal-content");

    modalBox.innerHTML = `
      <div style="text-align: center;">
        <h2 style="font-size: 1.3rem; font-weight: 800; margin-bottom: 12px; color: var(--primary); display: flex; align-items: center; justify-content: center; gap: 8px;">
          <i data-lucide="file-image"></i> Customer's Handwritten Parchi Photo
        </h2>
        <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 12px;">
          Order ID: <strong style="color: var(--primary);">${order.id}</strong> | Customer: <strong>${order.name || order.customerName || 'Customer'}</strong> (${order.phone || ''})
        </div>
        <div style="max-height: 65vh; overflow: auto; border: 2px dashed var(--primary); border-radius: 8px; padding: 8px; background: var(--bg-base); margin-bottom: 16px;">
          <img src="${photoUrl}" alt="Customer Parchi Photo" style="max-width: 100%; height: auto; border-radius: 6px; display: block; margin: 0 auto; box-shadow: var(--shadow-md);">
        </div>
        <div style="display: flex; gap: 12px; justify-content: center;">
          <button class="btn btn-secondary" onclick="document.getElementById('global-modal-overlay').classList.remove('open')">Close</button>
          <a href="${photoUrl}" download="parchi-${order.id}.jpg" class="btn btn-primary" target="_blank" style="display: inline-flex; align-items: center; gap: 6px;">
            <i data-lucide="download" style="width: 16px;"></i> Download Photo
          </a>
        </div>
      </div>
    `;
    overlay.classList.add("open");
    if (window.lucide) window.lucide.createIcons();
  }

  renderProducts(container) {
    container.innerHTML = `
      <div class="fade-in">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-lg);">
          <h2 style="font-size: 1.6rem; font-weight: 800; border: none; padding: 0; margin: 0;">Product Catalog Management</h2>
          <button class="btn btn-primary" onclick="window.adminDashboard.showAddProductModal()">
            <i data-lucide="plus"></i> Add New Product
          </button>
        </div>

        <div class="checkout-card" style="padding: var(--spacing-lg); border-radius: var(--radius-md); background: var(--bg-surface); border: 1px solid var(--border-color);">
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;">
              <thead>
                <tr style="border-bottom: 2px solid var(--border-color); color: var(--text-muted);">
                  <th style="padding: 10px;">ID</th>
                  <th style="padding: 10px;">Name</th>
                  <th style="padding: 10px;">Category</th>
                  <th style="padding: 10px; text-align: right;">Price</th>
                  <th style="padding: 10px; text-align: right;">Stock</th>
                  <th style="padding: 10px; text-align: center;">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${window.state.inventory.map(p => `
                  <tr style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: 12px 10px; font-weight: 700;">${p.id}</td>
                    <td style="padding: 12px 10px;"><strong>${p.name}</strong></td>
                    <td style="padding: 12px 10px;"><span class="hero-badge" style="font-size: 0.75rem;">${p.category}</span></td>
                    <td style="padding: 12px 10px; text-align: right; font-weight: 700;">₹${p.price.toFixed(2)}</td>
                    <td style="padding: 12px 10px; text-align: right; font-weight: 700; color: ${p.stock <= 10 ? 'var(--danger)' : 'var(--text-main)'};">${p.stock}</td>
                    <td style="padding: 12px 10px; text-align: center;">
                      <div style="display: flex; gap: 4px; justify-content: center;">
                        <button class="btn btn-secondary btn-sm" onclick="window.adminDashboard.showEditProductModal('${p.id}')">Edit</button>
                        <button class="btn btn-secondary btn-sm" onclick="window.adminDashboard.deleteProduct('${p.id}')" style="color: var(--danger); border-color: var(--danger);">Delete</button>
                      </div>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
  }

  // PANE: Categories Management (Full CRUD)
  renderCategories(container) {
    if (!window.state.categories) {
      window.state.categories = [
        { id: "cat-fruits", key: "fruits", name_en: "Fruits & Vegetables", name_hi: "फल और सब्ज़ियाँ", desc: "Fresh organic Shimla apples, bananas, green vegetables", icon: "apple" },
        { id: "cat-dairy", key: "dairy", name_en: "Dairy & Eggs", name_hi: "डेयरी और अंडे", desc: "Fresh clay-pot lassi, local paneer, farm milk, country eggs", icon: "milk" },
        { id: "cat-snacks", key: "snacks", name_en: "Snacks & Munchies", name_hi: "स्नैक्स और नमकीन", desc: "Haldiram bhujia, Lays magic masala, tea time snacks", icon: "cookie" },
        { id: "cat-groceries", key: "groceries", name_en: "Kitchen Groceries", name_hi: "रसोई का सामान", desc: "Chakki wheat flour, basmati rice, mustard oil, salt", icon: "wheat" },
        { id: "cat-beverages", key: "beverages", name_en: "Cold Beverages", name_hi: "कोल्ड ड्रिंक", desc: "Chilled soda cans, soft drinks, instant coffee", icon: "cup-soda" }
      ];
    }

    const counts = {};
    window.state.inventory.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });

    container.innerHTML = `
      <div class="fade-in">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-lg); flex-wrap: wrap; gap: var(--spacing-md);">
          <div>
            <h2 style="font-size: 1.6rem; font-weight: 800; border: none; padding: 0; margin: 0;">Category Management</h2>
            <p style="color: var(--text-muted); font-size: 0.9rem;">Manage store product categories, icons, and bilingual descriptions.</p>
          </div>
          <button class="btn btn-primary" onclick="window.adminDashboard.showAddCategoryModal()">
            <i data-lucide="plus"></i> Add New Category
          </button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--spacing-md);">
          ${window.state.categories.map(c => `
            <div class="checkout-card" style="padding: var(--spacing-lg); border-radius: var(--radius-md); background: var(--bg-surface); border: 1px solid var(--border-color); display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--spacing-sm);">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="background: var(--primary-light); color: var(--primary); width: 42px; height: 42px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                      <i data-lucide="${c.icon || 'tag'}"></i>
                    </div>
                    <div>
                      <h3 style="font-size: 1.1rem; font-weight: 800; border: none; padding: 0; margin: 0;">${c.name_en}</h3>
                      <span style="font-size: 0.8rem; color: var(--primary); font-weight: 700;">${c.name_hi || ''}</span>
                    </div>
                  </div>
                </div>
                <p style="color: var(--text-muted); font-size: 0.85rem; line-height: 1.5; margin-bottom: var(--spacing-md);">${c.desc || ''}</p>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: var(--spacing-sm);">
                <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted);">${counts[c.key] || 0} Products</span>
                <div style="display: flex; gap: 6px;">
                  <button class="btn btn-secondary btn-sm" onclick="window.adminDashboard.showEditCategoryModal('${c.id}')" style="padding: 4px 8px; font-size: 0.75rem;">Edit</button>
                  <button class="btn btn-secondary btn-sm" onclick="window.adminDashboard.deleteCategory('${c.id}')" style="color: var(--danger); border-color: var(--danger); padding: 4px 8px; font-size: 0.75rem;">Delete</button>
                </div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
  }

  showAddCategoryModal() {
    const overlay = document.getElementById("global-modal-overlay");
    const content = document.getElementById("global-modal-content");

    content.innerHTML = `
      <div>
        <h3 style="font-size: 1.3rem; font-weight: 800; margin-bottom: var(--spacing-md); color: var(--primary);">Add New Category</h3>
        <form onsubmit="window.adminDashboard.performAddCategory(event)" style="display: flex; flex-direction: column; gap: var(--spacing-md);">
          <div class="form-row">
            <div class="form-field">
              <label>Category Key Code *</label>
              <input type="text" id="cat-new-key" required placeholder="e.g. bakery">
            </div>
            <div class="form-field">
              <label>Icon Name (Lucide Icon) *</label>
              <input type="text" id="cat-new-icon" required value="shopping-bag" placeholder="apple, milk, cookie, wheat...">
            </div>
          </div>
          <div class="form-row">
            <div class="form-field">
              <label>Category Name (English) *</label>
              <input type="text" id="cat-new-name-en" required placeholder="Bakery & Fresh Bread">
            </div>
            <div class="form-field">
              <label>Category Name (Hindi) *</label>
              <input type="text" id="cat-new-name-hi" required placeholder="बेकरी और ताज़ा ब्रेड">
            </div>
          </div>
          <div class="form-field">
            <label>Description</label>
            <input type="text" id="cat-new-desc" placeholder="Brief details about items in this category...">
          </div>
          <div style="display: flex; gap: var(--spacing-md);">
            <button type="button" class="btn btn-secondary" style="flex:1;" onclick="document.getElementById('global-modal-overlay').classList.remove('open')">Cancel</button>
            <button type="submit" class="btn btn-primary" style="flex:1;">Add Category</button>
          </div>
        </form>
      </div>
    `;
    overlay.classList.add("open");
    if (window.lucide) window.lucide.createIcons();
  }

  performAddCategory(e) {
    e.preventDefault();
    const key = document.getElementById("cat-new-key").value.trim().toLowerCase();
    const icon = document.getElementById("cat-new-icon").value.trim();
    const name_en = document.getElementById("cat-new-name-en").value.trim();
    const name_hi = document.getElementById("cat-new-name-hi").value.trim();
    const desc = document.getElementById("cat-new-desc").value.trim();

    if (!window.state.categories) window.state.categories = [];

    const newCat = {
      id: "cat-" + Date.now(),
      key,
      icon,
      name_en,
      name_hi,
      desc
    };

    window.state.categories.push(newCat);
    window.saveState();
    document.getElementById("global-modal-overlay").classList.remove("open");
    showToast(`Category "${name_en}" created!`, "success");
    const pane = document.getElementById("admin-sub-viewport");
    this.renderCategories(pane);
  }

  showEditCategoryModal(catId) {
    const cat = (window.state.categories || []).find(c => c.id === catId);
    if (!cat) return;

    const overlay = document.getElementById("global-modal-overlay");
    const content = document.getElementById("global-modal-content");

    content.innerHTML = `
      <div>
        <h3 style="font-size: 1.3rem; font-weight: 800; margin-bottom: var(--spacing-md); color: var(--primary);">Edit Category - ${cat.name_en}</h3>
        <form onsubmit="window.adminDashboard.performSaveCategory(event, '${cat.id}')" style="display: flex; flex-direction: column; gap: var(--spacing-md);">
          <div class="form-row">
            <div class="form-field">
              <label>Category Key Code *</label>
              <input type="text" id="cat-edit-key" required value="${cat.key}">
            </div>
            <div class="form-field">
              <label>Icon Name *</label>
              <input type="text" id="cat-edit-icon" required value="${cat.icon || 'tag'}">
            </div>
          </div>
          <div class="form-row">
            <div class="form-field">
              <label>Category Name (English) *</label>
              <input type="text" id="cat-edit-name-en" required value="${cat.name_en}">
            </div>
            <div class="form-field">
              <label>Category Name (Hindi) *</label>
              <input type="text" id="cat-edit-name-hi" required value="${cat.name_hi || ''}">
            </div>
          </div>
          <div class="form-field">
            <label>Description</label>
            <input type="text" id="cat-edit-desc" value="${cat.desc || ''}">
          </div>
          <div style="display: flex; gap: var(--spacing-md);">
            <button type="button" class="btn btn-secondary" style="flex:1;" onclick="document.getElementById('global-modal-overlay').classList.remove('open')">Cancel</button>
            <button type="submit" class="btn btn-primary" style="flex:1;">Save Changes</button>
          </div>
        </form>
      </div>
    `;
    overlay.classList.add("open");
    if (window.lucide) window.lucide.createIcons();
  }

  performSaveCategory(e, catId) {
    e.preventDefault();
    const cat = (window.state.categories || []).find(c => c.id === catId);
    if (!cat) return;

    cat.key = document.getElementById("cat-edit-key").value.trim().toLowerCase();
    cat.icon = document.getElementById("cat-edit-icon").value.trim();
    cat.name_en = document.getElementById("cat-edit-name-en").value.trim();
    cat.name_hi = document.getElementById("cat-edit-name-hi").value.trim();
    cat.desc = document.getElementById("cat-edit-desc").value.trim();

    window.saveState();
    document.getElementById("global-modal-overlay").classList.remove("open");
    showToast(`Category "${cat.name_en}" updated!`, "success");
    const pane = document.getElementById("admin-sub-viewport");
    this.renderCategories(pane);
  }

  deleteCategory(catId) {
    if (confirm("Are you sure you want to delete this category?")) {
      window.state.categories = (window.state.categories || []).filter(c => c.id !== catId);
      window.saveState();
      showToast("Category deleted successfully!", "warning");
      const pane = document.getElementById("admin-sub-viewport");
      this.renderCategories(pane);
    }
  }

  // PANE: Offers / Banner Management (Full CRUD)
  renderOffers(container) {
    if (!window.state.offers) {
      window.state.offers = [
        { id: "off-1", title_en: "Fresh Veggie Morning Special", title_hi: "ताज़ा सब्ज़ियों का सुबह का स्पेशल", desc_en: "Get 15% off on all organic fruits & green veggies before 11 AM.", desc_hi: "सुबह 11 बजे से पहले ताज़े फलों और सब्ज़ियों पर 15% की छूट पाएं।", promoCode: "FRESH15", color: "blue", active: true },
        { id: "off-2", title_en: "Free Kirana Express Delivery", title_hi: "मुफ्त किराना एक्सप्रेस डिलीवरी", desc_en: "Complimentary home delivery within 30 minutes on orders above ₹299.", desc_hi: "₹299 से ऊपर के हर ऑर्डर पर 30 मिनट में मुफ्त होम डिलीवरी।", promoCode: "AUTO-APPLIED", color: "green", active: true }
      ];
    }

    container.innerHTML = `
      <div class="fade-in">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-lg); flex-wrap: wrap; gap: var(--spacing-md);">
          <div>
            <h2 style="font-size: 1.6rem; font-weight: 800; border: none; padding: 0; margin: 0;">Offers & Promotional Banners</h2>
            <p style="color: var(--text-muted); font-size: 0.9rem;">Manage live marketing banners, promo codes, and discount offers shown on the storefront.</p>
          </div>
          <button class="btn btn-primary" onclick="window.adminDashboard.showAddOfferModal()">
            <i data-lucide="plus"></i> Add New Offer Banner
          </button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--spacing-md);">
          ${window.state.offers.map(o => `
            <div class="checkout-card" style="padding: var(--spacing-lg); border-radius: var(--radius-md); background: var(--bg-surface); border: 2px solid ${o.color === 'green' ? 'var(--primary)' : 'var(--info)'}; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                  <span class="badge ${o.active ? 'badge-success' : 'badge-danger'}">${o.active ? '● LIVE ON HOME' : '○ INACTIVE'}</span>
                  <span style="font-size: 0.75rem; font-weight: 800; background: var(--bg-base); padding: 2px 8px; border-radius: 4px; border: 1px solid var(--border-color);">${o.promoCode || 'NO CODE'}</span>
                </div>
                <h3 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 4px; color: var(--text-main);">${o.title_en}</h3>
                <h4 style="font-size: 0.9rem; font-weight: 700; color: var(--primary); margin-bottom: 8px;">${o.title_hi || ''}</h4>
                <p style="color: var(--text-muted); font-size: 0.85rem; line-height: 1.4; margin-bottom: var(--spacing-md);">${o.desc_en}</p>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: var(--spacing-sm);">
                <button class="btn ${o.active ? 'btn-secondary' : 'btn-primary'} btn-sm" onclick="window.adminDashboard.toggleOfferStatus('${o.id}')" style="font-size: 0.75rem;">
                  ${o.active ? 'Disable' : 'Enable Live'}
                </button>
                <div style="display: flex; gap: 6px;">
                  <button class="btn btn-secondary btn-sm" onclick="window.adminDashboard.showEditOfferModal('${o.id}')" style="padding: 4px 8px; font-size: 0.75rem;">Edit</button>
                  <button class="btn btn-secondary btn-sm" onclick="window.adminDashboard.deleteOffer('${o.id}')" style="color: var(--danger); border-color: var(--danger); padding: 4px 8px; font-size: 0.75rem;">Delete</button>
                </div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
  }

  showAddOfferModal() {
    const overlay = document.getElementById("global-modal-overlay");
    const content = document.getElementById("global-modal-content");

    content.innerHTML = `
      <div>
        <h3 style="font-size: 1.3rem; font-weight: 800; margin-bottom: var(--spacing-md); color: var(--primary);">Add Promotional Banner Offer</h3>
        <form onsubmit="window.adminDashboard.performAddOffer(event)" style="display: flex; flex-direction: column; gap: var(--spacing-md);">
          <div class="form-row">
            <div class="form-field">
              <label>Offer Title (English) *</label>
              <input type="text" id="off-new-title-en" required placeholder="e.g. Midnight Snack Bargain">
            </div>
            <div class="form-field">
              <label>Offer Title (Hindi) *</label>
              <input type="text" id="off-new-title-hi" required placeholder="e.g. देर रात स्नैक्स स्पेशल ऑफर">
            </div>
          </div>
          <div class="form-field">
            <label>Description (English) *</label>
            <input type="text" id="off-new-desc-en" required placeholder="Get 10% instant discount on all chips and sodas.">
          </div>
          <div class="form-field">
            <label>Description (Hindi) *</label>
            <input type="text" id="off-new-desc-hi" required placeholder="सभी चिप्स और कोल्ड ड्रिंक्स पर 10% की तुरंत छूट पाएँ।">
          </div>
          <div class="form-row">
            <div class="form-field">
              <label>Promo Code</label>
              <input type="text" id="off-new-code" value="KIRANA10" placeholder="KIRANA10 or AUTO-APPLIED">
            </div>
            <div class="form-field">
              <label>Banner Theme Color</label>
              <select id="off-new-color">
                <option value="blue">Blue Gradient</option>
                <option value="green">Green Gradient</option>
                <option value="purple">Purple Gradient</option>
              </select>
            </div>
          </div>
          <div style="display: flex; gap: var(--spacing-md);">
            <button type="button" class="btn btn-secondary" style="flex:1;" onclick="document.getElementById('global-modal-overlay').classList.remove('open')">Cancel</button>
            <button type="submit" class="btn btn-primary" style="flex:1;">Add Offer Banner</button>
          </div>
        </form>
      </div>
    `;
    overlay.classList.add("open");
    if (window.lucide) window.lucide.createIcons();
  }

  performAddOffer(e) {
    e.preventDefault();
    const title_en = document.getElementById("off-new-title-en").value.trim();
    const title_hi = document.getElementById("off-new-title-hi").value.trim();
    const desc_en = document.getElementById("off-new-desc-en").value.trim();
    const desc_hi = document.getElementById("off-new-desc-hi").value.trim();
    const promoCode = document.getElementById("off-new-code").value.trim().toUpperCase() || "AUTO-APPLIED";
    const color = document.getElementById("off-new-color").value;

    if (!window.state.offers) window.state.offers = [];

    const newOffer = {
      id: "off-" + Date.now(),
      title_en,
      title_hi,
      desc_en,
      desc_hi,
      promoCode,
      color,
      active: true
    };

    window.state.offers.push(newOffer);
    if (window.DB) {
      window.DB.saveOffers(window.state.offers).catch(() => window.saveState());
    } else {
      window.saveState();
    }

    document.getElementById("global-modal-overlay").classList.remove("open");
    showToast(`New offer banner "${title_en}" created!`, "success");
    const pane = document.getElementById("admin-sub-viewport");
    this.renderOffers(pane);
  }

  showEditOfferModal(offerId) {
    const offer = (window.state.offers || []).find(o => o.id === offerId);
    if (!offer) return;

    const overlay = document.getElementById("global-modal-overlay");
    const content = document.getElementById("global-modal-content");

    content.innerHTML = `
      <div>
        <h3 style="font-size: 1.3rem; font-weight: 800; margin-bottom: var(--spacing-md); color: var(--primary);">Edit Offer Banner</h3>
        <form onsubmit="window.adminDashboard.performSaveOffer(event, '${offer.id}')" style="display: flex; flex-direction: column; gap: var(--spacing-md);">
          <div class="form-row">
            <div class="form-field">
              <label>Offer Title (English) *</label>
              <input type="text" id="off-edit-title-en" required value="${offer.title_en}">
            </div>
            <div class="form-field">
              <label>Offer Title (Hindi) *</label>
              <input type="text" id="off-edit-title-hi" required value="${offer.title_hi || ''}">
            </div>
          </div>
          <div class="form-field">
            <label>Description (English) *</label>
            <input type="text" id="off-edit-desc-en" required value="${offer.desc_en}">
          </div>
          <div class="form-field">
            <label>Description (Hindi) *</label>
            <input type="text" id="off-edit-desc-hi" required value="${offer.desc_hi || ''}">
          </div>
          <div class="form-row">
            <div class="form-field">
              <label>Promo Code</label>
              <input type="text" id="off-edit-code" value="${offer.promoCode || 'AUTO-APPLIED'}">
            </div>
            <div class="form-field">
              <label>Banner Theme Color</label>
              <select id="off-edit-color">
                <option value="blue" ${offer.color === 'blue' ? 'selected' : ''}>Blue Gradient</option>
                <option value="green" ${offer.color === 'green' ? 'selected' : ''}>Green Gradient</option>
                <option value="purple" ${offer.color === 'purple' ? 'selected' : ''}>Purple Gradient</option>
              </select>
            </div>
          </div>
          <div style="display: flex; gap: var(--spacing-md);">
            <button type="button" class="btn btn-secondary" style="flex:1;" onclick="document.getElementById('global-modal-overlay').classList.remove('open')">Cancel</button>
            <button type="submit" class="btn btn-primary" style="flex:1;">Save Changes</button>
          </div>
        </form>
      </div>
    `;
    overlay.classList.add("open");
    if (window.lucide) window.lucide.createIcons();
  }

  performSaveOffer(e, offerId) {
    e.preventDefault();
    const offer = (window.state.offers || []).find(o => o.id === offerId);
    if (!offer) return;

    offer.title_en = document.getElementById("off-edit-title-en").value.trim();
    offer.title_hi = document.getElementById("off-edit-title-hi").value.trim();
    offer.desc_en = document.getElementById("off-edit-desc-en").value.trim();
    offer.desc_hi = document.getElementById("off-edit-desc-hi").value.trim();
    offer.promoCode = document.getElementById("off-edit-code").value.trim().toUpperCase() || "AUTO-APPLIED";
    offer.color = document.getElementById("off-edit-color").value;

    if (window.DB) {
      window.DB.saveOffers(window.state.offers).catch(() => window.saveState());
    } else {
      window.saveState();
    }

    document.getElementById("global-modal-overlay").classList.remove("open");
    showToast(`Offer banner "${offer.title_en}" updated!`, "success");
    const pane = document.getElementById("admin-sub-viewport");
    this.renderOffers(pane);
  }

  toggleOfferStatus(offerId) {
    const offer = (window.state.offers || []).find(o => o.id === offerId);
    if (offer) {
      offer.active = !offer.active;
      if (window.DB) {
        window.DB.saveOffers(window.state.offers).catch(() => window.saveState());
      } else {
        window.saveState();
      }
      showToast(`Offer "${offer.title_en}" is now ${offer.active ? 'Live' : 'Disabled'}!`, offer.active ? 'success' : 'info');
      const pane = document.getElementById("admin-sub-viewport");
      this.renderOffers(pane);
    }
  }

  deleteOffer(offerId) {
    if (confirm("Delete this promotional offer banner?")) {
      window.state.offers = (window.state.offers || []).filter(o => o.id !== offerId);
      if (window.DB) {
        window.DB.saveOffers(window.state.offers).catch(() => window.saveState());
      } else {
        window.saveState();
      }
      showToast("Offer banner deleted!", "warning");
      const pane = document.getElementById("admin-sub-viewport");
      this.renderOffers(pane);
    }
  }

  // PANE: Promo Coupons (Full CRUD)
  renderCoupons(container) {
    if (!window.state.coupons) {
      window.state.coupons = [
        { code: "KIRANA10", discount: "10%", desc: "10% off entire cart", status: "Active" },
        { code: "FREESHIP", discount: "₹30", desc: "Free delivery credit", status: "Active" },
        { code: "FREECHILLED", discount: "₹15", desc: "Free cold-packaging wrapper", status: "Active" }
      ];
    }

    container.innerHTML = `
      <div class="fade-in">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-lg); flex-wrap: wrap; gap: var(--spacing-md);">
          <div>
            <h2 style="font-size: 1.6rem; font-weight: 800; border: none; padding: 0; margin: 0;">Promo Coupons</h2>
            <p style="color: var(--text-muted); font-size: 0.9rem;">Manage discount vouchers and promo codes for checkout.</p>
          </div>
          <button class="btn btn-primary" onclick="window.adminDashboard.showAddCouponModal()">
            <i data-lucide="plus"></i> Add New Coupon
          </button>
        </div>

        <div class="checkout-card" style="padding: var(--spacing-lg); border-radius: var(--radius-md); background: var(--bg-surface); border: 1px solid var(--border-color);">
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;">
              <thead>
                <tr style="border-bottom: 2px solid var(--border-color); color: var(--text-muted);">
                  <th style="padding: 10px;">Coupon Code</th>
                  <th style="padding: 10px;">Discount Value</th>
                  <th style="padding: 10px;">Description</th>
                  <th style="padding: 10px;">Status</th>
                  <th style="padding: 10px; text-align: center;">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${window.state.coupons.map(c => `
                  <tr style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: 12px 10px; font-weight: 800; color: var(--primary);"><code style="font-family: monospace; font-size: 0.95rem;">${c.code}</code></td>
                    <td style="padding: 12px 10px; font-weight: 800;">${c.discount}</td>
                    <td style="padding: 12px 10px; color: var(--text-muted);">${c.desc}</td>
                    <td style="padding: 12px 10px;"><span class="badge ${c.status === 'Active' ? 'badge-success' : 'badge-secondary'}">${c.status}</span></td>
                    <td style="padding: 12px 10px; text-align: center;">
                      <div style="display: flex; gap: 6px; justify-content: center;">
                        <button class="btn btn-secondary btn-sm" onclick="window.adminDashboard.showEditCouponModal('${c.code}')" style="padding: 4px 8px; font-size: 0.75rem;">Edit</button>
                        <button class="btn btn-secondary btn-sm" onclick="window.adminDashboard.deleteCoupon('${c.code}')" style="color: var(--danger); border-color: var(--danger); padding: 4px 8px; font-size: 0.75rem;">Delete</button>
                      </div>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
  }

  showAddCouponModal() {
    const overlay = document.getElementById("global-modal-overlay");
    const content = document.getElementById("global-modal-content");

    content.innerHTML = `
      <div>
        <h3 style="font-size: 1.3rem; font-weight: 800; margin-bottom: var(--spacing-md); color: var(--primary);">Add Promo Coupon</h3>
        <form onsubmit="window.adminDashboard.performAddCoupon(event)" style="display: flex; flex-direction: column; gap: var(--spacing-md);">
          <div class="form-row">
            <div class="form-field">
              <label>Coupon Code *</label>
              <input type="text" id="coup-new-code" required placeholder="e.g. FESTIVE20">
            </div>
            <div class="form-field">
              <label>Discount Value *</label>
              <input type="text" id="coup-new-disc" required placeholder="e.g. 20% or ₹50">
            </div>
          </div>
          <div class="form-field">
            <label>Description *</label>
            <input type="text" id="coup-new-desc" required placeholder="Flat 20% off on monthly ration">
          </div>
          <div style="display: flex; gap: var(--spacing-md);">
            <button type="button" class="btn btn-secondary" style="flex:1;" onclick="document.getElementById('global-modal-overlay').classList.remove('open')">Cancel</button>
            <button type="submit" class="btn btn-primary" style="flex:1;">Create Coupon</button>
          </div>
        </form>
      </div>
    `;
    overlay.classList.add("open");
    if (window.lucide) window.lucide.createIcons();
  }

  performAddCoupon(e) {
    e.preventDefault();
    const code = document.getElementById("coup-new-code").value.trim().toUpperCase();
    const discount = document.getElementById("coup-new-disc").value.trim();
    const desc = document.getElementById("coup-new-desc").value.trim();

    if (!window.state.coupons) window.state.coupons = [];

    window.state.coupons.push({
      code,
      discount,
      desc,
      status: "Active"
    });

    window.saveState();
    document.getElementById("global-modal-overlay").classList.remove("open");
    showToast(`Coupon "${code}" created successfully!`, "success");
    const pane = document.getElementById("admin-sub-viewport");
    this.renderCoupons(pane);
  }

  showEditCouponModal(code) {
    const coupon = (window.state.coupons || []).find(c => c.code === code);
    if (!coupon) return;

    const overlay = document.getElementById("global-modal-overlay");
    const content = document.getElementById("global-modal-content");

    content.innerHTML = `
      <div>
        <h3 style="font-size: 1.3rem; font-weight: 800; margin-bottom: var(--spacing-md); color: var(--primary);">Edit Coupon - ${coupon.code}</h3>
        <form onsubmit="window.adminDashboard.performSaveCoupon(event, '${coupon.code}')" style="display: flex; flex-direction: column; gap: var(--spacing-md);">
          <div class="form-row">
            <div class="form-field">
              <label>Coupon Code *</label>
              <input type="text" id="coup-edit-code" required value="${coupon.code}">
            </div>
            <div class="form-field">
              <label>Discount Value *</label>
              <input type="text" id="coup-edit-disc" required value="${coupon.discount}">
            </div>
          </div>
          <div class="form-field">
            <label>Description *</label>
            <input type="text" id="coup-edit-desc" required value="${coupon.desc}">
          </div>
          <div class="form-field">
            <label>Status</label>
            <select id="coup-edit-status">
              <option value="Active" ${coupon.status === 'Active' ? 'selected' : ''}>Active</option>
              <option value="Disabled" ${coupon.status === 'Disabled' ? 'selected' : ''}>Disabled</option>
            </select>
          </div>
          <div style="display: flex; gap: var(--spacing-md);">
            <button type="button" class="btn btn-secondary" style="flex:1;" onclick="document.getElementById('global-modal-overlay').classList.remove('open')">Cancel</button>
            <button type="submit" class="btn btn-primary" style="flex:1;">Save Coupon</button>
          </div>
        </form>
      </div>
    `;
    overlay.classList.add("open");
    if (window.lucide) window.lucide.createIcons();
  }

  performSaveCoupon(e, oldCode) {
    e.preventDefault();
    const coupon = (window.state.coupons || []).find(c => c.code === oldCode);
    if (!coupon) return;

    coupon.code = document.getElementById("coup-edit-code").value.trim().toUpperCase();
    coupon.discount = document.getElementById("coup-edit-disc").value.trim();
    coupon.desc = document.getElementById("coup-edit-desc").value.trim();
    coupon.status = document.getElementById("coup-edit-status").value;

    window.saveState();
    document.getElementById("global-modal-overlay").classList.remove("open");
    showToast(`Coupon "${coupon.code}" updated!`, "success");
    const pane = document.getElementById("admin-sub-viewport");
    this.renderCoupons(pane);
  }

  deleteCoupon(code) {
    if (confirm(`Delete coupon "${code}"?`)) {
      window.state.coupons = (window.state.coupons || []).filter(c => c.code !== code);
      window.saveState();
      showToast(`Coupon "${code}" deleted.`, "warning");
      const pane = document.getElementById("admin-sub-viewport");
      this.renderCoupons(pane);
    }
  }

  renderReports(container) {
    container.innerHTML = `
      <div class="fade-in">
        <h2 style="font-size: 1.6rem; font-weight: 800; border: none; padding: 0; margin-bottom: var(--spacing-lg);">Store Reports Ledger</h2>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-lg);">
          <div class="checkout-card" style="padding: var(--spacing-lg); border-radius: var(--radius-md); background: var(--bg-surface); border: 1px solid var(--border-color);">
            <h3 style="font-size: 1.15rem; font-weight: 800; margin-bottom: var(--spacing-md); border:none; padding:0;">Daily Sales Ledger</h3>
            <div style="display: flex; flex-direction: column; gap: var(--spacing-sm);">
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 6px;">
                <span>2026-06-28 (Today)</span>
                <strong>₹${window.state.totalSalesRevenue.toFixed(2)}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 6px; color: var(--text-muted);">
                <span>2026-06-27 (Yesterday)</span>
                <strong>₹14,250.00</strong>
              </div>
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 6px; color: var(--text-muted);">
                <span>2026-06-26</span>
                <strong>₹12,890.00</strong>
              </div>
            </div>
            <button class="btn btn-primary" onclick="showToast('Exporting daily CSV ledger...', 'success')" style="width: 100%; margin-top: var(--spacing-lg);">
              <i data-lucide="download"></i> Download Sales CSV
            </button>
          </div>

          <div class="checkout-card" style="padding: var(--spacing-lg); border-radius: var(--radius-md); background: var(--bg-surface); border: 1px solid var(--border-color); display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <h3 style="font-size: 1.15rem; font-weight: 800; margin-bottom: var(--spacing-sm); border:none; padding:0;">Inventory Valuation Report</h3>
              <p style="color: var(--text-muted); font-size: 0.85rem; line-height: 1.5;">Summarize cumulative cost of active shelf items, wholesale margins, and stock restock forecast charts.</p>
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px; margin-top: var(--spacing-md);">
              <button class="btn btn-secondary" onclick="showToast('Calculating sheet valuation...', 'info')">
                <i data-lucide="pie-chart"></i> View Stock Valuation Sheet
              </button>
              <button class="btn btn-secondary" onclick="showToast('Generating GST Tax breakdown report...', 'success')">
                <i data-lucide="file-spreadsheet"></i> Export GST Billing Ledger
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
  }

  // PANE: Store Settings (Comprehensive Edit & Update)
  renderSettings(container) {
    const dbStatus = window.DB ? window.DB.getStatus() : { isOnline: false, mode: 'Local Storage' };
    const isConnected = dbStatus.isOnline;

    container.innerHTML = `
      <div class="fade-in" style="max-width: 720px;">
        <h2 style="font-size: 1.6rem; font-weight: 800; border: none; padding: 0; margin-bottom: var(--spacing-lg);">Store Settings & Customizations</h2>

        <!-- Firebase Database Status Card -->
        <div class="checkout-card" style="padding: var(--spacing-lg); border-radius: var(--radius-md); background: var(--bg-surface); border: 2px solid ${isConnected ? 'var(--success)' : 'var(--warning)'}; margin-bottom: var(--spacing-md);">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 42px; height: 42px; border-radius: 50%; background: ${isConnected ? 'var(--success-light)' : 'rgba(255,152,0,0.1)'}; display: flex; align-items: center; justify-content: center;"><i data-lucide="${isConnected ? 'database' : 'smartphone'}" style="width: 20px; height: 20px; color: ${isConnected ? 'var(--success)' : '#e65100'};"></i></div>
              <div>
                <h3 style="font-size: 1rem; font-weight: 800; margin: 0 0 2px 0; color: var(--text-main);">Firebase Realtime Database</h3>
                <span style="font-size: 0.8rem; color: ${isConnected ? 'var(--success)' : 'var(--warning)'}; font-weight: 700;">${dbStatus.mode}</span>
              </div>
            </div>
            <span class="badge" style="background: ${isConnected ? 'var(--success-light)' : 'rgba(255,152,0,0.1)'}; color: ${isConnected ? 'var(--success)' : '#e65100'}; border: 1px solid ${isConnected ? 'var(--success)' : '#ff9800'}; font-weight: 800; font-size: 0.8rem; padding: 6px 14px; border-radius: 20px;">${isConnected ? '● LIVE SYNC ON' : '○ LOCAL STORAGE PERSISTENCE'}</span>
          </div>
        </div>

        <form onsubmit="window.adminDashboard.saveStoreSettings(event)" class="checkout-card" style="padding: var(--spacing-lg); border-radius: var(--radius-md); background: var(--bg-surface); border: 1px solid var(--border-color); display: flex; flex-direction: column; gap: var(--spacing-md);">
          
          <h3 style="font-size: 1.1rem; font-weight: 800; color: var(--primary); margin-bottom: var(--spacing-xs); border-bottom: 1px solid var(--border-color); padding-bottom: 6px;">1. Store Identity & Branding</h3>
          
          <div class="form-row">
            <div class="form-field">
              <label style="font-weight:700;">Kirana Shop Name (English) *</label>
              <input type="text" id="setting-shop-name" value="${window.SHOP_CONFIG.name || 'Pal Grocery'}" required style="background: var(--bg-base); border: 1px solid var(--border-color); padding: 8px; border-radius: 4px; color: var(--text-main); width: 100%;">
            </div>
            <div class="form-field">
              <label style="font-weight:700;">Kirana Shop Name (Hindi) *</label>
              <input type="text" id="setting-shop-name-hi" value="${(window.TRANSLATIONS.hi && window.TRANSLATIONS.hi.shop_name) || 'पाल ग्रॉसरी'}" required style="background: var(--bg-base); border: 1px solid var(--border-color); padding: 8px; border-radius: 4px; color: var(--text-main); width: 100%;">
            </div>
          </div>

          <div class="form-row">
            <div class="form-field">
              <label style="font-weight:700;">Store Owner Name *</label>
              <input type="text" id="setting-owner-name" value="${window.SHOP_CONFIG.ownerName || 'Ramlallu Pal'}" required style="background: var(--bg-base); border: 1px solid var(--border-color); padding: 8px; border-radius: 4px; color: var(--text-main); width: 100%;">
            </div>
            <div class="form-field">
              <label style="font-weight:700;">WhatsApp / Support Contact *</label>
              <input type="text" id="setting-phone" value="${window.SHOP_CONFIG.phone || '919415552992'}" required style="background: var(--bg-base); border: 1px solid var(--border-color); padding: 8px; border-radius: 4px; color: var(--text-main); width: 100%;">
            </div>
          </div>

          <h3 style="font-size: 1.1rem; font-weight: 800; color: var(--primary); margin-top: var(--spacing-sm); margin-bottom: var(--spacing-xs); border-bottom: 1px solid var(--border-color); padding-bottom: 6px;">2. Operating Hours & Delivery</h3>

          <div class="form-row">
            <div class="form-field">
              <label style="font-weight:700;">Operating Hours</label>
              <input type="text" id="setting-hours" value="08:00 AM - 10:00 PM" style="background: var(--bg-base); border: 1px solid var(--border-color); padding: 8px; border-radius: 4px; color: var(--text-main); width: 100%;">
            </div>
            <div class="form-field">
              <label style="font-weight:700;">Delivery Radius (km)</label>
              <input type="text" id="setting-delivery" value="${window.SHOP_CONFIG.deliveryRange || '3km'}" style="background: var(--bg-base); border: 1px solid var(--border-color); padding: 8px; border-radius: 4px; color: var(--text-main); width: 100%;">
            </div>
          </div>

          <h3 style="font-size: 1.1rem; font-weight: 800; color: var(--primary); margin-top: var(--spacing-sm); margin-bottom: var(--spacing-xs); border-bottom: 1px solid var(--border-color); padding-bottom: 6px;">3. Store Tagline & Announcement</h3>

          <div class="form-field">
            <label style="font-weight:700;">Store Tagline (English)</label>
            <input type="text" id="setting-tagline-en" value="${(window.TRANSLATIONS.en && window.TRANSLATIONS.en.tagline) || 'Fresh Groceries & Chilled Drinks Delivered Instantly'}" style="background: var(--bg-base); border: 1px solid var(--border-color); padding: 8px; border-radius: 4px; color: var(--text-main); width: 100%;">
          </div>
          <div class="form-field">
            <label style="font-weight:700;">Store Tagline (Hindi)</label>
            <input type="text" id="setting-tagline-hi" value="${(window.TRANSLATIONS.hi && window.TRANSLATIONS.hi.tagline) || 'ताज़ा राशन और ठंडाल्ड-ड्रिंक तुरंत घर पहुंचाएं'}" style="background: var(--bg-base); border: 1px solid var(--border-color); padding: 8px; border-radius: 4px; color: var(--text-main); width: 100%;">
          </div>

          <button type="submit" class="btn btn-primary" style="margin-top: var(--spacing-md); width: 100%;">
            <i data-lucide="save"></i> Save All Settings & Sync Live Storefront
          </button>
        </form>

        <!-- Admin Security Credentials & Password Change Form -->
        <form onsubmit="window.adminDashboard.changeAdminPassword(event)" class="checkout-card" style="padding: var(--spacing-lg); border-radius: var(--radius-md); background: var(--bg-surface); border: 1.5px solid var(--primary); margin-top: 24px; display: flex; flex-direction: column; gap: var(--spacing-md);">
          <h3 style="font-size: 1.15rem; font-weight: 900; color: var(--primary); margin-bottom: 2px; border-bottom: 1px solid var(--border-color); padding-bottom: 6px;">
            🔐 Admin Security & Bank-Grade Password Protection
          </h3>
          <p style="font-size: 0.84rem; color: var(--text-muted); margin-top: -4px;">
            यहाँ से आप अपना नया पासवर्ड व यूजरनेम सेट कर सकते हैं। यह जानकारी MySQL डेटाबेस में <strong>Bcrypt Encryption</strong> से हमेशा के लिए सुरक्षित रहेगी।
          </p>

          <div class="form-field">
            <label style="font-weight:700;">Admin Security ID / Username *</label>
            <input type="text" id="admin-new-user" value="9415552992" required style="background: var(--bg-base); border: 1px solid var(--border-color); padding: 8px; border-radius: 4px; color: var(--text-main); width: 100%;">
          </div>

          <div class="form-row">
            <div class="form-field">
              <label style="font-weight:700;">Current Security Password *</label>
              <input type="password" id="admin-old-pass" placeholder="••••••••" required style="background: var(--bg-base); border: 1px solid var(--border-color); padding: 8px; border-radius: 4px; color: var(--text-main); width: 100%;">
            </div>
            <div class="form-field">
              <label style="font-weight:700;">New Secret Password (min 8 chars) *</label>
              <input type="password" id="admin-new-pass" placeholder="e.g. Pal@9415552992" required minlength="8" style="background: var(--bg-base); border: 1px solid var(--border-color); padding: 8px; border-radius: 4px; color: var(--text-main); width: 100%;">
            </div>
          </div>

          <button type="submit" class="btn btn-primary" style="margin-top: 6px; width: 100%; background: linear-gradient(135deg, var(--primary), #047857); border: none;">
            <i data-lucide="shield-check"></i> Update Security Credentials in Database
          </button>
        </form>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
  }

  async changeAdminPassword(e) {
    e.preventDefault();
    const oldPassword = document.getElementById("admin-old-pass").value;
    const newUsername = document.getElementById("admin-new-user").value.trim();
    const newPassword = document.getElementById("admin-new-pass").value;

    if (newPassword.length < 8) {
      showToast("New password must be at least 8 characters long for security!", "warning");
      return;
    }

    try {
      const token = (window.state && window.state.adminUser && window.state.adminUser.token) || localStorage.getItem("palbasket_admin_token") || "";
      const res = await fetch("api/auth.php?action=change_admin_credentials", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ oldPassword, newUsername, newPassword })
      });
      const data = await res.json();
      if (data.success) {
        showToast("🔐 Admin Password & Security Username updated successfully in MySQL Database!", "success");
        document.getElementById("admin-old-pass").value = "";
        document.getElementById("admin-new-pass").value = "";
      } else {
        showToast(data.error || "Failed to update password.", "danger");
      }
    } catch (err) {
      showToast("Admin credentials update failed.", "danger");
    }
  }

  saveStoreSettings(e) {
    e.preventDefault();
    const name = document.getElementById('setting-shop-name').value.trim();
    const name_hi = document.getElementById('setting-shop-name-hi').value.trim();
    const ownerName = document.getElementById('setting-owner-name').value.trim();
    const phone = document.getElementById('setting-phone').value.trim();
    const deliveryRange = document.getElementById('setting-delivery').value.trim();
    const tagline_en = document.getElementById('setting-tagline-en').value.trim();
    const tagline_hi = document.getElementById('setting-tagline-hi').value.trim();

    window.SHOP_CONFIG.name = name;
    window.SHOP_CONFIG.ownerName = ownerName;
    window.SHOP_CONFIG.phone = phone;
    window.SHOP_CONFIG.deliveryRange = deliveryRange;

    if (window.TRANSLATIONS.en) {
      window.TRANSLATIONS.en.shop_name = name;
      window.TRANSLATIONS.en.tagline = tagline_en;
    }
    if (window.TRANSLATIONS.hi) {
      window.TRANSLATIONS.hi.shop_name = name_hi;
      window.TRANSLATIONS.hi.tagline = tagline_hi;
    }

    if (window.translatePage) window.translatePage();

    if (window.DB) {
      window.DB.saveSettings(window.SHOP_CONFIG)
        .then(() => showToast('Store settings saved to Firebase & updated live!', 'success'))
        .catch(() => {
          window.saveState();
          showToast('Store settings saved locally!', 'success');
        });
    } else {
      window.saveState();
      showToast('Store settings updated and saved successfully!', 'success');
    }
  }
}

// Global Export
window.adminDashboard = new KiranaAdmin();
