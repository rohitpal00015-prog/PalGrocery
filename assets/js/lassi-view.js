// Pal Grocery - Artisanal Lassi Lounge Experience Module

let lassiState = {
  activeFlavor: "mithi",
  sweetness: 100,
  thickness: 100,
  ice: 80,
  toppings: {
    malai: false,
    nuts: false,
    rose: false,
    kesar: false
  },
  creaminess: 0,
  hasWonPromo: false,
  soundEnabled: false,
  audioCtx: null,
  isPouring: false,
  filledLevel: 0
};

// Web Audio API ASMR Sound Engine
function initLassiAudio() {
  if (!lassiState.audioCtx) {
    lassiState.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (lassiState.audioCtx.state === 'suspended') {
    lassiState.audioCtx.resume();
  }
}

function playLassiPourSound(duration) {
  if (!lassiState.soundEnabled) return;
  initLassiAudio();
  const ctx = lassiState.audioCtx;
  const now = ctx.currentTime;
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) { data[i] = Math.random() * 2 - 1; }
  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass"; filter.Q.value = 8;
  filter.frequency.setValueAtTime(160, now);
  filter.frequency.exponentialRampToValueAtTime(750, now + duration);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.01, now);
  gain.gain.linearRampToValueAtTime(0.12, now + 0.15);
  gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
  noiseSource.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
  noiseSource.start(); noiseSource.stop(now + duration);
}

function playLassiChimeSound() {
  if (!lassiState.soundEnabled) return;
  initLassiAudio();
  const ctx = lassiState.audioCtx; const now = ctx.currentTime;
  const bell1 = ctx.createOscillator(); const bell2 = ctx.createOscillator(); const gain = ctx.createGain();
  bell1.type = "sine"; bell1.frequency.setValueAtTime(523.25, now); bell1.frequency.exponentialRampToValueAtTime(783.99, now + 0.6);
  bell2.type = "sine"; bell2.frequency.setValueAtTime(1046.50, now);
  gain.gain.setValueAtTime(0.15, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);
  bell1.connect(gain); bell2.connect(gain); gain.connect(ctx.destination);
  bell1.start(); bell2.start(); bell1.stop(now + 1.0); bell2.stop(now + 1.0);
}

function playLassiClickSound() {
  if (!lassiState.soundEnabled) return;
  initLassiAudio();
  const ctx = lassiState.audioCtx;
  const osc = ctx.createOscillator(); const gain = ctx.createGain();
  osc.frequency.setValueAtTime(320, ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.06);
  gain.gain.setValueAtTime(0.06, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
  osc.connect(gain); gain.connect(ctx.destination);
  osc.start(); osc.stop(ctx.currentTime + 0.06);
}

function spawnLassiConfetti() {
  const canvas = document.querySelector(".lassi-canvas");
  if (!canvas) return;
  const colors = ["#f59e0b", "#ffffff", "#fef3c7", "#d97706", "#fbbf24", "#fffbeb"];
  for (let i = 0; i < 60; i++) {
    const p = document.createElement("div"); p.className = "confetti-piece";
    const angle = Math.random() * Math.PI * 2; const distance = 40 + Math.random() * 120;
    p.style.setProperty("--tx", `${Math.cos(angle) * distance}px`); p.style.setProperty("--ty", `${Math.sin(angle) * distance - 80}px`);
    p.style.left = "50%"; p.style.bottom = "80px"; p.style.background = colors[Math.floor(Math.random() * colors.length)];
    canvas.appendChild(p); setTimeout(() => p.remove(), 1200);
  }
}

// Single flavor: Mithi Lassi
const lassiFlavors = {
  mithi: {
    id: "lassi-mithi",
    name: "Mithi Lassi",
    basePrice: 30,
    primary: "#d97706",
    secondary: "#92400e",
    bg: "#fffbeb",
    desc: "Authentic Sweet Kulhad Lassi",
    tName: "Mithi Lassi"
  }
};

// Branding process steps
const lassiBrandingSteps = [
  {
    icon: '<i data-lucide="sprout"></i>',
    img: "assets/img/lassi_step1_kisan.jpg",
    title: "Fresh Milk Sourcing",
    desc: "We source pure whole milk directly from local dairy farmers for maximum freshness."
  },
  {
    icon: '<i data-lucide="flame"></i>',
    img: "assets/img/lassi_step2_boil.png",
    title: "Slow Boiling",
    desc: "Milk is slowly boiled to sterilize and enhance natural sweetness."
  },
  {
    icon: '<i data-lucide="sun"></i>',
    img: "assets/img/lassi_step3_dahi.png",
    title: "Traditional Curd Setting",
    desc: "Cool milk is set into dense organic curd using traditional starters."
  },
  {
    icon: '<i data-lucide="refresh-cw"></i>',
    img: "assets/img/lassi_step4_mathna.png",
    title: "Hand Churning",
    desc: "Prepared curd is carefully hand-churned to preserve natural velvety cream texture."
  },
  {
    icon: '<i data-lucide="cup-soda"></i>',
    img: "assets/img/lassi_step5_kulhad.png",
    title: "Terracotta Kulhad Pour",
    desc: "Served cold in porous earthen clay pots for natural evaporative micro-cooling."
  },
  {
    icon: '<i data-lucide="check-circle-2"></i>',
    img: "assets/img/lassi_step6_ready.png",
    title: "100% Pure & Fasting Safe",
    desc: "Zero preservatives, artificial colors or adulteration. 100% safe for fasting (Vrat)."
  }
];

// Main render function
function renderLassiSimulation(viewport) {
  const flavor = lassiFlavors[lassiState.activeFlavor];
  const lang = window.SHOP_CONFIG ? window.SHOP_CONFIG.language : 'en';

  viewport.innerHTML = `
    <div class="container fade-in lassi-v2-container">

      <!-- ADVANCED CURSOR HOVER & SCROLL ANIMATION STYLES FOR LASSI PAGE -->
      <style>
        .lassi-v2-container {
          perspective: 1000px;
        }

        /* 1. Hero Glass Banner Hover Physics & Glare Beam */
        .lassi-v2-hero-banner {
          background: linear-gradient(135deg, #451a03 0%, #78350f 50%, #92400e 100%);
          border: 1.5px solid rgba(251, 191, 36, 0.45);
          border-radius: 26px;
          padding: 36px 24px;
          margin-top: 1.5rem;
          margin-bottom: 2rem;
          text-align: center;
          position: relative;
          overflow: hidden;
          box-shadow: 0 16px 45px rgba(69, 26, 3, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(14px);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease;
          animation: lassiBannerFade 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .lassi-v2-hero-banner:hover {
          transform: translateY(-6px) scale(1.01);
          box-shadow: 0 24px 60px rgba(69, 26, 3, 0.5), inset 0 1px 2px rgba(255, 255, 255, 0.4);
          border-color: #fbbf24;
        }

        @keyframes lassiBannerFade {
          from { opacity: 0; transform: translateY(-25px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .lassi-v2-hero-banner::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -60%;
          width: 40%;
          height: 200%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.25) 50%,
            transparent 100%
          );
          transform: rotate(25deg);
          animation: lassiShineBeam 4s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes lassiShineBeam {
          0% { left: -60%; }
          40% { left: 140%; }
          100% { left: 140%; }
        }

        .lassi-v2-pill-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(251, 191, 36, 0.18);
          border: 1px solid rgba(251, 191, 36, 0.5);
          color: #fef08a;
          font-size: 0.8rem;
          font-weight: 800;
          padding: 6px 18px;
          border-radius: 30px;
          box-shadow: 0 4px 15px rgba(245, 158, 11, 0.25);
          margin-bottom: 12px;
          transition: transform 0.3s ease;
          animation: lassiBadgePulse 2.2s ease-in-out infinite alternate;
        }

        .lassi-v2-hero-banner:hover .lassi-v2-pill-badge {
          transform: scale(1.08) rotate(-2deg);
        }

        @keyframes lassiBadgePulse {
          0% { transform: translateY(0) scale(1); box-shadow: 0 4px 15px rgba(245, 158, 11, 0.25); }
          100% { transform: translateY(-4px) scale(1.05); box-shadow: 0 8px 22px rgba(245, 158, 11, 0.5); }
        }

        .lassi-v2-hero-title {
          font-size: 2.6rem;
          font-weight: 900;
          line-height: 1.15;
          background: linear-gradient(135deg, #ffffff 0%, #fef08a 60%, #fbbf24 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 10px;
          letter-spacing: -0.8px;
          filter: drop-shadow(0 2px 8px rgba(0,0,0,0.4));
        }

        .lassi-v2-hero-sub {
          color: #fef3c7 !important;
          font-size: 1.05rem;
          font-weight: 500;
          max-width: 680px;
          margin: 0 auto;
          line-height: 1.55;
          text-shadow: 0 2px 10px rgba(0,0,0,0.5);
          opacity: 1 !important;
        }

        /* 2. Artisanal Quality Matrix Interactive Cards V3 (Luxury Glassmorphism & Aura Pulse) */
        .lassi-matrix-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: var(--spacing-lg);
          margin-bottom: 36px;
        }

        .lassi-matrix-card {
          background: var(--bg-surface);
          border: 1.5px solid var(--border-color);
          border-radius: 24px;
          padding: 24px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: transform 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.45s ease, border-color 0.45s ease, background 0.45s ease;
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }

        /* Unique HSL Theme Accents for Each Quality Card */
        .lassi-matrix-card[data-card="1"]:hover {
          border-color: #10b981;
          box-shadow: 0 20px 45px rgba(16, 185, 129, 0.22);
          transform: translateY(-10px) scale(1.03);
        }
        .lassi-matrix-card[data-card="2"]:hover {
          border-color: #f59e0b;
          box-shadow: 0 20px 45px rgba(245, 158, 11, 0.22);
          transform: translateY(-10px) scale(1.03);
        }
        .lassi-matrix-card[data-card="3"]:hover {
          border-color: #ef4444;
          box-shadow: 0 20px 45px rgba(239, 68, 68, 0.22);
          transform: translateY(-10px) scale(1.03);
        }
        .lassi-matrix-card[data-card="4"]:hover {
          border-color: #6366f1;
          box-shadow: 0 20px 45px rgba(99, 102, 241, 0.22);
          transform: translateY(-10px) scale(1.03);
        }

        .lassi-matrix-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .lassi-matrix-icon-avatar {
          width: 52px;
          height: 52px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
          position: relative;
        }

        .lassi-matrix-icon-avatar::after {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 22px;
          background: inherit;
          opacity: 0.35;
          filter: blur(8px);
          z-index: -1;
          animation: avatarAuraGlow 3s ease-in-out infinite alternate;
        }

        @keyframes avatarAuraGlow {
          0% { transform: scale(0.9); opacity: 0.25; }
          100% { transform: scale(1.15); opacity: 0.5; }
        }

        .lassi-matrix-icon-avatar i {
          animation: icon3DSway 4s ease-in-out infinite alternate;
          display: inline-block;
          width: 24px;
          height: 24px;
        }

        .lassi-matrix-card:nth-child(1) .lassi-matrix-icon-avatar i { animation-delay: 0s; }
        .lassi-matrix-card:nth-child(2) .lassi-matrix-icon-avatar i { animation-delay: 0.5s; }
        .lassi-matrix-card:nth-child(3) .lassi-matrix-icon-avatar i { animation-delay: 1.0s; }
        .lassi-matrix-card:nth-child(4) .lassi-matrix-icon-avatar i { animation-delay: 1.5s; }

        @keyframes icon3DSway {
          0% { transform: translateY(0) rotate(0deg) scale(1); }
          50% { transform: translateY(-5px) rotate(6deg) scale(1.1); }
          100% { transform: translateY(0) rotate(-4deg) scale(1); }
        }

        .lassi-matrix-card:hover .lassi-matrix-icon-avatar {
          transform: scale(1.18) rotate(8deg);
        }

        .lassi-matrix-num-tag {
          font-size: 0.8rem;
          font-weight: 900;
          padding: 4px 12px;
          border-radius: 20px;
          background: var(--bg-surface-hover);
          color: var(--text-muted);
          border: 1px solid var(--border-color);
          transition: all 0.3s ease;
        }

        .lassi-matrix-card:hover .lassi-matrix-num-tag {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
          transform: scale(1.1);
        }

        .lassi-matrix-chip-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.72rem;
          font-weight: 800;
          padding: 3px 10px;
          border-radius: 12px;
          width: fit-content;
          letter-spacing: 0.3px;
          text-transform: uppercase;
        }

        .lassi-matrix-title {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: -0.3px;
          margin-top: 2px;
        }

        .lassi-matrix-desc {
          font-size: 0.83rem;
          color: var(--text-muted);
          line-height: 1.5;
        }

        /* 3. Timeline Step Cards Cursor Zoom & Lift Physics */
        .lassi-process-step {
          background: var(--bg-surface);
          border: 1.5px solid var(--border-color);
          border-radius: 22px;
          padding: 20px;
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease, border-color 0.4s ease;
          position: relative;
          cursor: pointer;
        }

        .lassi-process-step:hover {
          transform: translateY(-8px) scale(1.02);
          border-color: #d97706;
          box-shadow: 0 18px 42px rgba(217, 119, 6, 0.2);
        }

        .process-step-img-wrap {
          overflow: hidden;
          border-radius: 16px;
          position: relative;
        }

        .process-step-img {
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), filter 0.5s ease;
        }

        .lassi-process-step:hover .process-step-img {
          transform: scale(1.12);
          filter: brightness(1.05) contrast(1.05);
        }

        .process-step-img-icon {
          position: absolute;
          bottom: -10px;
          right: 12px;
          width: 38px;
          height: 38px;
          border-radius: 12px;
          background: linear-gradient(135deg, #d97706, #b45309);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 16px rgba(217, 119, 6, 0.4);
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          animation: stepIconBreathing 3s ease-in-out infinite alternate;
        }

        .lassi-process-step:hover .process-step-img-icon {
          transform: scale(1.22) rotate(-8deg);
          box-shadow: 0 10px 25px rgba(217, 119, 6, 0.6);
        }

        @keyframes stepIconBreathing {
          0% { transform: scale(0.95); opacity: 0.9; }
          100% { transform: scale(1.12); opacity: 1; filter: drop-shadow(0 0 6px #fbbf24); }
        }

        .process-step-number {
          position: absolute;
          top: 14px;
          left: 14px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(217, 119, 6, 0.15);
          color: #d97706;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.88rem;
          border: 1.5px solid rgba(217, 119, 6, 0.4);
          transition: transform 0.3s ease, background 0.3s ease, color 0.3s ease;
          z-index: 2;
        }

        .lassi-process-step:hover .process-step-number {
          transform: scale(1.15);
          background: #d97706;
          color: white;
          box-shadow: 0 4px 14px rgba(217, 119, 6, 0.5);
        }

        /* 4. Pal Store Guarantee Banner Hover Physics & Shimmer */
        .lassi-v2-guarantee-banner {
          background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
          border-radius: 26px;
          padding: 28px 32px;
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          box-shadow: 0 12px 35px rgba(217, 119, 6, 0.35);
          position: relative;
          overflow: hidden;
          flex-wrap: wrap;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
          cursor: pointer;
        }

        .lassi-v2-guarantee-banner:hover {
          transform: translateY(-5px) scale(1.01);
          box-shadow: 0 20px 50px rgba(217, 119, 6, 0.5);
        }

        .lassi-v2-guarantee-banner::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transform: translateX(-100%);
          animation: lassiGoldShimmer 3.5s linear infinite;
        }

        @keyframes lassiGoldShimmer {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(100%); }
        }

        .mini-trust-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.82rem;
          font-weight: 700;
          transition: transform 0.3s ease;
        }

        .lassi-v2-guarantee-banner:hover .mini-trust-badge {
          transform: scale(1.08);
        }
      </style>

      <!-- HERO HEADER (Modern Luxury Glassmorphism) -->
      <div class="lassi-v2-hero-banner">
        <span class="lassi-v2-pill-badge">
          <i data-lucide="sparkles" class="inline-icon"></i> PAL ARTISANAL DAIRY LOUNGE
        </span>
        <h1 class="lassi-v2-hero-title">${lang === 'hi' ? 'शाही देसी मलाई लस्सी' : "Pal's Sovereign Artisanal Lassi"}</h1>
        <p class="lassi-v2-hero-sub">
          ${lang === 'hi' ? '100% शुद्ध देसी दही, मिट्टी का कुल्हड़, ताज़ा मलाई और हस्तनिर्मित स्वाद का अनुभव!' : '100% pure organic desi curd hand-churned in terracotta clay kulhad — crafted for ultimate refreshment!'}
        </p>
      </div>



      <!-- MODERN ARTISANAL QUALITY MATRIX (4 Interactive Luxury Cards) -->
      <div class="lassi-matrix-grid">
        <div class="lassi-matrix-card" data-card="1">
          <div class="lassi-matrix-card-top">
            <div class="lassi-matrix-icon-avatar" style="background: rgba(16, 185, 129, 0.15); color: #10b981;">
              <i data-lucide="sprout"></i>
            </div>
            <span class="lassi-matrix-num-tag">#01</span>
          </div>
          <span class="lassi-matrix-chip-tag" style="background: rgba(16, 185, 129, 0.12); color: #059669;">🌱 Pure Farm Milk</span>
          <h4 class="lassi-matrix-title">100% Pure Dahi</h4>
          <p class="lassi-matrix-desc">Made directly from fresh local farm milk without any added water, powders or artificial thickeners.</p>
        </div>

        <div class="lassi-matrix-card" data-card="2">
          <div class="lassi-matrix-card-top">
            <div class="lassi-matrix-icon-avatar" style="background: rgba(245, 158, 11, 0.15); color: #d97706;">
              <i data-lucide="sun"></i>
            </div>
            <span class="lassi-matrix-num-tag">#02</span>
          </div>
          <span class="lassi-matrix-chip-tag" style="background: rgba(245, 158, 11, 0.12); color: #d97706;">🏺 Clay Cooled</span>
          <h4 class="lassi-matrix-title">Terracotta Clay Kulhad</h4>
          <p class="lassi-matrix-desc">Served in unglazed earthy clay vessels for natural evaporative micro-cooling and authentic taste.</p>
        </div>

        <div class="lassi-matrix-card" data-card="3">
          <div class="lassi-matrix-card-top">
            <div class="lassi-matrix-icon-avatar" style="background: rgba(239, 68, 68, 0.15); color: #ef4444;">
              <i data-lucide="heart"></i>
            </div>
            <span class="lassi-matrix-num-tag">#03</span>
          </div>
          <span class="lassi-matrix-chip-tag" style="background: rgba(239, 68, 68, 0.12); color: #dc2626;">🙏 Satvik & Vrat Safe</span>
          <h4 class="lassi-matrix-title">Fasting (Vrat) Approved</h4>
          <p class="lassi-matrix-desc">100% satvik preparation process making it fully safe for holy fasting and religious observance.</p>
        </div>

        <div class="lassi-matrix-card" data-card="4">
          <div class="lassi-matrix-card-top">
            <div class="lassi-matrix-icon-avatar" style="background: rgba(99, 102, 241, 0.15); color: #6366f1;">
              <i data-lucide="utensils-crossed"></i>
            </div>
            <span class="lassi-matrix-num-tag">#04</span>
          </div>
          <span class="lassi-matrix-chip-tag" style="background: rgba(99, 102, 241, 0.12); color: #4f46e5;">🥄 Velvet Layer</span>
          <h4 class="lassi-matrix-title">Spoonable Thick Cream</h4>
          <p class="lassi-matrix-desc">Dense velvet cream layer on top that is thick enough to enjoy with a spoon before drinking!</p>
        </div>
      </div>

      <!-- SOURCING & PREPARATION TIMELINE -->
      <div class="lassi-process-section" style="margin-bottom:28px;">
        <div class="lassi-process-header">
          <span class="process-header-label"><i data-lucide="sprout" class="inline-icon"></i> SOURCING TO KULHAD</span>
          <h2 class="process-header-title">${lang === 'hi' ? 'किसान के खेत से आपके कुल्हड़ तक' : 'From Local Farmers to Your Terracotta Kulhad'}</h2>
        </div>
        <div class="lassi-process-grid">
          ${lassiBrandingSteps.map((step, i) => `
            <div class="lassi-process-step">
              <div class="process-step-number">${i + 1}</div>
              <div class="process-step-img-wrap">
                <img
                  src="${step.img}"
                  alt="${step.title}"
                  class="process-step-img"
                  loading="lazy"
                  onerror="this.style.display='none'"
                />
                <span class="process-step-img-icon">${step.icon}</span>
              </div>
              <div class="process-step-title">${step.title}</div>
              <div class="process-step-desc">${step.desc}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- PAL STORE GUARANTEE BANNER -->
      <div class="lassi-v2-guarantee-banner">
        <div style="display:flex;align-items:center;gap:16px;">
          <div style="font-size:3rem;line-height:1;"><i data-lucide="shield-check"></i></div>
          <div>
            <h3 style="font-size:1.35rem;font-weight:900;margin-bottom:4px;">100% Pure Guarantee</h3>
            <p style="font-size:0.88rem;color:#fef08a;line-height:1.5;">
              Pal General Store uses 100% pure milk and curd since 2004. Completely unadulterated and safe for holy fasting (Vrat).
            </p>
          </div>
        </div>
        <div style="display:flex;gap:10px;flex-shrink:0;">
          <div class="mini-trust-badge" style="background:rgba(255,255,255,0.2);color:white;border-color:rgba(255,255,255,0.4);">
            <i data-lucide="heart" class="inline-icon"></i> Fasting Safe
          </div>
          <div class="mini-trust-badge" style="background:rgba(255,255,255,0.2);color:white;border-color:rgba(255,255,255,0.4);">
            <i data-lucide="sprout" class="inline-icon"></i> 100% Pure
          </div>
        </div>
      </div>

    </div>
  `;

  updateLassiTheme(flavor);
  attachLassiListeners();
}

function updateLassiTheme(flavor) {
  const root = document.documentElement;
  root.style.setProperty('--current-lassi-primary', flavor.primary);
  root.style.setProperty('--current-lassi-secondary', flavor.secondary);
  root.style.setProperty('--current-lassi-bg', flavor.bg);
}

function calculateLassiPrice() {
  const flavor = lassiFlavors[lassiState.activeFlavor];
  let price = flavor.basePrice;
  if (lassiState.toppings.malai) price += 20;
  if (lassiState.toppings.nuts) price += 25;
  if (lassiState.toppings.rose) price += 15;
  if (lassiState.toppings.kesar) price += 30;
  return price;
}

function updatePriceLabel() {
  const totalSpan = document.getElementById("lassi-total-price");
  if (totalSpan) totalSpan.textContent = calculateLassiPrice();

  const tagsContainer = document.getElementById("active-topping-tags");
  if (tagsContainer) {
    let tagsHTML = `<span style="background:#fff;border:1px solid #d97706;color:#92400e;font-size:0.75rem;font-weight:700;padding:4px 12px;border-radius:14px;">100% Pure Dahi</span>`;
    if (lassiState.toppings.malai) tagsHTML += `<span style="background:#fff;border:1px solid #d97706;color:#92400e;font-size:0.75rem;font-weight:700;padding:4px 12px;border-radius:14px;">+ Extra Malai</span>`;
    if (lassiState.toppings.nuts) tagsHTML += `<span style="background:#fff;border:1px solid #d97706;color:#92400e;font-size:0.75rem;font-weight:700;padding:4px 12px;border-radius:14px;">+ Pista Almond</span>`;
    if (lassiState.toppings.rose) tagsHTML += `<span style="background:#fff;border:1px solid #d97706;color:#92400e;font-size:0.75rem;font-weight:700;padding:4px 12px;border-radius:14px;">+ Rose Syrup</span>`;
    if (lassiState.toppings.kesar) tagsHTML += `<span style="background:#fff;border:1px solid #d97706;color:#92400e;font-size:0.75rem;font-weight:700;padding:4px 12px;border-radius:14px;">+ Kesar Threads</span>`;
    tagsContainer.innerHTML = tagsHTML;
  }
}

function attachLassiListeners() {
  if (window.lucide) window.lucide.createIcons();
  if (window.initScrollDrivenAnimations) window.initScrollDrivenAnimations();

  const asmrBtn = document.getElementById("lassi-asmr-btn");
  if (asmrBtn) {
    asmrBtn.addEventListener("click", () => {
      lassiState.soundEnabled = !lassiState.soundEnabled;
      asmrBtn.classList.toggle("active", lassiState.soundEnabled);
      asmrBtn.innerHTML = `<i data-lucide="${lassiState.soundEnabled ? 'volume-2' : 'volume-x'}"></i>`;
      if (window.lucide) window.lucide.createIcons();
      if (lassiState.soundEnabled) playLassiChimeSound();
    });
  }

  const slideSweet = document.getElementById("slide-sweetness");
  const slideThick = document.getElementById("slide-thickness");
  const slideIce = document.getElementById("slide-ice");

  if (slideSweet) {
    slideSweet.addEventListener("input", e => {
      lassiState.sweetness = e.target.value;
      document.getElementById("lbl-sweetness").textContent = `${lassiState.sweetness}%`;
      playLassiClickSound();
    });
  }

  if (slideThick) {
    slideThick.addEventListener("input", e => {
      lassiState.thickness = e.target.value;
      document.getElementById("lbl-thickness").textContent = `${lassiState.thickness}%`;
      const dens = document.getElementById("display-thickness-val");
      if (dens) dens.textContent = lassiState.thickness > 140 ? "Ultra Spoonable" : lassiState.thickness > 90 ? "Super Thick" : "Classic";
      playLassiClickSound();
    });
  }

  if (slideIce) {
    slideIce.addEventListener("input", e => {
      lassiState.ice = e.target.value;
      document.getElementById("lbl-ice").textContent = `${lassiState.ice}%`;
      const cool = document.getElementById("display-ice-cool");
      if (cool) cool.textContent = lassiState.ice > 80 ? "4 deg C Chilled" : lassiState.ice > 40 ? "8 deg C Cold" : "Room Temp";
      playLassiClickSound();
    });
  }

  document.querySelectorAll(".topping-card").forEach(card => {
    card.addEventListener("click", e => {
      const topKey = card.dataset.topping;
      if (!topKey) return;
      lassiState.toppings[topKey] = !lassiState.toppings[topKey];
      const chk = card.querySelector("input[type='checkbox']");
      if (chk) chk.checked = lassiState.toppings[topKey];
      card.classList.toggle("checked", lassiState.toppings[topKey]);
      playLassiClickSound();
      updatePriceLabel();
    });
  });

  const pourBtn = document.getElementById("lassi-pour-btn");
  if (pourBtn) {
    pourBtn.addEventListener("click", () => {
      playLassiPourSound(1.2);
      playLassiChimeSound();
      spawnLassiConfetti();

      const flavorObj = lassiFlavors[lassiState.activeFlavor];
      const customPrice = calculateLassiPrice();
      const customId = `lassi-custom-${Date.now()}`;

      const toppingsApplied = Object.keys(lassiState.toppings).filter(t => lassiState.toppings[t])
        .map(t => t === 'malai' ? 'Extra Cream' : t === 'nuts' ? 'Pistachio Almond' : t === 'rose' ? 'Rose Syrup' : 'Kesar Threads');
      const toppingsText = toppingsApplied.length > 0 ? ` with Toppings: ${toppingsApplied.join(', ')}` : '';
      const desc = `Customized ${flavorObj.name} (Sweetness: ${lassiState.sweetness}%, Thickness: ${lassiState.thickness}%, Ice: ${lassiState.ice}%)${toppingsText}`;

      window.state.inventory.push({
        id: customId,
        name: `${flavorObj.name} (Fresh Recipe)`,
        price: customPrice,
        stock: 99,
        category: "dairy",
        supplier: "Pal Artisanal Dairy",
        description: desc,
        status: "hidden"
      });

      window.addProductToCart(customId, 1, lassiState.ice > 50 ? "chilled" : "regular");

      if (window.showToast) {
        window.showToast(`Order Placed! ${flavorObj.tName} added to cart for RS ${customPrice}`);
      }
    });
  }

  const addCart = document.getElementById("lassi-add-cart-btn");
  if (addCart) {
    addCart.addEventListener("click", () => {
      const flavorObj = lassiFlavors[lassiState.activeFlavor];
      const customPrice = calculateLassiPrice();
      const toppingsApplied = Object.keys(lassiState.toppings).filter(t => lassiState.toppings[t])
        .map(t => t === 'malai' ? 'Extra Cream' : t === 'nuts' ? 'Pistachio Almond' : t === 'rose' ? 'Rose Syrup' : 'Kesar Threads');
      const toppingsText = toppingsApplied.length > 0 ? ` with Toppings: ${toppingsApplied.join(', ')}` : '';
      const desc = `Customized ${flavorObj.name} (Sweetness: ${lassiState.sweetness}%, Thickness: ${lassiState.thickness}%, Ice: ${lassiState.ice}%)${toppingsText}`;
      const customId = `lassi-custom-${Date.now()}`;

      window.state.inventory.push({
        id: customId,
        name: `${flavorObj.name} (Custom Recipe)`,
        price: customPrice,
        stock: 99,
        category: "dairy",
        supplier: "Pal Artisanal Dairy",
        description: desc,
        status: "hidden"
      });

      window.addProductToCart(customId, 1, lassiState.ice > 50 ? "chilled" : "regular");
      playLassiChimeSound();

      if (window.showToast) {
        window.showToast(`Recipe saved & added to basket! RS ${customPrice}`);
      }
    });
  }
}

window.renderLassiSimulation = renderLassiSimulation;
