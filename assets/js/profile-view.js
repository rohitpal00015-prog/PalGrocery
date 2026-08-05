// Pal Grocery - Profile & Rewards View Module

function renderCustomerProfile(viewport) {
  const points = window.state.user.loyaltyPoints;
  const tier = window.state.user.loyaltyTier;
  
  // Progress to next tier (let's assume Silver at 100, Gold at 200, Platinum at 500)
  const percent = Math.min(100, (points / 500) * 100);

  viewport.innerHTML = `
    <div class="container fade-in" style="padding-bottom: 3rem;">
      <div style="margin-top: var(--spacing-lg);">
        <h2 style="font-size: 1.8rem; font-weight: 800; letter-spacing: -0.5px;">Your Customer Account</h2>
      </div>

      <div class="checkout-grid" style="margin-top: var(--spacing-lg);">
        <div style="display: flex; flex-direction: column; gap: var(--spacing-md);">
          <!-- Account info -->
          <div class="checkout-card">
            <h3>Personal Information</h3>
            <div class="form-row">
              <div class="form-field">
                <label>Name</label>
                <input type="text" readonly value="${window.state.user.name}">
              </div>
              <div class="form-field">
                <label>Phone Number</label>
                <input type="text" readonly value="${window.state.user.phone}">
              </div>
            </div>
            <div class="form-field">
              <label>Delivery Address</label>
              <input type="text" readonly value="${window.state.user.address}">
            </div>
            <button class="btn btn-secondary btn-sm" style="margin-top: 1rem; width: 100%; border-color: var(--danger); color: var(--danger); display: flex; align-items: center; justify-content: center; gap: 6px;" onclick="window.performLogout()">
              <i data-lucide="log-out" style="width: 14px; height: 14px;"></i> Logout
            </button>
          </div>

          <!-- Past Orders -->
          <div class="checkout-card">
            <h3>Online Purchase History</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
              <thead>
                <tr style="border-bottom: 2px solid var(--border-color); color: var(--text-muted); font-weight: 700;">
                  <th style="padding-bottom: 8px;">Order ID</th>
                  <th style="padding-bottom: 8px;">Date</th>
                  <th style="padding-bottom: 8px;">Status</th>
                  <th style="padding-bottom: 8px; text-align: right;">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                ${window.state.orders.map(o => {
                  const isHindi = window.SHOP_CONFIG.language === "hi";
                  const statusBadgeClass = o.status === 'Delivered' ? 'badge-success' : o.status === 'Pending Estimation' ? 'badge-warning' : 'badge-primary';
                  const statusText = isHindi ? (o.status === 'Pending Estimation' ? 'मूल्यांकन लंबित' : o.status) : o.status;
                  const totalText = o.isParchi && o.total === 0 ? (isHindi ? "पर्ची (जांच जारी)" : "Parchi (Pending Est.)") : `₹${o.total.toFixed(2)}`;
                  return `
                    <tr style="border-bottom: 1px solid var(--border-color); cursor: pointer;" onclick="navigateView('tracker', '${o.id}')">
                      <td style="padding: 12px 0; font-weight: 700; color: var(--primary);">${o.id} <i data-lucide="chevron-right" style="width: 12px; display: inline-block;"></i></td>
                      <td>${o.date}</td>
                      <td><span class="badge ${statusBadgeClass}">${statusText}</span></td>
                      <td style="text-align: right; font-weight: 800;">${totalText}</td>
                    </tr>
                  `;
                }).join("")}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Loyalty panel -->
        <div>
          <div class="checkout-card" style="border-color: var(--primary);">
            <div style="text-align: center; margin-bottom: var(--spacing-md);">
              <i data-lucide="sparkles" style="width: 48px; height: 48px; color: var(--primary); margin: 0 auto var(--spacing-sm) auto;"></i>
              <h3>Kirana Loyalty Club</h3>
              <span class="badge badge-primary" style="margin-top: 4px; font-size: 0.85rem; padding: 4px 12px;">${tier} Member</span>
            </div>
            
            <div style="background: var(--bg-base); padding: var(--spacing-md); border-radius: var(--radius-sm); text-align: center; margin-bottom: var(--spacing-md);">
              <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 700;">TOTAL ACCRUED POINTS</div>
              <div style="font-size: 2.2rem; font-weight: 800; color: var(--primary);">${points}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">Valued at ₹${points.toFixed(2)} (Use to pay at checkout!)</div>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 700; margin-bottom: 4px;">
                <span>Gold Tier status</span>
                <span style="color: var(--text-muted);">${points} / 500 pts</span>
              </div>
              <div style="background: var(--bg-base); height: 8px; border-radius: 4px; overflow: hidden; margin-bottom: 8px;">
                <div style="background: var(--primary); width: ${percent}%; height: 100%;"></div>
              </div>
              <p style="font-size: 0.75rem; color: var(--text-muted); text-align: center;">Earn 1 point for every ₹10 spent. Unlock Platinum benefits at 500 points!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
