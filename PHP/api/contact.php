<?php
// File: api/contact.php

require_once __DIR__ . '/../controllers/ContactController.php';

// Set headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Handle OPTIONS request method for CORS preflight
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    exit(0);
}

// Instantiate controller
$controller = new ContactController();

// Determine the HTTP method
$method = $_SERVER['REQUEST_METHOD'];

// Determine the 'action' parameter
$action = isset($_POST['action']) ? $_POST['action'] : (isset($_GET['action']) ? $_GET['action'] : 'read');

// We only have single contact row
$id = isset($_GET['id']) ? intval($_GET['id']) : null;

switch($action){
    case 'read':
        $controller->getAll(); 
        break;
    case 'update':
        if ($method === 'POST') {
            $controller->update();
        } else {
            echo json_encode(["success" => false, "message" => "Invalid request method for update."]);
        }
        break;
    default:
        echo json_encode(["message" => "Action not allowed."]);
        break;
}
