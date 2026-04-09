<?php
/**
 * Exercise 09 - Delete Single Record
 * Endpoint: POST /api/delete.php?id=X
 */

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    sendJSON(false, 'Method not allowed');
}

try {
    // Get ID from query parameter
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

    if ($id <= 0) {
        sendJSON(false, 'Invalid record ID');
    }

    // Prepare DELETE statement
    $sql = "DELETE FROM submissions WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);

    // Execute query
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        sendJSON(true, 'Record deleted successfully');
    } else {
        sendJSON(false, 'Record not found');
    }

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
