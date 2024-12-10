<?php
// controllers/TransactionController.php

require_once __DIR__ . '/../models/Transaction.php';

class TransactionController {
    private $model;

    public function __construct(){
        $this->model = new Transaction();
    }

    public function getAll(){
        $stmt = $this->model->getAll();
        $transactions = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["success" => true, "data" => $transactions]);
    }

    public function getById($id){
        $stmt = $this->model->getById($id);
        $transaction = $stmt->fetch(PDO::FETCH_ASSOC);

        if($transaction){
            // Ambil koneksi dari model
            $conn = $this->model->getConnection();

            // Query untuk mengambil detail transaksi
            $query = "SELECT * FROM transaction_detail WHERE transaction_id = :transaction_id";
            $stmt_details = $conn->prepare($query);
            $stmt_details->bindParam(':transaction_id', $id, PDO::PARAM_INT);
            $stmt_details->execute();
            $details = $stmt_details->fetchAll(PDO::FETCH_ASSOC);

            // Tambahkan detail ke dalam transaksi
            $transaction['transaction_details'] = $details;

            echo json_encode(["success" => true, "data" => $transaction]);
        } else {
            echo json_encode(["success" => false, "message" => "Transaksi tidak ditemukan."]);
        }
    }

    public function create(){
        // Mendapatkan data dari input JSON
        $data = json_decode(file_get_contents("php://input"), true);

        // Validasi data
        if(!isset($data['user_id'], $data['laundry_location'])){
            echo json_encode(["success" => false, "message" => "Missing required fields."]);
            return;
        }

        if($this->model->create($data)){
            echo json_encode(["success" => true, "message" => "Transaction created successfully."]);
        } else {
            echo json_encode(["success" => false, "message" => "Failed to create transaction."]);
        }
    }

    public function update($id){
        $data = json_decode(file_get_contents("php://input"), true);

        // Validasi data
        if(empty($data)){
            echo json_encode(["success" => false, "message" => "No data provided for update."]);
            return;
        }

        if($this->model->update($id, $data)){
            echo json_encode(["success" => true, "message" => "Transaction updated successfully."]);
        } else {
            echo json_encode(["success" => false, "message" => "Failed to update transaction."]);
        }
    }

    public function delete($id){
        if($this->model->delete($id)){
            echo json_encode(["success" => true, "message" => "Transaction deleted successfully."]);
        } else {
            echo json_encode(["success" => false, "message" => "Failed to delete transaction."]);
        }
    }
}
?>
