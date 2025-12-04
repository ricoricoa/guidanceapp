<?php
// Simple test to verify reports can be fetched from the database
try {
    // Load .env
    $env_file = 'backend-laravel/.env';
    if (file_exists($env_file)) {
        $env = [];
        foreach (file($env_file) as $line) {
            $line = trim($line);
            if (empty($line) || $line[0] === '#') continue;
            [$key, $value] = explode('=', $line, 2);
            $env[trim($key)] = trim($value);
        }
    }

    $db_host = $env['DB_HOST'] ?? 'localhost';
    $db_port = $env['DB_PORT'] ?? 3306;
    $db_name = $env['DB_DATABASE'] ?? 'guidance_app';
    $db_user = $env['DB_USERNAME'] ?? 'root';
    $db_pass = $env['DB_PASSWORD'] ?? '';

    echo "Connecting to: $db_host:$db_port / $db_name\n";

    // Create connection
    $pdo = new PDO(
        "mysql:host=$db_host;port=$db_port;dbname=$db_name;charset=utf8mb4",
        $db_user,
        $db_pass
    );
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Check if reports table exists
    $stmt = $pdo->query("SHOW TABLES LIKE 'reports'");
    $table_exists = $stmt->rowCount() > 0;

    echo "Reports table exists: " . ($table_exists ? "YES" : "NO") . "\n";

    if ($table_exists) {
        // Get all reports
        $stmt = $pdo->query("SELECT r.*, u.name as user_name, u.email as user_email FROM reports r LEFT JOIN users u ON r.user_id = u.id ORDER BY r.created_at DESC");
        $reports = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo "Total reports in database: " . count($reports) . "\n";
        
        if (count($reports) > 0) {
            echo "\nReports:\n";
            foreach ($reports as $report) {
                echo "- ID: {$report['id']}, Type: {$report['report_type']}, Status: {$report['status']}, By: {$report['user_name']} ({$report['user_email']})\n";
                echo "  Title: {$report['title']}\n";
            }
        } else {
            echo "No reports in database yet.\n";
        }
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
