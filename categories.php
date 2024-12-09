<?php
include 'db_connection.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");


// GET request: Fetch all categories
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $query = "SELECT * FROM ServiceCategory";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}

// POST request: Add a new category
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $service_icon = $data['service_icon'];
    $service_description = $data['service_description'];

    $query = "INSERT INTO ServiceCategory (service_icon, service_description) VALUES (:service_icon, :service_description)";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':service_icon', $service_icon);
    $stmt->bindParam(':service_description', $service_description);
    $stmt->execute();
    echo json_encode(["message" => "Category added successfully"]);
}

// DELETE request: Delete a category
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $category_id = $_GET['id'];
    $query = "DELETE FROM ServiceCategory WHERE category_id = :category_id";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':category_id', $category_id);
    $stmt->execute();
    echo json_encode(["message" => "Category deleted successfully"]);
}
?>