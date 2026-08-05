// Pal Grocery - Real-Time Customer Order Tracking Module

function renderOrderTrackingPage(viewport, params = null) {
  const isHindi = window.SHOP_CONFIG ? window.SHOP_CONFIG.language === "hi" : false;
  let defaultSearch = "";

  if (typeof params === "string") {
    defaultSearch = params;
  } else if (params && params.id) {
    defaultSearch = params.id;
  }

  viewport.innerHTML = `
    <style>
      .tracking-container {
        max-width: 760px;
        margin: 2rem auto 4rem auto;
      }

      .tracking-card {
        background: var(--bg-surface);
        border: 1.5px solid var(--border-color);
        border-radius: 26px;
        padding: 32px;
        box-shadow: 0 12px 35px rgba(0, 0, 0, 0.03);
      }

      .tracking-search-bar {
        display: flex;
        gap: 12px;
        margin-top: 20px;
        margin-bottom: 28px;
        flex-wrap: wrap;
      }

      .tracking-input {
        flex: 1;
        background: var(--bg-surface-hover);
        border: 1.5px solid var(--border-color);
        border-radius: 18px;
        padding: 12px 20px;
        font-size: 1rem;
        color: var(--text-main);
        outline: none;
        transition: border-color 0.3s ease;
      }

      .tracking-input:focus {
        border-color: var(--primary);
      }

      /* Stepper Timeline */
      .tracker-timeline {
        position: relative;
        padding-left: 28px;
        margin-top: 24px;
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      .tracker-timeline::before {
        content: '';
        position: absolute;
        left: 9px;
        top: 8px;
        bottom: 8px;
        width: 3px;
        background: var(--border-color);
      }

      .tracker-step {
        position: relative;
        display: flex;
        align-items: center;
        gap: 14px;
      }

      .tracker-dot {
        position: absolute;
        left: -28px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: var(--bg-surface);
        border: 3px solid var(--border-color);
        z-index: 1;
        transition: all 0.3s ease;
      }

      .tracker-step.completed .tracker-dot {
        background: var(--primary);
        border-color: var(--primary);
        box-shadow: 0 0 12px rgba(16, 185, 129, 0.5);
      }

      .tracker-step.active .tracker-dot {
        background: #0ea5e9;
        border-color: #0ea5e9;
        animation: activeDotPulse 1.8s infinite;
      }

      @keyframes activeDotPulse {
        0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(14, 165, 233, 0.6); }
        70% { transform: scale(1.15); box-shadow: 0 0 0 8px rgba(14, 165, 233, 0); }
        100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(14, 165, 233, 0); }
      }

      .tracker-step-title {
        font-size: 1rem;
        font-weight: 800;
        color: var(--text-main);
      }

      .tracker-step-desc {
        font-size: 0.82rem;
        color: var(--text-muted);
      }
    </style>

    <div class="container fade-in tracking-container">
      <div class="tracking-card">
        <div style="text-align: center; margin-bottom: 20px;">
          <span class="story-hero-badge" style="background: rgba(16, 185, 129, 0.12); color: var(--primary); font-size: 0.8rem; font-weight: 800; padding: 6px 16px; border-radius: 30px; border: 1px solid rgba(16, 185, 129, 0.3);">
            <i data-lucide="truck" style="width: 15px; height: 15px;"></i> ${isHindi ? 'लाइव ऑर्डर ट्रैकिंग' : 'Live Express Tracking'}
          </span>
          <h1 style="font-size: 2.2rem; font-weight: 900; color: var(--text-main); margin-top: 8px; margin-bottom: 6px; letter-spacing: -0.5px;">
            ${isHindi ? 'ऑर्डर की स्थिति जांचें' : 'Track Your Order Status'}
          </h1>
          <p style="font-size: 0.92rem; color: var(--text-muted);">
            ${isHindi ? 'अपनी ऑर्डर आईडी (उदा. ORD-2026-8912) या मोबाइल नंबर दर्ज करके लाइव स्थिति देखें:' : 'Enter your Order ID (e.g., ORD-2026-8912) or Mobile Number to check real-time status:'}
          </p>
        </div>

        <form onsubmit="handleOrderTrackSearch(event)" class="tracking-search-bar">
          <input type="text" id="track-order-input" class="tracking-input" placeholder="${isHindi ? 'ऑर्डर आईडी या फोन नंबर दर्ज करें...' : 'Enter Order ID or Phone Number...'}" value="${defaultSearch}" required>
          <button type="submit" class="btn btn-primary" style="border-radius: 18px; padding: 12px 24px; font-weight: 800; display: flex; align-items: center; gap: 8px;">
            <i data-lucide="search" style="width: 18px;"></i> ${isHindi ? 'ट्रैक करें' : 'Track Order'}
          </button>
        </form>

        <div id="tracking-result-box">
          <!-- Real-time Order Details Output -->
        </div>
      </div>
    </div>
  `;

  if (defaultSearch) {
    executeOrderTrackingSearch(defaultSearch);
  }

  if (window.lucide) window.lucide.createIcons();
}

window.handleOrderTrackSearch = (e) => {
  e.preventDefault();
  const val = document.getElementById("track-order-input").value.trim();
  executeOrderTrackingSearch(val);
};

function executeOrderTrackingSearch(query) {
  const resultBox = document.getElementById("tracking-result-box");
  if (!resultBox) return;

  const isHindi = window.SHOP_CONFIG ? window.SHOP_CONFIG.language === "hi" : false;
  const cleanQ = query.toLowerCase();

  const orders = window.state.orders || [];
  const foundOrder = orders.find(o =>
    (o.id && o.id.toLowerCase() === cleanQ) ||
    (o.phone && o.phone.replace(/[^0-9]/g, '').includes(cleanQ.replace(/[^0-9]/g, ''))) ||
    (o.name && o.name.toLowerCase().includes(cleanQ))
  );

  if (!foundOrder) {
    resultBox.innerHTML = `
      <div style="text-align: center; padding: 2.5rem 1rem; background: var(--bg-surface-hover); border: 1.5px dashed var(--border-color); border-radius: 20px; color: var(--text-muted); margin-top: 16px;">
        <i data-lucide="alert-circle" style="width: 44px; height: 44px; color: var(--warning); margin-bottom: 10px;"></i>
        <h3 style="font-size: 1.1rem; font-weight: 800; color: var(--text-main);">${isHindi ? 'ऑर्डर नहीं मिला' : 'No Active Order Found'}</h3>
        <p style="font-size: 0.85rem; max-width: 440px; margin: 4px auto 14px auto;">
          ${isHindi 
            ? 'कृपया अपनी ऑर्डर आईडी की जाँच करें या दुकानदार से +91 94155 52992 पर सीधे संपर्क करें।' 
            : 'Please verify your Order ID or call our Devari Bazar store at +91 94155 52992.'}
        </p>
        <a href="tel:+919415552992" class="btn btn-secondary btn-sm" style="border-radius: 16px; font-weight: 700;">📞 Call Store Support</a>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  // Determine stage progression
  const status = foundOrder.status || "Pending";
  let stepStage = 1;
  if (status === "Shipped" || status === "Out for Delivery") stepStage = 2;
  if (status === "Delivered" || status === "Completed") stepStage = 3;

  resultBox.innerHTML = `
    <div style="border-top: 2px dashed var(--border-color); padding-top: 24px; margin-top: 10px;">
      <!-- Order Header Card -->
      <div style="background: var(--bg-surface-hover); border: 1px solid var(--border-color); border-radius: 20px; padding: 18px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
        <div>
          <span style="font-size: 1.25rem; font-weight: 900; color: var(--primary); font-family: monospace;">${foundOrder.id}</span>
          <span style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">📅 ${foundOrder.date || ''} ${foundOrder.time || ''}</span>
        </div>
        <div style="text-align: right;">
          <span class="badge ${stepStage === 3 ? 'badge-success' : stepStage === 2 ? 'badge-primary' : 'badge-warning'}" style="font-size: 0.88rem; padding: 6px 16px; border-radius: 20px; font-weight: 800;">
            ${foundOrder.status}
          </span>
          <span style="display: block; font-size: 0.85rem; font-weight: 900; color: var(--text-main); margin-top: 4px;">Total: ₹${(foundOrder.total || 0).toFixed(2)}</span>
        </div>
      </div>

      <!-- Live Stepper -->
      <h3 style="font-size: 1.1rem; font-weight: 800; color: var(--text-main); margin-bottom: 14px; border: none; padding: 0;">
        ${isHindi ? 'लाइव प्रगति (Live Tracking Status)' : 'Live Delivery Progression'}
      </h3>

      <div class="tracker-timeline">
        <!-- Step 1 -->
        <div class="tracker-step ${stepStage >= 1 ? 'completed' : ''} ${stepStage === 1 ? 'active' : ''}">
          <div class="tracker-dot"></div>
          <div>
            <div class="tracker-step-title">${isHindi ? '1. ऑर्डर प्राप्त हुआ (Order Received)' : '1. Order Received'}</div>
            <div class="tracker-step-desc">${isHindi ? 'पाल जनरल स्टोर देवरी बाज़ार में ऑर्डर दर्ज हो चुका है।' : 'Order confirmed by Devari Bazar store.'}</div>
          </div>
        </div>

        <!-- Step 2 -->
        <div class="tracker-step ${stepStage >= 2 ? 'completed' : ''} ${stepStage === 2 ? 'active' : ''}">
          <div class="tracker-dot"></div>
          <div>
            <div class="tracker-step-title">${isHindi ? '2. पैकिंग व डिलीवरी के लिए रवाना (Out for Delivery)' : '2. Out for 30-Min Express Delivery'}</div>
            <div class="tracker-step-desc">${isHindi ? 'सामान पैक होकर डिलीवरी के लिए निकल चुका है (30 मिनट नियम)।' : 'Packed and on the way within 30 minutes.'}</div>
          </div>
        </div>

        <!-- Step 3 -->
        <div class="tracker-step ${stepStage >= 3 ? 'completed' : ''} ${stepStage === 3 ? 'active' : ''}">
          <div class="tracker-dot"></div>
          <div>
            <div class="tracker-step-title">${isHindi ? '3. डिलीवर हो गया (Order Delivered)' : '3. Successfully Delivered'}</div>
            <div class="tracker-step-desc">${isHindi ? 'सामान आपके पते पर सुरक्षित पहुँचा दिया गया है।' : 'Items delivered safely to your address.'}</div>
          </div>
        </div>
      </div>

      <!-- Customer & Contact Quick Bar -->
      <div style="margin-top: 28px; background: var(--bg-surface-hover); border: 1px solid var(--border-color); border-radius: 18px; padding: 16px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
        <div style="font-size: 0.85rem; color: var(--text-muted);">
          👤 <strong>${foundOrder.name || 'Customer'}</strong> | 📍 ${foundOrder.address || 'Devari Bazar Store Pickup'}
        </div>
        <div style="display: flex; gap: 8px;">
          <a href="tel:+919415552992" class="btn btn-secondary btn-sm" style="border-radius: 14px; font-weight: 700;">📞 Call Store</a>
          <a href="https://wa.me/919415552992?text=${encodeURIComponent('Hi, checking update on Order ' + foundOrder.id)}" target="_blank" class="btn btn-secondary btn-sm" style="border-radius: 14px; color: #22c55e; border-color: #22c55e; font-weight: 700;">💬 WhatsApp</a>
        </div>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
}
