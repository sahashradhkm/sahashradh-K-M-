<?php
/**
 * Exercise 09 - Clear All Records
 * Endpoint: POST /api/clear.php
 */

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    sendJSON(false, 'Method not allowed');
}

try {
    // Delete all records
    $sql = "DELETE FROM submissions";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    $deletedCount = $stmt->rowCount();
    sendJSON(true, "Deleted $deletedCount records successfully", ['count' => $deletedCount]);

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
