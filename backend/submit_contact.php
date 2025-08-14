<?php
require_once 'db_config.php';
require_once 'csrf.php';

header('Content-Type: application/json');

// Initialize response
$response = [
    'success' => false,
    'message' => '',
    'errors' => []
];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verify_csrf_token($_POST['csrf_token'] ?? '')) {
        echo json_encode(['success' => false, 'message' => 'Invalid CSRF token']);
        $conn->close();
        exit;
    }
    // Sanitize inputs
    $name = trim($conn->real_escape_string($_POST['name'] ?? ''));
    $email = trim($conn->real_escape_string($_POST['email'] ?? ''));
    $phone = trim($conn->real_escape_string($_POST['phone'] ?? ''));
    $subject = trim($conn->real_escape_string($_POST['subject'] ?? ''));
    $message = trim($conn->real_escape_string($_POST['message'] ?? ''));

    // Validate required fields
    if (empty($name)) $response['errors']['name'] = 'Name is required';
    if (empty($email)) {
        $response['errors']['email'] = 'Email is required';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['errors']['email'] = 'Invalid email format';
    }
    if (empty($subject)) $response['errors']['subject'] = 'Subject is required';
    if (empty($message)) $response['errors']['message'] = 'Message is required';

    // If no errors, proceed
    if (empty($response['errors'])) {
        $stmt = $conn->prepare("INSERT INTO contact_messages 
                               (name, email, phone, subject, message) 
                               VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssss", $name, $email, $phone, $subject, $message);
        
        if ($stmt->execute()) {
            $response['success'] = true;
            $response['message'] = 'Your message has been sent successfully!';
        } else {
            $response['message'] = 'Database error: ' . $stmt->error;
        }
        
        $stmt->close();
    } else {
        $response['message'] = 'Please correct the errors below';
    }
} else {
    $response['message'] = 'Invalid request method';
}

$conn->close();
echo json_encode($response);
?>