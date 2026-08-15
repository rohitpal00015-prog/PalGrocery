<?php
// Protected Admin Route - Inventory Management
require_once __DIR__ . '/auth_check.php';
requireAdminAuth();
header('Location: dashboard.php?tab=inventory');
exit();
