<?php
// controllers/AboutController.php

require_once __DIR__ . '/../models/About.php';

class AboutController {
    private $model;

    public function __construct(){
        $this->model = new About();
    }

    // Mendapatkan semua entri About
    public function getAll(){
        try {
            $stmt = $this->model->getAll();
            $abouts = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(["data" => $abouts, "success" => true]);
        } catch (Exception $e) {
            echo json_encode(["message" => "Failed to retrieve about sections.", "success" => false]);
        }
    }

    // Mendapatkan entri About berdasarkan ID
    public function getById($id){
        try {
            $stmt = $this->model->getById($id);
            $about = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($about) {
                echo json_encode(["data" => $about, "success" => true]);
            } else {
                echo json_encode(["message" => "About entry not found.", "success" => false]);
            }
        } catch (Exception $e) {
            echo json_encode(["message" => "Failed to retrieve the about entry.", "success" => false]);
        }
    }

    // Membuat entri About baru
    public function create(){
        // Akses data form dan unggah file
        $description_about = isset($_POST['description_about']) ? trim($_POST['description_about']) : '';
        $about_title = isset($_POST['about_title']) ? trim($_POST['about_title']) : ''; // Tambahan
        $image_url_about = isset($_FILES['image_url_about']) ? $_FILES['image_url_about'] : null;

        if ($description_about) {
            // Tangani pengunggahan gambar
            $imagePath = $this->handleImageUpload($image_url_about);

            // Siapkan data untuk model
            $data = [
                'description_about' => $description_about,
                'about_title' => $about_title // Tambahan
            ];
            if ($imagePath) {
                // Asumsikan image_url_about harus berupa URL yang dapat diakses oleh frontend
                $imageUrl = $this->getImageUrl($imagePath);
                $data['image_url_about'] = $imageUrl;
            }

            // Panggil model untuk menyimpan data
            if ($this->model->create($data)) {
                echo json_encode(["message" => "About entry created successfully.", "success" => true]);
            } else {
                echo json_encode(["message" => "Failed to create about entry.", "success" => false]);
            }
        } else {
            echo json_encode(["message" => "Description is required.", "success" => false]);
        }
    }

    // Memperbarui entri About dengan gambar
    public function updateWithImage($id){
        // Akses data form dan unggah file
        $description_about = isset($_POST['description_about']) ? trim($_POST['description_about']) : '';
        $about_title = isset($_POST['about_title']) ? trim($_POST['about_title']) : ''; // Tambahan
        $image_url_about = isset($_FILES['image_url_about']) ? $_FILES['image_url_about'] : null;

        if ($description_about) {
            // Tangani pengunggahan gambar jika ada
            $imagePath = $this->handleImageUpload($image_url_about);
            $updateData = [
                'description_about' => $description_about,
                'about_title' => $about_title // Tambahan
            ];

            if ($imagePath) {
                // Konversi path server ke URL
                $imageUrl = $this->getImageUrl($imagePath);
                $updateData['image_url_about'] = $imageUrl;

                // Hapus gambar lama jika ada
                $stmt = $this->model->getById($id);
                $existingAbout = $stmt->fetch(PDO::FETCH_ASSOC);
                if ($existingAbout && !empty($existingAbout['image_url_about'])) {
                    $oldImagePath = $this->getImagePath($existingAbout['image_url_about']);
                    if (file_exists($oldImagePath)) {
                        unlink($oldImagePath);
                    }
                }
            }

            // Panggil model untuk memperbarui data
            if ($this->model->update($id, $updateData)) {
                echo json_encode(["message" => "About entry updated successfully.", "success" => true]);
            } else {
                echo json_encode(["message" => "Failed to update about entry.", "success" => false]);
            }
        } else {
            echo json_encode(["message" => "Description is required.", "success" => false]);
        }
    }

    // Memperbarui entri About tanpa gambar (Opsional)
    public function update($id, $data){
        $description_about = isset($data['description_about']) ? trim($data['description_about']) : '';
        $about_title = isset($data['about_title']) ? trim($data['about_title']) : ''; // Tambahan

        if ($description_about) {
            // Siapkan data untuk pembaruan
            $updateData = [
                'description_about' => $description_about,
                'about_title' => $about_title // Tambahan
            ];

            // Panggil model untuk memperbarui data
            if ($this->model->update($id, $updateData)) {
                echo json_encode(["message" => "About entry updated successfully.", "success" => true]);
            } else {
                echo json_encode(["message" => "Failed to update about entry.", "success" => false]);
            }
        } else {
            echo json_encode(["message" => "Description is required.", "success" => false]);
        }
    }

    // Menghapus entri About
    public function delete($id){
        try {
            // Pertama, dapatkan entri About untuk mengambil path gambar
            $stmt = $this->model->getById($id);
            $about = $stmt->fetch(PDO::FETCH_ASSOC);
            if (!$about) {
                echo json_encode(["message" => "About entry not found.", "success" => false]);
                return;
            }

            // Hapus file gambar jika ada
            if (!empty($about['image_url_about'])) {
                $imagePath = $this->getImagePath($about['image_url_about']);
                if (file_exists($imagePath)) {
                    if (!unlink($imagePath)) {
                        echo json_encode(["message" => "Failed to delete the image file.", "success" => false]);
                        return;
                    }
                }
            }

            // Hapus entri dari database
            if ($this->model->delete($id)) {
                echo json_encode(["message" => "About entry deleted successfully.", "success" => true]);
            } else {
                echo json_encode(["message" => "Failed to delete about entry.", "success" => false]);
            }
        } catch (Exception $e) {
            echo json_encode(["message" => "An error occurred while deleting the about entry.", "success" => false]);
        }
    }

    // Menangani pengunggahan gambar
    private function handleImageUpload($file) {
        if (!$file || $file['error'] !== UPLOAD_ERR_OK) {
            return null; // Tidak ada file yang diunggah atau terjadi kesalahan unggah
        }

        // Validasi jenis file
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!in_array($file['type'], $allowedTypes)) {
            return null; // Jenis gambar tidak valid
        }

        // Validasi ukuran file (maks. 5MB)
        if ($file['size'] > 5 * 1024 * 1024) {
            return null; // Ukuran gambar terlalu besar
        }

        $uploadDir = __DIR__ . '/../uploads/';
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $imageName = uniqid('about_', true) . '.' . pathinfo($file['name'], PATHINFO_EXTENSION);
        $imagePath = $uploadDir . $imageName;

        if (move_uploaded_file($file['tmp_name'], $imagePath)) {
            return $imagePath;
        }

        return null; // Unggah gagal
    }

    // Mengonversi path file server ke URL yang dapat diakses
    private function getImageUrl($imagePath) {
        // Sesuaikan base URL sesuai konfigurasi server Anda
        $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
        $host = $_SERVER['HTTP_HOST'];
        $baseUrl = $protocol . "://" . $host . "/uploads/";
        $relativePath = basename($imagePath);
        return $baseUrl . $relativePath;
    }

    // Mengonversi URL gambar kembali ke path file server
    private function getImagePath($imageUrl) {
        // Asumsikan direktori 'uploads' berada di direktori yang sama dengan API PHP
        $uploadDir = __DIR__ . '/../uploads/';
        $filename = basename($imageUrl);
        return $uploadDir . $filename;
    }
}
?>
