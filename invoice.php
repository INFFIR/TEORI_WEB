<?php
require_once 'db_connection.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Mendapatkan `transaction_id` dari query string
if (!isset($_GET['transaction_id'])) {
    echo json_encode(["status" => "error", "message" => "Transaction ID is required."]);
    exit();
}

$transaction_id = filter_var($_GET['transaction_id'], FILTER_SANITIZE_NUMBER_INT);

try {
    // Ambil data transaksi utama
    $query = "SELECT transaction_id, user_id, laundry_location 
          FROM `transaction` WHERE transaction_id = :transaction_id";

    $stmt = $conn->prepare($query);
    $stmt->bindParam(':transaction_id', $transaction_id, PDO::PARAM_INT);
    $stmt->execute();
    $transaction = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$transaction) {
        echo json_encode(["status" => "error", "message" => "Transaction not found."]);
        exit();
    }

    // Ambil detail transaksi
    $query = "SELECT td.transaction_id, td.value_count, td.sum_offered_price, o.offered_name AS service_name, o.offered_price AS price
              FROM transaction_detail td
              JOIN serviceoffered o ON td.offered_id = o.offered_id
              WHERE td.transaction_id = :transaction_id";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':transaction_id', $transaction_id, PDO::PARAM_INT);
    $stmt->execute();
    $details = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "transaction" => $transaction,
        "details" => $details
    ]);
} catch (PDOException $exception) {
    echo json_encode(["status" => "error", "message" => "Error: " . $exception->getMessage()]);
}
?>
