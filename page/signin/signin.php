<?php
session_start();  // Memulai session

// Koneksi ke database
$conn = new mysqli("localhost", "root", "", "web_laundry");

// Periksa koneksi
if ($conn->connect_error) {
    die("Koneksi gagal: " . $conn->connect_error);
}

// Periksa jika form disubmit
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Ambil data dari form
    $username = $conn->real_escape_string($_POST['username']);
    $password = $_POST['password'];

    // Query untuk memeriksa apakah input adalah email atau username
    $sql = "SELECT * FROM users WHERE email = '$username' OR username = '$username'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        if (password_verify($password, $user['password'])) {
            // Simpan data user dalam session
            $_SESSION['user_id'] = $user['id'];  // Menyimpan ID pengguna di session
            $_SESSION['username'] = $user['username'];  // Menyimpan username di session
            $_SESSION['email'] = $user['email'];  // Menyimpan email di session

            // Redirect ke halaman utama (index.html)
            header("Location: http://localhost/TEORI_WEB");
            exit;
        } else {
            echo "Password salah!";
        }
    } else {
        echo "Akun tidak ditemukan!";
    }
}

$conn->close();
?>