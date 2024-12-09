<?php
// api/contact.php

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

// Get the ID from the URL if present (not needed as only one contact entry)
$id = isset($_GET['id']) ? intval($_GET['id']) : null;

switch($action){
    case 'read':
        $controller->getAll(); // getAll should return the single contact entry
        break;
    case 'update':
        $controller->update();
        break;
    default:
        echo json_encode(["message" => "Action not allowed."]);
        break;
}
?>
