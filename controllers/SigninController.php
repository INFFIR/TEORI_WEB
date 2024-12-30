<?php
// controllers/SigninController.php

require_once __DIR__ . '/../models/Signin.php';

class SigninController {
    private $signinModel;

    public function __construct() {
        $this->signinModel = new Signin();
    }

    /**
     * Proses Sign In
     * 
     * @param string $username
     * @param string $password
     * @return array
     */
    public function signin($username, $password) {
        // Cek apakah pengguna ada
        $user = $this->signinModel->getUserByUsername($username);

        if (!$user) {
            return ['success' => false, 'message' => 'User not found'];
        }

        // Verifikasi password
        if (!password_verify($password, $user['password_user'])) {
            return ['success' => false, 'message' => 'Incorrect password'];
        }

        // (Opsional) Buat session atau token JWT
        // Contoh sederhana menggunakan session
        session_start();
        $_SESSION['user_id'] = $user['user_id'];
        $_SESSION['username'] = $user['username_user'];
        $_SESSION['user_role'] = $user['user_role'];

        return ['success' => true, 'message' => 'Sign in successful'];
    }
}
?>
