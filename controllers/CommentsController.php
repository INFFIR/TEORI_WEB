<?php
// controllers/CommentsController.php

require_once __DIR__ . '/../models/Comments.php';

class CommentsController {
    private $model;

    public function __construct(){
        $this->model = new Comments();
    }

    public function getAll(){
        $stmt = $this->model->getAll();
        $comments = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($comments);
    }

    public function getById($id){
        $stmt = $this->model->getById($id);
        $comment = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($comment);
    }

    public function create(){
        $data = json_decode(file_get_contents("php://input"), true);

        // Validasi data
        if(!isset($data['user_id'], $data['offered_id'])){
            echo json_encode(["message" => "Missing required fields."]);
            return;
        }

        // Validasi stars jika ada
        if(isset($data['stars']) && ($data['stars'] < 1 || $data['stars'] > 5)){
            echo json_encode(["message" => "Stars must be between 1 and 5."]);
            return;
        }

        if($this->model->create($data)){
            echo json_encode(["message" => "Comment created successfully."]);
        } else {
            echo json_encode(["message" => "Failed to create comment."]);
        }
    }

    public function update($id){
        $data = json_decode(file_get_contents("php://input"), true);

        // Validasi data
        if(empty($data)){
            echo json_encode(["message" => "No data provided for update."]);
            return;
        }

        // Validasi stars jika ada
        if(isset($data['stars']) && ($data['stars'] < 1 || $data['stars'] > 5)){
            echo json_encode(["message" => "Stars must be between 1 and 5."]);
            return;
        }

        if($this->model->update($id, $data)){
            echo json_encode(["message" => "Comment updated successfully."]);
        } else {
            echo json_encode(["message" => "Failed to update comment."]);
        }
    }

    public function delete($id){
        if($this->model->delete($id)){
            echo json_encode(["message" => "Comment deleted successfully."]);
        } else {
            echo json_encode(["message" => "Failed to delete comment."]);
        }
    }
}
?>
