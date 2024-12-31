<?php
// controllers/ContactController.php

require_once __DIR__ . '/../models/Contact.php';

class ContactController {
    private $model;

    public function __construct(){
        $this->model = new Contact();
    }

    // Get all contacts (should be only one)
    public function getAll(){
        $stmt = $this->model->getAll();
        $contacts = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($contacts);
    }

    // Disable getById method as only one entry exists
    public function getById($id){
        echo json_encode(["success" => false, "message" => "Operation not allowed."]);
    }

    // Disable create method
    public function create(){
        echo json_encode(["success" => false, "message" => "Create operation not allowed."]);
    }

    // Update contact
    public function update(){
        // Fetch the first contact entry
        $stmt = $this->model->getAll();
        $contacts = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if(count($contacts) == 0){
            // No contact entry exists
            echo json_encode(["success" => false, "message" => "No contact entry exists to update."]);
            return;
        }

        $contact = $contacts[0];
        $contact_id = $contact['contact_id'];

        // Handle form data and file upload
        $title_contact = isset($_POST['title_contact']) ? trim($_POST['title_contact']) : '';
        $image_url_contact = isset($_FILES['image_url_contact']) ? $_FILES['image_url_contact'] : null;
        $logo_contact = isset($_FILES['logo_contact']) ? $_FILES['logo_contact'] : null;

        // Validate title_contact
        if(empty($title_contact)){
            echo json_encode(["success" => false, "message" => "Contact title is required."]);
            return;
        }

        // Prepare data to update
        $data = [
            'title_contact' => $title_contact
        ];

        // Handle contact image upload if present
        if($image_url_contact && $image_url_contact['error'] == UPLOAD_ERR_OK){
            // Validate and upload image
            $uploadResult = $this->uploadImage($image_url_contact, 'contact_images');
            if($uploadResult['success']){
                // Delete old contact image if exists
                if(!empty($contact['image_url_contact'])){
                    $this->deleteImage($contact['image_url_contact']);
                }
                $data['image_url_contact'] = $uploadResult['file_path'];
            } else {
                echo json_encode(["success" => false, "message" => $uploadResult['message']]);
                return;
            }
        }

        // Handle logo upload if present
        if($logo_contact && $logo_contact['error'] == UPLOAD_ERR_OK){
            // Validate and upload logo
            $uploadResult = $this->uploadImage($logo_contact, 'logos');
            if($uploadResult['success']){
                // Delete old logo if exists
                if(!empty($contact['logo'])){
                    $this->deleteImage($contact['logo']);
                }
                $data['logo'] = $uploadResult['file_path'];
            } else {
                echo json_encode(["success" => false, "message" => $uploadResult['message']]);
                return;
            }
        }

        // Perform the update
        if($this->model->update($contact_id, $data)){
            echo json_encode(["success" => true, "message" => "Contact entry updated successfully."]);
        } else {
            echo json_encode(["success" => false, "message" => "Failed to update contact entry."]);
        }
    }

    // Disable delete method
    public function delete($id){
        echo json_encode(["success" => false, "message" => "Delete operation not allowed."]);
    }

    // Function to handle image upload
    private function uploadImage($file, $type){
        $uploadDir = __DIR__ . '/../uploads/' . $type . '/';

        // Create the upload directory if it doesn't exist
        if(!file_exists($uploadDir)){
            mkdir($uploadDir, 0755, true);
        }

        $fileName = basename($file['name']);
        $imageFileType = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

        // Check if the file is an actual image
        $check = getimagesize($file['tmp_name']);
        if($check === false){
            return ["success" => false, "message" => "File is not an image."];
        }

        // Check file size (max 5MB)
        if($file['size'] > 5 * 1024 * 1024){
            return ["success" => false, "message" => "File size exceeds 5MB."];
        }

        // Allow only certain file formats
        $allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];
        if(!in_array($imageFileType, $allowedTypes)){
            return ["success" => false, "message" => "Only JPG, JPEG, PNG, and GIF files are allowed."];
        }

        // Generate a unique file name
        $uniqueFileName = uniqid($type . '_', true) . '.' . $imageFileType;
        $targetFilePath = $uploadDir . $uniqueFileName;

        if(move_uploaded_file($file['tmp_name'], $targetFilePath)){
            // Get the base URL
            $baseUrl = $this->getBaseUrl();
            // Return the absolute URL
            return ["success" => true, "file_path" => $baseUrl . 'uploads/' . $type . '/' . $uniqueFileName];
        } else {
            return ["success" => false, "message" => "There was an error uploading the image."];
        }
    }

    // Function to delete old image
    private function deleteImage($image_url_contact){
        // Parse URL to get the relative path
        $parsedUrl = parse_url($image_url_contact);
        $imagePath = __DIR__ . '/../' . ltrim($parsedUrl['path'], '/');

        if(file_exists($imagePath)){
            unlink($imagePath);
        }
    }

    // Function to get base URL
    private function getBaseUrl(){
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' 
                     || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
        $host = $_SERVER['HTTP_HOST'];
        // Ensure the base URL does not include the 'api' subdirectory
        $baseUrl = $protocol . $host . '/TEORI_WEB/PHP/';
        return $baseUrl;
    }
}
?>
