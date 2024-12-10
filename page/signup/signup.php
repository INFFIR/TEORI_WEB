<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Koneksi ke database
$host = 'localhost';
$user = 'root';
$pass = '';
$db = 'web_laundry';

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode(["error" => "Koneksi database gagal: " . $conn->connect_error]));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    $name = $conn->real_escape_string($input['username_user'] ?? '');
    $username = $conn->real_escape_string($input['username'] ?? '');
    $email = $conn->real_escape_string($input['email'] ?? '');
    $password = $conn->real_escape_string($input['password_user'] ?? '');
    $profile_image = $conn->real_escape_string($input['user_image_profile'] ?? 'https://example.com/default.jpg');

    if (empty($name) || empty($username) || empty($email) || empty($password)) {
        echo json_encode(["error" => "Semua kolom harus diisi"]);
        exit;
    }

    $password_hashed = password_hash($password, PASSWORD_BCRYPT);

    $checkUserQuery = "SELECT * FROM users WHERE username='$username' OR email='$email'";
    $result = $conn->query($checkUserQuery);

    if ($result->num_rows > 0) {
        echo json_encode(["error" => "Username atau email sudah digunakan"]);
    } else {
        $sql = "INSERT INTO users (name, username, email, password, profile_image) 
                VALUES ('$name', '$username', '$email', '$password_hashed', '$profile_image')";

        if ($conn->query($sql)) {
            echo json_encode(["message" => "Akun berhasil dibuat"]);
        } else {
            echo json_encode(["error" => "Gagal membuat akun: " . $conn->error]);
        }
    }
} else {
    echo json_encode(["error" => "Metode request tidak valid"]);
}

$conn->close();