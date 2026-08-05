<?php
// ============================================================
//   Orders API — Pal Grocery
//  GET  /api/orders.php          → Sare orders (admin)
//  POST /api/orders.php          → Naya order save karo
//  PUT  /api/orders.php          → Order status update karo
// ============================================================

require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = getDB();

if ($method === 'GET') {
    $id = isset($_GET['id']) ? trim($_GET['id']) : null;

    if ($id) {
        $stmt = $db->prepare("SELECT * FROM orders WHERE id = ?");
        $stmt->bind_param("s", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        if ($row) {
            jsonResponse(['success' => true, 'order' => formatOrder($row)]);
        } else {
            errorResponse("Order not found: $id", 404);
        }
    } else {
        $status = isset($_GET['status']) ? trim($_GET['status']) : null;
        $limit  = isset($_GET['limit']) ? intval($_GET['limit']) : 50;

        if ($status) {
            $stmt = $db->prepare("SELECT * FROM orders WHERE status = ? ORDER BY order_date DESC LIMIT ?");
            $stmt->bind_param("si", $status, $limit);
        } else {
            $stmt = $db->prepare("SELECT * FROM orders ORDER BY order_date DESC LIMIT ?");
            $stmt->bind_param("i", $limit);
        }
        $stmt->execute();
        $result = $stmt->get_result();

        $orders = [];
        while ($row = $result->fetch_assoc()) {
            $orders[] = formatOrder($row);
        }
        jsonResponse(['success' => true, 'count' => count($orders), 'orders' => $orders]);
    }
}

elseif ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data) {
        errorResponse("Order data zaroori hai");
    }

    $id       = 'ORD-' . time() . '-' . rand(100, 999);
    $name     = $db->real_escape_string($data['customerName'] ?? 'Guest');
    $phone    = $db->real_escape_string($data['customerPhone'] ?? '');
    $email    = $db->real_escape_string($data['customerEmail'] ?? '');
    $items    = json_encode($data['items'] ?? []);
    $total    = floatval($data['total'] ?? 0);
    $status   = 'Pending';
    $payment  = $db->real_escape_string($data['paymentMethod'] ?? 'UPI');
    $address  = $db->real_escape_string($data['deliveryAddress'] ?? '');
    $isParchi = isset($data['isParchi']) ? (int)$data['isParchi'] : 0;
    $notes    = $db->real_escape_string($data['notes'] ?? '');

    $stmt = $db->prepare("INSERT INTO orders (id, customer_name, customer_phone, customer_email, items_json, total, status, payment_method, delivery_address, is_parchi, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssssdsssss",
        $id, $name, $phone, $email, $items, $total, $status, $payment, $address, $isParchi, $notes
    );

    if ($stmt->execute()) {
        jsonResponse(['success' => true, 'message' => 'Order place ho gaya!', 'orderId' => $id], 201);
    } else {
        errorResponse("Order save nahi hua: " . $stmt->error, 500);
    }
}

elseif ($method === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data || !isset($data['id'])) {
        errorResponse("Order ID zaroori hai");
    }
    $id     = trim($data['id']);
    $status = isset($data['status']) ? trim($data['status']) : null;
    $total  = isset($data['total']) ? floatval($data['total']) : null;

    if ($status !== null && $total !== null) {
        $stmt = $db->prepare("UPDATE orders SET status=?, total=? WHERE id=?");
        $stmt->bind_param("sds", $status, $total, $id);
    } elseif ($status !== null) {
        $stmt = $db->prepare("UPDATE orders SET status=? WHERE id=?");
        $stmt->bind_param("ss", $status, $id);
    } elseif ($total !== null) {
        $stmt = $db->prepare("UPDATE orders SET total=? WHERE id=?");
        $stmt->bind_param("ds", $total, $id);
    } else {
        errorResponse("Status ya total field hona chahiye update karne ke liye");
        exit();
    }

    if ($stmt->execute()) {
        jsonResponse(['success' => true, 'message' => "Order $id update ho gaya!"]);
    } else {
        errorResponse("Order update nahi hua: " . $stmt->error, 500);
    }
}

else {
    errorResponse("Invalid method", 405);
}

$db->close();

function formatOrder($row) {
    return [
        'id'             => $row['id'],
        'customerName'   => $row['customer_name'],
        'customerPhone'  => $row['customer_phone'],
        'customerEmail'  => $row['customer_email'],
        'items'          => json_decode($row['items_json'], true) ?? [],
        'total'          => floatval($row['total']),
        'status'         => $row['status'],
        'paymentMethod'  => $row['payment_method'],
        'deliveryAddress'=> $row['delivery_address'],
        'isParchi'       => (bool)$row['is_parchi'],
        'notes'          => $row['notes'],
        'date'           => substr($row['order_date'], 0, 10),
        'orderDate'      => $row['order_date'],
    ];
}
