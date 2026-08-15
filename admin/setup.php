<?php
// ============================================================
//   First-Time Administrator Setup — Pal Grocery
//   Locks automatically once an Admin account exists.
// ============================================================

require_once __DIR__ . '/auth_check.php';
setNoCacheHeaders();

$db = getDB();

// Check if any administrator account already exists in MySQL
$adminExists = false;

// 1. Check admins table
$resAdmins = $db->query("SELECT COUNT(*) as cnt FROM admins");
if ($resAdmins && ($row = $resAdmins->fetch_assoc()) && (int)$row['cnt'] > 0) {
    $adminExists = true;
}

// 2. Check settings table backup
if (!$adminExists) {
    $resSettings = $db->query("SELECT setting_value FROM settings WHERE setting_key = 'admin_password_hash'");
    if ($resSettings && ($row = $resSettings->fetch_assoc()) && !empty($row['setting_value'])) {
        $adminExists = true;
    }
}

// Handle Form Submission
$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && !$adminExists) {
    $csrfToken = $_POST['csrf_token'] ?? '';
    if (!verifyCSRFToken($csrfToken)) {
        $error = 'Invalid security token. Please try again.';
    } else {
        $name            = trim($_POST['name'] ?? '');
        $username        = trim($_POST['username'] ?? '');
        $email           = trim($_POST['email'] ?? '');
        $password        = $_POST['password'] ?? '';
        $confirmPassword = $_POST['confirm_password'] ?? '';

        if (empty($name) || empty($username) || empty($email) || empty($password)) {
            $error = 'All fields are required.';
        } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $error = 'Please enter a valid email address.';
        } elseif (strlen($password) < 8) {
            $error = 'Password must be at least 8 characters long.';
        } elseif ($password !== $confirmPassword) {
            $error = 'Password and Confirm Password do not match.';
        } else {
            // Hash password with Bcrypt
            $hash = password_hash($password, PASSWORD_BCRYPT);

            // Insert into admins table
            $stmt = $db->prepare("INSERT INTO admins (name, username, email, password_hash, role) VALUES (?, ?, ?, ?, 'admin')");
            $stmt->bind_param("ssss", $name, $username, $email, $hash);

            if ($stmt->execute()) {
                $newId = $stmt->insert_id;

                // Sync with settings table for backward compatibility
                $stmtSetU = $db->prepare("INSERT INTO settings (setting_key, setting_value) VALUES ('admin_username', ?) ON DUPLICATE KEY UPDATE setting_value = ?");
                $stmtSetU->bind_param("ss", $username, $username);
                $stmtSetU->execute();

                $stmtSetP = $db->prepare("INSERT INTO settings (setting_key, setting_value) VALUES ('admin_password_hash', ?) ON DUPLICATE KEY UPDATE setting_value = ?");
                $stmtSetP->bind_param("ss", $hash, $hash);
                $stmtSetP->execute();

                // Authenticate Session
                session_regenerate_id(true);
                $_SESSION['admin_id']       = $newId;
                $_SESSION['admin_name']     = $name;
                $_SESSION['admin_username'] = $username;
                $_SESSION['admin_email']    = $email;
                $_SESSION['admin_role']     = 'admin';

                header('Location: dashboard.php');
                exit();
            } else {
                $error = 'Failed to create Administrator: ' . $db->error;
            }
        }
    }
}

$csrfToken = getCSRFToken();
?>
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin First-Time Setup | Pal Grocery</title>
  <link rel="stylesheet" href="../assets/css/style.css">
  <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body style="background: radial-gradient(circle at center, #1e293b 0%, #0f172a 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem 1rem;">

  <div class="login-card" style="border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6); background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(16px); width: 100%; max-width: 480px; padding: 2.5rem; border-radius: 16px;">
    
    <div class="login-header" style="text-align: center; padding-bottom: 1.5rem; border-bottom: 1px solid rgba(255, 255, 255, 0.08); margin-bottom: 1.5rem;">
      <div style="background: linear-gradient(135deg, #10b981, #047857); width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 20px rgba(0,0,0,0.3); color: white; margin: 0 auto 12px auto;">
        <i data-lucide="<?php echo $adminExists ? 'lock' : 'user-plus'; ?>" style="width: 32px; height: 32px;"></i>
      </div>
      <h2 style="color: white; font-weight: 800; font-size: 1.6rem; letter-spacing: -0.5px;">
        <?php echo $adminExists ? 'Setup Locked' : 'First-Time Admin Setup'; ?>
      </h2>
      <p style="color: var(--text-muted); font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px;">
        <?php echo $adminExists ? 'Administrator Account Active' : 'Configure Owner Credentials'; ?>
      </p>
    </div>

    <?php if ($adminExists): ?>
      <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #fca5a5; padding: 1rem; border-radius: 8px; font-size: 0.88rem; line-height: 1.5; margin-bottom: 1.5rem;">
        <strong style="display: block; font-size: 0.95rem; margin-bottom: 4px; color: #ef4444;">🔒 Registration Disabled</strong>
        An Administrator account already exists in the system database. First-time setup is disabled to prevent unauthorized account creation.
      </div>
      
      <a href="login.php" class="btn-auth-action" style="background: linear-gradient(135deg, var(--primary), #047857); color: white; text-align: center; display: flex; align-items: center; justify-content: center; gap: 8px; text-decoration: none; padding: 0.75rem; border-radius: 8px; font-weight: 700;">
        <span>Proceed to Admin Login</span>
        <i data-lucide="arrow-right"></i>
      </a>
    <?php else: ?>

      <?php if (!empty($error)): ?>
        <div style="background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; color: #fca5a5; padding: 0.8rem 1rem; border-radius: 8px; font-size: 0.85rem; margin-bottom: 1.25rem;">
          <?php echo htmlspecialchars($error); ?>
        </div>
      <?php endif; ?>

      <form method="POST" action="setup.php" style="display: flex; flex-direction: column; gap: 1rem;">
        <input type="hidden" name="csrf_token" value="<?php echo htmlspecialchars($csrfToken); ?>">

        <div class="form-group">
          <label style="color: rgba(255,255,255,0.8); font-weight: 700; font-size: 0.85rem; margin-bottom: 4px; display: block;">Full Name *</label>
          <input type="text" name="name" placeholder="e.g. Ramlallu Pal" value="<?php echo htmlspecialchars($_POST['name'] ?? ''); ?>" required style="width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); padding: 10px 14px; border-radius: 8px; color: white;">
        </div>

        <div class="form-group">
          <label style="color: rgba(255,255,255,0.8); font-weight: 700; font-size: 0.85rem; margin-bottom: 4px; display: block;">Username or Mobile *</label>
          <input type="text" name="username" placeholder="e.g. 9415552992 or admin" value="<?php echo htmlspecialchars($_POST['username'] ?? ''); ?>" required style="width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); padding: 10px 14px; border-radius: 8px; color: white;">
        </div>

        <div class="form-group">
          <label style="color: rgba(255,255,255,0.8); font-weight: 700; font-size: 0.85rem; margin-bottom: 4px; display: block;">Email Address *</label>
          <input type="email" name="email" placeholder="admin@palgrocery.in" value="<?php echo htmlspecialchars($_POST['email'] ?? ''); ?>" required style="width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); padding: 10px 14px; border-radius: 8px; color: white;">
        </div>

        <div class="form-group">
          <label style="color: rgba(255,255,255,0.8); font-weight: 700; font-size: 0.85rem; margin-bottom: 4px; display: block;">Secret Password (min 8 chars) *</label>
          <input type="password" name="password" placeholder="••••••••" required minlength="8" style="width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); padding: 10px 14px; border-radius: 8px; color: white;">
        </div>

        <div class="form-group">
          <label style="color: rgba(255,255,255,0.8); font-weight: 700; font-size: 0.85rem; margin-bottom: 4px; display: block;">Confirm Password *</label>
          <input type="password" name="confirm_password" placeholder="••••••••" required minlength="8" style="width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); padding: 10px 14px; border-radius: 8px; color: white;">
        </div>

        <button type="submit" class="btn-auth-action" style="background: linear-gradient(135deg, #10b981, #047857); color: white; width: 100%; padding: 0.85rem; border-radius: 8px; font-weight: 800; margin-top: 8px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
          <span>Create Admin Account & Launch Portal</span>
          <i data-lucide="shield-check"></i>
        </button>
      </form>
    <?php endif; ?>

    <div style="border-top: 1px solid rgba(255,255,255,0.08); margin-top: 1.5rem; padding-top: 1rem; text-align: center;">
      <a href="../index.html" style="font-size: 0.8rem; color: var(--text-muted); text-decoration: none; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">
        <i data-lucide="arrow-left" style="width: 14px; height: 14px;"></i> Return to Storefront
      </a>
    </div>
  </div>

  <script>if (window.lucide) window.lucide.createIcons();</script>
</body>
</html>
