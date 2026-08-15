<?php
// Protected Admin Route - Reports & Analytics
require_once __DIR__ . '/auth_check.php';
requireAdminAuth();
header('Location: dashboard.php?tab=analytics');
exit();
