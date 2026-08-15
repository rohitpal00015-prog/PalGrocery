<?php
// Protected Admin Route - Khata / Customers Ledger
require_once __DIR__ . '/auth_check.php';
requireAdminAuth();
header('Location: dashboard.php?tab=khata');
exit();
