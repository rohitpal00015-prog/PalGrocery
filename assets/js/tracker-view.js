// Pal Grocery - Order Tracker View Module
// connected to PHP MySQL Backend for live updates

function renderOrderTracker(viewport, orderId) {
  const isHindi = window.SHOP_CONFIG.language === "hi";
  
  // Clean order ID format
  if (orderId && orderId.startsWith("#")) {
    orderId = orderId.slice(1);
  }

  // ─── Asynchronous DB Fetch if not in state ─────────────────
  let o = window.state.orders.find(item => item.id === orderId);
  
  if (!o && window.DB) {
    viewport.innerHTML = `
      <div class="container fade-in" style="padding: 6rem 0; text-align: center;">
        <div style="width: 40px; height: 40px; border: 3px solid var(--border-color); border-top-color: var(--primary); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1.5rem auto;"></div>
        <p style="color: var(--text-muted); font-size: 0.95rem; font-weight: 600;">
          ${isHindi ? "डेटाबेस से ऑर्डर लोड हो रहा है..." : "Fetching live order status..."}
        </p>
      </div>
    `;
    
    window.DB.loadOrder(orderId).then(fetchedOrder => {
      if (fetchedOrder) {
        window.state.orders.push(fetchedOrder);
        renderOrderTracker(viewport, orderId);
      } else {
        viewport.innerHTML = `
          <div class="container text-center" style="padding: 6rem 0;">
            <div style="background: rgba(239, 68, 68, 0.1); width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem auto;">
              <i data-lucide="alert-triangle" style="width: 32px; height: 32px; color: var(--danger);"></i>
            </div>
            <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem;">${isHindi ? "ऑर्डर नहीं मिला!" : "Order Not Found!"}</h2>
            <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 2rem;">
              ${isHindi ? "ऑर्डर आईडी " + orderId + " डेटाबेस में नहीं मिली।" : "Order ID " + orderId + " could not be found in our database."}
            </p>
            <button class="btn btn-primary" onclick="navigateView('home')">${isHindi ? "मुख्य पृष्ठ" : "Back to Storefront"}</button>
          </div>
        `;
        if (window.lucide) window.lucide.createIcons();
      }
    });
    return;
  }

  // Fallback default
  if (!o) {
    o = {
      id: orderId || "ORD-00000",
      date: new Date().toISOString().split("T")[0],
      total: 0,
      status: "Placed",
      items: [],
      address: window.state.user.address,
      phone: window.state.user.phone,
      name: window.state.user.name
    };
  }

  // Determine stage mapping
  // Stages: 1=Placed, 2=Packed, 3=Shipped, 4=Delivered
  let currentStage = 1;
  const statusStr = (o.status || "Placed").toLowerCase();
  
  if (statusStr === "placed" || statusStr === "pending" || statusStr === "pending estimation") {
    currentStage = 1;
  } else if (statusStr === "packed" || statusStr === "estimated") {
    currentStage = 2;
  } else if (statusStr === "shipped" || statusStr === "out for delivery") {
    currentStage = 3;
  } else if (statusStr === "delivered") {
    currentStage = 4;
  }

  // Language mapping
  const statusLabels = {
    "placed": isHindi ? "आर्डर प्राप्त हुआ" : "Order Placed",
    "pending": isHindi ? "लंबित" : "Pending",
    "pending estimation": isHindi ? "मूल्यांकन लंबित" : "Bill Pending",
    "shipped": isHindi ? "रास्ते में है" : "Out for Delivery",
    "delivered": isHindi ? "डिलीवर हो गया" : "Delivered Successfully"
  };
  
  const displayStatus = statusLabels[statusStr] || o.status;

  // Invoice Items details
  let itemsListHtml = "";
  if (o.isParchi) {
    itemsListHtml = `
      <div style="background: var(--bg-base); padding: var(--spacing-md); border-radius: var(--radius-sm); border: 1px dashed var(--primary); margin-top: 10px;">
        <div style="font-weight: 700; font-size: 0.85rem; color: var(--primary); margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
          <i data-lucide="file-text" style="width: 16px; height: 16px;"></i>
          ${isHindi ? "अपलोड की गई पर्ची सूची" : "Uploaded Parchi Text List"}
        </div>
        <div style="font-family: monospace; white-space: pre-wrap; font-size: 0.9rem; line-height: 1.5; color: var(--text-main);">
          ${o.itemsText || o.notes || "No items text"}
        </div>
      </div>
    `;
  } else if (o.items && o.items.length > 0) {
    itemsListHtml = `
      <div style="margin-top: 15px; border-top: 1px solid var(--border-color); padding-top: 10px;">
        <div style="font-weight: 700; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 8px;">
          ${isHindi ? "सामानों की सूची" : "Ordered Items"}
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${o.items.map(item => `
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
              <span>${item.name} <strong>x${item.qty}</strong></span>
              <span style="font-weight: 700;">₹${(item.price * item.qty).toFixed(2)}</span>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  // Refresh status button action
  window.refreshTrackerStatus = (btn) => {
    btn.classList.add("btn-loading");
    btn.innerHTML = `<i data-lucide="refresh-cw" class="inline-icon" style="animation: spin 1s linear infinite; margin-right: 8px;"></i> ${isHindi ? "चेक किया जा रहा है..." : "Checking..."}`;
    
    if (window.DB) {
      window.DB.loadOrder(orderId).then(updated => {
        setTimeout(() => {
          btn.classList.remove("btn-loading");
          if (updated) {
            // Update state
            const idx = window.state.orders.findIndex(ord => ord.id === orderId);
            if (idx !== -1) {
              window.state.orders[idx] = updated;
            } else {
              window.state.orders.push(updated);
            }
            showToast(isHindi ? "लेटेस्ट आर्डर स्टेटस लोड हुआ!" : "Status updated from server!", "success");
            renderOrderTracker(viewport, orderId);
          } else {
            btn.innerHTML = `<i data-lucide="refresh-cw"></i> ${isHindi ? "स्टेटस रिफ्रेश करें" : "Refresh Status"}`;
            if (window.lucide) window.lucide.createIcons();
            showToast(isHindi ? "स्थिति अपडेट नहीं की जा सकी।" : "Could not refresh status.", "warning");
          }
        }, 800);
      });
    } else {
      setTimeout(() => {
        btn.classList.remove("btn-loading");
        btn.innerHTML = `<i data-lucide="refresh-cw"></i> ${isHindi ? "स्टेटस रिफ्रेश करें" : "Refresh Status"}`;
        if (window.lucide) window.lucide.createIcons();
        showToast(isHindi ? "ऑफ़लाइन मोड (कोई सर्वर नहीं)" : "Offline mode (No connection)", "info");
      }, 500);
    }
  };

  const isParchiPending = o.isParchi && o.total === 0;

  viewport.innerHTML = `
    <div class="container fade-in" style="padding-bottom: 4rem; max-width: 680px; margin: 0 auto;">
      <!-- Tracker Header Card -->
      <div style="margin-top: var(--spacing-lg); text-align: center; background: var(--bg-surface); padding: var(--spacing-lg); border-radius: var(--radius-lg); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
          <span class="badge badge-primary" style="font-weight:800; font-size: 0.75rem; letter-spacing:0.5px;">ORDER ID: ${o.id}</span>
          <span style="font-size: 0.8rem; color: var(--text-muted); font-weight:700;">Ordered: ${o.date || o.orderDate || ""}</span>
        </div>
        
        <h2 style="font-size: 1.7rem; font-weight: 900; margin: 8px 0; color: var(--text-main); display: flex; align-items: center; justify-content: center; gap: 10px;">
          <i data-lucide="package-search" style="color: var(--primary); width: 28px; height: 28px;"></i>
          ${isHindi ? "डिलिवरी ट्रैकिंग" : "Delivery Tracking"}
        </h2>
        
        <div style="margin-top: 15px; display: flex; align-items: center; justify-content: center; gap: 8px; flex-wrap: wrap;">
          <span style="font-size: 0.9rem; color: var(--text-muted);">${isHindi ? "वर्तमान स्थिति:" : "Status:"}</span>
          <span class="badge" style="background: ${currentStage === 4 ? 'var(--success-light)' : 'var(--warning-light)'}; color: ${currentStage === 4 ? 'var(--success)' : 'var(--warning)'}; font-size: 0.9rem; font-weight: 800; padding: 6px 16px; border-radius: 30px;">
            ${displayStatus}
          </span>
        </div>

        <!-- Live Delivery ETA Countdown Timer Card -->
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border-radius: var(--radius-md); padding: 14px; margin-top: 16px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.25);">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="background: rgba(255,255,255,0.2); width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
              <i data-lucide="clock" style="width: 20px; height: 20px; color: white;"></i>
            </div>
            <div style="text-align: left;">
              <span style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.9; font-weight: 700; display: block;">
                ${isHindi ? "अनुमानित डिलीवरी समय (ETA)" : "Estimated Delivery ETA"}
              </span>
              <span style="font-size: 0.85rem; font-weight: 800;">
                ${isHindi ? "30 मिनट की सुपरफास्ट होम डिलीवरी" : "30-Min Instant Kirana Express"}
              </span>
            </div>
          </div>
          <div style="background: rgba(0,0,0,0.2); padding: 6px 14px; border-radius: 20px; font-weight: 900; font-family: monospace; font-size: 1.15rem; letter-spacing: 1px;" id="tracker-eta-countdown">
            24:18 Mins
          </div>
        </div>

        <div style="margin-top: 15px; display:flex; justify-content:center;">
          <button class="btn btn-secondary btn-sm" onclick="window.refreshTrackerStatus(this)" style="display: flex; align-items: center; gap: 6px; font-weight: 800; font-size: 0.8rem; border-radius: 20px; padding: 6px 16px; border-color: var(--primary); color: var(--primary);">
            <i data-lucide="refresh-cw" style="width: 14px; height: 14px;"></i>
            ${isHindi ? "स्टेटस रिफ्रेश करें" : "Refresh Status"}
          </button>
        </div>
      </div>

      <!-- Live Interactive Progress Timeline -->
      <div class="checkout-card" style="margin-top: var(--spacing-md); padding: 1.8rem var(--spacing-lg);">
        <h3 style="font-size: 1.1rem; font-weight: 800; margin-bottom: 1.5rem; border: none; padding: 0; display:flex; align-items:center; gap:8px;">
          <i data-lucide="route" style="color:var(--primary); width:18px;"></i>
          ${isHindi ? "डिलिवरी का रास्ता" : "Delivery Progress"}
        </h3>

        <!-- Horizontal Line Progress -->
        <div style="display: flex; justify-content: space-between; position: relative; margin-bottom: var(--spacing-xl); padding: 0 10px;">
          <!-- Gray connector line behind -->
          <div style="position: absolute; left: 24px; right: 24px; top: 18px; height: 4px; background: var(--border-color); z-index: 1;"></div>
          <!-- Filled primary connector line depending on stage -->
          <div style="position: absolute; left: 24px; width: ${((currentStage - 1) / 3) * 100}%; top: 18px; height: 4px; background: var(--primary); transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1); z-index: 2;"></div>

          <!-- Step 1: Placed -->
          <div style="display: flex; flex-direction: column; align-items: center; text-align: center; width: 60px; z-index: 3; position: relative;">
            <div style="width: 36px; height: 36px; border-radius: 50%; background: ${currentStage >= 1 ? 'var(--primary)' : 'var(--bg-surface)'}; border: 3px solid ${currentStage >= 1 ? 'var(--primary)' : 'var(--border-color)'}; color: ${currentStage >= 1 ? 'white' : 'var(--text-muted)'}; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem; transition: all 0.3s;">
              <i data-lucide="shopping-bag" style="width: 16px; height: 16px;"></i>
            </div>
            <div style="font-size: 0.72rem; font-weight: 800; margin-top: 8px; color: ${currentStage >= 1 ? 'var(--primary)' : 'var(--text-muted)'};">
              ${isHindi ? "आर्डर मिला" : "Received"}
            </div>
          </div>

          <!-- Step 2: Packed -->
          <div style="display: flex; flex-direction: column; align-items: center; text-align: center; width: 60px; z-index: 3; position: relative;">
            <div style="width: 36px; height: 36px; border-radius: 50%; background: ${currentStage >= 2 ? 'var(--primary)' : 'var(--bg-surface)'}; border: 3px solid ${currentStage >= 2 ? 'var(--primary)' : 'var(--border-color)'}; color: ${currentStage >= 2 ? 'white' : 'var(--text-muted)'}; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem; transition: all 0.3s;">
              <i data-lucide="package-check" style="width: 16px; height: 16px;"></i>
            </div>
            <div style="font-size: 0.72rem; font-weight: 800; margin-top: 8px; color: ${currentStage >= 2 ? 'var(--primary)' : 'var(--text-muted)'};">
              ${isHindi ? "पैक हुआ" : "Packed"}
            </div>
          </div>

          <!-- Step 3: Out for Delivery -->
          <div style="display: flex; flex-direction: column; align-items: center; text-align: center; width: 60px; z-index: 3; position: relative;">
            <div style="width: 36px; height: 36px; border-radius: 50%; background: ${currentStage >= 3 ? 'var(--primary)' : 'var(--bg-surface)'}; border: 3px solid ${currentStage >= 3 ? 'var(--primary)' : 'var(--border-color)'}; color: ${currentStage >= 3 ? 'white' : 'var(--text-muted)'}; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem; transition: all 0.3s;">
              <i data-lucide="truck" style="width: 16px; height: 16px;"></i>
            </div>
            <div style="font-size: 0.72rem; font-weight: 800; margin-top: 8px; color: ${currentStage >= 3 ? 'var(--primary)' : 'var(--text-muted)'};">
              ${isHindi ? "रास्ते में" : "Transit"}
            </div>
          </div>

          <!-- Step 4: Delivered -->
          <div style="display: flex; flex-direction: column; align-items: center; text-align: center; width: 60px; z-index: 3; position: relative;">
            <div style="width: 36px; height: 36px; border-radius: 50%; background: ${currentStage >= 4 ? 'var(--success)' : 'var(--bg-surface)'}; border: 3px solid ${currentStage >= 4 ? 'var(--success)' : 'var(--border-color)'}; color: ${currentStage >= 4 ? 'white' : 'var(--text-muted)'}; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem; transition: all 0.3s;">
              <i data-lucide="home" style="width: 16px; height: 16px;"></i>
            </div>
            <div style="font-size: 0.72rem; font-weight: 800; margin-top: 8px; color: ${currentStage >= 4 ? 'var(--success)' : 'var(--text-muted)'};">
              ${isHindi ? "पहुंच गया" : "Delivered"}
            </div>
          </div>
        </div>

        <!-- Conditional Alerts based on Parchi and Status -->
        ${isParchiPending ? `
          <div style="background: rgba(255, 152, 0, 0.08); border: 1px dashed #ff9800; border-radius: 8px; padding: 12px; margin-top: var(--spacing-md); display: flex; align-items: flex-start; gap: 10px;">
            <i data-lucide="help-circle" style="color: #ff9800; flex-shrink: 0; width: 20px; height: 20px; margin-top: 2px;"></i>
            <div>
              <strong style="color: #e65100; font-size: 0.85rem; display:block; margin-bottom: 2px;">${isHindi ? "दुकानदार से बिल का इंतजार है" : "Waiting for Shop Owner's Bill"}</strong>
              <span style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4; display:block;">
                ${isHindi ? "दुकानदार आपकी भेजी गई पर्ची के सामानों का मूल्यांकन कर रहा है। जल्द ही यहाँ कीमत दिखेगी और डिलीवरी शुरू होगी।" : "The store owner is packing your custom Parchi list. Once finalized, the total bill and transit boy details will show up."}
              </span>
            </div>
          </div>
        ` : ""}

        <!-- Order Information Table -->
        <div style="background: var(--bg-surface-hover); border-radius: var(--radius-md); padding: var(--spacing-md); border: 1px solid var(--border-color); margin-top: 20px; display: flex; flex-direction: column; gap: var(--spacing-sm);">
          <div style="display:flex; justify-content:space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">
            <span style="font-size:0.85rem; color: var(--text-muted); font-weight:600;">${isHindi ? "ग्राहक का नाम" : "Customer Name"}</span>
            <span style="font-size:0.85rem; font-weight:700; color: var(--text-main);">${o.name || o.customerName || "Customer"}</span>
          </div>
          
          <div style="display:flex; justify-content:space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">
            <span style="font-size:0.85rem; color: var(--text-muted); font-weight:600;">${isHindi ? "मोबाइल नंबर" : "Phone Number"}</span>
            <span style="font-size:0.85rem; font-weight:700; color: var(--text-main);">${o.phone || o.customerPhone || "N/A"}</span>
          </div>

          <div style="display:flex; justify-content:space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 8px; flex-wrap:wrap; gap: 8px;">
            <span style="font-size:0.85rem; color: var(--text-muted); font-weight:600;">${isHindi ? "डिलिवरी का पता" : "Delivery Address"}</span>
            <span style="font-size:0.82rem; font-weight:700; color: var(--text-main); text-align:right; max-width: 350px;">${o.address || o.deliveryAddress || "Devari Bazaar, UP"}</span>
          </div>

          <div style="display:flex; justify-content:space-between; padding-top: 4px;">
            <span style="font-size:0.9rem; color: var(--text-main); font-weight:800;">${isHindi ? "कुल देय राशि" : "Total Payable Bill"}</span>
            <span style="font-size:1.1rem; font-weight:900; color: var(--primary);">
              ${isParchiPending ? (isHindi ? "बिल बन रहा है..." : "Calculating...") : "₹" + o.total.toFixed(2)}
            </span>
          </div>
        </div>

        <!-- Items Display Section -->
        ${itemsListHtml}
      </div>

      <!-- Action Buttons -->
      <div style="display: flex; gap: var(--spacing-md); margin-top: var(--spacing-lg);">
        <button class="btn btn-secondary" style="flex: 1; font-weight: 800;" onclick="navigateView('home')">
          <i data-lucide="shopping-bag" style="width:16px; margin-right:4px;"></i>
          ${isHindi ? "दुकान पर वापस जाएं" : "Back to Shop"}
        </button>
        <button class="btn btn-primary" style="flex: 1; font-weight: 800;" onclick="navigateView('profile')">
          <i data-lucide="history" style="width:16px; margin-right:4px;"></i>
          ${isHindi ? "आर्डर इतिहास" : "Purchase History"}
        </button>
      </div>
    </div>
  `;
  if (window.lucide) window.lucide.createIcons();

  // Start live ETA countdown timer
  if (window.trackerInterval) clearInterval(window.trackerInterval);
  let remainingSeconds = 24 * 60 + 35;
  window.trackerInterval = setInterval(() => {
    remainingSeconds--;
    if (remainingSeconds < 0) remainingSeconds = 0;
    const mins = Math.floor(remainingSeconds / 60);
    const secs = remainingSeconds % 60;
    const timerEl = document.getElementById("tracker-eta-countdown");
    if (timerEl) {
      timerEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')} Mins`;
    }
  }, 1000);
}
