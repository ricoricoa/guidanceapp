<?php
$conn = new PDO('mysql:host=127.0.0.1;dbname=web_system', 'root', '');
$result = $conn->query('SELECT id, name, email, role FROM users WHERE email = "rico@gmail.com"');
$user = $result->fetch(PDO::FETCH_ASSOC);
if ($user) {
  echo 'User found: ' . json_encode($user);
} else {
  echo 'User not found in database';
}
?>
