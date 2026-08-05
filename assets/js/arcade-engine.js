// Pal Kirana Arcade & Interactive Gaming Engine (Premium Edition)

class KiranaArcadeEngine {
  constructor() {
    this.activeGame = null;
    this.catchGameInterval = null;
    this.timerInterval = null;
    this.score = 0;
    this.streak = 0;
    this.timeLeft = 30;
    this.basketX = 50; // percentage
    this.sorterIndex = 0;
    this.sorterItems = [];
    this.leaderboard = this.loadLeaderboard();
  }

  loadLeaderboard() {
    try {
      const saved = localStorage.getItem("palbasket_arcade_leaderboard");
      return saved ? JSON.parse(saved) : [
        { name: "Vishal K.", score: 180, reward: "25% OFF" },
        { name: "Ramlallu Pal", score: 150, reward: "20% OFF" },
        { name: "Suresh M.", score: 120, reward: "15% OFF" }
      ];
    } catch(e) {
      return [
        { name: "Vishal K.", score: 180, reward: "25% OFF" },
        { name: "Ramlallu Pal", score: 150, reward: "20% OFF" }
      ];
    }
  }

  saveHighScore(playerName, scoreVal, rewardText) {
    this.leaderboard.push({ name: playerName, score: scoreVal, reward: rewardText });
    this.leaderboard.sort((a, b) => b.score - a.score);
    this.leaderboard = this.leaderboard.slice(0, 5); // Keep top 5
    try {
      localStorage.setItem("palbasket_arcade_leaderboard", JSON.stringify(this.leaderboard));
    } catch(e) {}
  }

  // Floating SVG Arcade Widget HTML
  getFloatingWidgetHTML() {
    return `
      <div class="floating-arcade-widget" id="floating-arcade-btn" title="Play Kirana Games & Win Coupons!" onclick="window.kiranaArcade.openModal()">
        <div class="arcade-pulse-ring"></div>
        <div class="arcade-svg-container">
          <svg viewBox="0 0 100 100" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="pad-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#8b5cf6"/>
                <stop offset="100%" stop-color="#6d28d9"/>
              </linearGradient>
              <linearGradient id="btn-glow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#f59e0b"/>
                <stop offset="100%" stop-color="#ef4444"/>
              </linearGradient>
            </defs>
            <path d="M 20 35 C 10 35 5 50 12 70 C 18 85 32 82 40 70 L 48 58 L 52 58 L 60 70 C 68 82 82 85 88 70 C 95 50 90 35 80 35 C 65 35 58 45 50 45 C 42 45 35 35 20 35 Z" fill="url(#pad-grad)" stroke="#a78bfa" stroke-width="2.5" filter="drop-shadow(0 6px 12px rgba(109,40,217,0.5))"/>
            <rect x="23" y="48" width="6" height="16" rx="2" fill="#ffffff"/>
            <rect x="18" y="53" width="16" height="6" rx="2" fill="#ffffff"/>
            <circle cx="76" cy="49" r="4" fill="url(#btn-glow)"/>
            <circle cx="84" cy="57" r="4" fill="url(#btn-glow)"/>
            <circle cx="68" cy="57" r="4" fill="url(#btn-glow)"/>
            <circle cx="76" cy="65" r="4" fill="url(#btn-glow)"/>
            <ellipse cx="50" cy="42" rx="6" ry="3" fill="#38bdf8"/>
          </svg>
        </div>
        <div class="arcade-widget-badge">
          <i data-lucide="gamepad-2" class="inline-icon"></i>
          <span>PLAY & WIN!</span>
        </div>
      </div>
    `;
  }

  getArcadeModalHTML() {
    return `
      <div class="arcade-modal-overlay" id="arcade-modal-overlay">
        <div class="arcade-modal-card">
          <button class="arcade-close-btn" onclick="window.kiranaArcade.closeModal()">
            <i data-lucide="x"></i>
          </button>
          
          <div id="arcade-modal-content">
            <!-- Dynamic Content -->
          </div>
        </div>
      </div>
    `;
  }

  renderGameHub() {
    const content = document.getElementById("arcade-modal-content");
    if (!content) return;

    const lang = window.SHOP_CONFIG.language;
    content.innerHTML = `
      <div class="arcade-hub-header">
        <span class="arcade-hub-tag"><i data-lucide="sparkles" class="inline-icon"></i> PAL KIRANA PREMIUM ARCADE</span>
        <h2>${lang === 'hi' ? 'गेम खेलें और कूपन जीतें!' : 'Play Games & Win Instant Coupons!'}</h2>
        <p>${lang === 'hi' ? 'अपनी पसंद का गेम चुनें, तर्क शक्ति दिखाएं और 25% तक की छूट अनलॉक करें।' : 'Choose a challenge, achieve target score, and unlock instant savings on your order!'}</p>
      </div>

      <div class="arcade-games-grid">
        <!-- Game 1: Logical Kirana Sorter -->
        <div class="arcade-game-card" onclick="window.kiranaArcade.startSorterGame()">
          <div class="arcade-card-icon" style="background: linear-gradient(135deg, #10b981, #059669);">
            <i data-lucide="boxes" style="width: 32px; height: 32px; color: white;"></i>
          </div>
          <div class="arcade-card-info">
            <h3>${lang === 'hi' ? 'राशन सॉर्टर पहेली (Logical Sorter)' : 'Kirana Logic Category Sorter'}</h3>
            <p>${lang === 'hi' ? 'सामान को सही बास्केट (ग्रॉसरी, डेयरी, स्नैक्स) me 30s me sort karein!' : 'Sort Kirana items into correct category bins fast to earn combo streaks!'}</p>
            <span class="arcade-reward-pill"><i data-lucide="award" class="inline-icon"></i> 25% OFF Coupon</span>
          </div>
          <button class="btn btn-primary btn-sm" style="margin-top: 10px; width: 100%;">
            ${lang === 'hi' ? 'सॉर्टिंग खेलें' : 'Play Sorter'}
          </button>
        </div>

        <!-- Game 2: Catch the Product -->
        <div class="arcade-game-card" onclick="window.kiranaArcade.startCatchGame()">
          <div class="arcade-card-icon" style="background: linear-gradient(135deg, #f59e0b, #ef4444);">
            <i data-lucide="shopping-bag" style="width: 32px; height: 32px; color: white;"></i>
          </div>
          <div class="arcade-card-info">
            <h3>${lang === 'hi' ? 'कैच द राशन (Arcade Fall)' : 'Catch the Product Arcade'}</h3>
            <p>${lang === 'hi' ? 'गिरते हुए ताज़ा फल और दूध की बोतलें अपनी टोकरी में पकड़ें!' : 'Catch falling fresh produce into your basket before timer expires!'}</p>
            <span class="arcade-reward-pill"><i data-lucide="award" class="inline-icon"></i> 20% OFF Coupon</span>
          </div>
          <button class="btn btn-secondary btn-sm" style="margin-top: 10px; width: 100%;">
            ${lang === 'hi' ? 'कैच खेलें' : 'Play Arcade'}
          </button>
        </div>
      </div>

      <!-- Leaderboard Banner -->
      <div class="arcade-leaderboard-card">
        <div style="font-weight: 800; font-size: 0.9rem; color: var(--primary); display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
          <span><i data-lucide="trophy" class="inline-icon"></i> ARCADE CHAMPIONS LEADERBOARD</span>
          <span style="font-size: 0.72rem; color: var(--text-muted);">TOP PLAYERS TODAY</span>
        </div>
        <div class="leaderboard-rows">
          ${this.leaderboard.map((player, rank) => `
            <div class="leaderboard-row">
              <span><strong>#${rank + 1}</strong> ${player.name}</span>
              <span class="badge badge-success" style="font-size:0.7rem;">${player.score} PTS (${player.reward})</span>
            </div>
          `).join("")}
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  // --- GAME 1: LOGICAL KIRANA CATEGORY SORTER ---
  startSorterGame() {
    this.activeGame = "sorter";
    this.score = 0;
    this.streak = 0;
    this.timeLeft = 30;
    this.sorterIndex = 0;

    // Items array with logical categories
    this.sorterItems = [
      { name: "Shimla Apples", cat: "dairy_fresh", icon: "apple", color: "#ef4444" },
      { name: "Amul Butter", cat: "dairy_fresh", icon: "milk", color: "#f59e0b" },
      { name: "Haldiram Bhujia", cat: "snacks_drinks", icon: "cookie", color: "#d97706" },
      { name: "Chakki Atta", cat: "groceries_oil", icon: "bean", color: "#2563eb" },
      { name: "Coca Cola", cat: "snacks_drinks", icon: "cup-soda", color: "#dc2626" },
      { name: "Mustard Oil", cat: "groceries_oil", icon: "droplet", color: "#ca8a04" },
      { name: "Full Cream Milk", cat: "dairy_fresh", icon: "milk", color: "#3b82f6" },
      { name: "Lays Chips", cat: "snacks_drinks", icon: "cookie", color: "#ef4444" },
      { name: "Basmati Rice", cat: "groceries_oil", icon: "bean", color: "#16a34a" },
      { name: "Nescafe Coffee", cat: "snacks_drinks", icon: "coffee", color: "#8b5cf6" },
      { name: "Tata Salt", cat: "groceries_oil", icon: "package", color: "#0284c7" },
      { name: "Country Eggs", cat: "dairy_fresh", icon: "egg", color: "#b45309" }
    ];

    // Shuffle items
    this.sorterItems.sort(() => Math.random() - 0.5);

    const content = document.getElementById("arcade-modal-content");
    if (!content) return;

    const lang = window.SHOP_CONFIG.language;
    content.innerHTML = `
      <div class="arcade-play-header">
        <button class="btn btn-secondary btn-sm" onclick="window.kiranaArcade.renderGameHub()">
          <i data-lucide="arrow-left"></i> ${lang === 'hi' ? 'वापस जाएं' : 'Back'}
        </button>
        <div class="arcade-stats-row">
          <div class="arcade-stat-badge">SCORE: <strong id="sorter-score-val">0</strong></div>
          <div class="arcade-stat-badge">STREAK: <strong id="sorter-streak-val">0x</strong></div>
          <div class="arcade-stat-badge timer">TIME: <strong id="sorter-time-val">30s</strong></div>
        </div>
      </div>

      <div class="sorter-game-area" id="sorter-area">
        <div class="sorter-item-display" id="sorter-active-card">
          <!-- Active Item Card -->
        </div>

        <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin: 10px 0; text-align: center;">
          ${lang === 'hi' ? 'सामान को सही बास्केट बटन पर टैप करके सॉर्ट करें:' : 'Tap the correct Category Bin below:'}
        </div>

        <div class="sorter-bins-grid">
          <button class="sorter-bin-btn bin-groceries" onclick="window.kiranaArcade.handleSorterChoice('groceries_oil')">
            <i data-lucide="bean"></i>
            <span>${lang === 'hi' ? 'रसोई व तेल' : 'Groceries & Oil'}</span>
          </button>
          <button class="sorter-bin-btn bin-dairy" onclick="window.kiranaArcade.handleSorterChoice('dairy_fresh')">
            <i data-lucide="milk"></i>
            <span>${lang === 'hi' ? 'डेयरी व फ्रेश' : 'Dairy & Fresh'}</span>
          </button>
          <button class="sorter-bin-btn bin-snacks" onclick="window.kiranaArcade.handleSorterChoice('snacks_drinks')">
            <i data-lucide="cookie"></i>
            <span>${lang === 'hi' ? 'स्नैक्स व ड्रिंक्स' : 'Snacks & Drinks'}</span>
          </button>
        </div>
      </div>
    `;

    this.renderSorterActiveCard();
    if (window.lucide) window.lucide.createIcons();

    this.clearIntervals();
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      const tVal = document.getElementById("sorter-time-val");
      if (tVal) tVal.textContent = `${this.timeLeft}s`;

      if (this.timeLeft <= 0) {
        this.endSorterGame();
      }
    }, 1000);
  }

  renderSorterActiveCard() {
    const cardBox = document.getElementById("sorter-active-card");
    if (!cardBox) return;

    if (this.sorterIndex >= this.sorterItems.length) {
      this.endSorterGame();
      return;
    }

    const item = this.sorterItems[this.sorterIndex];
    cardBox.innerHTML = `
      <div class="sorter-card-box fade-in">
        <div class="sorter-card-icon" style="background: ${item.color}15; border: 2px solid ${item.color};">
          <i data-lucide="${item.icon}" style="width: 42px; height: 42px; color: ${item.color};"></i>
        </div>
        <div class="sorter-card-name">${item.name}</div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
  }

  handleSorterChoice(chosenCat) {
    if (this.sorterIndex >= this.sorterItems.length) return;

    const currentItem = this.sorterItems[this.sorterIndex];
    const isCorrect = currentItem.cat === chosenCat;

    const area = document.getElementById("sorter-area");

    if (isCorrect) {
      this.streak++;
      const multiplier = Math.min(3, 1 + Math.floor(this.streak / 3));
      this.score += 20 * multiplier;

      if (area) {
        area.style.borderColor = "var(--success)";
        setTimeout(() => { if (area) area.style.borderColor = "var(--border-color)"; }, 180);
      }
    } else {
      this.streak = 0;
      this.score = Math.max(0, this.score - 10);

      if (area) {
        area.style.borderColor = "var(--danger)";
        setTimeout(() => { if (area) area.style.borderColor = "var(--border-color)"; }, 180);
      }
    }

    const scoreVal = document.getElementById("sorter-score-val");
    const streakVal = document.getElementById("sorter-streak-val");
    if (scoreVal) scoreVal.textContent = this.score;
    if (streakVal) streakVal.textContent = `${this.streak}x`;

    this.sorterIndex++;
    this.renderSorterActiveCard();
  }

  getRandomSarcasticDialogue() {
    const comments = [
      "Tumhari speed dekhkar blender ne resignation de diya. 🤦‍♂️",
      "Lassi to bach gayi... tum nahi. 😂",
      "Doctor ne kaha stress kam karo... tum game khelne aa gaye. Sahi kiya! 😌",
      "Tumhare score ko dekhkar glass ne aankh band kar li. 🥲",
      "Aaj ka MVP: Tum nahi... Lassi thi. 😂",
      "Stress ko side karo, Lassi ko try karo. 🥛",
      "Tumhare reflex dekhkar blender ne resignation de diya. 💀",
      "Glass bach gaya... score nahi. 😂",
      "Itna dhyan padhai me lagaya hota toh NASA me hote. Par koi nahi, Lassi peeo! 🚀",
      "Tumse na ho payega... bas Lassi peene pe dhyan do! 🥤",
      "Score dekhkar lagta hai blender khud sharma gaya. 🙈",
      "Aisa khele ho ki Dahi ne bhi jamne se inkaar kar diya. 🧊",
      "Ek taraf tumhari gaming skills... doosri taraf hamari Lassi. Win-win sirf Lassi ka hai! 🏆",
      "Bhagwan ne dimaag diya tha... game me kyu nahi lagaya? 😂",
      "Game over ho gaya, par Lassi abhi bhi thandi hai! ❄️",
      "Tumhare fingers itne slow hain ki dahi jamne me kam time lagta hai. ⏳",
      "Lagta hai bina Lassi piye aaye the... isliye speed nahi mili! 🥛",
      "Game scorecard ne abhi abhi 2 minute ka maun rakha hai. 🤫",
      "Sahi batao... aankhein band karke khel rahe the kya? 👁️❌",
      "Itni slow speed par toh Devari Bazaar ka jam bhi sharmaney lage! 🛵",
      "Aapki gaming timing dekhkar hamari makhani dahi pighal gayi. 🫠",
      "Reflexes itne sharp hain ki makhhi bhi side se nikal jaye! 🪰",
      "Game toh khatam ho gaya... ab ek kulhad Lassi order karke mood fresh karo! 🍃"
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  endSorterGame() {
    this.clearIntervals();
    const content = document.getElementById("arcade-modal-content");
    if (!content) return;

    const lang = window.SHOP_CONFIG.language;
    const randomDialogue = this.getRandomSarcasticDialogue();

    content.innerHTML = `
      <div class="arcade-result-screen" style="padding: 1.5rem 1rem;">
        <div class="result-icon"><i data-lucide="message-square-quote" style="width:48px;height:48px;color:#f59e0b;"></i></div>
        <h2 style="font-size: 1.3rem; font-weight: 900; margin: 8px 0;">Post-Match Analysis 💬</h2>
        <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 12px;">Your Final Score: <strong>${this.score} Points</strong></p>

        <div style="background: rgba(234, 179, 8, 0.12); border: 2px solid #eab308; border-radius: 12px; padding: 14px; margin-bottom: 20px; text-align: left;">
          <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 900; color: #f59e0b; margin-bottom: 6px;">Funny Statement:</div>
          <div style="font-size: 1.05rem; font-weight: 800; color: var(--text-main); line-height: 1.5;">"${randomDialogue}"</div>
        </div>

        <div style="display: flex; gap: 10px; justify-content: center;">
          <button class="btn btn-secondary" onclick="window.kiranaArcade.renderGameHub()">
            ${lang === 'hi' ? 'मुख्य मेनू 🏠' : 'Game Hub 🏠'}
          </button>
          <button class="btn btn-primary" onclick="window.kiranaArcade.startSorterGame()">
            ${lang === 'hi' ? 'दोबारा खेलें (Next Comment) 🎮' : 'Play Again (Next Dialogue) 🎮'}
          </button>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  // --- GAME 2: CATCH THE PRODUCT ARCADE ---
  startCatchGame() {
    this.activeGame = "catch";
    this.score = 0;
    this.timeLeft = 30;
    this.basketX = 50;

    const content = document.getElementById("arcade-modal-content");
    if (!content) return;

    const lang = window.SHOP_CONFIG.language;
    content.innerHTML = `
      <div class="arcade-play-header">
        <button class="btn btn-secondary btn-sm" onclick="window.kiranaArcade.renderGameHub()">
          <i data-lucide="arrow-left"></i> ${lang === 'hi' ? 'वापस जाएं' : 'Back'}
        </button>
        <div class="arcade-stats-row">
          <div class="arcade-stat-badge">SCORE: <strong id="catch-score-val">0</strong></div>
          <div class="arcade-stat-badge timer">TIME: <strong id="catch-time-val">30s</strong></div>
        </div>
      </div>

      <div class="catch-game-canvas" id="catch-canvas">
        <div class="catch-basket" id="catch-basket" style="left: 50%;">
          <i data-lucide="shopping-cart" style="width: 28px; height: 28px; color: white;"></i>
        </div>
      </div>

      <div class="catch-controls-hint">
        <span>${lang === 'hi' ? 'माउस घुमाएं या बटन दबाकर टोकरी चलाएं:' : 'Move mouse or tap buttons to move basket:'}</span>
        <div style="display: flex; gap: 10px; margin-top: 6px;">
          <button class="btn btn-secondary btn-sm" onclick="window.kiranaArcade.moveBasket(-15)">◀ LEFT</button>
          <button class="btn btn-secondary btn-sm" onclick="window.kiranaArcade.moveBasket(15)">RIGHT ▶</button>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    const canvas = document.getElementById("catch-canvas");
    if (canvas) {
      canvas.addEventListener("mousemove", (e) => {
        const rect = canvas.getBoundingClientRect();
        const relX = ((e.clientX - rect.left) / rect.width) * 100;
        this.basketX = Math.max(10, Math.min(90, relX));
        const b = document.getElementById("catch-basket");
        if (b) b.style.left = `${this.basketX}%`;
      });

      canvas.addEventListener("touchmove", (e) => {
        if (e.touches.length > 0) {
          const rect = canvas.getBoundingClientRect();
          const relX = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
          this.basketX = Math.max(10, Math.min(90, relX));
          const b = document.getElementById("catch-basket");
          if (b) b.style.left = `${this.basketX}%`;
        }
      });
    }

    this.clearIntervals();
    this.catchGameInterval = setInterval(() => this.spawnFallingItem(), 600);
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      const timeVal = document.getElementById("catch-time-val");
      if (timeVal) timeVal.textContent = `${this.timeLeft}s`;

      if (this.timeLeft <= 0) {
        this.endCatchGame();
      }
    }, 1000);
  }

  moveBasket(delta) {
    this.basketX = Math.max(10, Math.min(90, this.basketX + delta));
    const b = document.getElementById("catch-basket");
    if (b) b.style.left = `${this.basketX}%`;
  }

  spawnFallingItem() {
    const canvas = document.getElementById("catch-canvas");
    if (!canvas) return;

    const items = [
      { icon: "apple", color: "#ef4444", pts: 10 },
      { icon: "milk", color: "#3b82f6", pts: 10 },
      { icon: "cookie", color: "#f59e0b", pts: 15 },
      { icon: "sparkles", color: "#ec4899", pts: 25 }
    ];

    const chosen = items[Math.floor(Math.random() * items.length)];
    const itemEl = document.createElement("div");
    itemEl.className = "falling-produce-item";
    const posX = Math.random() * 80 + 10;
    itemEl.style.left = `${posX}%`;
    itemEl.style.top = `-30px`;
    itemEl.innerHTML = `<i data-lucide="${chosen.icon}" style="width:20px;height:20px;color:${chosen.color};"></i>`;

    canvas.appendChild(itemEl);
    if (window.lucide) window.lucide.createIcons();

    let posY = -30;
    const fallSpeed = 3.5 + Math.random() * 2.5;

    const fallLoop = setInterval(() => {
      posY += fallSpeed;
      itemEl.style.top = `${posY}px`;

      const canvasHeight = canvas.clientHeight;
      if (posY >= canvasHeight - 50 && posY <= canvasHeight - 10) {
        if (Math.abs(posX - this.basketX) < 15) {
          this.score += chosen.pts;
          const scoreVal = document.getElementById("catch-score-val");
          if (scoreVal) scoreVal.textContent = this.score;

          canvas.style.borderColor = chosen.color;
          setTimeout(() => { if (canvas) canvas.style.borderColor = "var(--primary)"; }, 150);

          clearInterval(fallLoop);
          itemEl.remove();
          return;
        }
      }

      if (posY > canvasHeight) {
        clearInterval(fallLoop);
        itemEl.remove();
      }
    }, 30);
  }

  endCatchGame() {
    this.clearIntervals();
    const content = document.getElementById("arcade-modal-content");
    if (!content) return;

    const lang = window.SHOP_CONFIG.language;
    const randomDialogue = this.getRandomSarcasticDialogue();

    content.innerHTML = `
      <div class="arcade-result-screen" style="padding: 1.5rem 1rem;">
        <div class="result-icon"><i data-lucide="message-square-quote" style="width:48px;height:48px;color:#f59e0b;"></i></div>
        <h2 style="font-size: 1.3rem; font-weight: 900; margin: 8px 0;">Post-Match Reaction 💬</h2>
        <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 12px;">Your Catch Score: <strong>${this.score} Points</strong></p>

        <div style="background: rgba(234, 179, 8, 0.12); border: 2px solid #eab308; border-radius: 12px; padding: 14px; margin-bottom: 20px; text-align: left;">
          <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 900; color: #f59e0b; margin-bottom: 6px;">Funny Statement:</div>
          <div style="font-size: 1.05rem; font-weight: 800; color: var(--text-main); line-height: 1.5;">"${randomDialogue}"</div>
        </div>

        <div style="display: flex; gap: 10px; justify-content: center;">
          <button class="btn btn-secondary" onclick="window.kiranaArcade.renderGameHub()">
            ${lang === 'hi' ? 'मुख्य मेनू 🏠' : 'Game Hub 🏠'}
          </button>
          <button class="btn btn-primary" onclick="window.kiranaArcade.startCatchGame()">
            ${lang === 'hi' ? 'दोबारा खेलें (Next Comment) 🎮' : 'Play Again (Next Dialogue) 🎮'}
          </button>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  applyCoupon(code) {
    const couponInput = document.getElementById("cart-coupon-code");
    if (couponInput) couponInput.value = code;
    window.state.couponApplied = true;

    if (window.showToast) {
      window.showToast(`Promo code ${code} applied successfully!`, "success");
    }

    this.closeModal();
    if (window.navigateView) window.navigateView("shop");
  }

  openModal() {
    let overlay = document.getElementById("arcade-modal-overlay");
    if (!overlay) {
      document.body.insertAdjacentHTML("beforeend", this.getArcadeModalHTML());
      overlay = document.getElementById("arcade-modal-overlay");
    }
    overlay.classList.add("active");
    this.renderGameHub();
  }

  closeModal() {
    this.clearIntervals();
    const overlay = document.getElementById("arcade-modal-overlay");
    if (overlay) overlay.classList.remove("active");
  }

  clearIntervals() {
    if (this.catchGameInterval) clearInterval(this.catchGameInterval);
    if (this.timerInterval) clearInterval(this.timerInterval);
  }
}

// Global Export & Auto Initialization
window.kiranaArcade = new KiranaArcadeEngine();
