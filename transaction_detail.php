<?php
require_once 'db_connection.php'; // Pastikan file ini berisi koneksi ke database

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204); // No Content
    exit();
}

// Mengambil input JSON
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['transaction_id'], $input['offered_id'], $input['value_count'], $input['sum_offered_price'])) {
    echo json_encode(["status" => "error", "message" => "All fields are required."]);
    exit();
}

$transaction_id = filter_var($input['transaction_id'], FILTER_SANITIZE_NUMBER_INT);
$offered_id = filter_var($input['offered_id'], FILTER_SANITIZE_NUMBER_INT);
$value_count = filter_var($input['value_count'], FILTER_SANITIZE_NUMBER_INT);
$sum_offered_price = filter_var($input['sum_offered_price'], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);

try {
    // Insert detail transaksi baru
    $query = "INSERT INTO `transaction_detail` (`transaction_id`, `offered_id`, `value_count`, `sum_offered_price`) 
              VALUES (:transaction_id, :offered_id, :value_count, :sum_offered_price)";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':transaction_id', $transaction_id, PDO::PARAM_INT);
    $stmt->bindParam(':offered_id', $offered_id, PDO::PARAM_INT);
    $stmt->bindParam(':value_count', $value_count, PDO::PARAM_INT);
    $stmt->bindParam(':sum_offered_price', $sum_offered_price, PDO::PARAM_STR);

    if ($stmt->execute()) {
        $transaction_detail_id = $conn->lastInsertId();

        // Fetch kembali data detail transaksi
        $query = "SELECT * FROM `transaction_detail` WHERE `id` = :id";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':id', $transaction_detail_id, PDO::PARAM_INT);
        $stmt->execute();
        $new_transaction_detail = $stmt->fetch(PDO::FETCH_ASSOC);

        echo json_encode([
            "status" => "success",
            "transaction_detail_id" => $transaction_detail_id,
            "data" => $new_transaction_detail
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Transaction detail insertion failed."]);
    }
} catch (PDOException $exception) {
    echo json_encode(["status" => "error", "message" => "Error: " . $exception->getMessage()]);
}
?>
