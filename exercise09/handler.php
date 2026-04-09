<?php
// =====================================================
// Exercise 09 - Simplified Single Handler Backend
// All operations handled in one file
// =====================================================

header('Content-Type: application/json');

// Load environment variables
$env = parse_ini_file('.env');

// Database credentials (from .env or hardcoded defaults)
$db_host = $env['DB_HOST'] ?? getenv('DB_HOST') ?? 'localhost';
$db_user = $env['DB_USER'] ?? getenv('DB_USER') ?? 'root';
$db_password = $env['DB_PASSWORD'] ?? getenv('DB_PASSWORD') ?? '';
$db_name = $env['DB_NAME'] ?? getenv('DB_NAME') ?? 'exercise_09_db';

// Initialize response
$response = [
    'success' => false,
    'message' => '',
    'data' => null,
    'count' => 0
];

try {
    // Create PDO connection
    $dsn = "mysql:host={$db_host};charset=utf8mb4";
    $pdo = new PDO($dsn, $db_user, $db_password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);

    // Create database if not exists
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `{$db_name}`");
    $pdo->exec("USE `{$db_name}`");

    // Create table if not exists
    $pdo->exec("CREATE TABLE IF NOT EXISTS `submissions` (
        `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        `fullname` VARCHAR(100) NOT NULL,
        `email` VARCHAR(100) NOT NULL,
        `position` VARCHAR(100) NOT NULL,
        `skills` VARCHAR(255),
        `notes` LONGTEXT,
        `submitted_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX `idx_email` (`email`),
        INDEX `idx_submitted_at` (`submitted_at`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    // Get action parameter
    $action = $_GET['action'] ?? $_POST['action'] ?? 'fetch';

    // ========== SUBMIT ACTION ==========
    if ($action === 'submit') {
        $fullname = trim($_POST['fullname'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $position = trim($_POST['position'] ?? '');
        $skills = trim($_POST['skills'] ?? '');
        $notes = trim($_POST['notes'] ?? '');

        // Validation
        if (empty($fullname)) {
            throw new Exception('Full name is required');
        }
        if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new Exception('Valid email is required');
        }
        if (empty($position)) {
            throw new Exception('Position is required');
        }

        // Insert data
        $stmt = $pdo->prepare("INSERT INTO `submissions` 
            (`fullname`, `email`, `position`, `skills`, `notes`) 
            VALUES (?, ?, ?, ?, ?)");
        
        $stmt->execute([$fullname, $email, $position, $skills, $notes]);

        $response['success'] = true;
        $response['message'] = 'Data submitted successfully!';
        $response['data'] = [
            'id' => $pdo->lastInsertId(),
            'fullname' => $fullname,
            'email' => $email,
            'position' => $position,
            'skills' => $skills,
            'notes' => $notes,
            'submitted_at' => date('Y-m-d H:i:s')
        ];
    }

    // ========== FETCH ACTION ==========
    else if ($action === 'fetch') {
        $stmt = $pdo->query("SELECT * FROM `submissions` ORDER BY `submitted_at` DESC");
        $data = $stmt->fetchAll();

        $response['success'] = true;
        $response['message'] = 'Data fetched successfully';
        $response['data'] = $data;
        $response['count'] = count($data);
    }

    // ========== DELETE ACTION ==========
    else if ($action === 'delete') {
        $id = (int)($_GET['id'] ?? $_POST['id'] ?? 0);

        if ($id <= 0) {
            throw new Exception('Invalid record ID');
        }

        $stmt = $pdo->prepare("DELETE FROM `submissions` WHERE `id` = ?");
        $stmt->execute([$id]);

        $response['success'] = true;
        $response['message'] = 'Record deleted successfully';
    }

    // ========== CLEAR ACTION ==========
    else if ($action === 'clear') {
        $pdo->exec("DELETE FROM `submissions`");

        $response['success'] = true;
        $response['message'] = 'All records cleared successfully';
    }

    // ========== CSV DOWNLOAD ACTION ==========
    else if ($action === 'csv') {
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename="data_' . date('Y-m-d_H-i-s') . '.csv"');

        // Add UTF-8 BOM
        echo "\xEF\xBB\xBF";

        $stmt = $pdo->query("SELECT * FROM `submissions` ORDER BY `submitted_at` DESC");
        $data = $stmt->fetchAll();

        // CSV Header
        $fp = fopen('php://output', 'w');
        fputcsv($fp, ['ID', 'Full Name', 'Email', 'Position', 'Skills', 'Notes', 'Submitted At']);

        // CSV Rows
        foreach ($data as $row) {
            fputcsv($fp, [
                $row['id'],
                $row['fullname'],
                $row['email'],
                $row['position'],
                $row['skills'],
                $row['notes'],
                $row['submitted_at']
            ]);
        }

        fclose($fp);
        exit;
    }

    // ========== COPY DATA ACTION ==========
    else if ($action === 'copy') {
        header('Content-Type: text/plain; charset=utf-8');
        header('Content-Disposition: attachment; filename="data_' . date('Y-m-d_H-i-s') . '.txt"');

        $stmt = $pdo->query("SELECT * FROM `submissions` ORDER BY `submitted_at` DESC");
        $data = $stmt->fetchAll();

        // TSV Header
        echo "ID\tFull Name\tEmail\tPosition\tSkills\tNotes\tSubmitted At\n";

        // TSV Rows
        foreach ($data as $row) {
            echo $row['id'] . "\t" 
                . $row['fullname'] . "\t" 
                . $row['email'] . "\t" 
                . $row['position'] . "\t" 
                . $row['skills'] . "\t" 
                . $row['notes'] . "\t" 
                . $row['submitted_at'] . "\n";
        }

        exit;
    }

    // ========== UNKNOWN ACTION ==========
    else {
        $response['message'] = 'Unknown action: ' . htmlspecialchars($action);
    }

} catch (PDOException $e) {
    $response['success'] = false;
    $response['message'] = 'Database error: ' . $e->getMessage();
} catch (Exception $e) {
    $response['success'] = false;
    $response['message'] = $e->getMessage();
}

// Return JSON response
echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
exit;
?>
