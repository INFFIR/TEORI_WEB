<?php
// api/transaction.php

require_once __DIR__ . '/../controllers/TransactionController.php';

// [SESSION CHECK ADDED] Mulai session untuk cek user login
session_start();
if (!isset($_SESSION['user_id'])) {
    // Bila user belum login, kembalikan pesan error
    header("HTTP/1.1 401 Unauthorized");
    echo json_encode(["success" => false, "message" => "User not logged in."]);
    exit();
}

// Set headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Handle OPTIONS request method for CORS preflight
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    exit(0);
}

// Instantiate controller
$controller = new TransactionController();

// Determine the HTTP method
$method = $_SERVER['REQUEST_METHOD'];
// Get the ID from the URL if present
$id = isset($_GET['id']) ? intval($_GET['id']) : null;

switch($method){
    case 'GET':
        if($id){
            $controller->getById($id);
        } else {
            $controller->getAll();
        }
        break;
    case 'POST':
        $controller->create();
        break;
    case 'PUT':
        if($id){
            $controller->update($id);
        } else {
            echo json_encode(["success" => false, "message" => "ID is required for update."]);
        }
        break;
    case 'DELETE':
        if($id){
            $controller->delete($id);
        } else {
            echo json_encode(["success" => false, "message" => "ID is required for deletion."]);
        }
        break;
    default:
        echo json_encode(["success" => false, "message" => "Method not allowed."]);
        break;
}
?>
