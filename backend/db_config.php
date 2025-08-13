<?php
// Database Configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'course_requests');
define('DB_USER', 'root');
define('DB_PASS', 'Prathamesh@12');

// Create connection
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Create table (modify fields as needed)
$sql = "CREATE TABLE IF NOT EXISTS course_callbacks (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    whatsapp VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    preferred_language VARCHAR(20) NOT NULL,
    course_name VARCHAR(100) NOT NULL,  // Added to track which course
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

if (!$conn->query($sql)) {
    die("Error creating table: " . $conn->error);
}

// Create tables if not exists
$sql = "CREATE TABLE IF NOT EXISTS applications (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20),
    address TEXT NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    highest_education VARCHAR(50) NOT NULL,
    graduation_year INT(4),
    institution VARCHAR(100),
    field_of_study VARCHAR(100),
    cgpa VARCHAR(20),
    current_status VARCHAR(50) NOT NULL,
    program_interest VARCHAR(50) NOT NULL,
    preferred_start VARCHAR(50) NOT NULL,
    time_commitment VARCHAR(50) NOT NULL,
    motivation TEXT NOT NULL,
    prior_experience TEXT,
    terms_accepted BOOLEAN NOT NULL,
    marketing_consent BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending'
)";

if (!$conn->query($sql)) {
    die("Error creating applications table: " . $conn->error);
}

$sql = "CREATE TABLE IF NOT EXISTS contact_messages (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT 0
)";

if ($conn->query($sql)) {
    echo "Table created successfully";
} else {
    echo "Error creating table: " . $conn->error;
}
?>