<?php
include 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $service_icon = $_POST['service_icon'];
    $service_description = $_POST['service_description'];

    $query = "INSERT INTO ServiceCategory (service_icon, service_description) VALUES (:service_icon, :service_description)";
    $stmt = $conn->prepare($query);

    $stmt->bindParam(':service_icon', $service_icon);
    $stmt->bindParam(':service_description', $service_description);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Category added successfully"]);
    } else {
        echo json_encode(["message" => "Failed to add category"]);
    }
}
?>
