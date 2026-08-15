<?php
// ============================================================
//   Database Configuration — Pal Grocery
//  Agar XAMPP me MySQL password set hai to neeche change karo
// ============================================================

define('DB_HOST', 'localhost');
define('DB_USER', 'root');       // XAMPP default user
define('DB_PASS', '');           // XAMPP default password (khali)
define('DB_NAME', 'palbasket_db');

// CORS & Production Security Headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('X-Frame-Options: SAMEORIGIN');
header('X-Content-Type-Options: nosniff');
header('X-XSS-Protection: 1; mode=block');
header('Referrer-Policy: strict-origin-when-cross-origin');

// Set JSON Content-Type only for /api/ requests
if (isset($_SERVER['SCRIPT_NAME']) && strpos($_SERVER['SCRIPT_NAME'], '/api/') !== false) {
    header('Content-Type: application/json; charset=UTF-8');
}

// Preflight OPTIONS request handle
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database connection banao
function getDB() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    if ($conn->connect_error) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Database connection failed: ' . $conn->connect_error,
            'hint' => 'XAMPP me MySQL start hai? phpMyAdmin me palbasket_db database bana hai?'
        ]);
        exit();
    }
    $conn->set_charset('utf8mb4');
    return $conn;
}

// JSON response helper
function jsonResponse($data, $code = 200) {
    http_response_code($code);
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit();
}

// Error response helper
function errorResponse($message, $code = 400) {
    jsonResponse(['success' => false, 'error' => $message], $code);
}

// Verify Admin Auth Token or active PHP session for sensitive API actions
function verifyAdminAuthToken($conn) {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    // 1. First priority: Check active PHP server-side session
    if (isset($_SESSION['admin_id']) && !empty($_SESSION['admin_id']) && isset($_SESSION['admin_role']) && in_array($_SESSION['admin_role'], ['admin', 'store_owner'], true)) {
        return true;
    }

    // 2. Second priority: Read Authorization Header
    $headers = function_exists('getallheaders') ? getallheaders() : [];
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';

    if (!empty($authHeader) && preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
        $token = trim($matches[1]);
        if (!empty($token)) {
            $resToken = $conn->query("SELECT setting_value FROM settings WHERE setting_key = 'admin_session_token'");
            $storedToken = ($resToken && $row = $resToken->fetch_assoc()) ? $row['setting_value'] : '';

            if ($storedToken && hash_equals($storedToken, $token)) {
                return true;
            }

            $resHash = $conn->query("SELECT setting_value FROM settings WHERE setting_key = 'admin_password_hash'");
            $storedHash = ($resHash && $row = $resHash->fetch_assoc()) ? $row['setting_value'] : '';
            if ($storedHash && hash_equals(hash('sha256', $storedHash), $token)) {
                return true;
            }
        }
    }

    errorResponse('🚨 Unauthorized Access: Active Admin Session required. Please log in.', 401);
}
