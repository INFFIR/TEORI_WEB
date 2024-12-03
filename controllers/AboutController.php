<?php
// controllers/AboutController.php

require_once __DIR__ . '/../models/About.php';

class AboutController {
    private $model;

    public function __construct(){
        $this->model = new About();
    }

    public function getAll(){
        $stmt = $this->model->getAll();
        $abouts = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($abouts);
    }

    public function getById($id){
        $stmt = $this->model->getById($id);
        $about = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($about);
    }

    public function create(){
        $data = json_decode(file_get_contents("php://input"), true);
        if($this->model->create($data)){
            echo json_encode(["message" => "About entry created successfully."]);
        } else {
            echo json_encode(["message" => "Failed to create about entry."]);
        }
    }

    public function update($id){
        $data = json_decode(file_get_contents("php://input"), true);
        if($this->model->update($id, $data)){
            echo json_encode(["message" => "About entry updated successfully."]);
        } else {
            echo json_encode(["message" => "Failed to update about entry."]);
        }
    }

    public function delete($id){
        if($this->model->delete($id)){
            echo json_encode(["message" => "About entry deleted successfully."]);
        } else {
            echo json_encode(["message" => "Failed to delete about entry."]);
        }
    }
}
?>
