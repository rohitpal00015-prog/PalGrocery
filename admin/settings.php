<?php
// Protected Admin Route - Store Settings & Security Credentials
require_once __DIR__ . '/auth_check.php';
requireAdminAuth();
header('Location: dashboard.php?tab=settings');
exit();
