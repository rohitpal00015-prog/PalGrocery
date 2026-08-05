// Pal Grocery - Loyalty Club & Rewards View Module

function renderRewardsPage(viewport) {
  const isLogged = window.state.user !== null;

  if (!isLogged) {
    // Show premium "Join Loyalty Club" login lock card
    viewport.innerHTML = `
      <div class="container fade-in" style="max-width: 600px; padding: 4rem 1.5rem; text-align: center;">
        <div class="glass-card" style="padding: var(--spacing-xl); border-radius: var(--radius-lg); border: 1px solid var(--border-color); box-shadow: var(--shadow-lg);">
          <div style="background: linear-gradient(135deg, var(--primary), var(--secondary)); width: 72px; height: 72px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-lg); color: white; margin: 0 auto var(--spacing-md) auto;">
            <i data-lucide="crown" style="width: 36px; height: 36px; stroke-width: 2px;"></i>
          </div>
          <h2 style="font-size: 1.8rem; font-weight: 800; margin-bottom: var(--spacing-sm); letter-spacing: -0.5px;">Pal Loyalty Club</h2>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: var(--spacing-lg);">
            Join our exclusive club to earn coins on every order, unlock premium membership tiers, and claim scratch cards to reveal discount coupon codes!
          </p>
          
          <div style="background: var(--bg-surface-hover); padding: var(--spacing-md); border-radius: var(--radius-sm); font-size: 0.85rem; text-align: left; margin-bottom: var(--spacing-lg); border: 1px solid var(--border-color); display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; align-items: center; gap: 8px; font-weight: 700; color: var(--text-main);"><i data-lucide="sparkles" style="color: var(--primary); width: 16px;"></i> Earn 1 Point for every ₹10 spent</div>
            <div style="display: flex; align-items: center; gap: 8px; font-weight: 700; color: var(--text-main);"><i data-lucide="truck" style="color: var(--primary); width: 16px;"></i> Silver/Gold gets free priority deliveries</div>
            <div style="display: flex; align-items: center; gap: 8px; font-weight: 700; color: var(--text-main);"><i data-lucide="gift" style="color: var(--primary); width: 16px;"></i> Exclusive scratch-cards and gifts</div>
          </div>
          
          <button class="btn btn-primary" onclick="navigateView('login', { redirect: 'rewards' })" style="width: 100%; border-radius: var(--radius-full);">
            <i data-lucide="log-in"></i> Sign In to Join Loyalty Club
          </button>
        </div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  // User is logged in, show rewards dashboard
  const user = window.state.user;
  const targetPoints = 500;
  const progressPercent = Math.min(100, (user.loyaltyPoints / targetPoints) * 100);

  viewport.innerHTML = `
    <div class="container fade-in" style="padding-bottom: 4rem;">
      <div style="margin-top: var(--spacing-lg); text-align: center; margin-bottom: var(--spacing-xl);">
        <span class="hero-badge" style="background: var(--primary-light); color: var(--primary);">Loyalty Rewards</span>
        <h2 style="font-size: 2.2rem; font-weight: 800; letter-spacing: -1px; margin-bottom: 4px;">Your Club Rewards Panel</h2>
        <p style="color: var(--text-muted); font-size: 0.95rem;">Check your loyalty stats, scratch discount cards, and copy active store promo coupons.</p>
      </div>

      <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: var(--spacing-xl); align-items: start;">
        
        <!-- Left Column: Loyalty Stats & scratch cards -->
        <div style="display: flex; flex-direction: column; gap: var(--spacing-lg);">
          
          <!-- Tier Card -->
          <div class="checkout-card" style="padding: var(--spacing-xl); border-radius: var(--radius-lg); background: var(--bg-surface); position: relative; overflow: hidden; border: 1px solid var(--border-color); box-shadow: var(--shadow-md);">
            <!-- Glow background overlay -->
            <div style="position: absolute; top: -50px; right: -50px; width: 150px; height: 150px; border-radius: 50%; background: var(--grad-glow); filter: blur(30px); opacity: 0.8; pointer-events: none;"></div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-lg);">
              <div>
                <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--primary); letter-spacing: 1px;">Current Status Tier</span>
                <h3 style="font-size: 1.8rem; font-weight: 800; color: var(--text-main); margin-top: 2px; border:none; padding:0; margin-bottom:0;">${user.loyaltyTier} Member</h3>
              </div>
              <div style="background: linear-gradient(135deg, var(--primary), var(--secondary)); width: 52px; height: 52px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-md); color: white;">
                <i data-lucide="crown" style="width: 26px; height: 26px;"></i>
              </div>
            </div>

            <div style="margin-bottom: var(--spacing-md);">
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700; margin-bottom: 6px;">
                <span style="color: var(--text-muted);">Points Milestone Progress</span>
                <span style="color: var(--text-main);">${user.loyaltyPoints} / ${targetPoints} pts</span>
              </div>
              
              <!-- Progress Bar -->
              <div style="background: var(--bg-surface-hover); height: 10px; border-radius: var(--radius-full); overflow: hidden; border: 1px solid var(--border-color);">
                <div style="background: var(--grad-primary); width: ${progressPercent}%; height: 100%; border-radius: var(--radius-full); transition: width 0.6s ease;"></div>
              </div>
              <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 8px;">Earn another <strong>${targetPoints - user.loyaltyPoints} points</strong> to advance to the next premium tier level!</p>
            </div>
          </div>

          <!-- Gamified Scratch Card Card -->
          <div class="checkout-card" style="padding: var(--spacing-xl); border-radius: var(--radius-lg); background: var(--bg-surface); border: 1px solid var(--border-color); box-shadow: var(--shadow-md); text-align: center;">
            <h3 style="font-size: 1.3rem; font-weight: 800; margin-bottom: var(--spacing-xs); border:none; padding:0;">Scratch & Win Discount Card</h3>
            <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: var(--spacing-md);">Scratch off the silver layer with your mouse or finger to reveal an exclusive coupon code!</p>
            
            <div style="position: relative; width: 280px; height: 160px; margin: 0 auto; border-radius: var(--radius-sm); overflow: hidden; box-shadow: var(--shadow-md); border: 1px solid var(--border-color); background: var(--bg-surface-hover); display: flex; align-items: center; justify-content: center;">
              <!-- Underneath Prize Layer -->
              <div style="text-align: center;">
                <span style="font-size: 0.75rem; font-weight: 800; color: var(--primary); text-transform: uppercase; letter-spacing: 1px;">Exclusive Gift Code</span>
                <div id="scratch-prize-code" style="font-size: 1.8rem; font-weight: 800; color: var(--text-main); margin-top: 6px; letter-spacing: 1px; filter: blur(4px); transition: filter 0.5s ease;">
                  PALGOLD
                </div>
                <button class="btn btn-secondary btn-sm" onclick="window.copyScratchPrize()" style="margin-top: 8px; font-size: 0.75rem; padding: 4px 10px;">
                  Copy Code
                </button>
              </div>

              <!-- Top Canvas Scratch Layer -->
              <canvas id="scratch-canvas" width="280" height="160" style="position: absolute; top: 0; left: 0; cursor: crosshair; transition: opacity 0.5s ease;"></canvas>
            </div>
          </div>
        </div>

        <!-- Right Column: Exclusive Coupons Grid & Instructions -->
        <div style="display: flex; flex-direction: column; gap: var(--spacing-lg);">
          <div class="checkout-card" style="padding: var(--spacing-xl); border-radius: var(--radius-lg); background: var(--bg-surface); border: 1px solid var(--border-color); box-shadow: var(--shadow-md);">
            <h3 style="font-size: 1.3rem; font-weight: 800; margin-bottom: var(--spacing-sm); border-bottom: 1px solid var(--border-color); padding-bottom: var(--spacing-xs);">Claim Active Store Coupons</h3>
            
            <div style="display: flex; flex-direction: column; gap: var(--spacing-md); margin-top: var(--spacing-md);">
              <!-- Coupon 1 -->
              <div style="border: 1px dashed var(--primary); background: var(--primary-light); padding: var(--spacing-md); border-radius: var(--radius-sm); display: flex; justify-content: space-between; align-items: center; gap: var(--spacing-sm);">
                <div>
                  <strong style="color: var(--primary); font-size: 1.05rem;">KIRANA10</strong>
                  <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">Save 10% on your entire basket order.</div>
                </div>
                <button class="btn btn-primary btn-sm" onclick="window.copyCoupon('KIRANA10')" style="padding: 6px 12px; font-size: 0.78rem;">Copy</button>
              </div>

              <!-- Coupon 2 -->
              <div style="border: 1px dashed var(--info); background: rgba(59, 130, 246, 0.08); padding: var(--spacing-md); border-radius: var(--radius-sm); display: flex; justify-content: space-between; align-items: center; gap: var(--spacing-sm);">
                <div>
                  <strong style="color: var(--info); font-size: 1.05rem;">FREESHIP</strong>
                  <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">Free home delivery on checkout.</div>
                </div>
                <button class="btn btn-secondary btn-sm" onclick="window.copyCoupon('FREESHIP')" style="padding: 6px 12px; font-size: 0.78rem; border-color: var(--info); color: var(--info);">Copy</button>
              </div>

              <!-- Coupon 3 -->
              <div style="border: 1px dashed var(--warning); background: rgba(245, 158, 11, 0.08); padding: var(--spacing-md); border-radius: var(--radius-sm); display: flex; justify-content: space-between; align-items: center; gap: var(--spacing-sm);">
                <div>
                  <strong style="color: var(--warning); font-size: 1.05rem;">FREECHILLED</strong>
                  <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">Free packaging for chilled items.</div>
                </div>
                <button class="btn btn-secondary btn-sm" onclick="window.copyCoupon('FREECHILLED')" style="padding: 6px 12px; font-size: 0.78rem; border-color: var(--warning); color: var(--warning);">Copy</button>
              </div>
            </div>
          </div>

          <!-- Instructions Card -->
          <div class="checkout-card" style="padding: var(--spacing-xl); border-radius: var(--radius-lg); background: var(--bg-surface); border: 1px solid var(--border-color); box-shadow: var(--shadow-md); display: flex; flex-direction: column; gap: var(--spacing-md);">
            <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 0; border-bottom: 1px solid var(--border-color); padding-bottom: var(--spacing-xs); display: flex; align-items: center; gap: 8px;">
              <i data-lucide="help-circle" style="color: var(--primary); width: 20px; height: 20px;"></i>
              कूपन/पॉइंट्स पाने का तरीका (How to Use)
            </h3>
            
            <div style="display: flex; flex-direction: column; gap: var(--spacing-sm); font-size: 0.88rem; line-height: 1.5; color: var(--text-muted);">
              <!-- Step 1 -->
              <div style="display: flex; gap: 12px; align-items: flex-start;">
                <div style="background: var(--primary-light); color: var(--primary); font-weight: bold; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.8rem;">1</div>
                <div>
                  <strong style="color: var(--text-main);">लॉयल्टी क्लब जॉइन करें:</strong> 
                  ऑफ़र पेज का पूरा लाभ उठाने के लिए सबसे पहले रजिस्टर या लॉग-इन करें।
                </div>
              </div>
              
              <!-- Step 2 -->
              <div style="display: flex; gap: 12px; align-items: flex-start;">
                <div style="background: var(--primary-light); color: var(--primary); font-weight: bold; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.8rem;">2</div>
                <div>
                  <strong style="color: var(--text-main);">शॉपिंग कर पॉइंट्स कमाएं:</strong> 
                  हर ₹10 के आर्डर पर 1 लॉयल्टी पॉइंट मिलेगा (उदा. ₹500 के आर्डर पर 50 पॉइंट्स)। यह पॉइंट्स आर्डर प्लेस करते ही जुड़ जाएँगे।
                </div>
              </div>
              
              <!-- Step 3 -->
              <div style="display: flex; gap: 12px; align-items: flex-start;">
                <div style="background: var(--primary-light); color: var(--primary); font-weight: bold; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.8rem;">3</div>
                <div>
                  <strong style="color: var(--text-main);">स्क्रैच करें या कूपन कॉपी करें:</strong> 
                  सिल्वर कार्ड को स्क्रैच कर स्पेशल कूपन <code style="background: var(--bg-surface-hover); padding: 2px 6px; border-radius: 4px; font-weight: bold; color: var(--primary);">PALGOLD</code> प्राप्त करें, या ऊपर दी गई कूपन्स लिस्ट से कोड कॉपी करें।
                </div>
              </div>
              
              <!-- Step 4 -->
              <div style="display: flex; gap: 12px; align-items: flex-start;">
                <div style="background: var(--primary-light); color: var(--primary); font-weight: bold; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.8rem;">4</div>
                <div>
                  <strong style="color: var(--text-main);">कूपन अप्लाई करें:</strong> 
                  बास्केट (Cart Drawer) ओपन कर कूपन इनपुट बॉक्स में कोड डालें और <strong>Apply</strong> पर क्लिक करें। आपका डिस्काउंट तुरंत लागू हो जाएगा!
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  // Initialize Canvas Scratch Physics
  initScratchCard();

  window.copyCoupon = (code) => {
    navigator.clipboard.writeText(code);
    showToast(`Coupon "${code}" copied to clipboard!`, "success");
  };

  window.copyScratchPrize = () => {
    const code = "PALGOLD";
    navigator.clipboard.writeText(code);
    showToast(`Prize Coupon "${code}" copied! Apply KIRANA10/PALGOLD to save!`, "success");
  };
}

function initScratchCard() {
  const canvas = document.getElementById("scratch-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Render a cool frosted metallic silver-gray background
  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0, "#e2e8f0");
  grad.addColorStop(0.5, "#cbd5e1");
  grad.addColorStop(1, "#94a3b8");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add card border lines
  ctx.lineWidth = 4;
  ctx.strokeStyle = "rgba(255,255,255,0.4)";
  ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);

  // Write Scratch Directions
  ctx.fillStyle = "#334155";
  ctx.font = "bold 15px 'Plus Jakarta Sans', system-ui";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Scratch silver layer!", canvas.width / 2, canvas.height / 2 - 8);
  ctx.font = "700 11px 'Plus Jakarta Sans'";
  ctx.fillStyle = "#64748b";
  ctx.fillText("Reveal discount coupons", canvas.width / 2, canvas.height / 2 + 14);

  let isDrawing = false;

  function scratch(x, y) {
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.fill();
    checkScratchPercentage();
  }

  canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    scratch(e.clientX - rect.left, e.clientY - rect.top);
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    scratch(e.clientX - rect.left, e.clientY - rect.top);
  });

  window.addEventListener("mouseup", () => {
    isDrawing = false;
  });

  // Mobile Touch Support
  canvas.addEventListener("touchstart", (e) => {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    scratch(touch.clientX - rect.left, touch.clientY - rect.top);
  });

  canvas.addEventListener("touchmove", (e) => {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    scratch(touch.clientX - rect.left, touch.clientY - rect.top);
    e.preventDefault();
  });

  canvas.addEventListener("touchend", () => {
    isDrawing = false;
  });

  let scratched = false;
  function checkScratchPercentage() {
    if (scratched) return;
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparent = 0;
    for (let i = 3; i < imgData.data.length; i += 4) {
      if (imgData.data[i] === 0) transparent++;
    }
    const percent = (transparent / (canvas.width * canvas.height)) * 100;
    if (percent > 45) {
      scratched = true;
      canvas.style.opacity = "0";
      canvas.style.pointerEvents = "none";
      const prize = document.getElementById("scratch-prize-code");
      if (prize) {
        prize.style.filter = "none";
        showToast("Success! Coupon 'PALGOLD' revealed and copied!", "success");
        navigator.clipboard.writeText("PALGOLD");
      }
    }
  }
}
