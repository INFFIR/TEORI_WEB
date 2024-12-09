<?php
header("Content-Type: application/json");
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Koneksi ke database
$host = 'localhost';
$user = 'root';
$pass = '';
$db = 'almeraa_laundry';

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode(["error" => "Koneksi database gagal: " . $conn->connect_error]));
}

// Periksa metode request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    $name = $conn->real_escape_string($input['name']);
    $username = $conn->real_escape_string($input['username']);
    $email = $conn->real_escape_string($input['email']);
    $password = password_hash($conn->real_escape_string($input['password']), PASSWORD_BCRYPT); // Hash password
    $profile_image = $conn->real_escape_string($input['profile_image'] ?? 'https://example.com/default.jpg'); // Gambar profil default jika kosong

    // Cek apakah username atau email sudah digunakan
    $checkUserQuery = "SELECT * FROM users WHERE username='$username' OR email='$email'";
    $result = $conn->query($checkUserQuery);

    if ($result->num_rows > 0) {
        echo json_encode(["error" => "Username atau email sudah digunakan"]);
    } else {
        // Tambahkan data ke tabel users
        $sql = "INSERT INTO users (name, username, email, password, profile_image) 
                VALUES ('$name', '$username', '$email', '$password', '$profile_image')";

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
?>