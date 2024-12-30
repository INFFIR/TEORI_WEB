<?php
// api/signin.php

// Menangani CORS
header("Access-Control-Allow-Origin: http://127.0.0.1:5501"); // Ganti dengan origin frontend Anda
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Menangani permintaan OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header('Content-Type: application/json');

require_once __DIR__ . '/../controllers/SigninController.php';

// Hanya menerima metode POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['message' => 'Method Not Allowed']);
    exit;
}

// Mengambil data JSON dari body request
$input = json_decode(file_get_contents('php://input'), true);

// Validasi input
if (!isset($input['username']) || !isset($input['password'])) {
    http_response_code(400);
    echo json_encode(['message' => 'Invalid input']);
    exit;
}

$username = trim($input['username']);
$password = trim($input['password']);

$controller = new SigninController();
$response = $controller->signin($username, $password);

if ($response['success']) {
    http_response_code(200);
} else {
    http_response_code(400);
}

echo json_encode($response);
?>
