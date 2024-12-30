<?php
// controllers/SignupController.php

require_once __DIR__ . '/../models/Signup.php';

class SignupController {
    private $signupModel;

    public function __construct() {
        $this->signupModel = new Signup();
    }

    /**
     * Proses Sign Up
     * 
     * @param string|null $profile_image
     * @param string $username
     * @param string $password
     * @param bool $terms
     * @return array
     */
    public function signup($profile_image, $username, $password, $terms) {
        // Validasi persetujuan terms
        if (!$terms) {
            return ['success' => false, 'message' => 'You must agree to the terms'];
        }

        // Cek apakah username sudah ada
        if ($this->signupModel->getUserByUsername($username)) {
            return ['success' => false, 'message' => 'Username already exists'];
        }

        // Hash password
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

        // Persiapkan data untuk disimpan
        $data = [
            'username_user' => $username,
            'password_user' => $hashedPassword,
            'user_role' => 'user', // Atur peran pengguna sesuai kebutuhan
            'user_image_profile' => $profile_image
        ];

        // Buat pengguna baru
        $created = $this->signupModel->createUser($data);

        if ($created) {
            return ['success' => true, 'message' => 'Account created successfully'];
        } else {
            return ['success' => false, 'message' => 'Failed to create account'];
        }
    }
}
?>
