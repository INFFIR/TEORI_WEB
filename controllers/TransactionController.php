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
        echo json_encode($transactions);
    }

    public function getById($id){
        $stmt = $this->model->getById($id);
        $transaction = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($transaction);
    }

    public function create(){
        $data = json_decode(file_get_contents("php://input"), true);

        // Validasi data
        if(!isset($data['user_id'], $data['laundry_location'])){
            echo json_encode(["message" => "Missing required fields."]);
            return;
        }

        if($this->model->create($data)){
            echo json_encode(["message" => "Transaction created successfully."]);
        } else {
            echo json_encode(["message" => "Failed to create transaction."]);
        }
    }

    public function update($id){
        $data = json_decode(file_get_contents("php://input"), true);

        // Validasi data
        if(empty($data)){
            echo json_encode(["message" => "No data provided for update."]);
            return;
        }

        if($this->model->update($id, $data)){
            echo json_encode(["message" => "Transaction updated successfully."]);
        } else {
            echo json_encode(["message" => "Failed to update transaction."]);
        }
    }

    public function delete($id){
        if($this->model->delete($id)){
            echo json_encode(["message" => "Transaction deleted successfully."]);
        } else {
            echo json_encode(["message" => "Failed to delete transaction."]);
        }
    }
}
?>
