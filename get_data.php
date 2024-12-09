<?php
include 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $query = "SELECT so.offered_id, so.offered_name, so.offered_price, so.offered_description, 
                     sc.service_description AS category 
              FROM ServiceOffered so 
              JOIN ServiceCategory sc ON so.category_id = sc.category_id";
    $stmt = $conn->prepare($query);
    $stmt->execute();

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($result);
}
?>
