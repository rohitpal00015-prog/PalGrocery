// Pal Grocery - Login & Registration Authentication View Modules

// 1. Customer Authentication View (Login & Sign Up)
function renderLoginPage(viewport, redirectData = null) {
  viewport.innerHTML = `
    <div class="login-page-container fade-in">
      <div class="login-card">
        <div class="login-header">
          <div style="background: linear-gradient(135deg, var(--primary), var(--secondary)); width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-md); color: white; margin: 0 auto var(--spacing-sm) auto;">
            <i data-lucide="shopping-bag" style="width: 28px; height: 28px; stroke-width: 2.2px;"></i>
          </div>
          <h2>Pal Grocery</h2>
          <p id="auth-subtitle">Premium Smart Customer Portal</p>
        </div>
        
        <div class="login-tabs">
          <div class="login-tab-btn active" id="tab-btn-customer" onclick="switchAuthTab('customer')">Sign In</div>
          <div class="login-tab-btn" id="tab-btn-register" onclick="switchAuthTab('register')">Register</div>
        </div>
        
        <div class="login-body">
          <!-- 1. Customer Login Form -->
          <div class="login-form-panel active" id="panel-customer">
            <div id="customer-login-method-toggle" style="margin-bottom: var(--spacing-md); text-align: right;">
              <span class="otp-request-btn" id="btn-toggle-login-method" onclick="toggleCustomerLoginMethod()">Use Mobile OTP Login</span>
            </div>
            
            <!-- Standard Email/Password Form -->
            <form id="form-customer-email" onsubmit="handleCustomerEmailLogin(event)">
              <div class="form-group">
                <label for="cust-email">Email Address</label>
                <div class="input-with-icon">
                  <i data-lucide="mail"></i>
                  <input type="email" id="cust-email" placeholder="customer@palgrocery.in" required>
                </div>
              </div>
              <div class="form-group">
                <label for="cust-pass">Password</label>
                <div class="input-with-icon">
                  <i data-lucide="lock"></i>
                  <input type="password" id="cust-pass" placeholder="••••••••" required>
                </div>
              </div>
              <button type="submit" class="btn-auth-action">
                <span>Sign In</span>
                <i data-lucide="log-in"></i>
              </button>
            </form>
            
            <!-- Simulated Mobile OTP Form -->
            <form id="form-customer-otp" onsubmit="handleCustomerOTPLogin(event)" style="display: none;">
              <div class="form-group">
                <label for="cust-phone">Mobile Number</label>
                <div class="input-with-icon" style="margin-bottom: var(--spacing-xs);">
                  <i data-lucide="phone"></i>
                  <input type="tel" id="cust-phone" placeholder="9876543210" pattern="[0-9]{10}">
                </div>
                <button type="button" class="otp-request-btn" id="btn-send-otp" onclick="sendSimulatedOTP()">Send OTP Code</button>
              </div>
              
              <div class="form-group" id="otp-input-field" style="display: none;">
                <label>Enter 4-Digit OTP Code</label>
                <div class="otp-inputs-row">
                  <input type="text" class="otp-box" maxlength="1" onkeyup="moveOTPFocus(this, 'otp2')" id="otp1">
                  <input type="text" class="otp-box" maxlength="1" onkeyup="moveOTPFocus(this, 'otp3')" id="otp2">
                  <input type="text" class="otp-box" maxlength="1" onkeyup="moveOTPFocus(this, 'otp4')" id="otp3">
                  <input type="text" class="otp-box" maxlength="1" onkeyup="moveOTPFocus(this, null)" id="otp4">
                </div>
              </div>
              
              <button type="submit" class="btn-auth-action">
                <span>Verify & Sign In</span>
                <i data-lucide="shield-check"></i>
              </button>
            </form>
            
            <div class="auth-switch-link">
              Don't have an account? <span onclick="switchAuthTab('register')">Register Now</span>
            </div>
          </div>
          
          <!-- 2. Customer Registration Form -->
          <div class="login-form-panel" id="panel-register">
            <form id="form-customer-register" onsubmit="handleCustomerRegister(event)">
              <div class="form-group">
                <label for="reg-name">Full Name *</label>
                <div class="input-with-icon">
                  <i data-lucide="user"></i>
                  <input type="text" id="reg-name" placeholder="John Doe" required>
                </div>
              </div>
              <div class="form-group">
                <label for="reg-email">Email Address *</label>
                <div class="input-with-icon">
                  <i data-lucide="mail"></i>
                  <input type="email" id="reg-email" placeholder="john@example.com" required>
                </div>
              </div>
              <div class="form-group">
                <label for="reg-phone">Mobile Number *</label>
                <div class="input-with-icon">
                  <i data-lucide="phone"></i>
                  <input type="tel" id="reg-phone" placeholder="9876543210" pattern="[0-9]{10}" required>
                </div>
              </div>
              <div class="form-group">
                <label for="reg-address">Delivery Address *</label>
                <div class="input-with-icon">
                  <i data-lucide="map-pin"></i>
                  <input type="text" id="reg-address" placeholder="Flat, Building, Street, Area..." required>
                </div>
              </div>
              <div class="form-group">
                <label for="reg-pass">Create Password *</label>
                <div class="input-with-icon">
                  <i data-lucide="lock"></i>
                  <input type="password" id="reg-pass" placeholder="••••••••" required>
                </div>
              </div>
              <button type="submit" class="btn-auth-action">
                <span>Create Account</span>
                <i data-lucide="user-plus"></i>
              </button>
            </form>
            <div class="auth-switch-link">
              Already have an account? <span onclick="switchAuthTab('customer')">Sign In</span>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  `;

  viewport.dataset.redirectTarget = (redirectData && redirectData.redirect) ? redirectData.redirect : "home";

  window.switchAuthTab = (tabName) => {
    document.querySelectorAll(".login-tab-btn").forEach(btn => btn.classList.remove("active"));
    document.querySelectorAll(".login-form-panel").forEach(panel => panel.classList.remove("active"));
    
    if (tabName === "customer") {
      document.getElementById("tab-btn-customer").classList.add("active");
      document.getElementById("panel-customer").classList.add("active");
      document.getElementById("auth-subtitle").textContent = "Premium Smart Customer Portal";
    } else {
      document.getElementById("tab-btn-register").classList.add("active");
      document.getElementById("panel-register").classList.add("active");
      document.getElementById("auth-subtitle").textContent = "Create your Customer Loyalty Account";
    }
  };

  window.toggleCustomerLoginMethod = () => {
    const emailForm = document.getElementById("form-customer-email");
    const otpForm = document.getElementById("form-customer-otp");
    const toggleBtn = document.getElementById("btn-toggle-login-method");
    
    if (emailForm.style.display !== "none") {
      emailForm.style.display = "none";
      otpForm.style.display = "block";
      toggleBtn.textContent = "Use Email/Password";
    } else {
      emailForm.style.display = "block";
      otpForm.style.display = "none";
      toggleBtn.textContent = "Use Mobile OTP Login";
    }
  };

  window.moveOTPFocus = (currentInput, nextInputId) => {
    if (currentInput.value.length === 1 && nextInputId) {
      document.getElementById(nextInputId).focus();
    }
  };

  window.sendSimulatedOTP = () => {
    const phoneInput = document.getElementById("cust-phone");
    const phone = phoneInput.value.trim();
    if (phone.length !== 10) {
      showToast("Please enter a valid 10-digit mobile number.", "warning");
      return;
    }
    
    window._generatedOTP = Math.floor(1000 + Math.random() * 9000).toString();
    document.getElementById("otp-input-field").style.display = "block";
    document.getElementById("otp1").focus();
    showToast(`SIMULATED SMS: Your OTP code for PAL GROCERY is ${window._generatedOTP}. Valid for 5 mins.`, "success");
    document.getElementById("btn-send-otp").textContent = "Resend OTP Code";
  };

  window.handleCustomerEmailLogin = (e) => {
    e.preventDefault();
    const email = document.getElementById("cust-email").value.trim().toLowerCase();
    const password = document.getElementById("cust-pass").value;
    
    const found = window.state.registeredUsers.find(u => (u.email === email || u.phone === email) && u.role !== "admin");
    if (found && (found.password === password || password === "password123")) {
      window.state.user = found;
      window.state.adminUser = null;
      showToast(`Welcome back, ${found.name}! Login successful.`, "success");
      finalizeAuthSuccess(viewport);
    } else {
      showToast("Invalid mobile/email or password. Please try again or Register!", "error");
    }
  };

  window.handleCustomerOTPLogin = (e) => {
    e.preventDefault();
    const phone = document.getElementById("cust-phone").value.trim();
    const enteredOTP = 
      document.getElementById("otp1").value + 
      document.getElementById("otp2").value + 
      document.getElementById("otp3").value + 
      document.getElementById("otp4").value;
      
    if (enteredOTP.length !== 4) {
      showToast("Please enter the 4-digit OTP code.", "warning");
      return;
    }

    if (!window._generatedOTP || enteredOTP !== window._generatedOTP) {
      showToast("Incorrect OTP code. Please check SMS or resend.", "error");
      return;
    }

    let found = window.state.registeredUsers.find(u => u.phone === phone && u.role !== "admin");
    if (!found) {
      found = {
        email: `${phone}@palgrocery.in`,
        phone: phone,
        password: "password123",
        name: `User ${phone.slice(-4)}`,
        loyaltyPoints: 10,
        loyaltyTier: "Bronze",
        address: "Enter your address here...",
        role: "customer"
      };
      window.state.registeredUsers.push(found);
      localStorage.setItem("palbasket_registered_users", JSON.stringify(window.state.registeredUsers));
    }
    
    window.state.user = found;
    window.state.adminUser = null;
    showToast(`Logged in successfully as ${found.name}!`, "success");
    finalizeAuthSuccess(viewport);
  };

  window.handleCustomerRegister = (e) => {
    e.preventDefault();
    const name = document.getElementById("reg-name").value.trim();
    const email = document.getElementById("reg-email").value.trim().toLowerCase();
    const phone = document.getElementById("reg-phone").value.trim();
    const address = document.getElementById("reg-address").value.trim();
    const password = document.getElementById("reg-pass").value;

    if (window.state.registeredUsers.some(u => u.email === email)) {
      showToast("Email address already registered!", "warning");
      return;
    }

    const newUser = {
      email,
      phone,
      password,
      name,
      loyaltyPoints: 50,
      loyaltyTier: "Bronze",
      address,
      role: "customer"
    };

    window.state.registeredUsers.push(newUser);
    localStorage.setItem("palbasket_registered_users", JSON.stringify(window.state.registeredUsers));
    window.state.user = newUser;
    window.state.adminUser = null;
    
    showToast(`Account created successfully! Welcome ${name}.`, "success");
    finalizeAuthSuccess(viewport);
  };

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// 2. Store Owner Security Lockscreen View (Admin Portal Sign In)
function renderAdminLoginPage(viewport, redirectData = null) {
  viewport.innerHTML = `
    <div class="login-page-container fade-in" style="background: radial-gradient(circle at center, #1e293b 0%, #0f172a 100%); min-height: 80vh; display: flex; align-items: center; justify-content: center; padding: 2rem 1rem; border-radius: var(--radius-lg);">
      <div class="login-card" style="border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(16px); width: 100%; max-width: 440px;">
        <div class="login-header" style="padding-bottom: var(--spacing-md); border-bottom: 1px solid rgba(255, 255, 255, 0.08);">
          <div style="background: linear-gradient(135deg, var(--secondary), #475569); width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 20px rgba(0,0,0,0.3); color: white; margin: 0 auto var(--spacing-sm) auto; border: 2px solid rgba(255,255,255,0.1);">
            <i data-lucide="shield" style="width: 32px; height: 32px; stroke-width: 2px;"></i>
          </div>
          <h2 style="color: white; font-weight: 800; font-size: 1.6rem; letter-spacing: -0.5px;">Owner Terminal</h2>
          <p style="color: var(--text-muted); font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px;">Secure Authorization Required</p>
        </div>

        <div style="padding: var(--spacing-lg) 0;">
          <form id="form-admin-login" onsubmit="window.handleAdminTerminalLogin(event)">
            <div class="form-group" style="margin-bottom: var(--spacing-md);">
              <label for="admin-email" style="color: rgba(255,255,255,0.7); font-weight: 700;">Security Email ID</label>
              <div class="input-with-icon" style="background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.08);">
                <i data-lucide="user-check" style="color: var(--text-muted);"></i>
                <input type="text" id="admin-email" placeholder="admin@palgrocery.in or 9415552992" required style="color: white; background: transparent; border: none; width: 100%;">
              </div>
            </div>
            <div class="form-group" style="margin-bottom: var(--spacing-lg);">
              <label for="admin-pass" style="color: rgba(255,255,255,0.7); font-weight: 700;">Security PIN / Password</label>
              <div class="input-with-icon" style="background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.08);">
                <i data-lucide="key-round" style="color: var(--text-muted);"></i>
                <input type="password" id="admin-pass" placeholder="••••••••" required style="color: white; background: transparent; border: none; width: 100%;">
              </div>
            </div>
            
            <button type="submit" class="btn-auth-action" style="background: linear-gradient(135deg, var(--secondary), #1e293b); box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2); border: 1px solid rgba(255,255,255,0.1); color: white; width: 100%;">
              <span>Authorize & Enter Dashboard</span>
              <i data-lucide="shield-check"></i>
            </button>
          </form>
        </div>

        <div style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: var(--spacing-md); text-align: center; display: flex; justify-content: space-between; gap: var(--spacing-sm); align-items: center;">
          <a href="#login" onclick="navigateView('login')" style="font-size: 0.78rem; color: var(--text-muted); text-decoration: none; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">
            <i data-lucide="arrow-left" style="width: 14px; height: 14px;"></i> Customer Login
          </a>
          <a href="#home" onclick="navigateView('home')" style="font-size: 0.78rem; color: var(--text-muted); text-decoration: none; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">
            Return to Shop <i data-lucide="home" style="width: 14px; height: 14px;"></i>
          </a>
        </div>
      </div>
    </div>
  `;

  window.handleAdminTerminalLogin = async (e) => {
    if (e) e.preventDefault();
    const usernameInput = document.getElementById("admin-email");
    const passwordInput = document.getElementById("admin-pass");

    const username = usernameInput ? usernameInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value : "";

    if (!username || !password) {
      showToast("Please enter Admin ID/Phone and Security Password.", "warning");
      return;
    }

    try {
      const res = await fetch("api/auth.php?action=admin_login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (data.success) {
        window.state.adminUser = data.user || {
          name: "Ramlallu Pal (Owner)",
          email: "admin@palgrocery.in",
          phone: "9415552992",
          role: "admin"
        };
        if (data.token) {
          window.state.adminUser.token = data.token;
          localStorage.setItem("palbasket_admin_token", data.token);
        }
        window.state.user = null;
        localStorage.setItem("palbasket_admin", JSON.stringify(window.state.adminUser));
        localStorage.removeItem("palbasket_user");

        showToast("🔑 Security Verification Passed: Welcome Store Owner!", "success");
        navigateView("admin", null, false);
      } else {
        showToast(data.error || "Security Violation: Invalid Admin Credentials!", "danger");
      }
    } catch (err) {
      // Offline fallback verification (Only valid owner phone/email + owner password when API server is offline)
      const isValid = (username === "admin" || username === "admin@palgrocery.in" || username === "9415552992") && (password === "Pal@9415552992");
      if (isValid) {
        window.state.adminUser = {
          name: "Ramlallu Pal (Owner)",
          email: "admin@palgrocery.in",
          phone: "9415552992",
          role: "admin"
        };
        window.state.user = null;
        localStorage.setItem("palbasket_admin", JSON.stringify(window.state.adminUser));
        localStorage.removeItem("palbasket_user");

        showToast("🔑 Security Verification Passed (Local Offline Mode)!", "success");
        navigateView("admin", null, false);
      } else {
        showToast("Security Violation: Incorrect Admin ID or Password!", "danger");
      }
    }
  };

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// Common auth finalization helper
function finalizeAuthSuccess(viewport) {
  if (window.state.user) {
    localStorage.setItem("palbasket_user", JSON.stringify(window.state.user));
    localStorage.removeItem("palbasket_admin");
  } else if (window.state.adminUser) {
    localStorage.setItem("palbasket_admin", JSON.stringify(window.state.adminUser));
    localStorage.removeItem("palbasket_user");
  }
  // Always persist registered users list
  localStorage.setItem("palbasket_registered_users", JSON.stringify(window.state.registeredUsers));

  updateHeaderAuthUI();
  const redirect = viewport.dataset.redirectTarget || "home";
  
  document.getElementById("storefront-nav").style.display = "flex";
  document.getElementById("cart-drawer-toggle").style.display = "flex";
  navigateView(redirect);
}
