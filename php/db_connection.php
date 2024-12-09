<?php
$host = "localhost";
$username = "root";
$password = "";
$dbname = "almeraa_laundry";

// Membuat koneksi
$conn = new mysqli($host, $username, $password, $dbname);

// Periksa koneksi
if ($conn->connect_error) {
    die("Koneksi gagal: " . $conn->connect_error);
}