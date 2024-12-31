<?php
// models/Signin.php

require_once __DIR__ . '/Model.php';

class Signin extends Model {
    protected $table = 'login';
    protected $primaryKey = 'user_id';

    /**
     * Mengambil pengguna berdasarkan username
     * 
     * @param string $username
     * @return array|null
     */
    public function getUserByUsername($username) {
        $query = "SELECT * FROM {$this->table} WHERE username_user = :username LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':username', $username, PDO::PARAM_STR);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        return $user ?: null;
    }
}
?>
