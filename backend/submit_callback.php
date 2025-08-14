<?php
require_once 'db_config.php';
require_once 'csrf.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verify_csrf_token($_POST['csrf_token'] ?? '')) {
        echo json_encode(['success' => false, 'message' => 'Invalid CSRF token']);
        $conn->close();
        exit;
    }
    $required = ['full_name', 'phone', 'whatsapp', 'email', 'preferred_language'];
    $errors = [];

    // Validate required fields
    foreach ($required as $field) {
        if (empty($_POST[$field])) {
            $errors[] = ucfirst(str_replace('_', ' ', $field)) . ' is required';
        }
    }

    if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Invalid email format';
    }

    if (count($errors) > 0) {
        echo json_encode(['success' => false, 'errors' => $errors]);
        exit;
    }

    // Get course name from hidden input or referrer
    $course_name = $_POST['course_name'] ?? 'Unknown Course';

    // Insert into database
    $stmt = $conn->prepare("INSERT INTO course_callbacks 
        (full_name, phone, whatsapp, email, preferred_language, course_name) 
        VALUES (?, ?, ?, ?, ?, ?)");
    
    $stmt->bind_param(
        "ssssss",
        $_POST['full_name'],
        $_POST['phone'],
        $_POST['whatsapp'],
        $_POST['email'],
        $_POST['preferred_language'],
        $course_name
    );

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Request submitted!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Database error']);
    }

    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
}

$conn->close();
?>