<?php
require_once 'db_config.php';

header('Content-Type: application/json');

$response = [
    'success' => false,
    'message' => '',
    'errors' => []
];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validate required fields
    $required = [
        'firstName', 'lastName', 'email', 'phone', 'dateOfBirth',
        'address', 'city', 'state', 'highestEducation', 'currentStatus',
        'programInterest', 'startDate', 'timeCommitment', 'motivation',
        'termsAccepted'
    ];
    
    foreach ($required as $field) {
        if (empty($_POST[$field])) {
            $response['errors'][$field] = 'This field is required';
        }
    }
    
    // Validate email format
    if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
        $response['errors']['email'] = 'Invalid email format';
    }
    
    // Validate phone number
    if (!preg_match('/^[0-9]{10,15}$/', $_POST['phone'])) {
        $response['errors']['phone'] = 'Invalid phone number';
    }
    
    // If no errors, proceed with database insertion
    if (empty($response['errors'])) {
        // Prepare data
        $data = [
            'first_name' => $conn->real_escape_string($_POST['firstName']),
            'last_name' => $conn->real_escape_string($_POST['lastName']),
            'email' => $conn->real_escape_string($_POST['email']),
            'phone' => $conn->real_escape_string($_POST['phone']),
            'date_of_birth' => $conn->real_escape_string($_POST['dateOfBirth']),
            'gender' => isset($_POST['gender']) ? $conn->real_escape_string($_POST['gender']) : null,
            'address' => $conn->real_escape_string($_POST['address']),
            'city' => $conn->real_escape_string($_POST['city']),
            'state' => $conn->real_escape_string($_POST['state']),
            'highest_education' => $conn->real_escape_string($_POST['highestEducation']),
            'graduation_year' => isset($_POST['graduationYear']) ? (int)$_POST['graduationYear'] : null,
            'institution' => isset($_POST['institution']) ? $conn->real_escape_string($_POST['institution']) : null,
            'field_of_study' => isset($_POST['fieldOfStudy']) ? $conn->real_escape_string($_POST['fieldOfStudy']) : null,
            'cgpa' => isset($_POST['cgpa']) ? $conn->real_escape_string($_POST['cgpa']) : null,
            'current_status' => $conn->real_escape_string($_POST['currentStatus']),
            'program_interest' => $conn->real_escape_string($_POST['programInterest']),
            'preferred_start' => $conn->real_escape_string($_POST['startDate']),
            'time_commitment' => $conn->real_escape_string($_POST['timeCommitment']),
            'motivation' => $conn->real_escape_string($_POST['motivation']),
            'prior_experience' => isset($_POST['priorExperience']) ? $conn->real_escape_string($_POST['priorExperience']) : null,
            'terms_accepted' => isset($_POST['termsAccepted']) ? 1 : 0,
            'marketing_consent' => isset($_POST['marketingConsent']) ? 1 : 0
        ];
        
        // Insert into database
        $sql = "INSERT INTO applications (
            first_name, last_name, email, phone, date_of_birth, gender, 
            address, city, state, highest_education, graduation_year, 
            institution, field_of_study, cgpa, current_status, program_interest, 
            preferred_start, time_commitment, motivation, prior_experience, 
            terms_accepted, marketing_consent
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )";
        
        $stmt = $conn->prepare($sql);
        $stmt->bind_param(
            "ssssssssssisssssssssii",
            $data['first_name'], $data['last_name'], $data['email'],
            $data['phone'], $data['date_of_birth'], $data['gender'],
            $data['address'], $data['city'], $data['state'],
            $data['highest_education'], $data['graduation_year'],
            $data['institution'], $data['field_of_study'], $data['cgpa'],
            $data['current_status'], $data['program_interest'],
            $data['preferred_start'], $data['time_commitment'],
            $data['motivation'], $data['prior_experience'],
            $data['terms_accepted'], $data['marketing_consent']
        );
        
        if ($stmt->execute()) {
            $response['success'] = true;
            $response['message'] = 'Application submitted successfully!';
        } else {
            $response['message'] = 'Error submitting application: ' . $stmt->error;
        }
        
        $stmt->close();
    } else {
        $response['message'] = 'Please correct the errors in your application';
    }
} else {
    $response['message'] = 'Invalid request method';
}

$conn->close();
echo json_encode($response);
?>