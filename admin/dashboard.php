<?php
// ============================================================
//   Server-Side Protected Admin Dashboard — Pal Grocery
//   Requires active PHP $_SESSION['admin_id'] & valid Admin role.
// ============================================================

require_once __DIR__ . '/auth_check.php';

// Enforce strict server-side authentication & anti-cache headers
requireAdminAuth();

$adminName = $_SESSION['admin_name'] ?? 'Ramlallu Pal';
$adminRole = $_SESSION['admin_role'] ?? 'admin';
$csrfToken = getCSRFToken();
?>
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Control Center | Pal Grocery</title>
  <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body>

  <!--  Main Navigation Header for Admin -->
  <header class="app-header">
    <div class="container nav-wrapper">
      <a href="dashboard.php" class="logo">
        <i data-lucide="shopping-bag" style="stroke-width: 2.5px;"></i>
        <span>Pal Grocery (Admin Terminal)</span>
      </a>

      <div class="nav-actions">
        <div style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; font-weight: 700; color: var(--text-main); background: var(--bg-surface-hover); padding: 4px 12px; border-radius: 20px; border: 1px solid var(--border-color);">
          <i data-lucide="shield-check" style="width: 16px; height: 16px; color: var(--primary);"></i>
          <span><?php echo htmlspecialchars($adminName); ?> (<?php echo htmlspecialchars(strtoupper($adminRole)); ?>)</span>
        </div>

        <a href="../index.html" class="theme-toggle-btn" style="font-size: 0.8rem; font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; gap: 4px; padding: 6px 12px;">
          <i data-lucide="store" style="width: 15px; height: 15px;"></i> Storefront
        </a>

        <a href="logout.php" class="btn btn-secondary btn-sm" style="font-size: 0.8rem; font-weight: 700; text-decoration: none; color: var(--danger); border-color: var(--danger); display: inline-flex; align-items: center; gap: 4px; padding: 6px 12px;">
          <i data-lucide="log-out" style="width: 15px; height: 15px;"></i> Logout
        </a>
      </div>
    </div>
  </header>

  <!-- Main Display Viewport for Admin Shell -->
  <main class="main-content" id="app-viewport">
    <div class="container" style="padding: 4rem 0; text-align: center;">
      <div class="spinner" style="width: 40px; height: 40px; border: 3px solid var(--border-color); border-top-color: var(--primary); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem auto;"></div>
      <p style="font-weight: 700; color: var(--text-muted);">Loading Secure Admin Terminal...</p>
    </div>
  </main>

  <!-- Lucide Icons -->
  <script src="https://unpkg.com/lucide@latest"></script>

  <!-- Inject Server Session state & Admin Standalone flag -->
  <script>
    window.IS_ADMIN_STANDALONE = true;
    window.SERVER_ADMIN = {
      id: <?php echo json_encode($_SESSION['admin_id']); ?>,
      name: <?php echo json_encode($adminName); ?>,
      role: <?php echo json_encode($adminRole); ?>,
      csrfToken: <?php echo json_encode($csrfToken); ?>
    };
    window.state = window.state || {};
    window.state.adminUser = {
      name: window.SERVER_ADMIN.name,
      role: window.SERVER_ADMIN.role
    };
    window.state.currentView = "admin";
  </script>

  <!-- Application Modules -->
  <script src="../assets/js/db.js"></script>
  <script src="../assets/js/products.js"></script>
  <script src="../assets/js/ai-assistant.js"></script>
  <script src="../assets/js/admin.js"></script>
  <script src="../assets/js/pos.js"></script>
  <script src="../assets/js/parchi-view.js"></script>
  <script src="../assets/js/arcade-engine.js"></script>
  <script src="../assets/js/app.js"></script>
  <script>
    if (window.adminDashboard && window.adminDashboard.renderAdminShell) {
      window.adminDashboard.renderAdminShell();
    }
  </script>
</body>
</html>
