// Pal Grocery - Home View Module

function renderCustomerHome(viewport) {
  const lang = window.SHOP_CONFIG.language;
  const heroTitle = lang === 'hi' ? '20+ सालों का भरोसा<br>अब ऑनलाइन।' : '20+ Years of Trust<br>Now Online.';
  const heroDesc = lang === 'hi' 
    ? 'पाल जनरल स्टोर पिछले 20+ वर्षों से आपके परिवार को ताज़ा सब्जियाँ, डेयरी, घरेलू राशन और विश्वसनीय सेवा प्रदान कर रहा है। आज ही ऑनलाइन खरीदारी का अनुभव करें।'
    : 'Pal General Store has been connecting your family with premium quality groceries, dairy, and trusted local service for over 20 years. Experience modern digital shopping today.';
  const badgeText = lang === 'hi' ? '<i data-lucide="zap" class="inline-icon"></i> 30 मिनट में राशन की तुरंत डिलीवरी' : '<i data-lucide="zap" class="inline-icon"></i> Instant Kirana Delivery (30 Mins)';

  viewport.innerHTML = `
    <div class="container fade-in">
      <!-- Apple-style Hero Banner -->
      <section class="hero-section">
        <div class="hero-content">
          <span class="hero-badge">${badgeText}</span>
          <h1>${heroTitle}</h1>
          <p>${heroDesc}</p>
          
          <div class="hero-search-wrapper">
            <i data-lucide="search" style="color: var(--text-muted);"></i>
            <input type="text" class="hero-search-input" id="hero-catalog-search" placeholder="${lang === 'hi' ? 'दूध, सेब, नमक, आटा खोजें...' : 'Search fresh milk, apples, salt, atta...'}" onkeypress="handleHeroSearch(event)">
            <button class="voice-search-btn" id="voice-search-simulate" title="Simulate voice search" onclick="simulateVoiceSearch()">
              <i data-lucide="mic"></i>
            </button>
          </div>

          <!-- Floating Levitating Game SVG (No Box Container) -->
          <div class="hero-floating-svg-trigger" onclick="window.kiranaArcade.openModal()" title="Play Games & Win 25% OFF Coupons!">
            <div class="hero-svg-glow-ring"></div>
            <svg viewBox="0 0 100 100" width="68" height="68" class="hero-game-svg-element" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="hero-pad-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#a855f7"/>
                  <stop offset="50%" stop-color="#7c3aed"/>
                  <stop offset="100%" stop-color="#4c1d95"/>
                </linearGradient>
                <linearGradient id="hero-btn-glow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#fbbf24"/>
                  <stop offset="100%" stop-color="#ef4444"/>
                </linearGradient>
                <filter id="hero-drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="#7c3aed" flood-opacity="0.6"/>
                </filter>
              </defs>
              <!-- 3D Levitating Gamepad -->
              <path d="M 20 35 C 10 35 5 50 12 70 C 18 85 32 82 40 70 L 48 58 L 52 58 L 60 70 C 68 82 82 85 88 70 C 95 50 90 35 80 35 C 65 35 58 45 50 45 C 42 45 35 35 20 35 Z" fill="url(#hero-pad-grad)" stroke="#c084fc" stroke-width="2.5" filter="url(#hero-drop-shadow)"/>
              <rect x="23" y="48" width="6" height="16" rx="2" fill="#ffffff"/>
              <rect x="18" y="53" width="16" height="6" rx="2" fill="#ffffff"/>
              <circle cx="76" cy="49" r="4.5" fill="url(#hero-btn-glow)"/>
              <circle cx="84" cy="57" r="4.5" fill="url(#hero-btn-glow)"/>
              <circle cx="68" cy="57" r="4.5" fill="url(#hero-btn-glow)"/>
              <circle cx="76" cy="65" r="4.5" fill="url(#hero-btn-glow)"/>
              <ellipse cx="50" cy="42" rx="6" ry="3" fill="#38bdf8"/>
            </svg>
            <div class="hero-floating-svg-badge">
              <i data-lucide="gamepad-2" class="inline-icon"></i> PLAY KIRANA ARCADE!
            </div>
          </div>
        </div>
        <div class="hero-visuals">
          <div class="hero-visual-card">
            <img src="assets/img/shop_photo.png" alt="Shop Photo">
            <div class="hero-visual-card-title">${lang === 'hi' ? 'दुकान की तस्वीर' : 'Shop Photo'}</div>
          </div>
          <div class="hero-visual-card">
            <img src="assets/img/photo.png" alt="Fresh Produce">
            <div class="hero-visual-card-title">${lang === 'hi' ? 'ताज़ा राशन' : 'Product Photo'}</div>
          </div>
          <div class="hero-visual-card">
            <img src="assets/img/grocery_basket.png" alt="Grocery Basket Illustration">
            <div class="hero-visual-card-title">${lang === 'hi' ? 'राशन टोकरी' : 'Grocery Basket'}</div>
          </div>
          <div class="hero-visual-card">
            <img src="assets/img/storefront_image.png" alt="Storefront Image">
            <div class="hero-visual-card-title">${lang === 'hi' ? 'प्रवेश द्वार' : 'Storefront'}</div>
          </div>
        </div>
      </section>
      
      <!-- HOME PAGE CUSTOM REDESIGN STYLES -->
      <style>
        .home-cat-showcase {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
          gap: 18px;
          margin-top: 16px;
        }

        .home-cat-card-v2 {
          position: relative;
          background: var(--bg-surface);
          border: 1.5px solid var(--border-color);
          border-radius: 22px;
          padding: 22px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          cursor: pointer;
          overflow: hidden;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.03);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .home-cat-card-v2:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 38px rgba(0, 0, 0, 0.08);
          border-color: #0ea5e9;
        }

        .home-cat-icon-circle {
          width: 62px;
          height: 62px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 8px 20px rgba(0,0,0,0.06);
          position: relative;
          z-index: 1;
        }

        /* Continuous Ambient Glow Aura around Category Containers */
        .home-cat-icon-circle::before {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 24px;
          background: inherit;
          opacity: 0.35;
          filter: blur(8px);
          z-index: -1;
          animation: containerAuraPulse 3.5s ease-in-out infinite alternate;
        }

        @keyframes containerAuraPulse {
          0% { opacity: 0.2; filter: blur(6px); transform: scale(0.96); }
          100% { opacity: 0.55; filter: blur(10px); transform: scale(1.08); }
        }

        /* Continuous Levitating Breathing Animation for Category Icons */
        .home-cat-icon-circle i {
          animation: iconFloatBreathing 3.6s ease-in-out infinite alternate;
          display: inline-block;
        }

        .home-cat-card-v2:nth-child(1) .home-cat-icon-circle i { animation-delay: 0s; }
        .home-cat-card-v2:nth-child(2) .home-cat-icon-circle i { animation-delay: 0.4s; }
        .home-cat-card-v2:nth-child(3) .home-cat-icon-circle i { animation-delay: 0.8s; }
        .home-cat-card-v2:nth-child(4) .home-cat-icon-circle i { animation-delay: 1.2s; }
        .home-cat-card-v2:nth-child(5) .home-cat-icon-circle i { animation-delay: 1.6s; }

        @keyframes iconFloatBreathing {
          0% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-4px) scale(1.08); }
          100% { transform: translateY(0px) scale(1); }
        }

        .home-cat-card-v2:hover .home-cat-icon-circle {
          transform: scale(1.12) rotate(4deg);
        }

        .home-cat-title {
          font-size: 1.02rem;
          font-weight: 800;
          color: var(--text-main);
          margin: 0 0 6px 0;
        }

        .home-cat-tag {
          font-size: 0.76rem;
          font-weight: 700;
          color: var(--text-muted);
          background: var(--bg-base);
          padding: 3px 10px;
          border-radius: 12px;
          border: 1px solid var(--border-color);
        }

        .why-choose-grid-v2 {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          margin-top: 24px;
        }

        .why-choose-card-v2 {
          background: var(--bg-surface);
          border: 1.5px solid var(--border-color);
          border-radius: 22px;
          padding: 24px;
          position: relative;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.03);
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
        }

        .why-choose-card-v2:hover {
          transform: translateY(-5px);
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.09);
          border-color: #0ea5e9;
        }

        .why-num-badge {
          position: absolute;
          top: 18px;
          right: 20px;
          font-size: 1.5rem;
          font-weight: 900;
          color: var(--border-color);
          opacity: 0.5;
          font-family: monospace;
        }

        .why-icon-avatar {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          box-shadow: 0 8px 22px rgba(0, 0, 0, 0.08);
          transition: transform 0.3s ease;
          position: relative;
          z-index: 1;
        }

        .why-icon-avatar::after {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 18px;
          background: inherit;
          opacity: 0.35;
          filter: blur(6px);
          z-index: -1;
          animation: avatarGlowBreathing 3.5s ease-in-out infinite alternate;
        }

        @keyframes avatarGlowBreathing {
          0% { opacity: 0.2; transform: scale(0.95); }
          100% { opacity: 0.55; transform: scale(1.08); }
        }

        /* Gentle Swaying Motion for Why Choose Icons */
        .why-icon-avatar i {
          animation: iconGentleSway 4.2s ease-in-out infinite alternate;
          display: inline-block;
        }

        .why-choose-card-v2:nth-child(1) .why-icon-avatar i { animation-delay: 0s; }
        .why-choose-card-v2:nth-child(2) .why-icon-avatar i { animation-delay: 0.5s; }
        .why-choose-card-v2:nth-child(3) .why-icon-avatar i { animation-delay: 1.0s; }
        .why-choose-card-v2:nth-child(4) .why-icon-avatar i { animation-delay: 1.5s; }
        .why-choose-card-v2:nth-child(5) .why-icon-avatar i { animation-delay: 2.0s; }
        .why-choose-card-v2:nth-child(6) .why-icon-avatar i { animation-delay: 2.5s; }

        @keyframes iconGentleSway {
          0% { transform: rotate(0deg) translateY(0); }
          33% { transform: rotate(6deg) translateY(-2px); }
          66% { transform: rotate(-5deg) translateY(-1px); }
          100% { transform: rotate(0deg) translateY(0); }
        }

        .why-choose-card-v2:hover .why-icon-avatar {
          transform: scale(1.1);
        }

        .why-title-v2 {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--text-main);
          margin: 0 0 8px 0;
        }

        .why-desc-v2 {
          font-size: 0.88rem;
          color: var(--text-muted);
          line-height: 1.55;
          margin: 0;
        }

        .trending-header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .flame-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, #ef4444, #f59e0b);
          color: white;
          font-size: 0.78rem;
          font-weight: 800;
          padding: 5px 12px;
          border-radius: 20px;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }

        /* Continuous Flame & Sparkle Flickering */
        .flame-badge i {
          animation: flameFlicker 1.8s ease-in-out infinite alternate;
          display: inline-block;
        }

        @keyframes flameFlicker {
          0% { transform: scale(1) rotate(0deg); opacity: 0.85; }
          50% { transform: scale(1.22) rotate(-8deg); opacity: 1; filter: drop-shadow(0 0 6px #f59e0b); }
          100% { transform: scale(1) rotate(6deg); opacity: 0.9; }
        }

        /* Hero Badge Instant Delivery Zap Icon Pulse */
        .hero-badge i {
          animation: heroZapPulse 1.6s ease-in-out infinite alternate;
          display: inline-block;
        }

        @keyframes heroZapPulse {
          0% { transform: scale(0.95); opacity: 0.85; }
          100% { transform: scale(1.25); opacity: 1; filter: drop-shadow(0 0 8px #38bdf8); }
        }
      </style>

      <!-- Category quick buttons (Redesigned UI) -->
      <section class="category-strip" style="margin-top: var(--spacing-xl);">
        <div class="trending-header-bar">
          <div>
            <span class="flame-badge">
              <i data-lucide="sparkles" style="width: 14px; height: 14px;"></i> POPULAR SECTIONS
            </span>
            <h2 style="font-size: 1.8rem; font-weight: 900; margin-top: 6px; letter-spacing: -0.5px;">
              ${lang === 'hi' ? 'कैटेगरी के अनुसार खरीदें' : 'Shop by Category'}
            </h2>
          </div>
          <a href="#shop" class="btn btn-secondary btn-sm" onclick="navigateView('shop')" style="border-radius: 20px; padding: 8px 18px; font-weight: 700;">
            ${lang === 'hi' ? 'सभी देखें →' : 'See All Categories →'}
          </a>
        </div>
        
        <div class="home-cat-showcase">
          <div class="home-cat-card-v2" onclick="navigateView('shop', 'snacks')">
            <div class="home-cat-icon-circle" style="background: linear-gradient(135deg, #fffbeb, #fef3c7); color: #d97706;">
              <i data-lucide="cookie" style="width: 28px; height: 28px;"></i>
            </div>
            <h3 class="home-cat-title">${lang === 'hi' ? 'स्नैक्स और नमकीन' : 'Snacks & Munchies'}</h3>
            <span class="home-cat-tag">Chips & Biscuits</span>
          </div>

          <div class="home-cat-card-v2" onclick="navigateView('shop', 'groceries')">
            <div class="home-cat-icon-circle" style="background: linear-gradient(135deg, #ecfdf5, #d1fae5); color: #059669;">
              <i data-lucide="bean" style="width: 28px; height: 28px;"></i>
            </div>
            <h3 class="home-cat-title">${lang === 'hi' ? 'रसोई का सामान' : 'Groceries'}</h3>
            <span class="home-cat-tag">Atta, Rice & Oil</span>
          </div>

          <div class="home-cat-card-v2" onclick="navigateView('shop', 'cold_drink')">
            <div class="home-cat-icon-circle" style="background: linear-gradient(135deg, #e0f2fe, #bae6fd); color: #0284c7;">
              <i data-lucide="cup-soda" style="width: 28px; height: 28px;"></i>
            </div>
            <h3 class="home-cat-title">${lang === 'hi' ? 'कोल्ड ड्रिंक' : 'Cold Drinks'}</h3>
            <span class="home-cat-tag">Chilled Instantly</span>
          </div>

          <div class="home-cat-card-v2" onclick="navigateView('shop', 'lassi')">
            <div class="home-cat-icon-circle" style="background: linear-gradient(135deg, #fef3c7, #fde68a); color: #b45309;">
              <i data-lucide="glass-water" style="width: 28px; height: 28px;"></i>
            </div>
            <h3 class="home-cat-title">${lang === 'hi' ? 'लस्सी' : 'Lassi'}</h3>
            <span class="home-cat-tag">Fresh Desi Dahi</span>
          </div>

          <div class="home-cat-card-v2" onclick="navigateView('shop', 'essentials')">
            <div class="home-cat-icon-circle" style="background: linear-gradient(135deg, #faf5ff, #f3e8ff); color: #7c3aed;">
              <i data-lucide="shopping-bag" style="width: 28px; height: 28px;"></i>
            </div>
            <h3 class="home-cat-title">${lang === 'hi' ? 'रोज़ाना का राशन' : 'Daily Essentials'}</h3>
            <span class="home-cat-tag">Household Needs</span>
          </div>
        </div>
      </section>

      <!-- Why Choose Pal General Store Section (Redesigned UI) -->
      <section class="category-strip why-choose-section" style="margin-top: 3.5rem; margin-bottom: 3.5rem;">
        <div style="text-align: center; max-width: 650px; margin: 0 auto 2.2rem auto;">
          <span class="flame-badge" style="background: linear-gradient(135deg, #10b981, #059669);">
            <i data-lucide="shield-check" style="width: 14px; height: 14px;"></i> SINCE 2006
          </span>
          <h2 style="font-size: 2rem; font-weight: 900; letter-spacing: -0.5px; margin-top: 8px;">
            ${lang === 'hi' ? 'पाल जनरल स्टोर को क्यों चुनें?' : 'Why Choose Pal General Store'}
          </h2>
          <p style="color: var(--text-muted); font-size: 0.95rem; margin-top: 6px; line-height: 1.5;">
            ${lang === 'hi' ? '20+ वर्षों से स्थानीय परिवारों द्वारा विश्वसनीय और प्रीमियम सेवा' : 'Serving local families with trust, quality, and friendliness for over two decades.'}
          </p>
        </div>
        
        <div class="why-choose-grid-v2">
          <div class="why-choose-card-v2">
            <span class="why-num-badge">01</span>
            <div class="why-icon-avatar" style="background: linear-gradient(135deg, #ecfdf5, #a7f3d0); color: #059669;">
              <i data-lucide="clock" style="width: 24px; height: 24px;"></i>
            </div>
            <h3 class="why-title-v2">${lang === 'hi' ? '20+ वर्षों का अनुभव' : '20+ Years Experience'}</h3>
            <p class="why-desc-v2">${lang === 'hi' ? '2006 से हम आपके साथ हैं और हमेशा बेहतरीन सामान और सेवा प्रदान करते रहे हैं।' : 'Serving Noida with premium products and outstanding reliability since 2006.'}</p>
          </div>

          <div class="why-choose-card-v2">
            <span class="why-num-badge">02</span>
            <div class="why-icon-avatar" style="background: linear-gradient(135deg, #fdf2f8, #fbcfe8); color: #db2777;">
              <i data-lucide="users" style="width: 24px; height: 24px;"></i>
            </div>
            <h3 class="why-title-v2">${lang === 'hi' ? 'स्थानीय परिवारों का भरोसा' : 'Trusted by Local Families'}</h3>
            <p class="why-desc-v2">${lang === 'hi' ? 'हज़ारों पड़ोसियों और पीढ़ियों का अटूट विश्वास और प्रेम हमारा गौरव है।' : 'Preferred neighborhood store building strong relationships across generations.'}</p>
          </div>

          <div class="why-choose-card-v2">
            <span class="why-num-badge">03</span>
            <div class="why-icon-avatar" style="background: linear-gradient(135deg, #eff6ff, #bfdbfe); color: #2563eb;">
              <i data-lucide="qr-code" style="width: 24px; height: 24px;"></i>
            </div>
            <h3 class="why-title-v2">${lang === 'hi' ? 'UPI डिजिटल भुगतान' : 'UPI Payments'}</h3>
            <p class="why-desc-v2">${lang === 'hi' ? 'तेज़, सुरक्षित और कैशलेस भुगतान। GPay, PhonePe, Paytm या BHIM स्कैन करें।' : 'Safe, touchless checkout with scan-and-pay via Google Pay, PhonePe, Paytm, or BHIM.'}</p>
          </div>

          <div class="why-choose-card-v2">
            <span class="why-num-badge">04</span>
            <div class="why-icon-avatar" style="background: linear-gradient(135deg, #faf5ff, #e9d5ff); color: #7c3aed;">
              <i data-lucide="shopping-bag" style="width: 24px; height: 24px;"></i>
            </div>
            <h3 class="why-title-v2">${lang === 'hi' ? 'विस्तृत उत्पाद चयन' : 'Wide Product Selection'}</h3>
            <p class="why-desc-v2">${lang === 'hi' ? 'ताज़ा फल, सब्जियाँ, डेयरी से लेकर रोज़ाना का पूरा किराना सामान एक ही छत के नीचे।' : 'From fresh green groceries to daily home items, get everything you need in one basket.'}</p>
          </div>

          <div class="why-choose-card-v2">
            <span class="why-num-badge">05</span>
            <div class="why-icon-avatar" style="background: linear-gradient(135deg, #fffbeb, #fde68a); color: #d97706;">
              <i data-lucide="tag" style="width: 24px; height: 24px;"></i>
            </div>
            <h3 class="why-title-v2">${lang === 'hi' ? 'उचित और सही दाम' : 'Fair Pricing'}</h3>
            <p class="why-desc-v2">${lang === 'hi' ? 'हर सामान पर बचत, विशेष डिस्काउंट और बिना किसी छिपे हुए अतिरिक्त शुल्क के दाम।' : 'Guaranteed local value with daily bargains and honest product pricing.'}</p>
          </div>

          <div class="why-choose-card-v2">
            <span class="why-num-badge">06</span>
            <div class="why-icon-avatar" style="background: linear-gradient(135deg, #f0fdf4, #bbf7d0); color: #16a34a;">
              <i data-lucide="smile" style="width: 24px; height: 24px;"></i>
            </div>
            <h3 class="why-title-v2">${lang === 'hi' ? 'मित्रतापूर्ण व्यवहार' : 'Friendly Service'}</h3>
            <p class="why-desc-v2">${lang === 'hi' ? 'आपके अपने परिवार की दुकान। विनम्र स्टाफ, होम डिलीवरी और व्यक्तिगत मदद।' : 'Personalized customer-first assistance, home delivery, and warm hospitality.'}</p>
          </div>
        </div>
      </section>

      <!-- Trending Grocery list grid (Redesigned UI) -->
      <section class="category-strip" style="margin-bottom: 3.5rem;">
        <div class="trending-header-bar">
          <div>
            <span class="flame-badge" style="background: linear-gradient(135deg, #f59e0b, #ef4444);">
              <i data-lucide="flame" style="width: 14px; height: 14px;"></i> TOP DEMAND
            </span>
            <h2 style="font-size: 1.8rem; font-weight: 900; margin-top: 6px; letter-spacing: -0.5px;">
              ${lang === 'hi' ? 'चर्चित उत्पाद' : 'Trending Products'}
            </h2>
          </div>
          <a href="#shop" class="btn btn-primary btn-sm" onclick="navigateView('shop')" style="border-radius: 20px; padding: 8px 20px; font-weight: 800;">
            ${lang === 'hi' ? 'पूरा कैटलॉग देखें →' : 'Explore Full Catalog →'}
          </a>
        </div>

        <div class="products-grid" id="home-trending-grid">
          <!-- Populated by JS -->
        </div>
      </section>
    </div>
  `;

  // Render trending cards
  const trendingGrid = document.getElementById("home-trending-grid");
  if (trendingGrid) {
    const trendList = window.state.inventory.filter(p => p.status !== "hidden").slice(0, 4); // First 4 visible items
    trendingGrid.innerHTML = renderProductsListMarkup(trendList);
  }


}

function handleHeroSearch(e) {
  if (e.key === "Enter") {
    const val = e.target.value.trim();
    if (val.length > 0) {
      navigateView("shop", { search: val });
    }
  }
}

function simulateVoiceSearch() {
  const searchInput = document.getElementById("hero-catalog-search");
  const voiceBtn = document.getElementById("voice-search-simulate");

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (SpeechRecognition) {
    try {
      const recognition = new SpeechRecognition();
      recognition.lang = window.SHOP_CONFIG.language === 'hi' ? 'hi-IN' : 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      if (voiceBtn) {
        voiceBtn.style.color = "#ef4444";
        voiceBtn.style.transform = "scale(1.2)";
      }

      if (window.showToast) {
        window.showToast(window.SHOP_CONFIG.language === 'hi' ? 'सुन रहे हैं... उत्पाद का नाम बोलें!' : 'Listening... Speak your product search now!', "info");
      }

      recognition.start();

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (searchInput) searchInput.value = transcript;
        if (voiceBtn) {
          voiceBtn.style.color = "";
          voiceBtn.style.transform = "";
        }
        if (window.showToast) {
          window.showToast(`Voice Search: "${transcript}"`, "success");
        }
        setTimeout(() => {
          window.navigateView("shop", { search: transcript });
        }, 500);
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        if (voiceBtn) {
          voiceBtn.style.color = "";
          voiceBtn.style.transform = "";
        }
        fallbackVoiceSearch(searchInput);
      };

      recognition.onend = () => {
        if (voiceBtn) {
          voiceBtn.style.color = "";
          voiceBtn.style.transform = "";
        }
      };

      return;
    } catch (e) {
      console.warn("Web Speech API init failed:", e);
    }
  }

  fallbackVoiceSearch(searchInput);
}

function fallbackVoiceSearch(searchInput) {
  const sampleQueries = ["Fresh Milk", "Chakki Atta", "Shimla Apples", "Basmati Rice", "Desi Ghee", "Lassi"];
  const randomQuery = sampleQueries[Math.floor(Math.random() * sampleQueries.length)];

  if (searchInput) searchInput.value = randomQuery;
  if (window.showToast) {
    window.showToast(`Voice Search Result: "${randomQuery}"`, "info");
  }

  setTimeout(() => {
    window.navigateView("shop", { search: randomQuery });
  }, 600);
}
