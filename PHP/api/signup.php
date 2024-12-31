<?php
// api/signup.php

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

require_once __DIR__ . '/../controllers/SignupController.php';

// Hanya menerima metode POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['message' => 'Method Not Allowed']);
    exit;
}

// Mengambil data JSON dari body request
$input = json_decode(file_get_contents('php://input'), true);

// Validasi input
if (!isset($input['username']) || !isset($input['password']) || !isset($input['terms'])) {
    http_response_code(400);
    echo json_encode(['message' => 'Invalid input']);
    exit;
}

$profile_image = isset($input['profile_image']) ? trim($input['profile_image']) : null;
$username = trim($input['username']);
$password = trim($input['password']);
$terms = $input['terms'];

$controller = new SignupController();
$response = $controller->signup($profile_image, $username, $password, $terms);

if ($response['success']) {
    http_response_code(201); // Created
} else {
    http_response_code(400);
}

echo json_encode($response);
?>
