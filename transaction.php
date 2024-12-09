<?php
require_once 'db_connection.php'; // Pastikan file ini berisi koneksi ke database

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Access-Control-Allow-Headers: Content-Type'); 

// Mengambil input JSON
$input = json_decode(file_get_contents('php://input'), true);

// Memeriksa jika data ada
if (isset($input['user_id']) && isset($input['laundry_location'])) {
    $user_id = $input['user_id'];
    $laundry_location = $input['laundry_location'];
} else {
    echo json_encode(["status" => "error", "message" => "User ID and laundry location are required."]);
    exit();
}

try {
    // Insert transaksi baru
    $query = "INSERT INTO `transaction` (`user_id`, `laundry_location`) VALUES (:user_id, :laundry_location)";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':user_id', $user_id);
    $stmt->bindParam(':laundry_location', $laundry_location);
    
    if ($stmt->execute()) {
        $transaction_id = $conn->lastInsertId(); // Ambil ID transaksi yang baru disimpan
        echo json_encode(["status" => "success", "transaction_id" => $transaction_id]);
    } else {
        echo json_encode(["status" => "error", "message" => "Transaction failed."]);
    }
} catch (PDOException $exception) {
    echo json_encode(["status" => "error", "message" => "Error: " . $exception->getMessage()]);
}
?>
