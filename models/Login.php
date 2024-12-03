<?php
// models/Login.php

require_once 'Model.php';

class Login extends Model {
    protected $table = 'login';
    protected $primaryKey = 'user_id';

    // Metode khusus untuk mendapatkan user berdasarkan username
    public function getUserByUsername($username){
        $query = "SELECT * FROM {$this->table} WHERE username_user = :username";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":username", $username);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
?>
