<?php
/**
 * Exercise 09 - Download CSV Export
 * Endpoint: GET /api/download.php
 */

require_once 'config.php';

try {
    // Query all records
    $sql = "SELECT fullname, email, position, skills, experience, notes, submitted_at 
            FROM submissions 
            ORDER BY submitted_at DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $records = $stmt->fetchAll();

    // Set CSV headers
    header('Content-Type: text/csv;charset=utf-8');
    header('Content-Disposition: attachment;filename=data_export_' . date('Y-m-d_H-i-s') . '.csv');
    header('Pragma: no-cache');
    header('Expires: 0');

    // Open output stream
    $output = fopen('php://output', 'w');

    // Add BOM for UTF-8 (helps Excel recognize UTF-8)
    fprintf($output, chr(0xEF) . chr(0xBB) . chr(0xBF));

    // Write headers
    fputcsv($output, ['Full Name', 'Email', 'Position', 'Skills', 'Experience', 'Notes', 'Submitted']);

    // Write data rows
    foreach ($records as $record) {
        fputcsv($output, [
            $record['fullname'],
            $record['email'],
            $record['position'],
            $record['skills'],
            $record['experience'],
            $record['notes'],
            $record['submitted_at']
        ]);
    }

    fclose($output);
    exit;

} catch (PDOException $e) {
    error_log('Database error: ' . $e->getMessage());
    http_response_code(500);
    die('Database error. Please try again.');
} catch (Exception $e) {
    error_log('Server error: ' . $e->getMessage());
    http_response_code(500);
    die('Server error. Please try again.');
}
?>
