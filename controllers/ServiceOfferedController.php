<?php
// controllers/ServiceOfferedController.php

require_once __DIR__ . '/../models/ServiceOffered.php';

class ServiceOfferedController {
    private $model;
    private $uploadDir = __DIR__ . '/../uploads/service_offered/'; // Direktori untuk gambar layanan

    public function __construct(){
        $this->model = new ServiceOffered();
        // Buat direktori unggahan jika belum ada
        if (!file_exists($this->uploadDir)) {
            mkdir($this->uploadDir, 0755, true);
        }
    }

    // Fungsi untuk mendapatkan base URL
    private function getBaseUrl() {
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' 
                     || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
        $host = $_SERVER['HTTP_HOST'];
        $baseUrl = $protocol . $host . '/'; // Sesuaikan jika project berada di subdirektori
        return $baseUrl;
    }

    // Mendapatkan semua layanan dengan kategori dan mendukung filter multiple category_id
    public function getAll(){
        try {
            $conn = $this->model->getConnection();
            $table = $this->model->getTable();

            // Cek apakah ada parameter category_ids dalam query
            if(isset($_GET['category_ids'])){
                $categoryIds = explode(',', $_GET['category_ids']);
                $categoryIds = array_map('intval', $categoryIds);
                $placeholders = implode(',', array_fill(0, count($categoryIds), '?'));
                $query = "SELECT so.*, sc.title AS category_title 
                          FROM {$table} so 
                          JOIN service_category sc ON so.category_id = sc.category_id
                          WHERE so.category_id IN ($placeholders)";
                $stmt = $conn->prepare($query);
                $stmt->execute($categoryIds);
            } elseif(isset($_GET['category_id'])){
                $categoryId = intval($_GET['category_id']);
                $query = "SELECT so.*, sc.title AS category_title 
                          FROM {$table} so 
                          JOIN service_category sc ON so.category_id = sc.category_id
                          WHERE so.category_id = ?";
                $stmt = $conn->prepare($query);
                $stmt->execute([$categoryId]);
            } else {
                // Jika tidak ada filter, ambil semua layanan
                $query = "SELECT so.*, sc.title AS category_title 
                          FROM {$table} so 
                          JOIN service_category sc ON so.category_id = sc.category_id";
                $stmt = $conn->prepare($query);
                $stmt->execute();
            }

            $services = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Pastikan setiap service memiliki URL gambar yang benar
            foreach ($services as &$service) {
                if ($service['offered_image_url']) {
                    // Jika sudah berupa URL absolut, biarkan
                    if (filter_var($service['offered_image_url'], FILTER_VALIDATE_URL)) {
                        // Do nothing
                    } else {
                        // Jika path relatif, ubah menjadi URL absolut
                        $baseUrl = $this->getBaseUrl();
                        $service['offered_image_url'] = $baseUrl . $service['offered_image_url'];
                    }
                }
            }

            echo json_encode(["success" => true, "data" => $services]);
        } catch (Exception $e) {
            echo json_encode(["success" => false, "message" => "Failed to retrieve services."]);
        }
    }

    // Mendapatkan layanan berdasarkan ID dengan kategori
    public function getById($id){
        try {
            $conn = $this->model->getConnection();
            $table = $this->model->getTable();
            $primaryKey = $this->model->getPrimaryKey();
            $query = "SELECT so.*, sc.title AS category_title 
                      FROM {$table} so 
                      JOIN service_category sc ON so.category_id = sc.category_id
                      WHERE so.{$primaryKey} = :id";
            $stmt = $conn->prepare($query);
            $stmt->bindParam(":id", $id, PDO::PARAM_INT);
            $stmt->execute();
            $service = $stmt->fetch(PDO::FETCH_ASSOC);
            if($service){
                if ($service['offered_image_url']) {
                    // Jika sudah berupa URL absolut, biarkan
                    if (filter_var($service['offered_image_url'], FILTER_VALIDATE_URL)) {
                        // Do nothing
                    } else {
                        // Jika path relatif, ubah menjadi URL absolut
                        $baseUrl = $this->getBaseUrl();
                        $service['offered_image_url'] = $baseUrl . $service['offered_image_url'];
                    }
                }
                echo json_encode(["success" => true, "data" => $service]);
            } else {
                echo json_encode(["success" => false, "message" => "Service not found."]);
            }
        } catch (Exception $e) {
            echo json_encode(["success" => false, "message" => "Failed to retrieve the service."]);
        }
    }

    // Membuat layanan baru
    public function create(){
        // Periksa apakah request menggunakan multipart/form-data
        if (isset($_SERVER['CONTENT_TYPE']) && strpos($_SERVER['CONTENT_TYPE'], 'multipart/form-data') !== false) {
            $data = $_POST;

            // Validasi data yang diperlukan
            $requiredFields = ['category_id', 'offered_name', 'offered_price', 'offered_description'];
            foreach ($requiredFields as $field) {
                if (!isset($data[$field]) || empty(trim($data[$field]))) {
                    echo json_encode(["success" => false, "message" => "Field '{$field}' is required."]);
                    return;
                }
            }

            // Validasi bahwa category_id adalah angka
            if(!is_numeric($data['category_id'])){
                echo json_encode(["success" => false, "message" => "Invalid category selected."]);
                return;
            }

            // Tangani unggahan gambar
            if(isset($_FILES['offered_image_url']) && $_FILES['offered_image_url']['error'] == 0){
                $upload = $this->uploadImage($_FILES['offered_image_url']);
                if($upload['success']){
                    $data['offered_image_url'] = $upload['file_path'];
                } else {
                    echo json_encode(["success" => false, "message" => $upload['message']]);
                    return;
                }
            } else {
                $data['offered_image_url'] = null;
            }

            if($this->model->create($data)){
                echo json_encode(["success" => true, "message" => "Service created successfully."]);
            } else {
                echo json_encode(["success" => false, "message" => "Failed to create service."]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Invalid request format."]);
        }
    }

    // Memperbarui layanan berdasarkan ID
    public function update($id){
        // Periksa apakah request menggunakan multipart/form-data
        if (isset($_SERVER['CONTENT_TYPE']) && strpos($_SERVER['CONTENT_TYPE'], 'multipart/form-data') !== false) {
            // Ambil data POST
            $data = $_POST;

            // Validasi bahwa category_id adalah angka jika disediakan
            if(isset($data['category_id']) && !is_numeric($data['category_id'])){
                echo json_encode(["success" => false, "message" => "Invalid category selected."]);
                return;
            }

            // Inisialisasi array untuk data yang akan diupdate
            $updateData = [];

            // Cek dan tambahkan field yang disediakan ke array updateData
            if(isset($data['category_id']) && !empty(trim($data['category_id']))){
                $updateData['category_id'] = $data['category_id'];
            }
            if(isset($data['offered_name']) && !empty(trim($data['offered_name']))){
                $updateData['offered_name'] = $data['offered_name'];
            }
            if(isset($data['offered_price']) && !empty(trim($data['offered_price']))){
                $updateData['offered_price'] = $data['offered_price'];
            }
            if(isset($data['offered_description']) && !empty(trim($data['offered_description']))){
                $updateData['offered_description'] = $data['offered_description'];
            }

            // Tangani unggahan gambar jika ada
            if(isset($_FILES['offered_image_url']) && $_FILES['offered_image_url']['error'] == 0){
                // Dapatkan data layanan untuk menghapus gambar lama
                $service = $this->model->getById($id)->fetch(PDO::FETCH_ASSOC);
                if($service && $service['offered_image_url']){
                    // Parse URL untuk mendapatkan path relatif
                    $parsedUrl = parse_url($service['offered_image_url']);
                    $imagePath = __DIR__ . '/../' . ltrim($parsedUrl['path'], '/');
                    if(file_exists($imagePath)){
                        unlink($imagePath);
                    }
                }

                $upload = $this->uploadImage($_FILES['offered_image_url']);
                if($upload['success']){
                    $updateData['offered_image_url'] = $upload['file_path'];
                } else {
                    echo json_encode(["success" => false, "message" => $upload['message']]);
                    return;
                }
            }

            // Jika tidak ada data untuk diupdate
            if(empty($updateData)){
                echo json_encode(["success" => false, "message" => "No data provided for update."]);
                return;
            }

            if($this->model->update($id, $updateData)){
                echo json_encode(["success" => true, "message" => "Service updated successfully."]);
            } else {
                echo json_encode(["success" => false, "message" => "Failed to update service."]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Invalid request format."]);
        }
    }

    // Menghapus layanan berdasarkan ID
    public function delete($id){
        try {
            // Dapatkan data layanan untuk menghapus gambar jika ada
            $service = $this->model->getById($id)->fetch(PDO::FETCH_ASSOC);
            if($service && $service['offered_image_url']){
                // Parse URL untuk mendapatkan path relatif
                $parsedUrl = parse_url($service['offered_image_url']);
                $imagePath = __DIR__ . '/../' . ltrim($parsedUrl['path'], '/');
                if(file_exists($imagePath)){
                    unlink($imagePath);
                }
            }

            if($this->model->delete($id)){
                echo json_encode(["success" => true, "message" => "Service deleted successfully."]);
            } else {
                echo json_encode(["success" => false, "message" => "Failed to delete service."]);
            }
        } catch (Exception $e) {
            echo json_encode(["success" => false, "message" => "An error occurred while deleting the service."]);
        }
    }

    // Fungsi untuk mengunggah gambar
    private function uploadImage($file){
        $targetDir = $this->uploadDir;
        if (!file_exists($targetDir)) {
            mkdir($targetDir, 0755, true);
        }

        $fileName = basename($file["name"]);
        $imageFileType = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

        // Periksa apakah file adalah gambar
        $check = getimagesize($file["tmp_name"]);
        if($check === false){
            return ["success" => false, "message" => "File is not an image."];
        }

        // Periksa ukuran file (maks 5MB)
        if ($file["size"] > 5 * 1024 * 1024) {
            return ["success" => false, "message" => "Sorry, your file is too large."];
        }

        // Izinkan jenis file tertentu
        $allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];
        if(!in_array($imageFileType, $allowedTypes)){
            return ["success" => false, "message" => "Sorry, only JPG, JPEG, PNG & GIF files are allowed."];
        }

        // Buat nama file unik untuk mencegah penimpaan
        $uniqueFileName = uniqid('service_', true) . "." . $imageFileType;
        $finalPath = $targetDir . $uniqueFileName;

        if (move_uploaded_file($file["tmp_name"], $finalPath)) {
            // Mendapatkan base URL
            $baseUrl = $this->getBaseUrl();

            // Mendapatkan path relatif untuk disimpan di database
            $relativePath = 'uploads/service_offered/' . $uniqueFileName;
            return ["success" => true, "file_path" => $baseUrl . $relativePath];
        } else {
            return ["success" => false, "message" => "Sorry, there was an error uploading your file."];
        }
    }
}
?>
