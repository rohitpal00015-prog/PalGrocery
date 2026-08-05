// Pal Grocery - Checkout & Billing Simulation View Module

function renderCheckoutPage(viewport) {
  const totals = getCartTotals();

  viewport.innerHTML = `
    <div class="container fade-in" style="padding-bottom: 3rem;">
      <div style="margin-top: var(--spacing-lg);">
        <h2 style="font-size: 1.8rem; font-weight: 800; letter-spacing: -0.5px;">Complete Checkout</h2>
      </div>

      <div class="checkout-grid" style="margin-top: var(--spacing-lg);">
        <!-- Address & Payment methods -->
        <div>
          <div class="checkout-card">
            <h3>1. Delivery Address</h3>
            <div class="form-row">
              <div class="form-field">
                <label for="check-name">Full Name *</label>
                <input type="text" id="check-name" value="${window.state.user.name}" required>
              </div>
              <div class="form-field">
                <label for="check-phone">Phone Number *</label>
                <input type="text" id="check-phone" value="${window.state.user.phone}" required>
              </div>
            </div>
            <div class="form-field">
              <label for="check-address">Delivery Address *</label>
              <input type="text" id="check-address" value="${window.state.user.address}" required>
            </div>
          </div>

          <div class="checkout-card">
            <h3>2. Payment Method</h3>
            <div class="payment-options">
              <div class="payment-radio active" id="check-pay-upi" onclick="selectCheckoutPayment('upi')">
                <i data-lucide="qr-code" style="width: 32px; height: 32px; color: var(--primary);"></i>
                <span style="font-size: 0.9rem; font-weight: 700;">UPI QR Code</span>
              </div>
              <div class="payment-radio" id="check-pay-cod" onclick="selectCheckoutPayment('cod')">
                <i data-lucide="truck" style="width: 32px; height: 32px;"></i>
                <span style="font-size: 0.9rem; font-weight: 700;">Cash on Delivery</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Summary -->
        <div>
          <div class="checkout-card">
            <h3>Order Summary</h3>
            <div style="display: flex; flex-direction: column; gap: var(--spacing-sm); margin-bottom: var(--spacing-md);">
              ${window.state.cart.map(c => {
    const p = window.state.inventory.find(item => item.id === c.productId);
    if (!p) return "";
    const price = p.discountPrice || p.price;
    const tempText = c.temp === "chilled" ? " (Chilled)" : "";
    return `
                  <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
                    <span style="max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${p.name}${tempText} <strong>x${c.qty}</strong></span>
                    <span>₹${(price * c.qty).toFixed(2)}</span>
                  </div>
                `;
  }).join("")}
            </div>

            <div style="border-top: 1px solid var(--border-color); padding-top: var(--spacing-sm); display: flex; flex-direction: column; gap: 4px;">
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--text-muted);">
                <span>Subtotal</span><span>₹${totals.subtotal.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--text-muted);">
                <span>Delivery</span><span style="color: var(--success); font-weight: 700;">FREE</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 1.15rem; font-weight: 800; border-top: 1px solid var(--border-color); padding-top: 8px; margin-top: 4px;">
                <span>Total Payable</span><span style="color: var(--primary);">₹${totals.total.toFixed(2)}</span>
              </div>
            </div>

            <button class="btn btn-primary" onclick="processCheckoutFinal()" style="width: 100%; margin-top: var(--spacing-lg);">
              Place Order & Pay
            </button>
            <button class="btn btn-secondary" onclick="window.sendCheckoutWhatsApp()" style="width: 100%; margin-top: var(--spacing-sm); border-color: var(--success); color: var(--success); display: flex; align-items: center; justify-content: center; gap: 8px;">
              <i data-lucide="message-circle" style="width: 16px; height: 16px;"></i> Order via WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Bind local functions globally
  window.selectCheckoutPayment = (mode) => {
    window.checkoutPaymentMode = mode;
    const upi = document.getElementById("check-pay-upi");
    const cod = document.getElementById("check-pay-cod");

    if (mode === "upi") {
      upi.classList.add("active");
      cod.classList.remove("active");
    } else {
      upi.classList.remove("active");
      cod.classList.add("active");
    }
  };

  window.checkoutPaymentMode = "upi";
}

window.processCheckoutFinal = () => {
  const totals = getCartTotals();
  const address = document.getElementById("check-address").value.trim();
  const phone = document.getElementById("check-phone").value.trim();

  if (address.length === 0 || phone.length === 0) {
    alert("Please fill in the delivery address and phone number.");
    return;
  }

  // UPI payment simulation
  if (window.checkoutPaymentMode === "upi") {
    const modalContent = document.getElementById("global-modal-content");
    const overlay = document.getElementById("global-modal-overlay");

    modalContent.innerHTML = `
      <div style="text-align: center;">
        <h2 style="font-size: 1.3rem; font-weight: 800; margin-bottom: var(--spacing-sm); color: var(--primary);">Scan QR Code to Pay</h2>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: var(--spacing-md);">Open your favorite UPI App (BHIM, Google Pay, PhonePe, Paytm) to scan.</p>
        
        <div style="background: white; width: 160px; height: 160px; margin: 0 auto var(--spacing-md) auto; padding: 10px; border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: center;">
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <rect x="0" y="0" width="25" height="25" fill="black"/>
            <rect x="5" y="5" width="15" height="15" fill="white"/>
            <rect x="0" y="75" width="25" height="25" fill="black"/>
            <rect x="5" y="80" width="15" height="15" fill="white"/>
            <rect x="75" y="0" width="25" height="25" fill="black"/>
            <rect x="80" y="5" width="15" height="15" fill="white"/>
            <rect x="35" y="35" width="30" height="30" fill="black"/>
            <rect x="40" y="40" width="20" height="20" fill="white"/>
            <rect x="15" y="40" width="10" height="15" fill="black"/>
            <rect x="55" y="10" width="10" height="15" fill="black"/>
            <rect x="55" y="75" width="20" height="10" fill="black"/>
          </svg>
        </div>

        <div style="font-size: 1.5rem; font-weight: 800; margin-bottom: var(--spacing-sm);">₹${totals.total.toFixed(2)}</div>
        
        <div id="checkout-upi-timer-text" style="font-size: 0.85rem; color: var(--text-muted); font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px;">
          <div class="skeleton" style="width: 14px; height: 14px; border-radius: 50%;"></div>
          <span>Waiting for transaction authorization (Auto-paying in 3s)...</span>
        </div>
      </div>
    `;

    overlay.classList.add("open");

    // Simulate auto authorization after 3.5 seconds
    let sec = 3;
    const interval = setInterval(() => {
      sec--;
      const text = document.getElementById("checkout-upi-timer-text");
      if (text) {
        text.innerHTML = `<div class="skeleton" style="width: 14px; height: 14px; border-radius: 50%;"></div><span>Waiting for transaction authorization (Auto-paying in ${sec}s)...</span>`;
      }

      if (sec <= 0) {
        clearInterval(interval);
        finalizeOnlineOrder("UPI");
      }
    }, 1000);

  } else {
    // COD finalization
    finalizeOnlineOrder("COD");
  }
};

function finalizeOnlineOrder(method) {
  const totals = getCartTotals();
  const orderId = "ORD-" + Math.floor(10000 + Math.random() * 90000);
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });

  const name = document.getElementById("check-name") ? document.getElementById("check-name").value.trim() : (window.state.user ? window.state.user.name : "Customer");
  const phone = document.getElementById("check-phone") ? document.getElementById("check-phone").value.trim() : (window.state.user ? window.state.user.phone : "9415552992");
  const address = document.getElementById("check-address") ? document.getElementById("check-address").value.trim() : (window.state.user ? window.state.user.address : "Devari Bazar Store Pickup");

  // 1. Create order object
  const newOrder = {
    id: orderId,
    date: dateStr,
    time: timeStr,
    timestamp: now.getTime(),
    total: totals.total,
    status: "Pending",
    name: name,
    phone: phone,
    address: address,
    paymentMethod: method === "upi" ? "UPI QR Code" : "Cash on Delivery (COD)",
    items: window.state.cart.map(c => {
      const p = window.state.inventory.find(item => item.id === c.productId);
      return {
        name: p ? p.name : "Item",
        qty: c.qty,
        temp: c.temp || "regular",
        price: p ? (p.discountPrice || p.price) : 0
      };
    })
  };

  // 2. Adjust inventories
  window.state.cart.forEach(c => {
    const p = window.state.inventory.find(item => item.id === c.productId);
    if (p) {
      p.stock = Math.max(0, p.stock - c.qty);
      if (window.DB) {
        window.DB.saveProduct(p).catch(err => console.warn("Stock sync error:", err));
      }
    }
  });

  // 3. Add to Orders List and Persist
  if (!window.state.orders) window.state.orders = [];
  window.state.orders.unshift(newOrder);
  localStorage.setItem("palbasket_orders", JSON.stringify(window.state.orders));

  if (window.DB) {
    window.DB.saveOrder(newOrder).catch(err => console.warn("DB save order error:", err));
  }

  const newTransaction = {
    id: "TXN-" + Math.floor(100000 + Math.random() * 900000),
    date: dateStr,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    itemsCount: window.state.cart.reduce((sum, c) => sum + c.qty, 0),
    total: totals.total,
    type: "Online",
    paymentMethod: method
  };
  window.state.sales.unshift(newTransaction);

  // Accrue loyalty points
  const pointsEarned = Math.floor(totals.total / 10);
  window.state.user.loyaltyPoints += pointsEarned;

  // Save order id for display
  const finalOrderId = orderId;

  // 4. Reset Cart
  window.state.cart = [];
  window.state.couponApplied = false;

  // Close drawer if open
  document.getElementById("cart-drawer-container").classList.remove("open");
  document.getElementById("cart-overlay").classList.remove("open");
  updateCartBadge();

  // 5. Success screen inside modal
  const modalContent = document.getElementById("global-modal-content");
  const overlay = document.getElementById("global-modal-overlay");

  modalContent.innerHTML = `
    <div style="text-align: center; padding: var(--spacing-sm);">
      <i data-lucide="check-circle" style="width: 64px; height: 64px; color: var(--success); margin: 0 auto var(--spacing-md) auto;"></i>
      <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: var(--spacing-xs);">Order Placed Successfully!</h2>
      <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: var(--spacing-md);">Your invoice ID is <strong>${finalOrderId}</strong>. Loyalty points added: <strong>+${pointsEarned} pts</strong>.</p>
      
      <div style="background: var(--bg-surface-hover); padding: var(--spacing-md); border-radius: var(--radius-sm); font-size: 0.85rem; text-align: left; margin-bottom: var(--spacing-lg); line-height: 1.4;">
        <strong>Delivery Estimate:</strong> 25-35 minutes<br>
        <strong>Address:</strong> ${window.state.user.address}<br>
        <strong>Loyalty points balance:</strong> ${window.state.user.loyaltyPoints} points
      </div>

      <div style="display: flex; gap: var(--spacing-md);">
        <button class="btn btn-secondary" style="flex: 1;" onclick="document.getElementById('global-modal-overlay').classList.remove('open'); navigateView('home');">Back to Shop</button>
        <button class="btn btn-primary" style="flex: 1;" onclick="document.getElementById('global-modal-overlay').classList.remove('open'); navigateView('tracker', '${finalOrderId}');">
          <i data-lucide="map-pin"></i> Track Order
        </button>
      </div>
    </div>
  `;

  overlay.classList.add("open");
  if (window.lucide) window.lucide.createIcons();
}

window.sendCheckoutWhatsApp = () => {
  if (window.state.cart.length === 0) {
    showToast("Your cart is empty!", "warning");
    return;
  }

  const totals = getCartTotals();
  let itemsStr = "";
  window.state.cart.forEach(c => {
    const p = window.state.inventory.find(item => item.id === c.productId);
    if (p) {
      itemsStr += `- ${p.name} x${c.qty}\n`;
    }
  });

  const message = `Namaste Pal Grocery!\n\nI want to place an order:\n\n${itemsStr}\nTotal Amount: ₹${totals.total.toFixed(2)}\n\nDelivery Address: ${window.state.user.address}\nPhone: ${window.state.user.phone}`;
  const encodedText = encodeURIComponent(message);

  window.open(`https://wa.me/${window.SHOP_CONFIG.phone}?text=${encodedText}`, "_blank");
};
