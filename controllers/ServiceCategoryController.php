<?php
// controllers/ServiceCategoryController.php

require_once __DIR__ . '/../models/ServiceCategory.php';

class ServiceCategoryController {
    private $model;
    private $uploadIconDir = __DIR__ . '/../uploads/category_icons/'; // Directory for icons
    private $uploadImageDir = __DIR__ . '/../uploads/category_images/'; // Directory for images

    public function __construct(){
        $this->model = new ServiceCategory();
        // Create upload directories if they don't exist
        if (!file_exists($this->uploadIconDir)) {
            mkdir($this->uploadIconDir, 0777, true);
        }
        if (!file_exists($this->uploadImageDir)) {
            mkdir($this->uploadImageDir, 0777, true);
        }
    }

    // Mendapatkan semua entri Service Category
    public function getAll(){
        try {
            $stmt = $this->model->getAll();
            $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
            // Modify paths to be accessible via URL
            foreach ($categories as &$category) {
                if ($category['category_icon']) {
                    $category['category_icon'] = $this->getImageUrl($category['category_icon']);
                }
                if ($category['category_image']) {
                    $category['category_image'] = $this->getImageUrl($category['category_image']);
                }
            }
            echo json_encode(["data" => $categories, "success" => true]);
        } catch (Exception $e) {
            echo json_encode(["message" => "Failed to retrieve service categories.", "success" => false]);
        }
    }

    // Mendapatkan entri Service Category berdasarkan ID
    public function getById($id){
        try {
            $stmt = $this->model->getById($id);
            $category = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($category) {
                if ($category['category_icon']) {
                    $category['category_icon'] = $this->getImageUrl($category['category_icon']);
                }
                if ($category['category_image']) {
                    $category['category_image'] = $this->getImageUrl($category['category_image']);
                }
                echo json_encode(["data" => $category, "success" => true]);
            } else {
                echo json_encode(["message" => "Service category not found.", "success" => false]);
            }
        } catch (Exception $e) {
            echo json_encode(["message" => "Failed to retrieve the service category.", "success" => false]);
        }
    }

    // Membuat entri Service Category baru
    public function create(){
        // Akses data form dan unggah file
        $title = isset($_POST['title']) ? trim($_POST['title']) : '';
        $category_description = isset($_POST['category_description']) ? trim($_POST['category_description']) : '';
        $category_icon = isset($_FILES['category_icon']) ? $_FILES['category_icon'] : null;
        $category_image = isset($_FILES['category_image']) ? $_FILES['category_image'] : null;

        if ($title && $category_description) {
            // Tangani pengunggahan kategori_icon
            $iconPath = $this->handleImageUpload($category_icon, $this->uploadIconDir);
            if (!$iconPath) {
                echo json_encode(["message" => "Failed to upload category icon.", "success" => false]);
                return;
            }

            // Tangani pengunggahan kategori_image (opsional)
            $imagePath = null;
            if ($category_image && $category_image['error'] !== UPLOAD_ERR_NO_FILE) {
                $imagePath = $this->handleImageUpload($category_image, $this->uploadImageDir);
                if (!$imagePath) {
                    echo json_encode(["message" => "Failed to upload category image.", "success" => false]);
                    return;
                }
            }

            // Siapkan data untuk model
            $data = [
                'title' => $title,
                'category_icon' => $iconPath,
                'category_image' => $imagePath,
                'category_description' => $category_description
            ];

            // Panggil model untuk menyimpan data
            if ($this->model->create($data)) {
                echo json_encode(["message" => "Service category created successfully.", "success" => true]);
            } else {
                echo json_encode(["message" => "Failed to create service category.", "success" => false]);
            }
        } else {
            echo json_encode(["message" => "Title and Description are required.", "success" => false]);
        }
    }

    // Memperbarui entri Service Category dengan gambar
    public function updateWithImage($id){
        // Akses data form dan unggah file
        $title = isset($_POST['title']) ? trim($_POST['title']) : '';
        $category_description = isset($_POST['category_description']) ? trim($_POST['category_description']) : '';
        $category_icon = isset($_FILES['category_icon']) ? $_FILES['category_icon'] : null;
        $category_image = isset($_FILES['category_image']) ? $_FILES['category_image'] : null;

        if ($title && $category_description) {
            // Pertama, dapatkan entri Service Category untuk mengambil path gambar yang ada
            $stmt = $this->model->getById($id);
            $existingCategory = $stmt->fetch(PDO::FETCH_ASSOC);
            if (!$existingCategory) {
                echo json_encode(["message" => "Service category not found.", "success" => false]);
                return;
            }

            // Tangani pengunggahan kategori_icon jika ada
            $iconPath = $existingCategory['category_icon'];
            if ($category_icon && $category_icon['error'] === UPLOAD_ERR_OK) {
                // Hapus icon lama jika ada
                if ($existingCategory['category_icon'] && file_exists(__DIR__ . '/../' . $existingCategory['category_icon'])) {
                    unlink(__DIR__ . '/../' . $existingCategory['category_icon']);
                }
                $iconPath = $this->handleImageUpload($category_icon, $this->uploadIconDir);
                if (!$iconPath) {
                    echo json_encode(["message" => "Failed to upload category icon.", "success" => false]);
                    return;
                }
            }

            // Tangani pengunggahan kategori_image jika ada
            $imagePath = $existingCategory['category_image'];
            if ($category_image && $category_image['error'] !== UPLOAD_ERR_NO_FILE) {
                if ($existingCategory['category_image'] && file_exists(__DIR__ . '/../' . $existingCategory['category_image'])) {
                    unlink(__DIR__ . '/../' . $existingCategory['category_image']);
                }
                $imagePath = $this->handleImageUpload($category_image, $this->uploadImageDir);
                if (!$imagePath) {
                    echo json_encode(["message" => "Failed to upload category image.", "success" => false]);
                    return;
                }
            }

            // Siapkan data untuk update
            $data = [
                'title' => $title,
                'category_icon' => $iconPath,
                'category_image' => $imagePath,
                'category_description' => $category_description
            ];

            // Panggil model untuk memperbarui data
            if ($this->model->update($id, $data)) {
                echo json_encode(["message" => "Service category updated successfully.", "success" => true]);
            } else {
                echo json_encode(["message" => "Failed to update service category.", "success" => false]);
            }
        } else {
            echo json_encode(["message" => "Title and Description are required.", "success" => false]);
        }
    }

    // Memperbarui entri Service Category tanpa gambar (opsional)
    public function update($id, $data = null){
        // Jika data tidak diberikan, ambil dari $_POST
        if ($data === null) {
            $data = [];
            $data['title'] = isset($_POST['title']) ? trim($_POST['title']) : '';
            $data['category_description'] = isset($_POST['category_description']) ? trim($_POST['category_description']) : '';
        }

        $title = isset($data['title']) ? $data['title'] : '';
        $category_description = isset($data['category_description']) ? $data['category_description'] : '';

        if ($title && $category_description) {
            // Siapkan data untuk pembaruan
            $updateData = [
                'title' => $title,
                'category_description' => $category_description
            ];

            // Panggil model untuk memperbarui data
            if ($this->model->update($id, $updateData)) {
                echo json_encode(["message" => "Service category updated successfully.", "success" => true]);
            } else {
                echo json_encode(["message" => "Failed to update service category.", "success" => false]);
            }
        } else {
            echo json_encode(["message" => "Title and Description are required.", "success" => false]);
        }
    }

    // Menghapus entri Service Category
    public function delete($id){
        try {
            // Pertama, dapatkan entri Service Category untuk mengambil path gambar
            $stmt = $this->model->getById($id);
            $category = $stmt->fetch(PDO::FETCH_ASSOC);
            if (!$category) {
                echo json_encode(["message" => "Service category not found.", "success" => false]);
                return;
            }

            // Hapus file category_icon jika ada
            if (!empty($category['category_icon'])) {
                $iconPath = $this->getFilePath($category['category_icon']);
                if (file_exists($iconPath)) {
                    unlink($iconPath);
                }
            }

            // Hapus file category_image jika ada
            if (!empty($category['category_image'])) {
                $imagePath = $this->getFilePath($category['category_image']);
                if (file_exists($imagePath)) {
                    unlink($imagePath);
                }
            }

            // Hapus entri dari database
            if ($this->model->delete($id)) {
                echo json_encode(["message" => "Service category deleted successfully.", "success" => true]);
            } else {
                echo json_encode(["message" => "Failed to delete service category.", "success" => false]);
            }
        } catch (Exception $e) {
            echo json_encode(["message" => "An error occurred while deleting the service category.", "success" => false]);
        }
    }

    // Menangani pengunggahan gambar
    private function handleImageUpload($file, $uploadDir) {
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

        // Sanitasi nama file
        $fileName = basename($file['name']);
        $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        $newFileName = uniqid('service_', true) . '.' . $fileExtension;
        $imagePath = $uploadDir . $newFileName;

        if (move_uploaded_file($file['tmp_name'], $imagePath)) {
            // Mengembalikan path relatif untuk disimpan di database
            $relativePath = str_replace(__DIR__ . '/../', '', $imagePath);
            return $relativePath;
        }

        return null; // Unggah gagal
    }

    // Mengonversi path file server ke URL yang dapat diakses
    private function getImageUrl($relativePath) {
        // Sesuaikan base URL sesuai konfigurasi server Anda
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' 
                     || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
        $host = $_SERVER['HTTP_HOST'];
        $baseUrl = $protocol . $host . '/'; // Asumsikan project berada di root
        return $baseUrl . $relativePath;
    }

    // Mengonversi URL gambar kembali ke path file server
    private function getFilePath($url) {
        // Asumsikan direktori 'uploads' berada di root dan path relatif sudah benar
        return __DIR__ . '/../' . parse_url($url, PHP_URL_PATH);
    }
}
?>
