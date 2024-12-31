<?php
// controllers/LoginController.php

require_once __DIR__ . '/../models/Login.php';

class LoginController {
    private $model;

    public function __construct(){
        $this->model = new Login();
    }

    public function getAll(){
        $stmt = $this->model->getAll();
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($users);
    }

    public function getById($id){
        $stmt = $this->model->getById($id);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($user);
    }

    public function create(){
        $data = json_decode(file_get_contents("php://input"), true);

        // Validasi data
        if(!isset($data['username_user'], $data['password_user'], $data['user_role'])){
            echo json_encode(["message" => "Missing required fields."]);
            return;
        }

        // Hash password sebelum disimpan
        if(isset($data['password_user'])){
            $data['password_user'] = password_hash($data['password_user'], PASSWORD_BCRYPT);
        }

        if($this->model->create($data)){
            echo json_encode(["message" => "User created successfully."]);
        } else {
            echo json_encode(["message" => "Failed to create user."]);
        }
    }

    public function update($id){
        $data = json_decode(file_get_contents("php://input"), true);

        // Validasi data
        if(empty($data)){
            echo json_encode(["message" => "No data provided for update."]);
            return;
        }

        // Hash password jika ada
        if(isset($data['password_user'])){
            $data['password_user'] = password_hash($data['password_user'], PASSWORD_BCRYPT);
        }

        if($this->model->update($id, $data)){
            echo json_encode(["message" => "User updated successfully."]);
        } else {
            echo json_encode(["message" => "Failed to update user."]);
        }
    }

    public function delete($id){
        if($this->model->delete($id)){
            echo json_encode(["message" => "User deleted successfully."]);
        } else {
            echo json_encode(["message" => "Failed to delete user."]);
        }
    }

    public function login(){
        $data = json_decode(file_get_contents("php://input"), true);
        $username = isset($data['username_user']) ? $data['username_user'] : '';
        $password = isset($data['password_user']) ? $data['password_user'] : '';

        if(empty($username) || empty($password)){
            echo json_encode(["message" => "Username and password are required."]);
            return;
        }

        // Menggunakan metode model untuk mendapatkan user berdasarkan username
        $user = $this->model->getUserByUsername($username);

        if($user){
            if(password_verify($password, $user['password_user'])){
                // Generate token (gunakan JWT di produksi)
                $token = bin2hex(random_bytes(16));
                echo json_encode(["message" => "Login successful.", "token" => $token]);
            } else {
                echo json_encode(["message" => "Invalid password."]);
            }
        } else {
            echo json_encode(["message" => "User not found."]);
        }
    }
}
?>
