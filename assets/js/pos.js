// PAL GROCERY POS Billing Terminal Logic

class KiranaPOS {
  constructor() {
    this.posCart = [];
    this.paymentMethod = "cash";
    this.receivedAmount = 0;
  }

  // Add an item to the active cashier bill
  addToBill(productId, qty = 1) {
    const product = window.state.inventory.find(p => p.id === productId);
    if (!product) return;

    if (product.stock < qty) {
      alert(`Cannot add. Only ${product.stock} units available in inventory.`);
      return;
    }

    const existingItem = this.posCart.find(item => item.productId === productId);
    if (existingItem) {
      if (product.stock < existingItem.qty + qty) {
        alert(`Cannot add. Exceeds available stock (${product.stock}).`);
        return;
      }
      existingItem.qty += qty;
    } else {
      this.posCart.push({
        productId: productId,
        name: product.name,
        price: product.discountPrice || product.price,
        qty: qty
      });
    }

    this.renderPosBill();
  }

  // Remove or reduce item in active cashier bill
  updateBillQty(productId, qty) {
    const item = this.posCart.find(item => item.productId === productId);
    if (!item) return;

    const product = window.state.inventory.find(p => p.id === productId);

    if (qty <= 0) {
      this.posCart = this.posCart.filter(item => item.productId !== productId);
    } else {
      if (product && product.stock < qty) {
        alert(`Exceeds available stock (${product.stock}).`);
        return;
      }
      item.qty = qty;
    }
    this.renderPosBill();
  }

  // Calculate billing values
  getBillTotals() {
    let subtotal = 0;
    this.posCart.forEach(item => {
      subtotal += item.price * item.qty;
    });
    const tax = subtotal * 0.18; // 18% GST standard in India for processed retail
    const total = subtotal + tax;
    return { subtotal, tax, total };
  }

  // Render the cashier bill column in POS page
  renderPosBill() {
    const billContainer = document.getElementById("pos-bill-items-list");
    if (!billContainer) return;

    if (this.posCart.length === 0) {
      billContainer.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
          <i data-lucide="scan-barcode" style="width: 48px; height: 48px; margin-bottom: 1rem; opacity: 0.5;"></i>
          <p style="font-weight: 600;">Active Bill is Empty</p>
          <p style="font-size: 0.8rem; margin-top: 0.25rem;">Scan barcodes or select products on the left to start billing.</p>
        </div>
      `;
      // Clear totals too
      document.getElementById("pos-subtotal-val").textContent = "₹0.00";
      document.getElementById("pos-tax-val").textContent = "₹0.00";
      document.getElementById("pos-total-val").textContent = "₹0.00";
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    billContainer.innerHTML = this.posCart.map(item => `
      <div class="cart-item" style="border-radius: var(--radius-sm); margin-bottom: var(--spacing-sm); padding: var(--spacing-sm);">
        <div class="cart-item-details">
          <span class="cart-item-title">${item.name}</span>
          <span class="cart-item-price">₹${item.price.toFixed(2)} each</span>
          <div class="cart-item-actions" style="margin-top: 4px;">
            <div class="qty-selector" style="border-radius: var(--radius-sm);">
              <button class="qty-btn" style="width: 28px; height: 28px;" onclick="window.posSystem.updateBillQty('${item.productId}', ${item.qty - 1})">-</button>
              <span class="qty-val" style="width: 28px; font-size: 0.85rem;">${item.qty}</span>
              <button class="qty-btn" style="width: 28px; height: 28px;" onclick="window.posSystem.updateBillQty('${item.productId}', ${item.qty + 1})">+</button>
            </div>
            <span style="font-weight: 700; font-size: 0.9rem;">₹${(item.price * item.qty).toFixed(2)}</span>
          </div>
        </div>
      </div>
    `).join("");

    const totals = this.getBillTotals();
    document.getElementById("pos-subtotal-val").textContent = `₹${totals.subtotal.toFixed(2)}`;
    document.getElementById("pos-tax-val").textContent = `₹${totals.tax.toFixed(2)}`;
    document.getElementById("pos-total-val").textContent = `₹${totals.total.toFixed(2)}`;
    document.getElementById("pos-checkout-btn").disabled = false;
  }

  // Handle final invoice submission modal trigger
  checkoutPosBill() {
    if (this.posCart.length === 0) return;

    const totals = this.getBillTotals();
    const modalContent = document.getElementById("global-modal-content");
    const overlay = document.getElementById("global-modal-overlay");

    this.paymentMethod = "cash";
    this.receivedAmount = Math.ceil(totals.total);

    modalContent.innerHTML = `
      <div style="text-align: center;">
        <h2 style="font-size: 1.4rem; font-weight: 800; margin-bottom: var(--spacing-md); display: flex; align-items: center; justify-content: center; gap: 8px; color: var(--primary);">
          <i data-lucide="receipt"></i> Checkout POS Invoice
        </h2>
        <div style="font-size: 1.8rem; font-weight: 800; margin-bottom: var(--spacing-lg);">Total Due: ₹${totals.total.toFixed(2)}</div>
        
        <div class="payment-options" style="margin-bottom: var(--spacing-lg);">
          <div class="payment-radio active" id="pos-pay-cash" onclick="window.posSystem.selectPosPayment('cash')">
            <i data-lucide="banknote" style="width: 32px; height: 32px;"></i>
            <span style="font-size: 0.9rem; font-weight: 700;">Cash</span>
          </div>
          <div class="payment-radio" id="pos-pay-upi" onclick="window.posSystem.selectPosPayment('upi')">
            <i data-lucide="qr-code" style="width: 32px; height: 32px;"></i>
            <span style="font-size: 0.9rem; font-weight: 700;">UPI QR Scan</span>
          </div>
        </div>

        <div id="pos-cash-calculator">
          <div class="form-field" style="max-width: 300px; margin: 0 auto var(--spacing-md) auto;">
            <label for="pos-amount-received" style="text-align: left;">Cash Received (₹)</label>
            <input type="number" id="pos-amount-received" value="${this.receivedAmount}" oninput="window.posSystem.calculatePosChange()" style="font-size: 1.2rem; text-align: center; font-weight: 800; padding: 0.5rem;">
          </div>
          
          <div style="display: flex; gap: var(--spacing-sm); justify-content: center; margin-bottom: var(--spacing-md);">
            <button class="btn btn-secondary btn-sm" onclick="window.posSystem.setPosCashAmount(${Math.ceil(totals.total)})">Exact</button>
            <button class="btn btn-secondary btn-sm" onclick="window.posSystem.setPosCashAmount(100)">₹100</button>
            <button class="btn btn-secondary btn-sm" onclick="window.posSystem.setPosCashAmount(200)">₹200</button>
            <button class="btn btn-secondary btn-sm" onclick="window.posSystem.setPosCashAmount(500)">₹500</button>
            <button class="btn btn-secondary btn-sm" onclick="window.posSystem.setPosCashAmount(1000)">₹1000</button>
          </div>

          <div id="pos-change-due-box" style="background: var(--bg-surface-hover); padding: var(--spacing-md); border-radius: var(--radius-sm); margin-bottom: var(--spacing-lg);">
            <div style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">CHANGE DUE</div>
            <div id="pos-change-due-val" style="font-size: 1.5rem; font-weight: 800; color: var(--success);">₹0.00</div>
          </div>
        </div>

        <div id="pos-upi-sim-box" style="display: none; background: var(--bg-surface-hover); padding: var(--spacing-lg); border-radius: var(--radius-md); margin-bottom: var(--spacing-lg); text-align: center;">
          <div style="background: white; width: 140px; height: 140px; margin: 0 auto var(--spacing-md) auto; padding: 10px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border-color);">
            <!-- Mock dynamic QR code vector -->
            <svg viewBox="0 0 100 100" width="100%" height="100%">
              <rect x="0" y="0" width="25" height="25" fill="black"/>
              <rect x="5" y="5" width="15" height="15" fill="white"/>
              <rect x="0" y="75" width="25" height="25" fill="black"/>
              <rect x="5" y="80" width="15" height="15" fill="white"/>
              <rect x="75" y="0" width="25" height="25" fill="black"/>
              <rect x="80" y="5" width="15" height="15" fill="white"/>
              <rect x="35" y="35" width="30" height="30" fill="black"/>
              <rect x="40" y="40" width="20" height="20" fill="white"/>
              <rect x="42" y="42" width="16" height="16" fill="black"/>
              <rect x="15" y="40" width="10" height="15" fill="black"/>
              <rect x="55" y="10" width="10" height="15" fill="black"/>
              <rect x="55" y="75" width="20" height="10" fill="black"/>
              <rect x="85" y="40" width="10" height="25" fill="black"/>
            </svg>
          </div>
          <div id="pos-upi-timer-text" style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted); display: flex; align-items: center; justify-content: center; gap: 6px;">
            <div class="skeleton" style="width: 14px; height: 14px; border-radius: 50%;"></div>
            <span>Waiting for Customer Scan (Auto-paying in 3s)...</span>
          </div>
        </div>

        <div style="display: flex; gap: var(--spacing-md);">
          <button class="btn btn-secondary" style="flex: 1;" onclick="document.getElementById('global-modal-overlay').classList.remove('open')">Cancel</button>
          <button class="btn btn-primary" id="pos-confirm-payment-btn" style="flex: 1;" onclick="window.posSystem.finalizePosBill()">
            <i data-lucide="check-circle-2"></i> Confirm Payment
          </button>
        </div>
      </div>
    `;

    overlay.classList.add("open");
    this.calculatePosChange();
    if (window.lucide) window.lucide.createIcons();
  }

  // Trigger payment selection in modal
  selectPosPayment(method) {
    this.paymentMethod = method;
    const cashBtn = document.getElementById("pos-pay-cash");
    const upiBtn = document.getElementById("pos-pay-upi");
    const cashBox = document.getElementById("pos-cash-calculator");
    const upiBox = document.getElementById("pos-upi-sim-box");
    const confirmBtn = document.getElementById("pos-confirm-payment-btn");

    if (method === "cash") {
      cashBtn.classList.add("active");
      upiBtn.classList.remove("active");
      cashBox.style.display = "block";
      upiBox.style.display = "none";
      confirmBtn.disabled = false;
    } else {
      cashBtn.classList.remove("active");
      upiBtn.classList.add("active");
      cashBox.style.display = "none";
      upiBox.style.display = "block";
      confirmBtn.disabled = true;

      // Start automatic payment simulation timer (3 seconds)
      let secondsLeft = 3;
      const upiTimerText = document.getElementById("pos-upi-timer-text");
      
      const upiInterval = setInterval(() => {
        secondsLeft--;
        if (upiTimerText) {
          upiTimerText.innerHTML = `<div class="skeleton" style="width: 14px; height: 14px; border-radius: 50%;"></div><span>Waiting for Customer Scan (Auto-paying in ${secondsLeft}s)...</span>`;
        }
        
        if (secondsLeft <= 0) {
          clearInterval(upiInterval);
          if (document.getElementById("global-modal-overlay").classList.contains("open") && this.paymentMethod === "upi") {
            upiTimerText.innerHTML = `<i data-lucide="check-circle-2" style="color: var(--success); width: 18px; height: 18px;"></i><span style="color: var(--success); font-weight: 800;">Payment Received Successfully!</span>`;
            confirmBtn.disabled = false;
            if (window.lucide) window.lucide.createIcons();
          }
        }
      }, 1000);
      
      // Store interval reference to clear if user cancels
      this.upiIntervalRef = upiInterval;
    }
  }

  setPosCashAmount(amount) {
    const input = document.getElementById("pos-amount-received");
    if (input) {
      input.value = amount;
      this.calculatePosChange();
    }
  }

  calculatePosChange() {
    const input = document.getElementById("pos-amount-received");
    const changeVal = document.getElementById("pos-change-due-val");
    if (!input || !changeVal) return;

    this.receivedAmount = parseFloat(input.value) || 0;
    const totals = this.getBillTotals();
    const change = this.receivedAmount - totals.total;

    if (change < 0) {
      changeVal.textContent = `-₹${Math.abs(change).toFixed(2)}`;
      changeVal.style.color = "var(--danger)";
      document.getElementById("pos-confirm-payment-btn").disabled = true;
    } else {
      changeVal.textContent = `₹${change.toFixed(2)}`;
      changeVal.style.color = "var(--success)";
      document.getElementById("pos-confirm-payment-btn").disabled = false;
    }
  }

  // Complete billing transaction
  finalizePosBill() {
    if (this.posCart.length === 0) return;

    // Clear UPI interval if running
    if (this.upiIntervalRef) {
      clearInterval(this.upiIntervalRef);
    }

    const totals = this.getBillTotals();
    const transactionId = "TXN-" + Math.floor(100000 + Math.random() * 900000);
    const dateStr = new Date().toLocaleString();

    // 1. Deduct Inventory Stock
    this.posCart.forEach(item => {
      const product = window.state.inventory.find(p => p.id === item.productId);
      if (product) {
        product.stock = Math.max(0, product.stock - item.qty);
      }
    });

    // 2. Append transaction to sales analytics
    const newTransaction = {
      id: transactionId,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      itemsCount: this.posCart.reduce((sum, item) => sum + item.qty, 0),
      total: totals.total,
      type: "POS Store",
      paymentMethod: this.paymentMethod.toUpperCase()
    };
    
    window.state.sales.unshift(newTransaction);
    window.state.ordersCount += 1;
    window.state.totalSalesRevenue += totals.total;

    // Save billing data locally for receipt printing
    this.lastTransactionDetails = {
      id: transactionId,
      date: dateStr,
      items: [...this.posCart],
      subtotal: totals.subtotal,
      tax: totals.tax,
      total: totals.total,
      paymentMethod: this.paymentMethod.toUpperCase(),
      received: this.receivedAmount,
      change: Math.max(0, this.receivedAmount - totals.total)
    };

    // Render receipt template inside invisible div for printing
    this.injectReceiptHtml();

    // 3. Clear POS Cart
    this.posCart = [];
    this.renderPosBill();

    // 4. Update Admin Dashboard layout immediately if active
    if (window.state.currentView === "admin") {
      window.adminDashboard.renderActiveAdminPane();
    }

    // 5. Update modal to print receipt preview
    const modalContent = document.getElementById("global-modal-content");
    modalContent.innerHTML = `
      <div style="text-align: center;">
        <i data-lucide="check-circle-2" style="width: 64px; height: 64px; color: var(--success); margin: 0 auto var(--spacing-md) auto;"></i>
        <h2 style="font-size: 1.4rem; font-weight: 800; margin-bottom: var(--spacing-xs);">POS Bill Generated</h2>
        <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: var(--spacing-lg);">Transaction ID: ${transactionId}</p>
        
        <div style="border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: var(--spacing-md); text-align: left; background: var(--bg-base); font-family: monospace; font-size: 0.8rem; margin-bottom: var(--spacing-lg);">
          <div style="text-align: center; font-weight: 800; margin-bottom: 4px;">PAL GROCERY SMART BILL</div>
          <div style="text-align: center; margin-bottom: var(--spacing-sm);">Devari Bazaar, Haliya, Mirzapur, UP 231211</div>
          <hr style="border-top: 1px dashed var(--border-color); margin-bottom: 4px;">
          <div>ID: ${transactionId}</div>
          <div style="margin-bottom: var(--spacing-sm);">Date: ${dateStr}</div>
          <table style="width: 100%; border-collapse: collapse; font-size: 0.75rem;">
            <thead>
              <tr style="border-bottom: 1px dashed var(--border-color);">
                <th style="text-align: left;">Item</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${this.lastTransactionDetails.items.map(i => `
                <tr>
                  <td>${i.name}</td>
                  <td style="text-align: center;">${i.qty}</td>
                  <td style="text-align: right;">₹${(i.price * i.qty).toFixed(2)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          <hr style="border-top: 1px dashed var(--border-color); margin: var(--spacing-sm) 0;">
          <div style="display: flex; justify-content: space-between;"><span>Subtotal</span><span>₹${totals.subtotal.toFixed(2)}</span></div>
          <div style="display: flex; justify-content: space-between;"><span>GST (18%)</span><span>₹${totals.tax.toFixed(2)}</span></div>
          <div style="display: flex; justify-content: space-between; font-weight: 800;"><span>GRAND TOTAL</span><span>₹${totals.total.toFixed(2)}</span></div>
          <div style="display: flex; justify-content: space-between;"><span>Payment</span><span>${this.lastTransactionDetails.paymentMethod}</span></div>
          <hr style="border-top: 1px dashed var(--border-color); margin: var(--spacing-sm) 0;">
          <div style="text-align: center; font-weight: 700; font-size: 0.7rem;">THANK YOU FOR SHOPPING!</div>
        </div>

        <div style="display: flex; gap: var(--spacing-md);">
          <button class="btn btn-secondary" style="flex: 1;" onclick="document.getElementById('global-modal-overlay').classList.remove('open')">Close</button>
          <button class="btn btn-primary" style="flex: 1;" onclick="window.print()">
            <i data-lucide="printer"></i> Print Invoice
          </button>
        </div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
  }

  injectReceiptHtml() {
    let receiptDiv = document.getElementById("print-receipt-section");
    if (!receiptDiv) {
      receiptDiv = document.createElement("div");
      receiptDiv.id = "print-receipt-section";
      receiptDiv.style.display = "none";
      document.body.appendChild(receiptDiv);
    }

    const t = this.lastTransactionDetails;
    receiptDiv.innerHTML = `
      <div style="text-align: center; font-weight: 800; font-size: 1.1rem; margin-bottom: 2px;">PAL GROCERY</div>
      <div style="text-align: center; font-size: 0.8rem; margin-bottom: 10px;">Devari Bazaar Kirana, Haliya, Mirzapur<br>Phone: +91 94155 52992</div>
      <div style="font-size: 0.8rem; margin-bottom: 6px;">
        <strong>Invoice ID:</strong> ${t.id}<br>
        <strong>Date:</strong> ${t.date}<br>
        <strong>Operator:</strong> Vishal (Cashier)
      </div>
      <hr style="border-top: 1px dashed #000; margin: 6px 0;">
      <table style="width: 100%; font-size: 0.8rem; border-collapse: collapse;">
        <thead>
          <tr style="border-bottom: 1px dashed #000; text-align: left;">
            <th style="padding-bottom: 4px;">Item</th>
            <th style="text-align: center; padding-bottom: 4px;">Qty</th>
            <th style="text-align: right; padding-bottom: 4px;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${t.items.map(i => `
            <tr>
              <td style="padding: 2px 0;">${i.name}</td>
              <td style="text-align: center; padding: 2px 0;">${i.qty}</td>
              <td style="text-align: right; padding: 2px 0;">₹${(i.price * i.qty).toFixed(2)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
      <hr style="border-top: 1px dashed #000; margin: 6px 0;">
      <div style="font-size: 0.8rem; display: flex; justify-content: space-between; margin-bottom: 2px;">
        <span>Subtotal:</span><span>₹${t.subtotal.toFixed(2)}</span>
      </div>
      <div style="font-size: 0.8rem; display: flex; justify-content: space-between; margin-bottom: 2px;">
        <span>GST (18%):</span><span>₹${t.tax.toFixed(2)}</span>
      </div>
      <div style="font-size: 0.9rem; font-weight: 800; display: flex; justify-content: space-between; margin-bottom: 4px;">
        <span>GRAND TOTAL:</span><span>₹${t.total.toFixed(2)}</span>
      </div>
      <hr style="border-top: 1px dashed #000; margin: 6px 0;">
      <div style="font-size: 0.8rem;">
        <strong>Paid via:</strong> ${t.paymentMethod}<br>
        <strong>Cash Received:</strong> ₹${t.received.toFixed(2)}<br>
        <strong>Change Given:</strong> ₹${t.change.toFixed(2)}
      </div>
      <hr style="border-top: 1px dashed #000; margin: 8px 0 4px 0;">
      <div style="text-align: center; font-size: 0.75rem; font-weight: bold;">*** THANK YOU ***</div>
      <div style="text-align: center; font-size: 0.65rem; color: #555;">Support local Kiranas. Download Pal Grocery App.</div>
    `;
  }
}

// Global Export
window.posSystem = new KiranaPOS();
