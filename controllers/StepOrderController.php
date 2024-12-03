<?php
// controllers/StepOrderController.php

require_once __DIR__ . '/../models/StepOrder.php';

class StepOrderController {
    private $model;

    public function __construct(){
        $this->model = new StepOrder();
    }

    public function getAll(){
        $stmt = $this->model->getAll();
        $steps = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($steps);
    }

    public function getById($id){
        $stmt = $this->model->getById($id);
        $step = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($step);
    }

    public function create(){
        $data = json_decode(file_get_contents("php://input"), true);

        // Validasi data
        if(!isset($data['transaction_id'], $data['step_number'], $data['step_title'])){
            echo json_encode(["message" => "Missing required fields."]);
            return;
        }

        if($this->model->create($data)){
            echo json_encode(["message" => "Step order created successfully."]);
        } else {
            echo json_encode(["message" => "Failed to create step order."]);
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
            echo json_encode(["message" => "Step order updated successfully."]);
        } else {
            echo json_encode(["message" => "Failed to update step order."]);
        }
    }

    public function delete($id){
        if($this->model->delete($id)){
            echo json_encode(["message" => "Step order deleted successfully."]);
        } else {
            echo json_encode(["message" => "Failed to delete step order."]);
        }
    }
}
?>
