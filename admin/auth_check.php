<?php
// ============================================================
//   Server-Side Session Guard & CSRF Security Middleware
// ============================================================

if (session_status() === PHP_SESSION_NONE) {
    // Configure secure session cookie parameters before starting session
    ini_set('session.cookie_httponly', 1);
    ini_set('session.use_only_cookies', 1);
    ini_set('session.cookie_samesite', 'Lax');
    session_start();
}

require_once __DIR__ . '/../api/config.php';

// Set strict anti-caching headers & HTML content-type on all protected admin pages
function setNoCacheHeaders() {
    header("Content-Type: text/html; charset=UTF-8");
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
    header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");
}

// Check if active session is authenticated with valid admin role
function isAdminAuthenticated() {
    return (
        isset($_SESSION['admin_id']) &&
        !empty($_SESSION['admin_id']) &&
        isset($_SESSION['admin_role']) &&
        in_array($_SESSION['admin_role'], ['admin', 'store_owner'], true)
    );
}

// Strict authorization check for protected admin pages and endpoints
function requireAdminAuth() {
    setNoCacheHeaders();

    if (!isAdminAuthenticated()) {
        $isAjax = (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest')
               || (isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false)
               || (isset($_SERVER['CONTENT_TYPE']) && strpos($_SERVER['CONTENT_TYPE'], 'application/json') !== false);

        if ($isAjax) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'error' => '🚨 Authentication Required: Your admin session has expired or is invalid. Please log in.',
                'redirect' => 'login.php'
            ]);
            exit();
        } else {
            header('Location: login.php');
            exit();
        }
    }
}

// CSRF Token Management
function getCSRFToken() {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function verifyCSRFToken($submittedToken) {
    if (empty($submittedToken) || empty($_SESSION['csrf_token'])) {
        return false;
    }
    return hash_equals($_SESSION['csrf_token'], $submittedToken);
}
