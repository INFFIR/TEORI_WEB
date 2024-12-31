<?php
// config/db.php

class Database {
    private $host = "localhost";
    private $db_name = "web_laundry";
    private $username = "root";
    private $password = "";
    public $conn;

    public function getConnection(){
        $this->conn = null;
        try{
            // Set DSN
            $dsn = "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8mb4";
            // Create PDO instance
            $this->conn = new PDO($dsn, $this->username, $this->password);
            // Set PDO attributes
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $exception){
            echo "Connection error: " . $exception->getMessage();
            exit;
        }
        return $this->conn;
    }
}
?>
