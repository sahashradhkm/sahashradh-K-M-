<?php
/**
 * Exercise 09 - Copy to Clipboard (TSV Format)
 * Endpoint: GET /api/copy.php
 */

require_once 'config.php';

header('Content-Type: text/plain;charset=utf-8');

try {
    // Query all records
    $sql = "SELECT fullname, email, position, skills, experience, notes, submitted_at 
            FROM submissions 
            ORDER BY submitted_at DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $records = $stmt->fetchAll();

    if (empty($records)) {
        sendJSON(false, 'No records to copy');
    }

    // Build TSV string
    $tsv = '';

    // Add headers
    $tsv .= implode("\t", ['Full Name', 'Email', 'Position', 'Skills', 'Experience', 'Notes', 'Submitted']) . "\n";

    // Add data rows
    foreach ($records as $record) {
        $row = [
            $record['fullname'],
            $record['email'],
            $record['position'],
            $record['skills'],
            $record['experience'],
            $record['notes'],
            $record['submitted_at']
        ];
        $tsv .= implode("\t", $row) . "\n";
    }

    // Return TSV as plain text
    echo $tsv;
    exit;

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
