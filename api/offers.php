<?php
// ============================================================
//   Offers API — Pal Grocery
//  GET  /api/offers.php  → Sare offers
//  POST /api/offers.php  → Offers save karo (bulk)
//  PUT  /api/offers.php  → Ek offer update karo
// ============================================================

require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = getDB();

if ($method === 'GET') {
    $result = $db->query("SELECT * FROM offers ORDER BY id ASC");
    $offers = [];
    while ($row = $result->fetch_assoc()) {
        $offers[] = [
            'id'       => $row['id'],
            'title_en' => $row['title_en'],
            'title_hi' => $row['title_hi'],
            'desc_en'  => $row['desc_en'],
            'desc_hi'  => $row['desc_hi'],
            'promoCode'=> $row['promo_code'],
            'color'    => $row['color'],
            'active'   => (bool)$row['active'],
        ];
    }
    jsonResponse(['success' => true, 'offers' => $offers]);
}

elseif ($method === 'POST') {
    verifyAdminAuthToken($db);
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data || !isset($data['offers'])) {
        errorResponse("Offers array zaroori hai");
    }

    $db->query("DELETE FROM offers");

    $stmt = $db->prepare("INSERT INTO offers (id, title_en, title_hi, desc_en, desc_hi, promo_code, color, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $saved = 0;
    foreach ($data['offers'] as $o) {
        $id       = $o['id'] ?? ('offer-' . time() . '-' . $saved);
        $title_en = $o['title_en'] ?? '';
        $title_hi = $o['title_hi'] ?? '';
        $desc_en  = $o['desc_en'] ?? '';
        $desc_hi  = $o['desc_hi'] ?? '';
        $promo    = $o['promoCode'] ?? '';
        $color    = $o['color'] ?? 'orange';
        $active   = isset($o['active']) ? (int)$o['active'] : 1;
        $stmt->bind_param("sssssssi", $id, $title_en, $title_hi, $desc_en, $desc_hi, $promo, $color, $active);
        $stmt->execute();
        $saved++;
    }
    jsonResponse(['success' => true, 'message' => "$saved offers save ho gayi!"]);
}

elseif ($method === 'PUT') {
    verifyAdminAuthToken($db);
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data || !isset($data['id'])) {
        errorResponse("Offer ID zaroori hai");
    }
    $id     = $data['id'];
    $active = isset($data['active']) ? (int)$data['active'] : 1;
    $stmt = $db->prepare("UPDATE offers SET active=? WHERE id=?");
    $stmt->bind_param("is", $active, $id);
    $stmt->execute();
    jsonResponse(['success' => true, 'message' => "Offer '$id' update ho gaya!"]);
}

else {
    errorResponse("Invalid method", 405);
}

$db->close();
