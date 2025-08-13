<?php
require_once 'db_config.php';

header('Content-Type: application/json');

// Initialize response
$response = [
    'success' => false,
    'message' => '',
    'errors' => []
];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
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
            
            // Optional: Send email notification
            $to = 'your@email.com'; // Change this
            $emailSubject = "New Contact Form Submission: $subject";
            $emailBody = "You have received a new message:\n\n".
                        "Name: $name\n".
                        "Email: $email\n".
                        "Phone: ".($phone ? $phone : 'Not provided')."\n\n".
                        "Message:\n$message";
            
            $headers = "From: $email\r\n";
            mail($to, $emailSubject, $emailBody, $headers);
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