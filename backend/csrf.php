<?php
// CSRF helper
// Usage:
// - Include this file in backend endpoints: require_once 'csrf.php';
// - Call verify_csrf_token($_POST['csrf_token'] ?? '') to validate
// - Frontend can GET this file to retrieve a token as JSON

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function get_csrf_token() {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function verify_csrf_token($token) {
    if (!isset($_SESSION['csrf_token'])) {
        return false;
    }
    if (!is_string($token) || !hash_equals($_SESSION['csrf_token'], $token)) {
        return false;
    }
    return true;
}

// If requested directly (GET), return the token as JSON
if (php_sapi_name() !== 'cli') {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        header('Content-Type: application/json');
        echo json_encode(['token' => get_csrf_token()]);
        exit;
    }
}

