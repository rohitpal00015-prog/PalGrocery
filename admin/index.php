<?php
// Main Admin Directory Index
require_once __DIR__ . '/auth_check.php';

if (isAdminAuthenticated()) {
    header('Location: dashboard.php');
} else {
    header('Location: login.php');
}
exit();
