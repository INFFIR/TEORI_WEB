<?php
// controllers/ContactSendController.php

require_once __DIR__ . '/../models/ContactSend.php';

class ContactSendController {
    private $model;

    public function __construct(){
        $this->model = new ContactSend();
    }

    public function getAll(){
        $stmt = $this->model->getAll();
        $sends = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($sends);
    }

    public function getById($id){
        $stmt = $this->model->getById($id);
        $send = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($send);
    }

    public function create(){
        $data = json_decode(file_get_contents("php://input"), true);

        // Validasi data
        if(!isset($data['contact_name'], $data['contact_email'])){
            echo json_encode(["message" => "Missing required fields."]);
            return;
        }

        // Validasi email
        if(!filter_var($data['contact_email'], FILTER_VALIDATE_EMAIL)){
            echo json_encode(["message" => "Invalid email format."]);
            return;
        }

        if($this->model->create($data)){
            echo json_encode(["message" => "Contact message sent successfully."]);
        } else {
            echo json_encode(["message" => "Failed to send contact message."]);
        }
    }

    public function update($id){
        $data = json_decode(file_get_contents("php://input"), true);

        // Validasi data
        if(empty($data)){
            echo json_encode(["message" => "No data provided for update."]);
            return;
        }

        // Validasi email jika ada
        if(isset($data['contact_email']) && !filter_var($data['contact_email'], FILTER_VALIDATE_EMAIL)){
            echo json_encode(["message" => "Invalid email format."]);
            return;
        }

        if($this->model->update($id, $data)){
            echo json_encode(["message" => "Contact send entry updated successfully."]);
        } else {
            echo json_encode(["message" => "Failed to update contact send entry."]);
        }
    }

    public function delete($id){
        if($this->model->delete($id)){
            echo json_encode(["message" => "Contact send entry deleted successfully."]);
        } else {
            echo json_encode(["message" => "Failed to delete contact send entry."]);
        }
    }
}
?>
