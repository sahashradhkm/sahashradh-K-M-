<?php
/**
 * Exercise 09 - Fetch All Records from Database
 * Endpoint: GET /api/fetch.php
 */

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    sendJSON(false, 'Method not allowed');
}

try {
    // Query all records ordered by most recent first
    $sql = "SELECT id, fullname, email, position, skills, experience, notes, submitted_at 
            FROM submissions 
            ORDER BY submitted_at DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $records = $stmt->fetchAll();

    // Format data for display
    $formattedRecords = array_map(function($record) {
        return [
            'id' => (int)$record['id'],
            'fullname' => escapeHTML($record['fullname']),
            'email' => escapeHTML($record['email']),
            'position' => escapeHTML($record['position']),
            'skills' => escapeHTML($record['skills']),
            'experience' => escapeHTML($record['experience']),
            'notes' => escapeHTML($record['notes']),
            'timestamp' => $record['submitted_at']
        ];
    }, $records);

    sendJSON(true, 'Records fetched successfully', $formattedRecords);

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
