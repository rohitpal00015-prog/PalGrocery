// ============================================================
//   DATABASE LAYER — Pal Grocery (PHP + MySQL Backend)
//  Yeh file saare PHP API calls handle karti hai
//  Admin se koi bhi change hoga to PHP API → MySQL me save hoga
// ============================================================

const DB = (() => {
  // API base URL — XAMPP me chalte waqt yeh automatically set hota hai
  const BASE_URL = (() => {
    const origin = window.location.origin;
    const path = window.location.pathname;
    const parts = path.split('/').filter(p => p.length > 0);
    let subfolder = '';
    if (parts.length > 0 && parts[0] !== 'admin' && parts[0] !== 'api' && !parts[0].includes('.')) {
      subfolder = '/' + parts[0];
    }
    return `${origin}${subfolder}/api`;
  })();

  let isOnline = false;

  function _getAuthHeaders() {
    const token = (window.state && window.state.adminUser && window.state.adminUser.token) || localStorage.getItem('palbasket_admin_token') || '';
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  }


  // ─── Initialize: API connection test karo ───────────────
  async function init() {
    try {
      const res = await fetch(`${BASE_URL}/products.php?limit=1`, {
        method: 'GET',
        headers: _getAuthHeaders()
      });
      if (res.ok) {
        isOnline = true;
        window.FIREBASE_READY = true; // backward compat flag
        console.log(` PHP MySQL API connected! → ${BASE_URL}`);
        return true;
      }
    } catch (err) {
      console.warn(` PHP API not reachable (${BASE_URL}). localStorage mode.`);
    }
    isOnline = false;
    return false;
  }

  // ─── PRODUCTS: Sab load karo ────────────────────────────
  async function loadProducts() {
    if (!isOnline) {
      return _fromLocalStorage();
    }

    try {
      const res = await fetch(`${BASE_URL}/products.php`);
      const data = await res.json();
      if (data.success && data.products.length > 0) {
        console.log(` MySQL se ${data.products.length} products load hue`);
        // LocalStorage cache update karo
        localStorage.setItem('palbasket_inventory', JSON.stringify(data.products));
        return data.products;
      }
    } catch (err) {
      console.warn('Products load error:', err);
    }
    return _fromLocalStorage();
  }

  // ─── PRODUCTS: Ek product save/update karo ──────────────
  async function saveProduct(product) {
    _updateLocalStorage(product);

    if (!isOnline) return false;

    try {
      const res = await fetch(`${BASE_URL}/products.php`, {
        method: 'PUT',
        headers: _getAuthHeaders(),
        body: JSON.stringify(product)
      });
      const data = await res.json();
      if (data.success) {
        console.log(` Product "${product.name}" MySQL me save hua`);
        return true;
      }
    } catch (err) {
      console.warn('saveProduct error:', err);
    }
    return false;
  }

  // ─── PRODUCTS: Naya product add karo ────────────────────
  async function addProduct(product) {
    if (!product.id) {
      product.id = 'prod-' + Date.now();
    }
    window.state.inventory.push(product);
    localStorage.setItem('palbasket_inventory', JSON.stringify(window.state.inventory));

    if (!isOnline) return product.id;

    try {
      const res = await fetch(`${BASE_URL}/products.php`, {
        method: 'POST',
        headers: _getAuthHeaders(),
        body: JSON.stringify(product)
      });
      const data = await res.json();
      if (data.success) {
        console.log(` Naya product "${product.name}" MySQL me add hua`);
        return data.id || product.id;
      }
    } catch (err) {
      console.warn('addProduct error:', err);
    }
    return product.id;
  }

  // ─── PRODUCTS: Product delete karo ──────────────────────
  async function deleteProduct(productId) {
    window.state.inventory = window.state.inventory.filter(p => p.id !== productId);
    localStorage.setItem('palbasket_inventory', JSON.stringify(window.state.inventory));

    if (!isOnline) return false;

    try {
      const res = await fetch(`${BASE_URL}/products.php?id=${productId}`, {
        method: 'DELETE',
        headers: _getAuthHeaders()
      });
      const data = await res.json();
      if (data.success) {
        console.log(` Product ${productId} MySQL se delete hua`);
        return true;
      }
    } catch (err) {
      console.warn('deleteProduct error:', err);
    }
    return false;
  }

  // ─── PRODUCTS: Poora inventory save karo ────────────────
  async function saveAllProducts(products) {
    localStorage.setItem('palbasket_inventory', JSON.stringify(products));

    if (!isOnline) return false;

    // Har product ke liye PUT karo
    try {
      const promises = products.map(p =>
        fetch(`${BASE_URL}/products.php`, {
          method: 'PUT',
          headers: _getAuthHeaders(),
          body: JSON.stringify(p)
        })
      );
      await Promise.all(promises);
      console.log(` ${products.length} products MySQL me save hue`);
      return true;
    } catch (err) {
      console.warn('saveAllProducts error:', err);
    }
    return false;
  }

  // ─── OFFERS: Load karo ──────────────────────────────────
  async function loadOffers() {
    if (!isOnline) {
      const saved = localStorage.getItem('palbasket_offers');
      return saved ? JSON.parse(saved) : null;
    }

    try {
      const res = await fetch(`${BASE_URL}/offers.php`);
      const data = await res.json();
      if (data.success && data.offers.length > 0) {
        localStorage.setItem('palbasket_offers', JSON.stringify(data.offers));
        return data.offers;
      }
    } catch (err) {
      console.warn('loadOffers error:', err);
    }
    const saved = localStorage.getItem('palbasket_offers');
    return saved ? JSON.parse(saved) : null;
  }

  // ─── OFFERS: Save karo ──────────────────────────────────
  async function saveOffers(offers) {
    localStorage.setItem('palbasket_offers', JSON.stringify(offers));

    if (!isOnline) return false;

    try {
      const res = await fetch(`${BASE_URL}/offers.php`, {
        method: 'POST',
        headers: _getAuthHeaders(),
        body: JSON.stringify({ offers })
      });
      const data = await res.json();
      return data.success;
    } catch (err) {
      console.warn('saveOffers error:', err);
    }
    return false;
  }

  // ─── SETTINGS: Load karo ────────────────────────────────
  async function loadSettings() {
    if (!isOnline) {
      const saved = localStorage.getItem('palbasket_settings');
      return saved ? JSON.parse(saved) : null;
    }

    try {
      const res = await fetch(`${BASE_URL}/settings.php`);
      const data = await res.json();
      if (data.success && data.settings) {
        // Settings object ko SHOP_CONFIG format me convert karo
        const s = data.settings;
        const config = {
          name: s.shop_name || 'Pal Grocery',
          phone: s.phone || '919415552992',
          deliveryRange: s.delivery_range || '3km',
          ownerName: s.owner_name || 'Papa',
        };
        localStorage.setItem('palbasket_settings', JSON.stringify(config));
        return config;
      }
    } catch (err) {
      console.warn('loadSettings error:', err);
    }
    const saved = localStorage.getItem('palbasket_settings');
    return saved ? JSON.parse(saved) : null;
  }

  // ─── SETTINGS: Save karo ────────────────────────────────
  async function saveSettings(settings) {
    localStorage.setItem('palbasket_settings', JSON.stringify(settings));

    if (!isOnline) return false;

    // SHOP_CONFIG keys ko DB keys me map karo
    const dbSettings = {
      shop_name: settings.name || settings.shop_name || 'Pal Grocery',
      phone: settings.phone || '',
      delivery_range: settings.deliveryRange || '3km',
      owner_name: settings.ownerName || 'Papa',
    };

    try {
      const res = await fetch(`${BASE_URL}/settings.php`, {
        method: 'POST',
        headers: _getAuthHeaders(),
        body: JSON.stringify(dbSettings)
      });
      const data = await res.json();
      return data.success;
    } catch (err) {
      console.warn('saveSettings error:', err);
    }
    return false;
  }

  // ─── ORDERS: Save karo ──────────────────────────────────
  async function saveOrder(order) {
    // Save locally first
    if (window.state && window.state.orders) {
      window.state.orders.unshift(order);
      localStorage.setItem('palbasket_orders', JSON.stringify(window.state.orders));
    }

    if (!isOnline) return 'ORD-LOCAL-' + Date.now();

    try {
      const body = {
        customerName: order.name || window.state.user.name,
        customerPhone: order.phone || window.state.user.phone,
        customerEmail: order.email || window.state.user.email || '',
        items: order.items,
        total: order.total,
        paymentMethod: order.paymentMethod || 'UPI',
        deliveryAddress: order.address || window.state.user.address,
        isParchi: order.isParchi ? 1 : 0,
        notes: order.itemsText || ''
      };

      const res = await fetch(`${BASE_URL}/orders.php`, {
        method: 'POST',
        headers: _getAuthHeaders(),
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        console.log(` Order ${data.orderId} MySQL me save hua`);
        return data.orderId;
      }
    } catch (err) {
      console.warn('saveOrder error:', err);
    }
    return order.id || 'ORD-' + Date.now();
  }

  // ─── ORDERS: Sab load karo (for Admin) ───────────────────
  async function loadOrders() {
    if (!isOnline) {
      const saved = localStorage.getItem('palbasket_orders');
      return saved ? JSON.parse(saved) : [];
    }

    try {
      const res = await fetch(`${BASE_URL}/orders.php`);
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('palbasket_orders', JSON.stringify(data.orders));
        return data.orders;
      }
    } catch (err) {
      console.warn('loadOrders error:', err);
    }
    const saved = localStorage.getItem('palbasket_orders');
    return saved ? JSON.parse(saved) : [];
  }

  // ─── ORDERS: Ek fetch karo by ID (for Customer Tracker) ──
  async function loadOrder(orderId) {
    if (!isOnline) {
      const saved = localStorage.getItem('palbasket_orders');
      const orders = saved ? JSON.parse(saved) : [];
      return orders.find(o => o.id === orderId) || null;
    }

    try {
      const res = await fetch(`${BASE_URL}/orders.php?id=${orderId}`);
      const data = await res.json();
      if (data.success) {
        return data.order;
      }
    } catch (err) {
      console.warn('loadOrder error:', err);
    }
    return null;
  }

  // ─── ORDERS: Status/Total update karo ────────────────────
  async function updateOrderStatus(orderId, status, total = null) {
    if (window.state && window.state.orders) {
      const o = window.state.orders.find(ord => ord.id === orderId);
      if (o) {
        o.status = status;
        if (total !== null) o.total = total;
      }
      localStorage.setItem('palbasket_orders', JSON.stringify(window.state.orders));
    }

    if (!isOnline) return false;

    try {
      const body = { id: orderId, status: status };
      if (total !== null) body.total = total;

      const res = await fetch(`${BASE_URL}/orders.php`, {
        method: 'PUT',
        headers: _getAuthHeaders(),
        body: JSON.stringify(body)
      });
      const data = await res.json();
      return data.success;
    } catch (err) {
      console.warn('updateOrderStatus error:', err);
    }
    return false;
  }

  // ─── PHP me real-time listener nahi hota ───────────────
  // Admin update kare → customer page reload karne pe dikhega
  function listenProducts(callback) {
    // PHP version: polling every 30 seconds (optional)
    console.log('ℹ PHP mode: Real-time sync nahi — reload pe fresh data milega');
    return () => {}; // unsubscribe function
  }

  function listenOrders(callback) {
    return () => {};
  }

  // ─── STATUS ─────────────────────────────────────────────
  function getStatus() {
    return {
      isOnline,
      mode: isOnline ? ' PHP MySQL (XAMPP)' : ' Local Storage (Offline)'
    };
  }

  // ─── INTERNAL HELPERS ───────────────────────────────────
  function _fromLocalStorage() {
    const saved = localStorage.getItem('palbasket_inventory');
    if (saved) return JSON.parse(saved);
    return JSON.parse(JSON.stringify(window.PRODUCTS || []));
  }

  function _updateLocalStorage(updatedProduct) {
    try {
      if (window.state && window.state.inventory) {
        const idx = window.state.inventory.findIndex(p => p.id === updatedProduct.id);
        if (idx !== -1) {
          window.state.inventory[idx] = { ...window.state.inventory[idx], ...updatedProduct };
        }
        localStorage.setItem('palbasket_inventory', JSON.stringify(window.state.inventory));
      }
    } catch (e) {
      console.warn('localStorage update failed:', e);
    }
  }

  // Seed function (compatibility — PHP me nahi chahiye)
  async function seedDefaultProducts() {
    console.log('ℹ Seed: MySQL me setup.sql se data already hai');
  }

  // Public API
  return {
    init,
    loadProducts,
    saveProduct,
    addProduct,
    deleteProduct,
    saveAllProducts,
    listenProducts,
    loadOffers,
    saveOffers,
    loadSettings,
    saveSettings,
    saveOrder,
    loadOrders,
    loadOrder,
    updateOrderStatus,
    listenOrders,
    getStatus,
    seedDefaultProducts
  };
})();

window.DB = DB;
