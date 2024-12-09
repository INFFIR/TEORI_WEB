<?php
// controllers/ContactController.php

require_once __DIR__ . '/../models/Contact.php';

class ContactController {
    private $model;

    public function __construct(){
        $this->model = new Contact();
    }

    // Mendapatkan semua kontak (seharusnya hanya satu)
    public function getAll(){
        $stmt = $this->model->getAll();
        $contacts = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($contacts);
    }

    // Nonaktifkan metode getById karena hanya satu entri yang ada
    public function getById($id){
        echo json_encode(["success" => false, "message" => "Operation not allowed."]);
    }

    // Nonaktifkan metode create
    public function create(){
        echo json_encode(["success" => false, "message" => "Create operation not allowed."]);
    }

    // Memperbarui kontak
    public function update(){
        // Fetch the first contact entry
        $stmt = $this->model->getAll();
        $contacts = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if(count($contacts) == 0){
            // Tidak ada entri kontak yang ada
            echo json_encode(["success" => false, "message" => "No contact entry exists to update."]);
            return;
        }

        $contact = $contacts[0];
        $contact_id = $contact['contact_id'];

        // Handle form data and file upload
        $title_contact = isset($_POST['title_contact']) ? trim($_POST['title_contact']) : '';
        $image_url_contact = isset($_FILES['image_url_contact']) ? $_FILES['image_url_contact'] : null;

        // Validasi title_contact
        if(empty($title_contact)){
            echo json_encode(["success" => false, "message" => "Contact title is required."]);
            return;
        }

        // Persiapkan data untuk diperbarui
        $data = [
            'title_contact' => $title_contact
        ];

        // Tangani upload gambar jika ada
        if($image_url_contact && $image_url_contact['error'] == UPLOAD_ERR_OK){
            // Validasi dan upload gambar
            $uploadResult = $this->uploadImage($image_url_contact);
            if($uploadResult['success']){
                // Hapus gambar lama jika ada
                if(!empty($contact['image_url_contact'])){
                    $this->deleteImage($contact['image_url_contact']);
                }
                $data['image_url_contact'] = $uploadResult['file_path'];
            } else {
                echo json_encode(["success" => false, "message" => $uploadResult['message']]);
                return;
            }
        }

        // Lakukan pembaruan
        if($this->model->update($contact_id, $data)){
            echo json_encode(["success" => true, "message" => "Contact entry updated successfully."]);
        } else {
            echo json_encode(["success" => false, "message" => "Failed to update contact entry."]);
        }
    }

    // Nonaktifkan metode delete
    public function delete($id){
        echo json_encode(["success" => false, "message" => "Delete operation not allowed."]);
    }

    // Fungsi untuk menangani upload gambar
    private function uploadImage($file){
        $uploadDir = __DIR__ . '/../uploads/contact_images/';

        // Buat direktori upload jika belum ada
        if(!file_exists($uploadDir)){
            mkdir($uploadDir, 0755, true);
        }

        $fileName = basename($file['name']);
        $imageFileType = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

        // Periksa apakah file adalah gambar
        $check = getimagesize($file['tmp_name']);
        if($check === false){
            return ["success" => false, "message" => "File is not an image."];
        }

        // Periksa ukuran file (maks 5MB)
        if($file['size'] > 5 * 1024 * 1024){
            return ["success" => false, "message" => "File size exceeds 5MB."];
        }

        // Izinkan jenis file tertentu
        $allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];
        if(!in_array($imageFileType, $allowedTypes)){
            return ["success" => false, "message" => "Only JPG, JPEG, PNG, and GIF files are allowed."];
        }

        // Buat nama file unik
        $uniqueFileName = uniqid('contact_', true) . '.' . $imageFileType;
        $targetFilePath = $uploadDir . $uniqueFileName;

        if(move_uploaded_file($file['tmp_name'], $targetFilePath)){
            // Dapatkan base URL
            $baseUrl = $this->getBaseUrl();
            // Kembalikan URL absolut
            return ["success" => true, "file_path" => $baseUrl . 'uploads/contact_images/' . $uniqueFileName];
        } else {
            return ["success" => false, "message" => "There was an error uploading the image."];
        }
    }

    // Fungsi untuk menghapus gambar lama
    private function deleteImage($image_url_contact){
        // Parse URL untuk mendapatkan path relatif
        $parsedUrl = parse_url($image_url_contact);
        $imagePath = __DIR__ . '/../' . ltrim($parsedUrl['path'], '/');

        if(file_exists($imagePath)){
            unlink($imagePath);
        }
    }

    // Fungsi untuk mendapatkan base URL
    private function getBaseUrl(){
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' 
                     || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
        $host = $_SERVER['HTTP_HOST'];
        // Pastikan base URL tidak termasuk subdirektori 'api'
        $baseUrl = $protocol . $host . '/';
        return $baseUrl;
    }
}
?>
