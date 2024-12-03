<?php
// index.php

// Get the API request
$api = isset($_GET['api']) ? $_GET['api'] : '';

// Sanitize the API request
$api = preg_replace('/[^a-zA-Z0-9_]/', '', $api);

// Define the path to the API file
$api_file = __DIR__ . '/api/' . $api . '.php';

// Check if the API file exists
if(file_exists($api_file)){
    require_once $api_file;
} else {
    // Return 404 Not Found if API does not exist
    header("HTTP/1.0 404 Not Found");
    echo json_encode(["message" => "API endpoint not found."]);
}
?>
