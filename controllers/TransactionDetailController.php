<?php
// controllers/TransactionDetailController.php

require_once __DIR__ . '/../models/TransactionDetail.php';

class TransactionDetailController {
    private $model;

    public function __construct(){
        $this->model = new TransactionDetail();
    }

    public function getAll(){
        $stmt = $this->model->getAll();
        $details = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($details);
    }

    public function getById($id){
        $stmt = $this->model->getById($id);
        $detail = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($detail);
    }

    public function create(){
        $data = json_decode(file_get_contents("php://input"), true);

        // Validasi data
        if(!isset($data['transaction_id'], $data['offered_id'])){
            echo json_encode(["message" => "Missing required fields."]);
            return;
        }

        // Set default value_count jika tidak disediakan
        if(!isset($data['value_count'])){
            $data['value_count'] = 1;
        }

        // Hitung sum_offered_price jika offered_price tersedia
        if(isset($data['offered_price']) && isset($data['value_count'])){
            $data['sum_offered_price'] = $data['offered_price'] * $data['value_count'];
        }

        if($this->model->create($data)){
            echo json_encode(["message" => "Transaction detail created successfully."]);
        } else {
            echo json_encode(["message" => "Failed to create transaction detail."]);
        }
    }

    public function update($id){
        $data = json_decode(file_get_contents("php://input"), true);

        // Validasi data
        if(empty($data)){
            echo json_encode(["message" => "No data provided for update."]);
            return;
        }

        // Hitung sum_offered_price jika offered_price atau value_count diupdate
        if(isset($data['offered_price']) || isset($data['value_count'])){
            // Fetch existing record
            $stmt = $this->model->getById($id);
            $existing = $stmt->fetch(PDO::FETCH_ASSOC);
            $offered_price = isset($data['offered_price']) ? $data['offered_price'] : $existing['offered_price'];
            $value_count = isset($data['value_count']) ? $data['value_count'] : $existing['value_count'];
            $data['sum_offered_price'] = $offered_price * $value_count;
        }

        if($this->model->update($id, $data)){
            echo json_encode(["message" => "Transaction detail updated successfully."]);
        } else {
            echo json_encode(["message" => "Failed to update transaction detail."]);
        }
    }

    public function delete($id){
        if($this->model->delete($id)){
            echo json_encode(["message" => "Transaction detail deleted successfully."]);
        } else {
            echo json_encode(["message" => "Failed to delete transaction detail."]);
        }
    }
}
?>
