<?php
try {
    $conn = new PDO('mysql:host=127.0.0.1', 'root', '');
    $conn->exec('CREATE DATABASE IF NOT EXISTS web_system');
    echo 'Database created successfully';
} catch (PDOException $e) {
    echo 'Error: ' . $e->getMessage();
}
?>
