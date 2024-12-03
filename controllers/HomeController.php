<?php
// controllers/HomeController.php

require_once __DIR__ . '/../models/Home.php';

class HomeController {
    private $model;

    public function __construct(){
        $this->model = new Home();
    }

    public function getAll(){
        $stmt = $this->model->getAll();
        $homes = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($homes);
    }

    public function getById($id){
        $stmt = $this->model->getById($id);
        $home = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($home);
    }

    public function create(){
        $data = json_decode(file_get_contents("php://input"), true);
        if($this->model->create($data)){
            echo json_encode(["message" => "Home entry created successfully."]);
        } else {
            echo json_encode(["message" => "Failed to create home entry."]);
        }
    }

    public function update($id){
        $data = json_decode(file_get_contents("php://input"), true);
        if($this->model->update($id, $data)){
            echo json_encode(["message" => "Home entry updated successfully."]);
        } else {
            echo json_encode(["message" => "Failed to update home entry."]);
        }
    }

    public function delete($id){
        if($this->model->delete($id)){
            echo json_encode(["message" => "Home entry deleted successfully."]);
        } else {
            echo json_encode(["message" => "Failed to delete home entry."]);
        }
    }
}
?>
