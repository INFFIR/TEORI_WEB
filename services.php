<?php
include 'db_connection.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");


// GET request: Fetch all services
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Periksa apakah category_id ada dalam query string
    if (isset($_GET['category_id'])) {
        $category_id = $_GET['category_id']; // Ambil category_id dari query string

        // Query untuk mendapatkan layanan berdasarkan category_id
        $query = "SELECT so.offered_id, so.offered_name, so.offered_price, so.offered_description, 
                         so.offered_image_url, sc.service_description AS category 
                  FROM ServiceOffered so
                  JOIN ServiceCategory sc ON so.category_id = sc.category_id
                  WHERE so.category_id = :category_id";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':category_id', $category_id, PDO::PARAM_INT); // Bind parameter category_id
        $stmt->execute();
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); // Kirimkan hasil dalam format JSON
    } else {
        // Jika category_id tidak ada dalam query string, kirimkan semua layanan
        $query = "SELECT so.offered_id, so.offered_name, so.offered_price, so.offered_description, 
                         so.offered_image_url, sc.service_description AS category 
                  FROM ServiceOffered so
                  JOIN ServiceCategory sc ON so.category_id = sc.category_id";
        $stmt = $conn->prepare($query);
        $stmt->execute();
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); // Kirimkan hasil dalam format JSON
    }
}

// POST request: Add a new service
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $category_id = $data['category_id'];
    $offered_image_url = $data['offered_image_url'];
    $offered_name = $data['offered_name'];
    $offered_price = $data['offered_price'];
    $offered_description = $data['offered_description'];

    $query = "INSERT INTO ServiceOffered (category_id, offered_image_url, offered_name, offered_price, offered_description)
              VALUES (:category_id, :offered_image_url, :offered_name, :offered_price, :offered_description)";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':category_id', $category_id);
    $stmt->bindParam(':offered_image_url', $offered_image_url);
    $stmt->bindParam(':offered_name', $offered_name);
    $stmt->bindParam(':offered_price', $offered_price);
    $stmt->bindParam(':offered_description', $offered_description);
    $stmt->execute();
    echo json_encode(["message" => "Service added successfully"]);
}

// DELETE request: Delete a service
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $offered_id = $_GET['id'];
    $query = "DELETE FROM ServiceOffered WHERE offered_id = :offered_id";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':offered_id', $offered_id);
    $stmt->execute();
    echo json_encode(["message" => "Service deleted successfully"]);
}
?>