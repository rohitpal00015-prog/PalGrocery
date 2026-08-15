<?php
// Protected Admin Route - Orders Management
require_once __DIR__ . '/auth_check.php';
requireAdminAuth();
header('Location: dashboard.php?tab=orders');
exit();
