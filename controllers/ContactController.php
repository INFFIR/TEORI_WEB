<?php
// controllers/ContactController.php

require_once __DIR__ . '/../models/Contact.php';

class ContactController {
    private $model;

    public function __construct(){
        $this->model = new Contact();
    }

    public function getAll(){
        $stmt = $this->model->getAll();
        $contacts = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($contacts);
    }

    public function getById($id){
        $stmt = $this->model->getById($id);
        $contact = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($contact);
    }

    public function create(){
        $data = json_decode(file_get_contents("php://input"), true);

        // Validasi data
        if(!isset($data['title_contact'])){
            echo json_encode(["message" => "Missing required fields."]);
            return;
        }

        if($this->model->create($data)){
            echo json_encode(["message" => "Contact entry created successfully."]);
        } else {
            echo json_encode(["message" => "Failed to create contact entry."]);
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
            echo json_encode(["message" => "Contact entry updated successfully."]);
        } else {
            echo json_encode(["message" => "Failed to update contact entry."]);
        }
    }

    public function delete($id){
        if($this->model->delete($id)){
            echo json_encode(["message" => "Contact entry deleted successfully."]);
        } else {
            echo json_encode(["message" => "Failed to delete contact entry."]);
        }
    }
}
?>
