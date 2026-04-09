<?php
/**
 * Exercise 09 - Submit Form Data to Database
 * Endpoint: POST /api/submit.php
 */

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    sendJSON(false, 'Method not allowed');
}

try {
    // Get and validate form data
    $fullname = trim($_POST['fullname'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $position = trim($_POST['position'] ?? '');
    $experience = trim($_POST['experience'] ?? '');
    $notes = trim($_POST['notes'] ?? '');

    // Collect skills (can be multiple checkboxes)
    $skills = isset($_POST['skills']) ? implode(', ', (array)$_POST['skills']) : '';

    // Validation
    if (empty($fullname) || strlen($fullname) < 2) {
        sendJSON(false, 'Full name is required and must be at least 2 characters');
    }

    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendJSON(false, 'Valid email address is required');
    }

    if (empty($position)) {
        sendJSON(false, 'Position is required');
    }

    if (empty($experience)) {
        sendJSON(false, 'Experience is required');
    }

    if (strlen($notes) > 5000) {
        sendJSON(false, 'Notes cannot exceed 5000 characters');
    }

    // Prepare INSERT statement
    $sql = "INSERT INTO submissions (fullname, email, position, skills, experience, notes, submitted_at) 
            VALUES (:fullname, :email, :position, :skills, :experience, :notes, NOW())";

    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':fullname', $fullname);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':position', $position);
    $stmt->bindParam(':skills', $skills);
    $stmt->bindParam(':experience', $experience);
    $stmt->bindParam(':notes', $notes);

    // Execute query
    $stmt->execute();
    $lastId = $pdo->lastInsertId();

    sendJSON(true, 'Data submitted successfully', ['id' => $lastId]);

} catch (PDOException $e) {
    error_log('Database error: ' . $e->getMessage());
    http_response_code(500);
    sendJSON(false, 'Database error. Please try again.');
} catch (Exception $e) {
    error_log('Server error: ' . $e->getMessage());
    http_response_code(500);
    sendJSON(false, 'Server error. Please try again.');
}
?>
