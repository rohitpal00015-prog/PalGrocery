<?php
// ============================================================
//   Authentication API — Pal Grocery (Bank-Grade Security)
//   Features: Bcrypt Password Hashing, Anti-Brute-Force Rate Limiting, 
//             Admin Password Change & MySQL Permanent Storage
// ============================================================

require_once 'config.php';

$conn = getDB();

// ─── Table Initialization ─────────────────────────────────
$conn->query("
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL UNIQUE,
  email VARCHAR(100) NULL,
  password_hash VARCHAR(255) NOT NULL,
  address TEXT NULL,
  loyalty_points INT DEFAULT 0,
  loyalty_tier VARCHAR(30) DEFAULT 'Standard',
  role VARCHAR(20) DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
");

$conn->query("
CREATE TABLE IF NOT EXISTS login_attempts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ip_address VARCHAR(45) NOT NULL UNIQUE,
  attempts INT DEFAULT 1,
  last_attempt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
");

// Initialize default admin credentials if not set in settings
$conn->query("CREATE TABLE IF NOT EXISTS settings (
  setting_key VARCHAR(100) PRIMARY KEY,
  setting_value TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

$res = $conn->query("SELECT setting_value FROM settings WHERE setting_key = 'admin_password_hash'");
if ($res->num_rows === 0) {
    // Default password hash for "Pal@9415552992"
    $defaultHash = password_hash('Pal@9415552992', PASSWORD_BCRYPT);
    $conn->query("INSERT INTO settings (setting_key, setting_value) VALUES ('admin_username', '9415552992')");
    $conn->query("INSERT INTO settings (setting_key, setting_value) VALUES ('admin_password_hash', '$defaultHash')");
}

$ipAddress = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
$input = json_decode(file_get_contents('php://input'), true) ?? [];

// Helper: Rate Limit Checker (Max 5 attempts per 15 mins)
function checkRateLimit($conn, $ip) {
    $stmt = $conn->prepare("SELECT attempts, TIMESTAMPDIFF(MINUTE, last_attempt, NOW()) as mins_passed FROM login_attempts WHERE ip_address = ?");
    $stmt->bind_param("s", $ip);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        if ($row['attempts'] >= 5 && $row['mins_passed'] < 15) {
            $lockTimeRemaining = 15 - $row['mins_passed'];
            errorResponse("🚨 Too many failed login attempts! Security lock active for $lockTimeRemaining more minutes to prevent Brute-Force attacks.", 429);
        } elseif ($row['mins_passed'] >= 15) {
            // Reset attempts after 15 mins
            $stmtReset = $conn->prepare("UPDATE login_attempts SET attempts = 0 WHERE ip_address = ?");
            $stmtReset->bind_param("s", $ip);
            $stmtReset->execute();
        }
    }
}

// Helper: Record Failed Login Attempt
function recordFailedAttempt($conn, $ip) {
    $stmt = $conn->prepare("INSERT INTO login_attempts (ip_address, attempts) VALUES (?, 1) ON DUPLICATE KEY UPDATE attempts = attempts + 1, last_attempt = NOW()");
    $stmt->bind_param("s", $ip);
    $stmt->execute();
}

// Helper: Clear Login Attempts on Success
function clearAttempts($conn, $ip) {
    $stmt = $conn->prepare("DELETE FROM login_attempts WHERE ip_address = ?");
    $stmt->bind_param("s", $ip);
    $stmt->execute();
}

if ($method === 'POST') {
    // ─── ADMIN LOGIN ──────────────────────────────────────
    if ($action === 'admin_login') {
        checkRateLimit($conn, $ipAddress);
        usleep(250000); // 250ms anti-timing attack delay

        $username = trim($input['username'] ?? '');
        $password = trim($input['password'] ?? '');

        if (!$username || !$password) {
            errorResponse('Admin Username / Mobile number and Security Password are required.');
        }

        // Fetch stored admin credentials from settings
        $resUser = $conn->query("SELECT setting_value FROM settings WHERE setting_key = 'admin_username'");
        $resHash = $conn->query("SELECT setting_value FROM settings WHERE setting_key = 'admin_password_hash'");

        $storedUser = ($resUser && $row = $resUser->fetch_assoc()) ? $row['setting_value'] : '9415552992';
        $storedHash = ($resHash && $row = $resHash->fetch_assoc()) ? $row['setting_value'] : '';

        // Allow login by Username or stored admin username
        $isUserValid = (strtolower($username) === strtolower($storedUser) || $username === 'admin' || $username === '9415552992' || $username === 'admin@palgrocery.in');
        
        $isPassValid = false;
        if (!empty($storedHash)) {
            $isPassValid = password_verify($password, $storedHash);
        } else {
            $isPassValid = password_verify($password, password_hash('Pal@9415552992', PASSWORD_BCRYPT));
        }

        if ($isUserValid && $isPassValid) {
            clearAttempts($conn, $ipAddress);

            // Generate secure admin session token
            $sessionToken = bin2hex(random_bytes(32));
            $stmtToken = $conn->prepare("INSERT INTO settings (setting_key, setting_value) VALUES ('admin_session_token', ?) ON DUPLICATE KEY UPDATE setting_value = ?");
            $stmtToken->bind_param("ss", $sessionToken, $sessionToken);
            $stmtToken->execute();

            jsonResponse([
                'success' => true,
                'message' => 'Admin Security Verification Passed!',
                'token' => $sessionToken,
                'user' => [
                    'id' => 999,
                    'name' => 'Ramlallu Pal (Owner)',
                    'phone' => '9415552992',
                    'role' => 'admin',
                    'token' => $sessionToken
                ]
            ]);
        } else {
            recordFailedAttempt($conn, $ipAddress);
            errorResponse('Security Violation: Invalid Admin ID or Password. Attempt logged for security monitoring.', 401);
        }
    }

    // ─── CHANGE ADMIN PASSWORD & USERNAME ────────────────
    if ($action === 'change_admin_credentials') {
        verifyAdminAuthToken($conn);

        $oldPassword = trim($input['oldPassword'] ?? '');
        $newUsername = trim($input['newUsername'] ?? '');
        $newPassword = trim($input['newPassword'] ?? '');

        if (!$oldPassword || !$newUsername || !$newPassword) {
            errorResponse('Old password, New Username, and New Password are all required.');
        }

        if (strlen($newPassword) < 8) {
            errorResponse('New password must be at least 8 characters long for high security.');
        }

        // Verify old password
        $resHash = $conn->query("SELECT setting_value FROM settings WHERE setting_key = 'admin_password_hash'");
        $storedHash = ($resHash && $row = $resHash->fetch_assoc()) ? $row['setting_value'] : '';

        if (!password_verify($oldPassword, $storedHash)) {
            errorResponse('Incorrect old password! Verification failed.', 403);
        }

        // Save new username and bcrypt password hash
        $newHash = password_hash($newPassword, PASSWORD_BCRYPT);

        $stmtUser = $conn->prepare("INSERT INTO settings (setting_key, setting_value) VALUES ('admin_username', ?) ON DUPLICATE KEY UPDATE setting_value = ?");
        $stmtUser->bind_param("ss", $newUsername, $newUsername);
        $stmtUser->execute();

        $stmtHash = $conn->prepare("INSERT INTO settings (setting_key, setting_value) VALUES ('admin_password_hash', ?) ON DUPLICATE KEY UPDATE setting_value = ?");
        $stmtHash->bind_param("ss", $newHash, $newHash);
        $stmtHash->execute();

        // Refresh session token
        $newSessionToken = bin2hex(random_bytes(32));
        $stmtToken = $conn->prepare("INSERT INTO settings (setting_key, setting_value) VALUES ('admin_session_token', ?) ON DUPLICATE KEY UPDATE setting_value = ?");
        $stmtToken->bind_param("ss", $newSessionToken, $newSessionToken);
        $stmtToken->execute();

        jsonResponse([
            'success' => true,
            'message' => 'Admin Username & Password updated successfully in Database!',
            'token' => $newSessionToken
        ]);
    }

    // ─── CUSTOMER REGISTER ────────────────────────────────
    if ($action === 'register') {
        $name = trim($input['name'] ?? '');
        $phone = trim($input['phone'] ?? '');
        $email = trim($input['email'] ?? '');
        $password = trim($input['password'] ?? '');
        $address = trim($input['address'] ?? '');

        if (!$name || !$phone || !$password) {
            errorResponse('Name, Phone number and Password are required.');
        }

        $stmt = $conn->prepare("SELECT id FROM users WHERE phone = ?");
        $stmt->bind_param("s", $phone);
        $stmt->execute();
        if ($stmt->get_result()->num_rows > 0) {
            errorResponse('Mobile number already registered! Please login instead.');
        }

        $hash = password_hash($password, PASSWORD_BCRYPT);
        $stmt = $conn->prepare("INSERT INTO users (name, phone, email, password_hash, address) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssss", $name, $phone, $email, $hash, $address);

        if ($stmt->execute()) {
            jsonResponse([
                'success' => true,
                'message' => 'Registration successful!',
                'user' => [
                    'id' => $stmt->insert_id,
                    'name' => $name,
                    'phone' => $phone,
                    'email' => $email,
                    'address' => $address,
                    'loyaltyPoints' => 0,
                    'loyaltyTier' => 'Standard',
                    'role' => 'customer'
                ]
            ]);
        } else {
            errorResponse('Failed to register: ' . $conn->error);
        }
    }

    // ─── CUSTOMER LOGIN ──────────────────────────────────
    if ($action === 'login') {
        $phone = trim($input['phone'] ?? '');
        $password = trim($input['password'] ?? '');

        $stmt = $conn->prepare("SELECT * FROM users WHERE phone = ? OR email = ?");
        $stmt->bind_param("ss", $phone, $phone);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            errorResponse('Account not found with this phone/email. Please register!');
        }

        $user = $result->fetch_assoc();
        if (password_verify($password, $user['password_hash'])) {
            jsonResponse([
                'success' => true,
                'user' => [
                    'id' => (int)$user['id'],
                    'name' => $user['name'],
                    'phone' => $user['phone'],
                    'email' => $user['email'],
                    'address' => $user['address'],
                    'loyaltyPoints' => (int)$user['loyalty_points'],
                    'loyaltyTier' => $user['loyalty_tier'],
                    'role' => $user['role']
                ]
            ]);
        } else {
            errorResponse('Incorrect password!');
        }
    }
}

errorResponse('Invalid API endpoint or method.');
