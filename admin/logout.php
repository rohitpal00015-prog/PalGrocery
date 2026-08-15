<?php
// ============================================================
//   Admin Logout Handler — Pal Grocery
//   Destroys PHP session and invalidates cache
// ============================================================

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Unset all session variables
$_SESSION = array();

// Delete session cookie
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(
        session_name(),
        '',
        time() - 42000,
        $params["path"],
        $params["domain"],
        $params["secure"],
        $params["httponly"]
    );
}

// Destroy session
session_destroy();

// Anti-cache headers
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

// Redirect to login
header("Location: login.php");
exit();
