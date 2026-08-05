// Pal Grocery - About View Module

function renderCustomerAbout(viewport) {
  const isHindi = window.SHOP_CONFIG ? window.SHOP_CONFIG.language === "hi" : false;

  const sharedStyles = `
    <style>
      .story-wrapper {
        position: relative;
        overflow: hidden;
        padding-bottom: 5rem;
      }
      
      .ambient-glow {
        position: absolute;
        width: 420px;
        height: 420px;
        border-radius: 50%;
        filter: blur(120px);
        opacity: 0.15;
        z-index: -1;
        pointer-events: none;
      }
      .glow-left {
        top: 10%;
        left: -120px;
        background: radial-gradient(circle, var(--primary) 0%, transparent 70%);
        animation: floatGlowSlow 18s ease-in-out infinite alternate;
      }
      .glow-right {
        bottom: 15%;
        right: -120px;
        background: radial-gradient(circle, var(--secondary) 0%, transparent 70%);
        animation: floatGlowSlow 22s ease-in-out infinite alternate-reverse;
      }

      @keyframes floatGlowSlow {
        0% { transform: translateY(0px) scale(1); }
        100% { transform: translateY(-40px) scale(1.15); }
      }

      .story-hero-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: rgba(16, 185, 129, 0.12);
        border: 1px solid rgba(16, 185, 129, 0.35);
        color: var(--primary);
        font-size: 0.82rem;
        font-weight: 800;
        padding: 6px 18px;
        border-radius: 30px;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        margin-bottom: 14px;
        box-shadow: 0 4px 15px rgba(16, 185, 129, 0.12);
        animation: heroBadgeFloat 3s ease-in-out infinite alternate;
      }

      @keyframes heroBadgeFloat {
        0% { transform: translateY(0) scale(1); box-shadow: 0 4px 15px rgba(16, 185, 129, 0.12); }
        100% { transform: translateY(-4px) scale(1.04); box-shadow: 0 8px 22px rgba(16, 185, 129, 0.3); }
      }

      .shine-title {
        background: linear-gradient(135deg, var(--text-main) 10%, var(--primary) 65%, #3b82f6 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .about-grid {
        display: grid;
        grid-template-columns: 1.25fr 1fr;
        gap: var(--spacing-xl);
        align-items: start;
        margin-top: 2.5rem;
      }
      @media (max-width: 1024px) {
        .about-grid {
          grid-template-columns: 1fr;
          gap: var(--spacing-lg);
        }
      }

      .premium-card {
        position: relative;
        background: var(--bg-surface);
        border: 1.5px solid var(--border-color);
        border-radius: 26px;
        padding: var(--spacing-xl);
        box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.04);
        transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.45s ease, border-color 0.45s ease;
        overflow: hidden;
        cursor: pointer;
      }
      .premium-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, var(--primary), #3b82f6, var(--secondary));
        opacity: 0.85;
      }
      .premium-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 24px 55px -15px rgba(16, 185, 129, 0.2);
        border-color: rgba(16, 185, 129, 0.5);
      }

      .founder-frame {
        position: relative;
        width: 155px;
        height: 155px;
        margin-bottom: var(--spacing-md);
      }
      .founder-ring {
        position: absolute;
        top: -5px;
        left: -5px;
        right: -5px;
        bottom: -5px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--primary), var(--secondary), #3b82f6);
        animation: spinRing 12s linear infinite;
        padding: 3px;
        opacity: 0.9;
      }
      .founder-ring-outer {
        position: absolute;
        inset: -9px;
        border-radius: 50%;
        border: 2px dashed var(--primary);
        animation: spinRingReverse 20s linear infinite;
        opacity: 0.55;
      }
      .founder-ring::before {
        content: '';
        position: absolute;
        top: -10px;
        left: -10px;
        right: -10px;
        bottom: -10px;
        border-radius: 50%;
        background: inherit;
        filter: blur(14px);
        opacity: 0.45;
      }
      .founder-img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
        border: 4px solid var(--bg-surface);
        background: var(--bg-surface-hover);
        position: relative;
        z-index: 2;
      }
      @keyframes spinRing {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes spinRingReverse {
        0% { transform: rotate(360deg); }
        100% { transform: rotate(0deg); }
      }

      .pillars-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: var(--spacing-md);
        margin-top: 3rem;
      }

      .pillar-card {
        background: var(--bg-surface);
        border: 1.5px solid var(--border-color);
        border-radius: 22px;
        padding: 22px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.4s ease;
        cursor: pointer;
      }
      .pillar-card:hover {
        transform: translateY(-6px) scale(1.02);
        border-color: var(--primary);
        box-shadow: 0 16px 36px rgba(16, 185, 129, 0.15);
      }

      .pillar-icon-box {
        width: 46px;
        height: 46px;
        border-radius: 15px;
        background: rgba(16, 185, 129, 0.12);
        color: var(--primary);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 14px rgba(16, 185, 129, 0.2);
        transition: transform 0.3s ease;
      }
      .pillar-icon-box i {
        animation: pillarIconFloat 3.5s ease-in-out infinite alternate;
        display: inline-block;
      }
      .pillar-card:nth-child(1) .pillar-icon-box i { animation-delay: 0s; }
      .pillar-card:nth-child(2) .pillar-icon-box i { animation-delay: 0.4s; }
      .pillar-card:nth-child(3) .pillar-icon-box i { animation-delay: 0.8s; }
      .pillar-card:nth-child(4) .pillar-icon-box i { animation-delay: 1.2s; }

      @keyframes pillarIconFloat {
        0% { transform: translateY(0) scale(1); }
        50% { transform: translateY(-4px) scale(1.1) rotate(4deg); }
        100% { transform: translateY(0) scale(1); }
      }

      .pillar-card:hover .pillar-icon-box {
        transform: scale(1.15) rotate(6deg);
      }

      .milestone-section {
        margin-top: 3.5rem;
        background: var(--bg-surface);
        border: 1.5px solid var(--border-color);
        border-radius: 26px;
        padding: 28px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
      }
      .milestone-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--spacing-md);
        margin-top: 20px;
      }
      .milestone-card {
        background: var(--bg-surface-hover);
        border: 1.5px solid var(--border-color);
        border-radius: 20px;
        padding: 18px;
        position: relative;
        transition: transform 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
        cursor: pointer;
      }
      .milestone-card:hover {
        transform: translateY(-5px);
        border-color: var(--primary);
        box-shadow: 0 12px 30px rgba(16, 185, 129, 0.15);
      }
      .milestone-year {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 1.35rem;
        font-weight: 900;
        color: var(--primary);
        margin-bottom: 6px;
        transition: transform 0.3s ease;
      }
      .milestone-card:hover .milestone-year {
        transform: scale(1.08) translateX(4px);
      }
    </style>
  `;

  if (isHindi) {
    viewport.innerHTML = `
      ${sharedStyles}
      
      <div class="container fade-in story-wrapper" style="padding-bottom: 4rem;">
        <!-- Background Ambient Lights -->
        <div class="ambient-glow glow-left"></div>
        <div class="ambient-glow glow-right"></div>

        <!-- HERO HEADER -->
        <div style="text-align: center; max-width: 720px; margin: 3rem auto var(--spacing-xl) auto;">
          <span class="story-hero-badge">
            <i data-lucide="sparkles" style="width: 15px; height: 15px;"></i> हमारी 20 साल की विरासत
          </span>
          <h1 class="shine-title" style="font-size: 3rem; font-weight: 900; letter-spacing: -1.5px; margin-bottom: var(--spacing-md);">पाल ग्रॉसरी की कहानी</h1>
          <p style="color: var(--text-muted); line-height: 1.7; font-size: 1.05rem;">
            पिछले 20 वर्षों में बने विश्वास और विरासत को संजोए रखना, और आधुनिक डिजिटल माध्यम से अपने ग्राहकों के साथ जुड़ना।
          </p>
          
          <div style="display: flex; justify-content: center; gap: 10px; margin-top: var(--spacing-lg);">
            <button class="btn btn-secondary btn-sm" onclick="window.toggleLanguage()" style="gap: 8px; border-radius: var(--radius-full); box-shadow: var(--shadow-sm); padding: 0.55rem 1.4rem; font-weight: 700;">
              <i data-lucide="languages" style="width: 16px; height: 16px;"></i> Read in English
            </button>
          </div>
        </div>

        <!-- MAIN ABOUT GRID -->
        <div class="about-grid">
          <!-- Legacy Card -->
          <div class="premium-card scroll-reveal">
            <h2 style="font-size: 1.75rem; font-weight: 800; margin-bottom: var(--spacing-md); color: var(--primary); display: flex; align-items: center; gap: 10px; border: none; padding: 0;">
              <i data-lucide="shield-check" style="stroke-width: 2.2px;"></i>
              विश्वास पर बनी एक विरासत
            </h2>
            <div style="color: var(--text-main); line-height: 1.8; font-size: 1rem; display: flex; flex-direction: column; gap: var(--spacing-md);">
              <p>20 से अधिक वर्ष पहले, देवरी बाज़ार, हलिया (मिर्जापुर) के केंद्र में, <strong>श्री लल्लू पाल</strong> द्वारा एक साधारण लक्ष्य के साथ टिन की छत वाली चाय और पान की एक छोटी सी दुकान शुरू की गई थी — स्थानीय समुदाय की ईमानदारी, सम्मान और गुणवत्ता के साथ सेवा करना।</p>
              <p>जो एक मामूली सड़क किनारे की दुकान के रूप में शुरू हुआ था, वह धीरे-धीरे क्षेत्र के अनगिनत परिवारों के दैनिक जीवन का एक विश्वसनीय हिस्सा बन गया। जैसे-जैसे हमारे आसपास का बाजार बढ़ता गया, हमारी दुकान भी बढ़ती गई। वर्षों से, हमने चाय और पान से लेकर किराना का आवश्यक सामान, सामान्य household उत्पाद, कोल्ड ड्रिंक्स, लस्सी और कई अन्य रोज़मर्रा की ज़रूरतों को शामिल करने के लिए विस्तार किया।</p>
              <p>हालांकि, एक चीज़ कभी नहीं बदली — हमारे ग्राहकों के प्रति हमारी प्रतिबद्धता।</p>
              <p>दो दशकों से अधिक समय से, परिवारों की पीढ़ियाँ न केवल हमारे द्वारा पेश किए जाने वाले उत्पादों के कारण, बल्कि हमारे द्वारा बनाए गए संबंधों के कारण भी हमारे साथ खरीदारी कर रही हैं। हमारा मानना ​​है कि एक स्थानीय दुकान केवल सामान खरीदने की जगह से कहीं अधिक है; यह एक ऐसी जगह है जहाँ विश्वास कमाया जाता है, बातें साझा की जाती हैं, और ग्राहकों के साथ परिवार की तरह व्यवहार किया जाता है।</p>
              <p>आज, <strong>पाल जनरल स्टोर</strong> गर्व से देवरी बाज़ार के लोगों की उन्हीं मूल्यों के साथ सेवा कर रहा है जिन पर इसकी स्थापना की गई थी: <strong>ईमानदारी, विश्वसनीयता और व्यक्तिगत सेवा</strong>।</p>
              
              <div style="margin-top: var(--spacing-sm); font-weight: 700; border-top: 2px dashed var(--border-color); padding-top: var(--spacing-md); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--spacing-sm);">
                <span style="color: var(--text-muted);">हमारी कहानी का हिस्सा बनने के लिए धन्यवाद।</span>
                <span style="color: var(--primary); font-size: 1.1rem;">— लल्लू पाल और परिवार</span>
              </div>
            </div>
          </div>

          <!-- Founder Card -->
          <div class="premium-card scroll-reveal">
            <div style="display: flex; flex-direction: column; align-items: center; text-align: center; margin-bottom: var(--spacing-lg);">
              <div class="founder-frame">
                <div class="founder-ring-outer"></div>
                <div class="founder-ring"></div>
                <img src="image.png" alt="Founder" class="founder-img">
              </div>
              <h3 style="font-size: 1.45rem; font-weight: 800; color: var(--text-main); margin-bottom: 0;">श्री लल्लू पाल</h3>
              <span style="font-size: 0.8rem; color: var(--primary); font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px;">संस्थापक, पाल जनरल स्टोर</span>
            </div>
            
            <div style="padding: var(--spacing-md) 0 0 0; border-top: 2px dashed var(--border-color); position: relative;">
              <i data-lucide="quote" style="position: absolute; top: 15px; left: -10px; width: 48px; height: 48px; color: var(--primary); opacity: 0.08; pointer-events: none;"></i>
              <h4 style="font-size: 1.15rem; font-weight: 800; margin-bottom: var(--spacing-sm); color: var(--text-main); display: flex; align-items: center; gap: 8px; border: none; padding: 0;">
                संस्थापक का संदेश
              </h4>
              <div style="color: var(--text-muted); line-height: 1.8; font-size: 0.98rem; font-style: italic; display: flex; flex-direction: column; gap: 10px;">
                <p>"जब मैंने 20 से अधिक साल पहले इस दुकान की शुरुआत की थी, तब यह टिन की छत के नीचे सिर्फ एक छोटी सी चाय और पान की दुकान थी। उस समय, देवरी बाज़ार बहुत अलग था, और हमारे आसपास केवल कुछ ही दुकानें थीं।"</p>
                <p>"अपने ग्राहकों के समर्थन और विश्वास के साथ, हमने धीरे-धीरे अपने व्यवसाय का विस्तार किया और साल-दर-साल बढ़ते रहे। पीढ़ी-दर-पीढ़ी परिचित चेहरों को वापस आते देखना इस यात्रा का सबसे बड़ा पुरस्कार रहा है।"</p>
                <p>"आज, जैसे ही हमारी दुकान डिजिटल दुनिया में प्रवेश कर रही है, हमारा वादा वही है — हर ग्राहक की ईमानदारी, सम्मान और सच्चे दिल से सेवा करना।"</p>
              </div>
              <p style="text-align: right; font-weight: 800; color: var(--text-main); margin-top: var(--spacing-md); font-size: 1.05rem;">
                — लल्लू पाल
              </p>
            </div>
          </div>
        </div>

        <!-- 4 CORE PILLARS GRID -->
        <div class="pillars-grid">
          <div class="pillar-card scroll-reveal">
            <div class="pillar-icon-box">
              <i data-lucide="heart-handshake" style="width:22px;height:22px;"></i>
            </div>
            <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--text-main);">अटूट विश्वास (20+ वर्ष)</h4>
            <p style="font-size: 0.83rem; color: var(--text-muted); line-height: 1.5;">2004 से देवरी बाज़ार के 2,000 से अधिक परिवारों की ईमानदारी और भरोसे के साथ सेवा।</p>
          </div>

          <div class="pillar-card scroll-reveal">
            <div class="pillar-icon-box" style="background: rgba(245, 158, 11, 0.12); color: #d97706;">
              <i data-lucide="sprout" style="width:22px;height:22px;"></i>
            </div>
            <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--text-main);">100% शुद्धता व सात्विक</h4>
            <p style="font-size: 0.83rem; color: var(--text-muted); line-height: 1.5;">ताजा खेत का दूध, शुद्ध दही और बिना किसी मिलावट के पवित्र राशन सामान।</p>
          </div>

          <div class="pillar-card scroll-reveal">
            <div class="pillar-icon-box" style="background: rgba(14, 165, 233, 0.12); color: #0ea5e9;">
              <i data-lucide="truck" style="width:22px;height:22px;"></i>
            </div>
            <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--text-main);">30 मिनट में होम डिलीवरी</h4>
            <p style="font-size: 0.83rem; color: var(--text-muted); line-height: 1.5;">ऑर्डर सबमिट करने के 30 मिनट में दुकान से पिकअप करें या घर पर डिलीवरी पाएं।</p>
          </div>

          <div class="pillar-card scroll-reveal">
            <div class="pillar-icon-box" style="background: rgba(168, 85, 247, 0.12); color: #a855f7;">
              <i data-lucide="users" style="width:22px;height:22px;"></i>
            </div>
            <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--text-main);">पारिवारिक रिश्ते</h4>
            <p style="font-size: 0.83rem; color: var(--text-muted); line-height: 1.5;">हम हर ग्राहक को अपना परिवार मानते हैं और व्यक्तिगत देखभाल के साथ सेवा करते हैं।</p>
          </div>
        </div>

        <!-- 4-MILESTONE EVOLUTION TIMELINE -->
        <div class="milestone-section scroll-reveal">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
            <i data-lucide="history" style="width:22px;height:22px;color:var(--primary);"></i>
            <h3 style="font-size: 1.35rem; font-weight: 800; color: var(--text-main); border: none; padding: 0;">विकास की समय-सीमा (2004 - 2026)</h3>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-muted);">एक छोटी चाय की दुकान से आधुनिक डिजिटल किराना स्टोर बनने का सफर:</p>
          
          <div class="milestone-grid">
            <div class="milestone-card">
              <div class="milestone-year">2004</div>
              <strong style="font-size: 0.92rem; color: var(--text-main); display: block; margin-bottom: 4px;">शुरुआत (टिन की छत)</strong>
              <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.45;">श्री लल्लू पाल द्वारा देवरी बाज़ार में चाय व पान स्टॉल की स्थापना।</p>
            </div>

            <div class="milestone-card">
              <div class="milestone-year">2012</div>
              <strong style="font-size: 0.92rem; color: var(--text-main); display: block; margin-bottom: 4px;">किराना स्टोर विस्तार</strong>
              <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.45;">दैनिक आवश्यक राशन, आटा, दाल व घरेलू सामान शामिल किया।</p>
            </div>

            <div class="milestone-card">
              <div class="milestone-year">2018</div>
              <strong style="font-size: 0.92rem; color: var(--text-main); display: block; margin-bottom: 4px;">रिफ्रेशमेंट व लस्सी हब</strong>
              <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.45;">100% शुद्ध मलाईदार कुल्हड़ लस्सी व कोल्ड-ड्रिंक्स का केंद्र बना।</p>
            </div>

            <div class="milestone-card">
              <div class="milestone-year">2026</div>
              <strong style="font-size: 0.92rem; color: var(--text-main); display: block; margin-bottom: 4px;">डिजिटल स्टोर व डिलीवरी</strong>
              <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.45;">PWA वेब ऐप, व्हाट्सएप टेक्स्ट ऑर्डर व 30-मिनट होम डिलीवरी लॉन्च।</p>
            </div>
          </div>
        </div>

      </div>
    `;
  } else {
    viewport.innerHTML = `
      ${sharedStyles}
      
      <div class="container fade-in story-wrapper" style="padding-bottom: 4rem;">
        <!-- Background Ambient Lights -->
        <div class="ambient-glow glow-left"></div>
        <div class="ambient-glow glow-right"></div>

        <!-- HERO HEADER -->
        <div style="text-align: center; max-width: 720px; margin: 3rem auto var(--spacing-xl) auto;">
          <span class="story-hero-badge">
            <i data-lucide="sparkles" style="width: 15px; height: 15px;"></i> Our 20-Year Legacy
          </span>
          <h1 class="shine-title" style="font-size: 3rem; font-weight: 900; letter-spacing: -1.5px; margin-bottom: var(--spacing-md);">The Pal Grocery Story</h1>
          <p style="color: var(--text-muted); line-height: 1.7; font-size: 1.05rem;">
            Preserving the trust and legacy built over the last 20 years while making it easier for customers to connect with us in a modern digital way.
          </p>
          
          <div style="display: flex; justify-content: center; gap: 10px; margin-top: var(--spacing-lg);">
            <button class="btn btn-secondary btn-sm" onclick="window.toggleLanguage()" style="gap: 8px; border-radius: var(--radius-full); box-shadow: var(--shadow-sm); padding: 0.55rem 1.4rem; font-weight: 700;">
              <i data-lucide="languages" style="width: 16px; height: 16px;"></i> हिंदी में पढ़ें / Read in Hindi
            </button>
          </div>
        </div>

        <!-- MAIN ABOUT GRID -->
        <div class="about-grid">
          <!-- Legacy Card -->
          <div class="premium-card scroll-reveal">
            <h2 style="font-size: 1.75rem; font-weight: 800; margin-bottom: var(--spacing-md); color: var(--primary); display: flex; align-items: center; gap: 10px; border: none; padding: 0;">
              <i data-lucide="shield-check" style="stroke-width: 2.2px;"></i>
              A Legacy Built on Trust
            </h2>
            <div style="color: var(--text-main); line-height: 1.8; font-size: 1rem; display: flex; flex-direction: column; gap: var(--spacing-md);">
              <p>More than 20 years ago, in the heart of Devari Bazar, Haliya (Mirzapur), a small tin-roof tea and paan shop was started by <strong>Mr. Lallu Pal</strong> with a simple goal — to serve the local community with honesty, respect, and quality.</p>
              <p>What began as a modest roadside shop gradually became a trusted part of daily life for countless families in the area. As the market around us grew, so did our store. Over the years, we expanded from tea and paan to include kirana essentials, general household products, cold drinks, lassi, and many other everyday needs.</p>
              <p>One thing, however, has never changed — our commitment to our customers.</p>
              <p>For more than two decades, generations of families have continued to shop with us not only because of the products we offer, but because of the relationships we have built.</p>
              <p>We believe that a local store is more than a place to buy goods; it is a place where trust is earned, conversations are shared, and customers are treated like family.</p>
              <p>Today, <strong>Pal General Store</strong> proudly serves the people of Devari Bazar with the same values on which it was founded: <strong>honesty, reliability, and personal service</strong>.</p>
              
              <div style="margin-top: var(--spacing-sm); font-weight: 700; border-top: 2px dashed var(--border-color); padding-top: var(--spacing-md); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--spacing-sm);">
                <span style="color: var(--text-muted);">Thank you for being a part of our story.</span>
                <span style="color: var(--primary); font-size: 1.1rem;">— Lallu Pal & Family</span>
              </div>
            </div>
          </div>

          <!-- Founder Card -->
          <div class="premium-card scroll-reveal">
            <div style="display: flex; flex-direction: column; align-items: center; text-align: center; margin-bottom: var(--spacing-lg);">
              <div class="founder-frame">
                <div class="founder-ring-outer"></div>
                <div class="founder-ring"></div>
                <img src="image.png" alt="Mr. Lallu Pal - Founder" class="founder-img">
              </div>
              <h3 style="font-size: 1.45rem; font-weight: 800; color: var(--text-main); margin-bottom: 0;">Mr. Lallu Pal</h3>
              <span style="font-size: 0.8rem; color: var(--primary); font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px;">Founder, Pal General Store</span>
            </div>
            
            <div style="padding: var(--spacing-md) 0 0 0; border-top: 2px dashed var(--border-color); position: relative;">
              <i data-lucide="quote" style="position: absolute; top: 15px; left: -10px; width: 48px; height: 48px; color: var(--primary); opacity: 0.08; pointer-events: none;"></i>
              <h4 style="font-size: 1.15rem; font-weight: 800; margin-bottom: var(--spacing-sm); color: var(--text-main); display: flex; align-items: center; gap: 8px; border: none; padding: 0;">
                Founder's Message
              </h4>
              <div style="color: var(--text-muted); line-height: 1.8; font-size: 0.98rem; font-style: italic; display: flex; flex-direction: column; gap: 10px;">
                <p>"When I started this shop more than 20 years ago, it was just a small tea and paan stall under a tin roof. At that time, Devari Bazar was very different, with only a few shops around us."</p>
                <p>"With the support and trust of our customers, we slowly expanded our business and continued to grow year after year. Seeing familiar faces return generation after generation has been the greatest reward of this journey."</p>
                <p>"Today, as our store enters the digital world, our promise remains the same — to serve every customer with honesty, respect, and genuine care."</p>
              </div>
              <p style="text-align: right; font-weight: 800; color: var(--text-main); margin-top: var(--spacing-md); font-size: 1.05rem;">
                — Lallu Pal
              </p>
            </div>
          </div>
        </div>

        <!-- 4 CORE PILLARS GRID -->
        <div class="pillars-grid">
          <div class="pillar-card scroll-reveal">
            <div class="pillar-icon-box">
              <i data-lucide="heart-handshake" style="width:22px;height:22px;"></i>
            </div>
            <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--text-main);">20+ Years Trust</h4>
            <p style="font-size: 0.83rem; color: var(--text-muted); line-height: 1.5;">Serving over 2,000 families in Devari Bazar with unshakeable integrity since 2004.</p>
          </div>

          <div class="pillar-card scroll-reveal">
            <div class="pillar-icon-box" style="background: rgba(245, 158, 11, 0.12); color: #d97706;">
              <i data-lucide="sprout" style="width:22px;height:22px;"></i>
            </div>
            <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--text-main);">100% Satvik Purity</h4>
            <p style="font-size: 0.83rem; color: var(--text-muted); line-height: 1.5;">Fresh local farm milk, pure dahi, and 100% unadulterated holy groceries.</p>
          </div>

          <div class="pillar-card scroll-reveal">
            <div class="pillar-icon-box" style="background: rgba(14, 165, 233, 0.12); color: #0ea5e9;">
              <i data-lucide="truck" style="width:22px;height:22px;"></i>
            </div>
            <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--text-main);">30-Min Express Delivery</h4>
            <p style="font-size: 0.83rem; color: var(--text-muted); line-height: 1.5;">Items packed and ready for store pickup or local home delivery within 30 mins.</p>
          </div>

          <div class="pillar-card scroll-reveal">
            <div class="pillar-icon-box" style="background: rgba(168, 85, 247, 0.12); color: #a855f7;">
              <i data-lucide="users" style="width:22px;height:22px;"></i>
            </div>
            <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--text-main);">Community Heart</h4>
            <p style="font-size: 0.83rem; color: var(--text-muted); line-height: 1.5;">Treating every customer like family with personal warmth and genuine care.</p>
          </div>
        </div>

        <!-- 4-MILESTONE EVOLUTION TIMELINE -->
        <div class="milestone-section scroll-reveal">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
            <i data-lucide="history" style="width:22px;height:22px;color:var(--primary);"></i>
            <h3 style="font-size: 1.35rem; font-weight: 800; color: var(--text-main); border: none; padding: 0;">Evolution Timeline (2004 - 2026)</h3>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-muted);">From a small roadside tea stall to a modern digital grocery store:</p>
          
          <div class="milestone-grid">
            <div class="milestone-card">
              <div class="milestone-year">2004</div>
              <strong style="font-size: 0.92rem; color: var(--text-main); display: block; margin-bottom: 4px;">Tin-Roof Tea Stall</strong>
              <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.45;">Founded by Mr. Lallu Pal as a modest tea & paan shop in Devari Bazar.</p>
            </div>

            <div class="milestone-card">
              <div class="milestone-year">2012</div>
              <strong style="font-size: 0.92rem; color: var(--text-main); display: block; margin-bottom: 4px;">Kirana Store Expansion</strong>
              <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.45;">Expanded into essential daily groceries, atta, dal, and general goods.</p>
            </div>

            <div class="milestone-card">
              <div class="milestone-year">2018</div>
              <strong style="font-size: 0.92rem; color: var(--text-main); display: block; margin-bottom: 4px;">Kulhad Lassi Hub</strong>
              <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.45;">Became the local destination for 100% pure thick kulhad lassi and drinks.</p>
            </div>

            <div class="milestone-card">
              <div class="milestone-year">2026</div>
              <strong style="font-size: 0.92rem; color: var(--text-main); display: block; margin-bottom: 4px;">Digital Storefront & App</strong>
              <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.45;">Launched PWA web store, WhatsApp ordering, and 30-min express delivery.</p>
            </div>
          </div>
        </div>

      </div>
    `;
  }
  
  if (window.lucide) {
    window.lucide.createIcons();
  }
  if (window.initScrollDrivenAnimations) {
    window.initScrollDrivenAnimations();
  }
}
