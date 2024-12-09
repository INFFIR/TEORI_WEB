<?php
include 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $category_id = $_POST['category_id'];
    $offered_image_url = $_POST['offered_image_url'];
    $offered_name = $_POST['offered_name'];
    $offered_price = $_POST['offered_price'];
    $offered_description = $_POST['offered_description'];

    $query = "INSERT INTO ServiceOffered (category_id, offered_image_url, offered_name, offered_price, offered_description) 
              VALUES (:category_id, :offered_image_url, :offered_name, :offered_price, :offered_description)";
    $stmt = $conn->prepare($query);

    $stmt->bindParam(':category_id', $category_id);
    $stmt->bindParam(':offered_image_url', $offered_image_url);
    $stmt->bindParam(':offered_name', $offered_name);
    $stmt->bindParam(':offered_price', $offered_price);
    $stmt->bindParam(':offered_description', $offered_description);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Service offered added successfully"]);
    } else {
        echo json_encode(["message" => "Failed to add service offered"]);
    }
}
?>
