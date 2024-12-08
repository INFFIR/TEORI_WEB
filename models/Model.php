<?php
// models/Model.php

require_once __DIR__ . '/../config/db.php';

class Model {
    protected $conn;
    protected $table;
    protected $primaryKey;

    public function __construct(){
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    // Metode Getter untuk koneksi
    public function getConnection(){
        return $this->conn;
    }

    // Metode getter untuk $table
    public function getTable(){
        return $this->table;
    }

    // Metode getter untuk $primaryKey
    public function getPrimaryKey(){
        return $this->primaryKey;
    }

    public function getAll(){
        $query = "SELECT * FROM {$this->table}";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function getById($id){
        $query = "SELECT * FROM {$this->table} WHERE {$this->primaryKey} = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt;
    }

    public function create($data){
        $columns = implode(", ", array_keys($data));
        $placeholders = ":" . implode(", :", array_keys($data));
        $query = "INSERT INTO {$this->table} ({$columns}) VALUES ({$placeholders})";
        $stmt = $this->conn->prepare($query);
        foreach($data as $key => &$value){
            $stmt->bindParam(":".$key, $value);
        }
        return $stmt->execute();
    }

    /**
     * Memperbarui data berdasarkan ID dengan mendukung partial update
     * 
     * @param int $id
     * @param array $data
     * @return bool
     */
    public function update($id, $data){
        if(empty($data)){
            // Tidak ada data untuk diupdate
            return false;
        }

        // Membangun bagian SET dari query secara dinamis
        $fields = "";
        foreach($data as $key => $value){
            $fields .= "{$key} = :{$key}, ";
        }
        $fields = rtrim($fields, ", ");

        $query = "UPDATE {$this->table} SET {$fields} WHERE {$this->primaryKey} = :id";
        $stmt = $this->conn->prepare($query);

        // Mengikat nilai parameter
        foreach($data as $key => &$value){
            $stmt->bindParam(":".$key, $value);
        }
        $stmt->bindParam(":id", $id, PDO::PARAM_INT);

        return $stmt->execute();
    }

    public function delete($id){
        $query = "DELETE FROM {$this->table} WHERE {$this->primaryKey} = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id, PDO::PARAM_INT);
        return $stmt->execute();
    }
}
?>
