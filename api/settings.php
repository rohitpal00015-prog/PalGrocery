<?php
// ============================================================
//   Settings API — Pal Grocery
//  GET  /api/settings.php  → Sare settings
//  POST /api/settings.php  → Settings save karo
// ============================================================

require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = getDB();

if ($method === 'GET') {
    $result = $db->query("SELECT setting_key, setting_value FROM settings");
    $settings = [];
    while ($row = $result->fetch_assoc()) {
        $settings[$row['setting_key']] = $row['setting_value'];
    }
    jsonResponse(['success' => true, 'settings' => $settings]);
}

elseif ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data) {
        errorResponse("Settings data zaroori hai");
    }

    $stmt = $db->prepare("INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)");

    $saved = 0;
    foreach ($data as $key => $value) {
        $k = strval($key);
        $v = strval($value);
        $stmt->bind_param("ss", $k, $v);
        $stmt->execute();
        $saved++;
    }

    jsonResponse(['success' => true, 'message' => "$saved settings save ho gayi!"]);
}

else {
    errorResponse("Invalid method", 405);
}

$db->close();
