<?php
// ============================================================
//   Products API — Pal Grocery
//  GET    /api/products.php          → Sare products
//  GET    /api/products.php?id=X     → Ek product
//  POST   /api/products.php          → Naya product add
//  PUT    /api/products.php          → Product update
//  DELETE /api/products.php?id=X     → Product delete
// ============================================================

require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = getDB();

// ─── GET: Products fetch karo ─────────────────────────────
if ($method === 'GET') {
    $id = isset($_GET['id']) ? trim($_GET['id']) : null;

    if ($id) {
        // Ek specific product
        $stmt = $db->prepare("SELECT * FROM products WHERE id = ?");
        $stmt->bind_param("s", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $product = $result->fetch_assoc();

        if ($product) {
            jsonResponse(['success' => true, 'product' => formatProduct($product)]);
        } else {
            errorResponse("Product not found: $id", 404);
        }
    } else {
        // Sare products — active + hidden dono (admin ke liye)
        $category = isset($_GET['category']) ? trim($_GET['category']) : null;
        $search   = isset($_GET['search']) ? trim($_GET['search']) : null;

        $sql = "SELECT * FROM products";
        $params = [];
        $types = "";
        $conditions = [];

        if ($category && $category !== 'all') {
            $conditions[] = "category = ?";
            $params[] = $category;
            $types .= "s";
        }

        if ($search) {
            $conditions[] = "(name LIKE ? OR supplier LIKE ? OR barcode LIKE ?)";
            $like = "%$search%";
            $params[] = $like;
            $params[] = $like;
            $params[] = $like;
            $types .= "sss";
        }

        if (!empty($conditions)) {
            $sql .= " WHERE " . implode(" AND ", $conditions);
        }

        $sql .= " ORDER BY name ASC";

        if (!empty($params)) {
            $stmt = $db->prepare($sql);
            $stmt->bind_param($types, ...$params);
            $stmt->execute();
            $result = $stmt->get_result();
        } else {
            $result = $db->query($sql);
        }

        $products = [];
        while ($row = $result->fetch_assoc()) {
            $products[] = formatProduct($row);
        }

        jsonResponse(['success' => true, 'count' => count($products), 'products' => $products]);
    }
}

// ─── POST: Naya product add karo ─────────────────────────
elseif ($method === 'POST') {
    verifyAdminAuthToken($db);
    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data || empty($data['name']) || empty($data['price'])) {
        errorResponse("Name aur price zaroori hain");
    }

    // ID generate karo agar nahi diya
    $id = isset($data['id']) && $data['id'] ? $data['id'] : 'prod-' . time() . '-' . rand(100, 999);
    $name         = trim($data['name']);
    $category     = $data['category'] ?? 'groceries';
    $price        = floatval($data['price']);
    $discPrice    = isset($data['discountPrice']) && $data['discountPrice'] ? floatval($data['discountPrice']) : null;
    $stock        = intval($data['stock'] ?? 0);
    $expiry       = !empty($data['expiryDate']) ? $data['expiryDate'] : null;
    $supplier     = $data['supplier'] ?? 'Local Kirana Supplier';
    $barcode      = $data['barcode'] ?? '';
    $description  = $data['description'] ?? '';
    $rating       = floatval($data['rating'] ?? 5.0);
    $reviewsCount = intval($data['reviewsCount'] ?? 0);

    $stmt = $db->prepare("INSERT INTO products (id, name, category, price, discount_price, rating, reviews_count, stock, expiry_date, supplier, barcode, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

    $stmt->bind_param(
        "sssdddisssss",
        $id, $name, $category, $price, $discPrice, $rating, $reviewsCount, $stock, $expiry, $supplier, $barcode, $description
    );

    if ($stmt->execute()) {
        jsonResponse(['success' => true, 'message' => "Product '$name' add ho gaya!", 'id' => $id], 201);
    } else {
        errorResponse("Product add nahi hua: " . $stmt->error, 500);
    }
}

// ─── PUT: Product update karo ────────────────────────────
elseif ($method === 'PUT') {
    verifyAdminAuthToken($db);
    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data || empty($data['id'])) {
        errorResponse("Product ID zaroori hai update ke liye");
    }

    $id          = trim($data['id']);
    $name        = $data['name'] ?? '';
    $category    = $data['category'] ?? 'groceries';
    $price       = floatval($data['price'] ?? 0);
    $discPrice   = isset($data['discountPrice']) && $data['discountPrice'] ? floatval($data['discountPrice']) : null;
    $stock       = intval($data['stock'] ?? 0);
    $expiry      = !empty($data['expiryDate']) ? $data['expiryDate'] : null;
    $supplier    = $data['supplier'] ?? '';
    $barcode     = $data['barcode'] ?? '';
    $description = $data['description'] ?? '';
    $status      = $data['status'] ?? 'active';

    $stmt = $db->prepare("UPDATE products SET name=?, category=?, price=?, discount_price=?, stock=?, expiry_date=?, supplier=?, barcode=?, description=?, status=? WHERE id=?");

    $stmt->bind_param(
        "ssddissssss",
        $name, $category, $price, $discPrice, $stock, $expiry, $supplier, $barcode, $description, $status, $id
    );

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            jsonResponse(['success' => true, 'message' => "Product '$name' update ho gaya!"]);
        } else {
            // Check if product exists
            $check = $db->prepare("SELECT id FROM products WHERE id = ?");
            $check->bind_param("s", $id);
            $check->execute();
            if ($check->get_result()->num_rows === 0) {
                // Product exist nahi karta — INSERT karo
                $insertStmt = $db->prepare("INSERT INTO products (id, name, category, price, discount_price, stock, expiry_date, supplier, barcode, description, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $insertStmt->bind_param("sssddisssss", $id, $name, $category, $price, $discPrice, $stock, $expiry, $supplier, $barcode, $description, $status);
                $insertStmt->execute();
                jsonResponse(['success' => true, 'message' => "Product '$name' naya add ho gaya!"]);
            } else {
                jsonResponse(['success' => true, 'message' => 'Koi change nahi tha']);
            }
        }
    } else {
        errorResponse("Update nahi hua: " . $stmt->error, 500);
    }
}

// ─── DELETE: Product delete karo ─────────────────────────
elseif ($method === 'DELETE') {
    verifyAdminAuthToken($db);
    $id = isset($_GET['id']) ? trim($_GET['id']) : null;

    // Body se bhi check karo
    if (!$id) {
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['id'] ?? null;
    }

    if (!$id) {
        errorResponse("Product ID zaroori hai delete ke liye");
    }

    $stmt = $db->prepare("DELETE FROM products WHERE id = ?");
    $stmt->bind_param("s", $id);

    if ($stmt->execute() && $stmt->affected_rows > 0) {
        jsonResponse(['success' => true, 'message' => "Product '$id' delete ho gaya!"]);
    } else {
        errorResponse("Product nahi mila ya delete nahi hua: $id", 404);
    }
}

else {
    errorResponse("Invalid HTTP method: $method", 405);
}

$db->close();

// ─── Helper: DB row ko JS format me convert karo ─────────
function formatProduct($row) {
    return [
        'id'           => $row['id'],
        'name'         => $row['name'],
        'category'     => $row['category'],
        'price'        => floatval($row['price']),
        'discountPrice'=> $row['discount_price'] ? floatval($row['discount_price']) : null,
        'rating'       => floatval($row['rating']),
        'reviewsCount' => intval($row['reviews_count']),
        'stock'        => intval($row['stock']),
        'expiryDate'   => $row['expiry_date'],
        'supplier'     => $row['supplier'],
        'barcode'      => $row['barcode'],
        'description'  => $row['description'],
        'image'        => $row['image'] ?? null,
        'status'       => $row['status'] ?? 'active',
    ];
}
