// Pal Grocery - Contact & Customer Support Lounge Module

function renderCustomerContact(viewport) {
  const isHindi = window.SHOP_CONFIG ? window.SHOP_CONFIG.language === "hi" : false;

  viewport.innerHTML = `
    <style>
      .contact-v3-container {
        perspective: 1000px;
        padding-bottom: 4rem;
      }

      /* Hero Header */
      .contact-hero-banner {
        background: linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(14, 165, 233, 0.08) 100%);
        border: 1.5px solid rgba(16, 185, 129, 0.35);
        border-radius: 26px;
        padding: 32px 24px;
        margin-top: 1.5rem;
        margin-bottom: 2rem;
        text-align: center;
        position: relative;
        overflow: hidden;
        box-shadow: 0 12px 35px rgba(16, 185, 129, 0.1);
        backdrop-filter: blur(12px);
      }

      .contact-hero-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: #065f46;
        color: #ffffff;
        font-size: 0.85rem;
        font-weight: 800;
        padding: 8px 22px;
        border-radius: 30px;
        border: 1.5px solid #10b981;
        box-shadow: 0 6px 20px rgba(6, 95, 70, 0.4);
        margin-bottom: 14px;
        letter-spacing: 0.5px;
        animation: contactBadgeFloat 3s ease-in-out infinite alternate;
      }

      @keyframes contactBadgeFloat {
        0% { transform: translateY(0) scale(1); }
        100% { transform: translateY(-4px) scale(1.04); }
      }

      .contact-hero-title {
        font-size: 2.5rem;
        font-weight: 900;
        letter-spacing: -1px;
        margin-bottom: 8px;
        background: linear-gradient(135deg, var(--text-main) 20%, var(--primary) 70%, #0ea5e9 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .contact-hero-sub {
        color: var(--text-muted);
        font-size: 1.02rem;
        max-width: 680px;
        margin: 0 auto;
        line-height: 1.6;
      }

      /* 4 Contact Info Grid */
      .contact-info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
        gap: var(--spacing-md);
        margin-bottom: 2.5rem;
      }

      .contact-info-card {
        background: var(--bg-surface);
        border: 1.5px solid var(--border-color);
        border-radius: 22px;
        padding: 22px;
        display: flex;
        align-items: center;
        gap: 16px;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.03);
        transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease, border-color 0.4s ease;
        cursor: pointer;
        text-decoration: none;
        color: inherit;
      }

      .contact-info-card:hover {
        transform: translateY(-6px) scale(1.02);
        border-color: var(--primary);
        box-shadow: 0 16px 38px rgba(16, 185, 129, 0.18);
      }

      .contact-info-icon-box {
        width: 50px;
        height: 50px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
        transition: transform 0.3s ease;
      }

      .contact-info-card:hover .contact-info-icon-box {
        transform: scale(1.15) rotate(6deg);
      }

      /* Main Contact Layout Grid */
      .contact-main-grid {
        display: grid;
        grid-template-columns: 1.3fr 1fr;
        gap: var(--spacing-xl);
        align-items: start;
      }

      @media (max-width: 1024px) {
        .contact-main-grid {
          grid-template-columns: 1fr;
          gap: var(--spacing-lg);
        }
      }

      .contact-form-card {
        background: var(--bg-surface);
        border: 1.5px solid var(--border-color);
        border-radius: 26px;
        padding: 28px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
        transition: border-color 0.3s ease, box-shadow 0.3s ease;
      }

      .contact-topic-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 20px;
      }

      .topic-chip-btn {
        background: var(--bg-surface-hover);
        border: 1px solid var(--border-color);
        color: var(--text-muted);
        font-size: 0.8rem;
        font-weight: 700;
        padding: 6px 14px;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.25s ease;
      }

      .topic-chip-btn.active, .topic-chip-btn:hover {
        background: rgba(16, 185, 129, 0.12);
        border-color: var(--primary);
        color: var(--primary);
        transform: scale(1.04);
      }

      /* Map Card Radar Pulse */
      .contact-map-card {
        background: var(--bg-surface);
        border: 1.5px solid var(--border-color);
        border-radius: 26px;
        padding: 26px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
        text-align: center;
      }

      .map-vector-box {
        background: var(--bg-surface-hover);
        height: 210px;
        border-radius: 20px;
        border: 1px solid var(--border-color);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
        margin-bottom: 20px;
      }

      .map-radar-pulse {
        position: absolute;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background: rgba(16, 185, 129, 0.25);
        animation: mapRadarPulse 2.5s ease-out infinite;
      }

      @keyframes mapRadarPulse {
        0% { transform: scale(0.3); opacity: 0.8; }
        100% { transform: scale(2.2); opacity: 0; }
      }
    </style>

    <div class="container fade-in contact-v3-container">
      <!-- HERO HEADER -->
      <div class="contact-hero-banner">
        <span class="contact-hero-badge">
          <i data-lucide="headphones" style="width: 15px; height: 15px;"></i> ${isHindi ? '24/7 कस्टमर सपोर्ट लॉन्ज' : '24/7 Customer Care Lounge'}
        </span>
        <h1 class="contact-hero-title">${isHindi ? 'पाल ग्रॉसरी से संपर्क करें' : 'Get in Touch with Pal Store'}</h1>
        <p class="contact-hero-sub">
          ${isHindi 
            ? '30-मिनट डिलीवरी, होम राशन, मलाई लस्सी, थोक ऑर्डर या किसी भी सवाल के लिए हमसे सीधे संपर्क करें। हम सुबह 7:00 बजे से रात 10:00 बजे तक सेवा में उपलब्ध हैं।' 
            : 'Have questions about 30-minute delivery, home ration, artisanal lassi, bulk orders, or item returns? Connect with us directly — available 7 AM to 10 PM daily.'}
        </p>
      </div>

      <!-- 4 CONTACT INFO MATRIX -->
      <div class="contact-info-grid">
        <a href="tel:+919415552992" class="contact-info-card scroll-reveal">
          <div class="contact-info-icon-box" style="background: rgba(16, 185, 129, 0.14); color: #10b981;">
            <i data-lucide="phone-call"></i>
          </div>
          <div>
            <strong style="font-size: 0.92rem; color: var(--text-main); font-weight: 800;">${isHindi ? 'फोन कॉल सपोर्ट' : 'Direct Call'}</strong>
            <span style="font-size: 0.82rem; color: var(--primary); font-weight: 700; display: block; margin-top: 2px;">+91 94155 52992</span>
          </div>
        </a>

        <a href="https://wa.me/919415552992" target="_blank" class="contact-info-card scroll-reveal">
          <div class="contact-info-icon-box" style="background: rgba(34, 197, 94, 0.14); color: #22c55e;">
            <i data-lucide="message-circle"></i>
          </div>
          <div>
            <strong style="font-size: 0.92rem; color: var(--text-main); font-weight: 800;">${isHindi ? 'व्हाट्सएप ऑर्डर चैट' : 'Instant WhatsApp Chat'}</strong>
            <span style="font-size: 0.82rem; color: #22c55e; font-weight: 700; display: block; margin-top: 2px;">${isHindi ? 'चैट शुरू करें ➔' : 'Chat Now ➔'}</span>
          </div>
        </a>

        <div class="contact-info-card scroll-reveal">
          <div class="contact-info-icon-box" style="background: rgba(14, 165, 233, 0.14); color: #0ea5e9;">
            <i data-lucide="map-pin"></i>
          </div>
          <div>
            <strong style="font-size: 0.92rem; color: var(--text-main); font-weight: 800;">${isHindi ? 'दुकान का पता' : 'Store Location'}</strong>
            <span style="font-size: 0.78rem; color: var(--text-muted); display: block; margin-top: 2px;">Devari Bazar, Haliya, Mirzapur</span>
          </div>
        </div>

        <div class="contact-info-card scroll-reveal">
          <div class="contact-info-icon-box" style="background: rgba(245, 158, 11, 0.14); color: #d97706;">
            <i data-lucide="clock"></i>
          </div>
          <div>
            <strong style="font-size: 0.92rem; color: var(--text-main); font-weight: 800;">${isHindi ? 'समय सीमा सूचना' : 'Order Ready Time'}</strong>
            <span style="font-size: 0.78rem; color: var(--text-muted); display: block; margin-top: 2px;">${isHindi ? '30 मिनट में सामान तैयार' : 'Ready in 30 mins after order'}</span>
          </div>
        </div>
      </div>

      <!-- MAIN CONTACT GRID -->
      <div class="contact-main-grid">
        <!-- Contact Form Card -->
        <div class="contact-form-card scroll-reveal">
          <h3 style="font-size: 1.35rem; font-weight: 800; color: var(--text-main); margin-bottom: 6px; border: none; padding: 0;">
            <i data-lucide="send" style="width: 20px; height: 20px; color: var(--primary); display: inline-block; vertical-align: middle; margin-right: 6px;"></i>
            ${isHindi ? 'संदेश भेजें (Send Message)' : 'Send Us a Direct Message'}
          </h3>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 18px;">
            ${isHindi ? 'नीचे विषय चुनें और अपना मैसेज टाइप करें, दुकानदार तुरंत कॉल बैक करेंगे:' : 'Choose a query topic and send your note for instant store owner callback:'}
          </p>

          <!-- Query Topic Chips -->
          <div class="contact-topic-chips">
            <button class="topic-chip-btn active" onclick="selectContactTopic(this, '30-Min Delivery')">🛒 ${isHindi ? '30-मिनट डिलीवरी' : '30-Min Delivery'}</button>
            <button class="topic-chip-btn" onclick="selectContactTopic(this, 'Fresh Milk & Lassi')">🥛 ${isHindi ? 'ताज़ा दूध व लस्सी' : 'Fresh Milk & Lassi'}</button>
            <button class="topic-chip-btn" onclick="selectContactTopic(this, 'Bulk Kirana Order')">📦 ${isHindi ? 'थोक राशन ऑर्डर' : 'Bulk Kirana Order'}</button>
            <button class="topic-chip-btn" onclick="selectContactTopic(this, 'Product Return & Support')">💬 ${isHindi ? 'अन्य सहायता' : 'General Support'}</button>
          </div>

          <form onsubmit="handleContactSubmit(event)">
            <div class="form-row">
              <div class="form-field">
                <label for="contact-name">${isHindi ? 'आपका नाम *' : 'Your Full Name *'}</label>
                <input type="text" id="contact-name" required value="${window.state.user ? window.state.user.name : 'Vishal Kumar'}">
              </div>
              <div class="form-field">
                <label for="contact-phone">${isHindi ? 'मोबाइल नंबर *' : 'Phone Number *'}</label>
                <input type="tel" id="contact-phone" required value="${window.state.user ? window.state.user.phone : '9415552992'}">
              </div>
            </div>

            <div class="form-field" style="margin-bottom: var(--spacing-md);">
              <label for="contact-msg">${isHindi ? 'मैसेज का विवरण *' : 'Message Details *'}</label>
              <textarea id="contact-msg" rows="4" style="background: var(--bg-base); border: 1.5px solid var(--border-color); padding: 0.8rem; border-radius: 12px; color: var(--text-main); font-family: inherit; width: 100%;" required placeholder="${isHindi ? 'यहाँ अपना प्रश्न टाइप करें... (उदा. आटा 10kg का रेट क्या है?)' : 'Type your query details here...'}"></textarea>
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; border-radius: 16px; padding: 0.9rem; font-size: 1rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 8px;">
              <i data-lucide="send" style="width: 18px; height: 18px;"></i> ${isHindi ? 'मैसेज भेजें (Submit Message)' : 'Send Message Now'}
            </button>
          </form>
        </div>

        <!-- Store Map & Direct Location Card -->
        <div class="contact-map-card scroll-reveal">
          <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-main); margin-bottom: 12px; border: none; padding: 0;">
            <i data-lucide="map-pin" style="width: 18px; height: 18px; color: var(--primary); display: inline-block; vertical-align: middle; margin-right: 6px;"></i>
            ${isHindi ? 'दुकान का लाइव लोकेशन' : 'Store Live Location'}
          </h3>

          <div class="map-vector-box">
            <div class="map-radar-pulse"></div>
            <svg viewBox="0 0 100 100" width="100%" height="100%" opacity="0.6">
              <line x1="0" y1="20" x2="100" y2="20" stroke="var(--border-color)" stroke-width="2" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="var(--border-color)" stroke-width="2" />
              <line x1="0" y1="80" x2="100" y2="80" stroke="var(--border-color)" stroke-width="2" />
              <line x1="30" y1="0" x2="30" y2="100" stroke="var(--border-color)" stroke-width="2" />
              <line x1="70" y1="0" x2="70" y2="100" stroke="var(--border-color)" stroke-width="2" />
              <circle cx="50" cy="50" r="10" fill="rgba(16, 185, 129, 0.25)" />
              <circle cx="50" cy="50" r="5" fill="var(--primary)"/>
              <circle cx="50" cy="50" r="2" fill="#fff" />
            </svg>

            <div style="position: absolute; font-size: 0.78rem; font-weight: 800; background: var(--bg-surface); padding: 6px 12px; border-radius: 20px; border: 1px solid var(--border-color); display: flex; align-items: center; gap: 6px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
              <span class="status-pulse-dot"></span>
              <span>Devari Bazar, Haliya (Mirzapur)</span>
            </div>
          </div>

          <div style="text-align: left; font-size: 0.86rem; color: var(--text-muted); line-height: 1.6; background: var(--bg-surface-hover); padding: 14px; border-radius: 16px; border: 1px solid var(--border-color); margin-bottom: 16px;">
            <strong style="color: var(--text-main);">${isHindi ? 'पूरा पता:' : 'Full Address:'}</strong><br>
            Pal General Store, Devari Bazar, Haliya, Mirzapur, Uttar Pradesh - 231211<br><br>
            <strong style="color: var(--text-main);">${isHindi ? 'खुलने का समय:' : 'Store Hours:'}</strong><br>
            ${isHindi ? 'सोमवार - रविवार: सुबह 7:00 बजे से रात 10:00 बजे तक' : 'Monday - Sunday: 7:00 AM to 10:00 PM'}
          </div>

          <a href="https://maps.google.com/?q=Devari+Bazar+Haliya+Mirzapur" target="_blank" class="btn btn-secondary" style="width: 100%; border-radius: 16px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px;">
            <i data-lucide="navigation" style="width: 16px; height: 16px;"></i> ${isHindi ? 'गूगल मैप्स में रास्ता देखें' : 'Get Directions on Google Maps'}
          </a>
        </div>
      </div>
    </div>
  `;

  if (window.lucide) {
    window.lucide.createIcons();
  }
  if (window.initScrollDrivenAnimations) {
    window.initScrollDrivenAnimations();
  }
}

window.selectContactTopic = (btn, topic) => {
  const buttons = document.querySelectorAll('.topic-chip-btn');
  buttons.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const msgInput = document.getElementById('contact-msg');
  if (msgInput && !msgInput.value) {
    msgInput.value = `[Topic: ${topic}] `;
  }
};

window.handleContactSubmit = (e) => {
  e.preventDefault();
  const name = document.getElementById("contact-name").value;
  const isHindi = window.SHOP_CONFIG ? window.SHOP_CONFIG.language === "hi" : false;

  showToast(
    isHindi 
      ? `धन्यवाद ${name}! आपका संदेश भेज दिया गया है। दुकानदार आपको जल्द ही कॉल करेंगे।`
      : `Thank you ${name}! Your message has been sent. Our store owner will call you back shortly.`,
    "success"
  );
  e.target.reset();
};
