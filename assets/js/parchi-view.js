// Pal Grocery - Parchi (Manual List) Order View Module

function renderParchiPage(viewport) {
  const isHindi = window.SHOP_CONFIG.language === "hi";
  const user = window.state.user;

  // Find latest active Parchi order
  const activeParchiOrder = window.state.orders.find(o => o.isParchi);

  // Set default placeholder templates
  const hindiTemplate = `आटा - 25 किलो\nचावल - 20 किलो\nदाल (अरहर) - 5 किलो\nसरसों का तेल - 3 लीटर\nचीनी - 5 किलो`;
  const englishTemplate = `Aata - 25kg\nChawal - 20kg\nDal - 5kg\nOil - 3L\nSugar - 2kg`;

  // Right column html (Tracker if active order exists, else Guide)
  let rightColumnHtml = "";

  if (activeParchiOrder) {
    rightColumnHtml = `
      <!-- Live Tracker Card -->
      <div class="parchi-card" style="border: 2px solid var(--primary); background: var(--primary-light); display: flex; flex-direction: column; gap: var(--spacing-md);">
        <!-- Glow background overlay -->
        <div style="position: absolute; top: -50px; right: -50px; width: 120px; height: 120px; border-radius: 50%; background: var(--grad-glow); filter: blur(30px); opacity: 0.7; pointer-events: none;"></div>
        
        <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 0; color: var(--primary); display: flex; align-items: center; gap: 8px; border: none; padding: 0;">
          <i data-lucide="truck" style="width: 22px; height: 22px;"></i>
          ${isHindi ? "लाइव आर्डर ट्रैकिंग" : "Live Parchi Tracker"}
        </h3>

        <div style="background: var(--bg-surface); padding: var(--spacing-md); border-radius: var(--radius-sm); border: 1px solid var(--border-color); display: flex; flex-direction: column; gap: 8px; font-size: 0.9rem;">
          <div><strong>${isHindi ? "आर्डर आईडी:" : "Order ID:"}</strong> <span style="color: var(--primary); font-weight: bold;">${activeParchiOrder.id}</span></div>
          <div>
            <strong>${isHindi ? "बिल राशि:" : "Total Bill:"}</strong> 
            <span style="font-size: 1.1rem; font-weight: 800; color: ${activeParchiOrder.total > 0 ? 'var(--success)' : 'var(--warning)'};">
              ${activeParchiOrder.total > 0 ? `₹${activeParchiOrder.total.toFixed(2)}` : (isHindi ? 'जांच जारी (Pending Call)' : 'Pending Verification')}
            </span>
          </div>
          <div>
            <strong>${isHindi ? "आर्डर स्थिति (Status):" : "Current Status:"}</strong> 
            <span class="badge ${activeParchiOrder.status === 'Delivered' ? 'badge-success' : activeParchiOrder.status === 'Shipped' ? 'badge-primary' : 'badge-warning'}">
              ${activeParchiOrder.status === 'Pending Estimation' ? (isHindi ? 'मूल्यांकन लंबित' : 'Pending Estimation') : activeParchiOrder.status === 'Shipped' ? (isHindi ? 'रास्ते में है' : 'Shipped') : (isHindi ? 'डिलीवर हो गया' : 'Delivered')}
            </span>
          </div>
          <div style="border-top: 1px dashed var(--border-color); padding-top: 8px; margin-top: 4px; font-size: 0.8rem; color: var(--text-muted);">
            <strong>${isHindi ? "डिलिवरी पता:" : "Delivery Address:"}</strong> ${activeParchiOrder.address}
          </div>
        </div>

        <!-- Visual Timeline -->
        <div style="margin: var(--spacing-sm) 0; display: flex; flex-direction: column; gap: var(--spacing-sm); position: relative; padding-left: 20px;">
          <div style="position: absolute; left: 6px; top: 8px; bottom: 8px; width: 2px; background: var(--border-color);"></div>
          
          <!-- Step 1: Placed -->
          <div style="display: flex; gap: var(--spacing-sm); align-items: center; position: relative;">
            <div style="width: 12px; height: 12px; border-radius: 50%; background: var(--success); position: absolute; left: -19px; border: 2px solid var(--bg-surface);"></div>
            <span style="font-weight: bold; color: var(--text-main); font-size: 0.85rem;">
              ${isHindi ? "पर्ची प्राप्त हुई (Slip Sent)" : "Parchi Sent"}
            </span>
          </div>

          <!-- Step 2: Packed & Priced -->
          <div style="display: flex; gap: var(--spacing-sm); align-items: center; position: relative;">
            <div style="width: 12px; height: 12px; border-radius: 50%; background: ${activeParchiOrder.total > 0 ? 'var(--success)' : 'var(--border-color)'}; position: absolute; left: -19px; border: 2px solid var(--bg-surface);"></div>
            <span style="font-weight: ${activeParchiOrder.total > 0 ? 'bold' : 'normal'}; color: ${activeParchiOrder.total > 0 ? 'var(--text-main)' : 'var(--text-muted)'}; font-size: 0.85rem;">
              ${isHindi ? "पैकिंग व बिल तैयार" : "Packed & Estimated"}
            </span>
          </div>

          <!-- Step 3: Out for Delivery -->
          <div style="display: flex; gap: var(--spacing-sm); align-items: center; position: relative;">
            <div style="width: 12px; height: 12px; border-radius: 50%; background: ${(activeParchiOrder.status === 'Shipped' || activeParchiOrder.status === 'Delivered') ? 'var(--success)' : 'var(--border-color)'}; position: absolute; left: -19px; border: 2px solid var(--bg-surface);"></div>
            <span style="font-weight: ${(activeParchiOrder.status === 'Shipped' || activeParchiOrder.status === 'Delivered') ? 'bold' : 'normal'}; color: ${(activeParchiOrder.status === 'Shipped' || activeParchiOrder.status === 'Delivered') ? 'var(--text-main)' : 'var(--text-muted)'}; font-size: 0.85rem;">
              ${isHindi ? "डिलीवरी के लिए रवाना" : "Out for Delivery (Ramesh)"}
            </span>
          </div>

          <!-- Step 4: Delivered -->
          <div style="display: flex; gap: var(--spacing-sm); align-items: center; position: relative;">
            <div style="width: 12px; height: 12px; border-radius: 50%; background: ${activeParchiOrder.status === 'Delivered' ? 'var(--success)' : 'var(--border-color)'}; position: absolute; left: -19px; border: 2px solid var(--bg-surface);"></div>
            <span style="font-weight: ${activeParchiOrder.status === 'Delivered' ? 'bold' : 'normal'}; color: ${activeParchiOrder.status === 'Delivered' ? 'var(--text-main)' : 'var(--text-muted)'}; font-size: 0.85rem;">
              ${isHindi ? "डिलिवर हो गया" : "Delivered"}
            </span>
          </div>
        </div>

        <!-- Demo Simulator Controls -->
        <div style="background: rgba(255,255,255,0.4); padding: var(--spacing-sm); border-radius: var(--radius-sm); border: 1px solid rgba(16, 185, 129, 0.2); display: flex; flex-direction: column; gap: 8px;">
          <div style="font-size: 0.78rem; font-weight: 700; color: var(--primary); text-transform: uppercase; letter-spacing: 0.5px;">
            ${isHindi ? "लाइव ट्रैकिंग सिम्युलेटर (Simulator)" : "Live Tracking Simulator"}
          </div>
          
          <div style="display: flex; gap: 6px;">
            <button class="btn btn-secondary btn-sm" onclick="window.simulateParchiStep('price')" style="flex: 1; font-size: 0.72rem; padding: 6px; background: var(--bg-surface);">
              ${isHindi ? "1. बिल सेट करें (₹950)" : "1. Price Bill (₹950)"}
            </button>
            <button class="btn btn-secondary btn-sm" onclick="window.simulateParchiStep('deliver')" style="flex: 1; font-size: 0.72rem; padding: 6px; background: var(--bg-surface);">
              ${isHindi ? "2. डिलीवर मार्क करें" : "2. Mark Delivered"}
            </button>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="window.simulateParchiStep('reset')" style="font-size: 0.72rem; padding: 4px; border-color: var(--danger); color: var(--danger); background: transparent;">
            ${isHindi ? "नया पर्ची आर्डर शुरू करें (Reset)" : "Start New Order (Reset)"}
          </button>
        </div>
      </div>
    `;
  } else {
    rightColumnHtml = `
      <!-- Guide Card -->
      <div class="parchi-card" style="display: flex; flex-direction: column; gap: var(--spacing-lg);">
        <h3 style="font-size: 1.3rem; font-weight: 800; border-bottom: 1px solid var(--border-color); padding-bottom: var(--spacing-xs); margin-bottom: 0;">
          <i data-lucide="help-circle" class="inline-icon"></i> ${isHindi ? "काम कैसे करता है?" : "How it works?"}
        </h3>

        <div style="display: flex; flex-direction: column; gap: var(--spacing-md); font-size: 0.88rem; line-height: 1.5; color: var(--text-muted);">
          <div style="display: flex; gap: 12px; align-items: flex-start;">
            <div style="background: var(--primary-light); color: var(--primary); font-weight: bold; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.8rem;">1</div>
            <div>
              <strong style="color: var(--text-main);">अपनी लिस्ट लिखें:</strong>
              जो भी राशन चाहिए, उसे यहाँ लिखें (जैसे: आटा - 25 किलो, तेल - 3 लीटर)।
            </div>
          </div>

          <div style="display: flex; gap: 12px; align-items: flex-start;">
            <div style="background: var(--primary-light); color: var(--primary); font-weight: bold; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.8rem;">2</div>
            <div>
              <strong style="color: var(--text-main);">पर्ची सबमिट करें:</strong>
              अपना फ़ोन नंबर और पता डालकर 'पर्ची भेजें' पर क्लिक करें।
            </div>
          </div>

          <div style="display: flex; gap: 12px; align-items: flex-start;">
            <div style="background: var(--primary-light); color: var(--primary); font-weight: bold; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.8rem;">3</div>
            <div>
              <strong style="color: var(--text-main);">दुकानदार करेगा बिलिंग:</strong>
              स्टोर ओनर आपकी लिस्ट देखकर सामान पैक करेगा और उसका बिल (क़ीमत) अपडेट करेगा।
            </div>
          </div>

          <div style="display: flex; gap: 12px; align-items: flex-start;">
            <div style="background: var(--primary-light); color: var(--primary); font-weight: bold; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.8rem;">4</div>
            <div>
              <strong style="color: var(--text-main);">कन्फर्मेशन कॉल व डिलीवरी:</strong>
              आपको कुल क़ीमत बताने के लिए कॉल आएगी, और कन्फर्म होते ही डिलीवरी बॉय (रमेश) सामान लेकर रवाना हो जाएगा।
            </div>
          </div>
        </div>
      </div>
    `;
  }

  viewport.innerHTML = `
    <style>
      .parchi-container {
        position: relative;
        overflow: hidden;
        padding-bottom: 5rem;
      }
      .parchi-grid {
        display: grid;
        grid-template-columns: 1.25fr 1fr;
        gap: var(--spacing-xl);
        align-items: start;
        margin-top: 2rem;
      }
      @media (max-width: 1024px) {
        .parchi-grid {
          grid-template-columns: 1fr;
          gap: var(--spacing-lg);
        }
      }
      .parchi-card {
        background: var(--bg-surface);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-lg);
        padding: var(--spacing-xl);
        box-shadow: var(--shadow-md);
        position: relative;
        overflow: hidden;
      }
      .quick-template-btn {
        background: var(--bg-surface-hover);
        border: 1px solid var(--border-color);
        padding: 6px 12px;
        border-radius: var(--radius-full);
        font-size: 0.8rem;
        cursor: pointer;
        transition: all 0.2s ease;
        color: var(--text-main);
        font-weight: 600;
      }
      .quick-template-btn:hover {
        background: var(--primary-light);
        color: var(--primary);
        border-color: var(--primary);
      }
    </style>

    <div class="container fade-in parchi-container">
      <div style="text-align: center; max-width: 700px; margin: 3rem auto var(--spacing-xl) auto;">
        <span class="hero-badge" style="background: var(--primary-light); color: var(--primary);">
          ${isHindi ? "ऑर्डर टेक्स्ट द्वारा" : "Order by text"}
        </span>
        <h1 style="font-size: 2.5rem; font-weight: 800; letter-spacing: -1px; margin-top: var(--spacing-xs); margin-bottom: var(--spacing-sm);">
          ${isHindi ? "ऑर्डर लिस्ट (Text)" : "Order by text"}
        </h1>
        <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.6;">
          ${isHindi
      ? "सामानों की सूची टाइप करें। हमारे कर्मचारी सामान पैक करेंगे, दाम जोड़ेंगे और आर्डर कन्फर्म करने के लिए आपको कॉल करेंगे।"
      : "Type or paste your grocery list below. Our store staff will pack the items, calculate the prices, and call you to confirm."}
        </p>
        <button class="btn btn-primary" onclick="window.openOrderByTextModal()" style="margin-top: 14px; background: linear-gradient(135deg, #0ea5e9, #0284c7); border: none; box-shadow: 0 8px 25px rgba(14, 165, 233, 0.35); padding: 12px 24px; border-radius: 30px; font-weight: 800;">
          <i data-lucide="wind" class="inline-icon"></i> ${isHindi ? "एयर मोशन पॉपअप खोलें (Order by text)" : "Open Order by text Popup"}
        </button>
      </div>

      <div class="parchi-grid">
        <!-- Left: Text Area and Inputs -->
        <div class="parchi-card" style="display: flex; flex-direction: column; gap: var(--spacing-md);">
          <div>
            <!-- Handwritten Parchi Photo OCR Upload Card -->
            <div style="border: 1px dashed var(--primary); border-radius: var(--radius-md); padding: 12px; background: var(--primary-light); margin-bottom: 14px;">
              <label style="font-weight: 800; font-size: 0.85rem; color: var(--primary); display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
                <i data-lucide="camera" style="width: 16px;"></i>
                ${isHindi ? "हाथ से लिखी पर्ची की फोटो अपलोड करें (Parchi Photo Attachment)" : "Upload Handwritten Parchi Photo"}
              </label>
              <div style="display: flex; align-items: center; gap: 8px;">
                <input type="file" id="parchi-photo-input" accept="image/*" onchange="window.handleParchiPhotoUpload(event)" style="font-size: 0.8rem; padding: 6px; background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 4px; flex: 1; color: var(--text-main); cursor: pointer;">
                <span id="parchi-scan-status" style="font-size: 0.75rem; color: var(--primary); font-weight: 700;"></span>
              </div>

              <!-- Photo Preview Thumbnail Box -->
              <div id="parchi-photo-preview-box" style="margin-top: 10px; display: none; align-items: center; gap: 12px; background: var(--bg-surface); padding: 8px; border-radius: 6px; border: 1px solid var(--border-color);">
                <div style="width: 50px; height: 50px; border-radius: 6px; overflow: hidden; background: #000; border: 1px solid var(--border-color);">
                  <img id="parchi-photo-preview" src="" alt="Parchi Preview" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div style="flex: 1;">
                  <span style="font-size: 0.8rem; font-weight: 700; color: var(--primary); display: block;">${isHindi ? "पर्ची की फोटो संलग्न है" : "Parchi Photo Attached"}</span>
                  <span style="font-size: 0.75rem; color: var(--text-muted);">${isHindi ? "यह फोटो दुकानदार को एडमिन पोर्टल पर दिखेगी" : "Store owner will view this photo in Admin Portal"}</span>
                </div>
                <button type="button" class="btn btn-secondary btn-sm" onclick="window.removeParchiPhoto()" style="color: var(--danger); font-size: 0.75rem; padding: 4px 8px;">${isHindi ? "हटाएं" : "Remove"}</button>
              </div>
            </div>

            <label style="font-weight: 800; font-size: 0.95rem; display: block; margin-bottom: 8px;">
              ${isHindi ? "अपनी पर्ची यहाँ लिखें:" : "Type Grocery Items list:"}
            </label>
            
            <!-- Quick Templates -->
            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; align-items: center;">
              <span style="font-size: 0.78rem; color: var(--text-muted); font-weight: 700;">
                ${isHindi ? "उदाहरण लोड करें:" : "Load Template:"}
              </span>
              <button class="quick-template-btn" onclick="window.loadParchiTemplate('ration')">
                ${isHindi ? "महीने का राशन" : "Monthly Ration"}
              </button>
              <button class="quick-template-btn" onclick="window.loadParchiTemplate('tea')">
                ${isHindi ? "चाय पार्टी" : "Tea & Snacks"}
              </button>
              <button class="quick-template-btn" onclick="window.clearParchiInput()">
                ${isHindi ? "साफ़ करें" : "Clear"}
              </button>
            </div>

            <textarea id="parchi-input" rows="8" style="width: 100%; border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: var(--spacing-md); font-family: monospace; font-size: 0.95rem; background: var(--bg-surface-hover); color: var(--text-main); resize: vertical; line-height: 1.5;" placeholder="${isHindi ? `उदाहरण के लिए:\n${hindiTemplate}` : `For example:\n${englishTemplate}`}"></textarea>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md);">
            <div class="form-field">
              <label for="parchi-phone" style="font-weight: 700; font-size: 0.85rem;">${isHindi ? "मोबाइल नंबर *" : "Phone Number *"}</label>
              <input type="text" id="parchi-phone" value="${user ? user.phone : ''}" style="width: 100%; border: 1px solid var(--border-color); padding: 8px; border-radius: var(--radius-sm); background: var(--bg-base); color: var(--text-main);">
            </div>
            <div class="form-field">
              <label for="parchi-address" style="font-weight: 700; font-size: 0.85rem;">${isHindi ? "डिलिवरी का पता *" : "Delivery Address *"}</label>
              <input type="text" id="parchi-address" value="${user ? user.address : ''}" style="width: 100%; border: 1px solid var(--border-color); padding: 8px; border-radius: var(--radius-sm); background: var(--bg-base); color: var(--text-main);">
            </div>
          </div>

          <button class="btn btn-primary" onclick="window.submitParchiOrder()" style="width: 100%; margin-top: var(--spacing-sm); border-radius: var(--radius-full); font-weight: 800; gap: 8px;">
            <i data-lucide="send"></i>
            ${isHindi ? "पर्ची भेजें (आर्डर करें)" : "Send List (Place Order)"}
          </button>
        </div>

        <!-- Right Column -->
        <div id="parchi-right-pane" style="display: flex; flex-direction: column; gap: var(--spacing-lg);">
          ${rightColumnHtml}
        </div>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  // Template loaders
  window.loadParchiTemplate = (type) => {
    const input = document.getElementById("parchi-input");
    if (!input) return;

    if (type === 'ration') {
      input.value = isHindi
        ? `आटा (आशीर्वाद) - 25kg\nबासमती चावल - 20kg\nअरहर दाल - 5kg\nसरसों का तेल - 3 लीटर\nचीनी - 5 किलो`
        : `Aata (Aashirvaad) - 25kg\nBasmati Rice - 20kg\nArhar Dal - 5kg\nMustard Oil - 3L\nSugar - 5kg`;
    } else if (type === 'tea') {
      input.value = isHindi
        ? `रेड लेबल चायपत्ती - 500g\nचीनी - 2kg\nअमूल दूध - 4 पैकेट\nपारले-जी बिस्कुट - 5 पैकेट`
        : `Red Label Tea - 500g\nSugar - 2kg\nAmul Milk - 4 packets\nParle-G Biscuits - 5 packets`;
    }
  };

  window.clearParchiInput = () => {
    const input = document.getElementById("parchi-input");
    if (input) input.value = "";
  };

  window.submitParchiOrder = () => {
    const input = document.getElementById("parchi-input");
    const phoneInput = document.getElementById("parchi-phone");
    const addressInput = document.getElementById("parchi-address");

    if (!input || !phoneInput || !addressInput) return;

    const itemsText = input.value.trim();
    const phone = phoneInput.value.trim();
    const address = addressInput.value.trim();

    if (!itemsText) {
      showToast(isHindi ? "कृपया अपनी पर्ची में कुछ सामान जरूर लिखें!" : "Please write some items in your list!", "warning");
      return;
    }
    if (!phone || !address) {
      showToast(isHindi ? "डिलिवरी पता और मोबाइल नंबर अनिवार्य हैं!" : "Phone and delivery address are required!", "warning");
      return;
    }

    const orderId = "ORD-" + Math.floor(1000 + Math.random() * 9000);
    const dateStr = new Date().toISOString().split("T")[0];

    const newOrder = {
      id: orderId,
      date: dateStr,
      total: 0, // Estimating
      status: "Pending Estimation",
      isParchi: true,
      itemsText: itemsText,
      parchiImage: window.uploadedParchiImageBase64 || null,
      address: address,
      phone: phone,
      name: window.state.user.name,
      items: [{ name: "Parchi Grocery Items List", qty: 1, price: 0 }]
    };

    window.uploadedParchiImageBase64 = null;

    if (window.DB) {
      window.DB.saveOrder(newOrder);
    } else {
      window.state.orders.unshift(newOrder);
      localStorage.setItem("palbasket_orders", JSON.stringify(window.state.orders));
    }
    showToast(isHindi ? "आपका टेक्स्ट ऑर्डर सफलतापूर्वक भेजा गया!" : "Order by text Placed Successfully!", "success");

    // Refresh page view to load the Live Tracker directly
    renderParchiPage(viewport);
  };

  // Live progress simulation inside parchi-view itself
  window.simulateParchiStep = (step) => {
    if (!activeParchiOrder) return;
    const activeOrder = window.state.orders.find(o => o.isParchi && o.id === activeParchiOrder.id);
    if (!activeOrder) return;

    if (step === 'price') {
      activeOrder.total = 950;
      activeOrder.status = "Shipped";
      showToast(isHindi ? "दुकानदार ने बिल अपडेट किया (₹950.00) और रमेश डिलीवरी के लिए निकल गया!" : "Store owner updated bill to ₹950.00 and dispatched Ramesh!", "success");
    } else if (step === 'deliver') {
      activeOrder.status = "Delivered";
      showToast(isHindi ? "आर्डर सफलतापूर्वक डिलीवर मार्क हो गया!" : "Order marked as Delivered successfully!", "success");
    } else if (step === 'reset') {
      window.state.orders = window.state.orders.filter(o => o.id !== activeParchiOrder.id);
      showToast(isHindi ? "सिम्युलेटर रीसेट हो गया है।" : "Simulator reset.", "info");
    }

    // Refresh view
    renderParchiPage(viewport);
  };

  // Handwritten Parchi Photo OCR Upload Handler
  window.handleParchiPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const statusEl = document.getElementById("parchi-scan-status");
    const previewBox = document.getElementById("parchi-photo-preview-box");
    const imgPreview = document.getElementById("parchi-photo-preview");

    if (statusEl) statusEl.textContent = isHindi ? "फोटो अटैच हो रही है..." : "Attaching photo...";

    const reader = new FileReader();
    reader.onload = function (event) {
      window.uploadedParchiImageBase64 = event.target.result;

      if (imgPreview) imgPreview.src = window.uploadedParchiImageBase64;
      if (previewBox) previewBox.style.display = "flex";
      if (statusEl) statusEl.textContent = isHindi ? "✓ पर्ची अटैच हो गई!" : "✓ Photo Attached!";

      const textarea = document.getElementById("parchi-input");
      if (textarea && !textarea.value.trim()) {
        textarea.value = isHindi
          ? "हाथ की पर्ची की फोटो संलग्न है। कृपया फोटो देखकर सामान पैक करें।"
          : "Handwritten Parchi photo attached. Please pack items by viewing photo.";
      }
      showToast(isHindi ? "पर्ची की फोटो सफलतापूर्वक अटैच हो गई!" : "Handwritten Parchi photo attached successfully!", "success");
    };
    reader.readAsDataURL(file);
  };

  window.removeParchiPhoto = () => {
    window.uploadedParchiImageBase64 = null;
    const fileInput = document.getElementById("parchi-photo-input");
    const previewBox = document.getElementById("parchi-photo-preview-box");
    const imgPreview = document.getElementById("parchi-photo-preview");
    const statusEl = document.getElementById("parchi-scan-status");

    if (fileInput) fileInput.value = "";
    if (imgPreview) imgPreview.src = "";
    if (previewBox) previewBox.style.display = "none";
    if (statusEl) statusEl.textContent = "";
  };
}

// AIR MOVEMENT POPUP MODAL SYSTEM FOR ORDER BY TEXT
function injectAirModalStyles() {
  if (document.getElementById("air-modal-styles")) return;
  const styleEl = document.createElement("style");
  styleEl.id = "air-modal-styles";
  styleEl.textContent = `
    .air-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(15, 23, 42, 0.7);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.35s ease;
    }

    .air-modal-overlay.open {
      opacity: 1;
      pointer-events: auto;
    }

    .air-breeze-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      pointer-events: none;
    }

    .air-stream {
      position: absolute;
      height: 3px;
      background: linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.7), rgba(14, 165, 233, 0.9), transparent);
      border-radius: 50%;
      filter: blur(1px);
      animation: airStreamFlow 6s linear infinite;
    }
    .air-stream-1 { top: 20%; width: 60%; left: -60%; animation-delay: 0s; }
    .air-stream-2 { top: 50%; width: 80%; left: -80%; animation-delay: 2.5s; animation-duration: 4.8s; }
    .air-stream-3 { top: 80%; width: 50%; left: -50%; animation-delay: 1.2s; animation-duration: 6.5s; }

    @keyframes airStreamFlow {
      0% { transform: translateX(0) scaleY(1); opacity: 0; }
      30% { opacity: 0.85; transform: translateX(40vw) scaleY(2); }
      70% { opacity: 0.85; transform: translateX(100vw) scaleY(1.5); }
      100% { transform: translateX(160vw) scaleY(1); opacity: 0; }
    }

    .air-particle {
      position: absolute;
      width: 8px;
      height: 8px;
      background: rgba(56, 189, 248, 0.8);
      border-radius: 50%;
      box-shadow: 0 0 12px rgba(56, 189, 248, 0.9);
      animation: airParticleFloat 4s ease-in-out infinite;
    }
    .particle-1 { top: 75%; left: 20%; animation-delay: 0s; }
    .particle-2 { top: 60%; left: 75%; animation-delay: 1s; }
    .particle-3 { top: 85%; left: 50%; animation-delay: 2s; }
    .particle-4 { top: 35%; left: 80%; animation-delay: 1.5s; }

    @keyframes airParticleFloat {
      0% { transform: translateY(0px) scale(0.6); opacity: 0.2; }
      50% { transform: translateY(-45px) scale(1.2); opacity: 0.9; }
      100% { transform: translateY(-90px) scale(0.4); opacity: 0; }
    }

    .air-modal-card {
      position: relative;
      width: 92%;
      max-width: 520px;
      background: rgba(255, 255, 255, 0.94);
      border: 1.5px solid rgba(56, 189, 248, 0.4);
      border-radius: 24px;
      padding: 26px;
      box-shadow: 0 25px 60px rgba(14, 165, 233, 0.25), 0 0 40px rgba(56, 189, 248, 0.2);
      transform: scale(0.88) translateY(25px);
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      animation: airCardHoverFloat 3.8s ease-in-out infinite alternate;
    }

    [data-theme="dark"] .air-modal-card {
      background: rgba(15, 23, 42, 0.94);
      border-color: rgba(56, 189, 248, 0.45);
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(14, 165, 233, 0.35);
    }

    .air-modal-overlay.open .air-modal-card {
      transform: scale(1) translateY(0);
    }

    @keyframes airCardHoverFloat {
      0% { transform: translateY(0px); }
      100% { transform: translateY(-12px); }
    }

    .air-modal-close {
      position: absolute;
      top: 18px;
      right: 18px;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      border: none;
      background: rgba(0,0,0,0.06);
      font-size: 1.3rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-main);
      transition: all 0.2s ease;
    }
    .air-modal-close:hover {
      background: rgba(239, 68, 68, 0.15);
      color: #ef4444;
      transform: rotate(90deg);
    }

    .air-modal-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 18px;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 14px;
    }

    .air-icon-badge {
      width: 50px;
      height: 50px;
      border-radius: 16px;
      background: linear-gradient(135deg, #0ea5e9, #0284c7);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: 0 8px 20px rgba(14, 165, 233, 0.4);
      animation: airIconSpin 5s ease-in-out infinite alternate;
    }

    @keyframes airIconSpin {
      0% { transform: rotate(-6deg) scale(1); }
      100% { transform: rotate(6deg) scale(1.1); }
    }

    .air-modal-title {
      font-size: 1.4rem;
      font-weight: 800;
      margin: 0;
      background: linear-gradient(135deg, #0ea5e9, #0369a1);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .air-modal-sub {
      font-size: 0.83rem;
      color: var(--text-muted);
      margin-top: 2px;
    }

    .air-input-group {
      margin-bottom: 14px;
    }
    .air-input-group label {
      font-size: 0.83rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 6px;
      color: var(--text-main);
    }
    .air-input-group textarea,
    .air-input-group input {
      width: 100%;
      padding: 10px 14px;
      border-radius: 12px;
      border: 1.5px solid var(--border-color);
      background: var(--bg-surface);
      color: var(--text-main);
      font-size: 0.9rem;
      outline: none;
      transition: border-color 0.25s, box-shadow 0.25s;
    }
    .air-input-group textarea:focus,
    .air-input-group input:focus {
      border-color: #0ea5e9;
      box-shadow: 0 0 12px rgba(14, 165, 233, 0.3);
    }

    .air-template-chips {
      display: flex;
      gap: 6px;
      margin-bottom: 8px;
    }
    .air-template-chips button {
      padding: 4px 10px;
      border-radius: 14px;
      border: 1px solid #0ea5e9;
      background: rgba(14, 165, 233, 0.08);
      color: #0284c7;
      font-size: 0.75rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }
    .air-template-chips button:hover {
      background: #0ea5e9;
      color: white;
    }

    .air-modal-footer {
      display: flex;
      gap: 12px;
      margin-top: 18px;
    }
    .air-btn-secondary {
      flex: 1;
      padding: 10px 16px;
      border-radius: 12px;
      border: 1px solid var(--border-color);
      background: transparent;
      color: var(--text-main);
      font-weight: 700;
      cursor: pointer;
    }
    .air-btn-primary {
      flex: 2;
      padding: 12px 20px;
      border-radius: 12px;
      border: none;
      background: linear-gradient(135deg, #0ea5e9, #0284c7);
      color: white;
      font-weight: 800;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      box-shadow: 0 6px 20px rgba(14, 165, 233, 0.4);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .air-btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(14, 165, 233, 0.5);
    }
  `;
  document.head.appendChild(styleEl);
}

function openOrderByTextModal() {
  injectAirModalStyles();
  let overlay = document.getElementById("air-order-modal-overlay");
  const isHindi = window.SHOP_CONFIG && window.SHOP_CONFIG.language === "hi";
  const user = window.state ? window.state.user : null;
  const userAddress = user && user.address ? user.address : "";
  const userPhone = user && user.phone ? user.phone : "";

  if (!overlay) {
    const modalHTML = `
      <div class="air-modal-overlay" id="air-order-modal-overlay">
        <div class="air-breeze-background">
          <div class="air-stream air-stream-1"></div>
          <div class="air-stream air-stream-2"></div>
          <div class="air-stream air-stream-3"></div>
          <div class="air-particle particle-1"></div>
          <div class="air-particle particle-2"></div>
          <div class="air-particle particle-3"></div>
          <div class="air-particle particle-4"></div>
        </div>

        <div class="air-modal-card">
          <button class="air-modal-close" onclick="window.closeOrderByTextModal()">&times;</button>
          
          <div class="air-modal-header">
            <div class="air-icon-badge">
              <i data-lucide="wind" style="width:26px;height:26px;"></i>
            </div>
            <div>
              <h2 class="air-modal-title">${isHindi ? 'ऑर्डर लिस्ट (Text)' : 'Order by text'}</h2>
              <p class="air-modal-sub">${isHindi ? 'अपनी सामानों की सूची यहाँ टाइप करें और तुरंत घर पहुँचाएँ' : 'Type or paste your grocery list for instant local home delivery'}</p>
            </div>
          </div>

          <div class="air-modal-body">
            <div class="air-input-group">
              <label><i data-lucide="file-text" style="width:16px;"></i> ${isHindi ? 'सामानों की सूची:' : 'Grocery Items List (Text):'}</label>
              <div class="air-template-chips">
                <button onclick="window.fillModalTemplate('ration')">${isHindi ? 'महीने का राशन' : 'Monthly Ration'}</button>
                <button onclick="window.fillModalTemplate('tea')">${isHindi ? 'चाय पार्टी' : 'Tea & Snacks'}</button>
                <button onclick="window.fillModalTemplate('clear')">${isHindi ? 'साफ़ करें' : 'Clear'}</button>
              </div>
              <textarea id="air-modal-list-input" rows="5" placeholder="${isHindi ? 'आटा - 10kg\nदूध - 2L\nचीनी - 2kg\nचायपत्ती - 250g' : 'Aata - 10kg\nMilk - 2L\nSugar - 2kg\nTea - 250g'}"></textarea>
            </div>

            <div class="air-input-group">
              <label><i data-lucide="map-pin" style="width:16px;"></i> ${isHindi ? 'डिलीवरी पता:' : 'Delivery Address:'}</label>
              <input type="text" id="air-modal-address" placeholder="${isHindi ? 'पूरा पता दर्ज करें...' : 'Enter delivery address...'}" value="${userAddress}">
            </div>

            <div class="air-input-group">
              <label><i data-lucide="phone" style="width:16px;"></i> ${isHindi ? 'फोन नंबर:' : 'Phone Number:'}</label>
              <input type="text" id="air-modal-phone" placeholder="${isHindi ? '10 अंकों का मोबाइल नंबर' : '10-digit phone number'}" value="${userPhone}">
            </div>
          </div>

          <div class="air-modal-footer">
            <button class="air-btn-secondary" onclick="window.closeOrderByTextModal()">${isHindi ? 'रद्द करें' : 'Cancel'}</button>
            <button class="air-btn-primary" onclick="window.submitModalTextOrder()">
              <i data-lucide="send" style="width:18px;"></i> ${isHindi ? 'ऑर्डर भेजें' : 'Send Order by Text'}
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalHTML);
    overlay = document.getElementById("air-order-modal-overlay");
  }

  if (window.lucide) window.lucide.createIcons();

  const addressEl = document.getElementById("air-modal-address");
  const phoneEl = document.getElementById("air-modal-phone");
  if (addressEl && !addressEl.value && userAddress) addressEl.value = userAddress;
  if (phoneEl && !phoneEl.value && userPhone) phoneEl.value = userPhone;

  setTimeout(() => {
    overlay.classList.add("open");
  }, 10);
}

function closeOrderByTextModal() {
  const overlay = document.getElementById("air-order-modal-overlay");
  if (overlay) overlay.classList.remove("open");
}

function fillModalTemplate(type) {
  const textarea = document.getElementById("air-modal-list-input");
  if (!textarea) return;
  if (type === "ration") {
    textarea.value = "Aata - 25kg\nChawal - 20kg\nDal - 5kg\nOil - 3L\nSugar - 2kg";
  } else if (type === "tea") {
    textarea.value = "Tea Dust - 500g\nSugar - 1kg\nMilk - 2L\nBiscuits - 4 Packs";
  } else if (type === "clear") {
    textarea.value = "";
  }
}

function submitModalTextOrder() {
  const isHindi = window.SHOP_CONFIG && window.SHOP_CONFIG.language === "hi";
  const listInput = document.getElementById("air-modal-list-input");
  const addressInput = document.getElementById("air-modal-address");
  const phoneInput = document.getElementById("air-modal-phone");

  const listText = listInput ? listInput.value.trim() : "";
  const address = addressInput ? addressInput.value.trim() : "";
  const phone = phoneInput ? phoneInput.value.trim() : "";

  if (!listText) {
    if (window.showToast) window.showToast(isHindi ? "कृपया अपनी सामानों की सूची लिखें!" : "Please enter your grocery items list!", "warning");
    return;
  }
  if (!address || !phone) {
    if (window.showToast) window.showToast(isHindi ? "कृपया अपना पता और फोन नंबर भरें!" : "Please enter delivery address & phone number!", "warning");
    return;
  }

  const newOrder = {
    id: `TXT-${Math.floor(100000 + Math.random() * 900000)}`,
    items: [],
    parchiList: listText,
    isParchi: true,
    total: 0,
    status: "Pending Estimation",
    address: address,
    phone: phone,
    customerName: (window.state && window.state.user) ? window.state.user.name : "Valued Customer",
    createdAt: new Date().toISOString()
  };

  if (window.DB) {
    window.DB.saveOrder(newOrder);
  } else {
    window.state.orders.unshift(newOrder);
    localStorage.setItem("palbasket_orders", JSON.stringify(window.state.orders));
  }

  closeOrderByTextModal();
  if (window.showToast) window.showToast(isHindi ? "आपका टेक्स्ट ऑर्डर सफलतापूर्वक भेजा गया!" : "Your Order by Text has been submitted successfully!", "success");

  if (window.navigateView) window.navigateView("tracker", newOrder.id);
}

window.openOrderByTextModal = openOrderByTextModal;
window.closeOrderByTextModal = closeOrderByTextModal;
window.fillModalTemplate = fillModalTemplate;
window.submitModalTextOrder = submitModalTextOrder;
