<?php
// ============================================================
//   Database Configuration — Pal Grocery
//  Agar XAMPP me MySQL password set hai to neeche change karo
// ============================================================

define('DB_HOST', 'localhost');
define('DB_USER', 'root');       // XAMPP default user
define('DB_PASS', '');           // XAMPP default password (khali)
define('DB_NAME', 'palbasket_db');

// CORS Headers — JS fetch() ke liye zaroori hai
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=UTF-8');

// Preflight OPTIONS request handle karo
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
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
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit();
}

// Error response helper
function errorResponse($message, $code = 400) {
    jsonResponse(['success' => false, 'error' => $message], $code);
}
