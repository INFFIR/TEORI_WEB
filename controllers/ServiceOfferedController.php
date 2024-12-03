<?php
// controllers/ServiceOfferedController.php

require_once __DIR__ . '/../models/ServiceOffered.php';

class ServiceOfferedController {
    private $model;

    public function __construct(){
        $this->model = new ServiceOffered();
    }

    public function getAll(){
        $stmt = $this->model->getAll();
        $services = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($services);
    }

    public function getById($id){
        $stmt = $this->model->getById($id);
        $service = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($service);
    }

    public function create(){
        $data = json_decode(file_get_contents("php://input"), true);
        if($this->model->create($data)){
            echo json_encode(["message" => "Service offered created successfully."]);
        } else {
            echo json_encode(["message" => "Failed to create service offered."]);
        }
    }

    public function update($id){
        $data = json_decode(file_get_contents("php://input"), true);
        if($this->model->update($id, $data)){
            echo json_encode(["message" => "Service offered updated successfully."]);
        } else {
            echo json_encode(["message" => "Failed to update service offered."]);
        }
    }

    public function delete($id){
        if($this->model->delete($id)){
            echo json_encode(["message" => "Service offered deleted successfully."]);
        } else {
            echo json_encode(["message" => "Failed to delete service offered."]);
        }
    }
}
?>
