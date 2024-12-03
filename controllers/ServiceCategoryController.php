<?php
// controllers/ServiceCategoryController.php

require_once __DIR__ . '/../models/ServiceCategory.php';

class ServiceCategoryController {
    private $model;

    public function __construct(){
        $this->model = new ServiceCategory();
    }

    public function getAll(){
        $stmt = $this->model->getAll();
        $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($categories);
    }

    public function getById($id){
        $stmt = $this->model->getById($id);
        $category = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($category);
    }

    public function create(){
        $data = json_decode(file_get_contents("php://input"), true);
        if($this->model->create($data)){
            echo json_encode(["message" => "Service category created successfully."]);
        } else {
            echo json_encode(["message" => "Failed to create service category."]);
        }
    }

    public function update($id){
        $data = json_decode(file_get_contents("php://input"), true);
        if($this->model->update($id, $data)){
            echo json_encode(["message" => "Service category updated successfully."]);
        } else {
            echo json_encode(["message" => "Failed to update service category."]);
        }
    }

    public function delete($id){
        if($this->model->delete($id)){
            echo json_encode(["message" => "Service category deleted successfully."]);
        } else {
            echo json_encode(["message" => "Failed to delete service category."]);
        }
    }
}
?>
