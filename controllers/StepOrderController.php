<?php
// controllers/StepOrderController.php

require_once __DIR__ . '/../models/StepOrder.php';

class StepOrderController {
    private $model;
    private $uploadDir = __DIR__ . '/../uploads/step_icons/'; // Direktori untuk ikon langkah

    public function __construct(){
        $this->model = new StepOrder();
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
        // Sesuaikan dengan path root aplikasi Anda jika diperlukan
        $baseUrl = $protocol . $host . '/';
        return $baseUrl;
    }

    // Mendapatkan semua langkah diurutkan berdasarkan step_number
    public function getAll(){
        try {
            $conn = $this->model->getConnection();
            $table = $this->model->getTable();
            // Query tanpa JOIN dan diurutkan berdasarkan step_number
            $query = "SELECT * FROM {$table} ORDER BY step_number ASC";
            $stmt = $conn->prepare($query);
            $stmt->execute();
            $steps = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Pastikan setiap langkah memiliki URL ikon yang benar
            foreach ($steps as &$step) {
                if ($step['step_icon']) {
                    // Jika sudah berupa URL absolut, biarkan
                    if (filter_var($step['step_icon'], FILTER_VALIDATE_URL)) {
                        // Do nothing
                    } else {
                        // Jika path relatif, ubah menjadi URL absolut
                        $baseUrl = $this->getBaseUrl();
                        $step['step_icon'] = $baseUrl . $step['step_icon'];
                    }
                }
            }

            echo json_encode(["success" => true, "data" => $steps]);
        } catch (Exception $e) {
            echo json_encode(["success" => false, "message" => "Failed to retrieve steps."]);
        }
    }

    // Mendapatkan langkah berdasarkan ID
    public function getById($id){
        try {
            $conn = $this->model->getConnection();
            $table = $this->model->getTable();
            $query = "SELECT * FROM {$table} WHERE step_id = :id";
            $stmt = $conn->prepare($query);
            $stmt->bindParam(":id", $id, PDO::PARAM_INT);
            $stmt->execute();
            $step = $stmt->fetch(PDO::FETCH_ASSOC);
            if($step){
                if ($step['step_icon']) {
                    // Jika sudah berupa URL absolut, biarkan
                    if (filter_var($step['step_icon'], FILTER_VALIDATE_URL)) {
                        // Do nothing
                    } else {
                        // Jika path relatif, ubah menjadi URL absolut
                        $baseUrl = $this->getBaseUrl();
                        $step['step_icon'] = $baseUrl . $step['step_icon'];
                    }
                }
                echo json_encode(["success" => true, "data" => $step]);
            } else {
                echo json_encode(["success" => false, "message" => "Step not found."]);
            }
        } catch (Exception $e) {
            echo json_encode(["success" => false, "message" => "Failed to retrieve the step."]);
        }
    }

    // Membuat langkah baru
    public function create(){
        // Periksa apakah request menggunakan multipart/form-data
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = $_POST;

            // Validasi data yang diperlukan
            $requiredFields = ['step_number', 'step_title', 'step_description'];
            foreach ($requiredFields as $field) {
                if (!isset($data[$field]) || empty(trim($data[$field]))) {
                    echo json_encode(["success" => false, "message" => "Field '{$field}' is required."]);
                    return;
                }
            }

            // Validasi bahwa step_number adalah angka
            if(!is_numeric($data['step_number']) || intval($data['step_number']) < 1){
                echo json_encode(["success" => false, "message" => "Invalid step number."]);
                return;
            }

            $desired_step_number = intval($data['step_number']);

            // Temukan step_number maksimum yang ada
            $conn = $this->model->getConnection();
            $table = $this->model->getTable();
            $query_max = "SELECT MAX(step_number) as max_step_number FROM {$table}";
            $stmt_max = $conn->prepare($query_max);
            $stmt_max->execute();
            $result_max = $stmt_max->fetch(PDO::FETCH_ASSOC);
            $max_step_number = $result_max['max_step_number'] ? intval($result_max['max_step_number']) : 0;

            // Jika desired_step_number > max_step_number +1, set ke max_step_number +1
            if ($desired_step_number > ($max_step_number +1)) {
                $desired_step_number = $max_step_number +1;
            }

            // Cek apakah step_number sudah ada
            $existing_step = $this->getStepByNumber($desired_step_number);
            if($existing_step){
                // Geser semua step_number >= desired_step_number ke atas (+1)
                $this->shiftStepNumbers($desired_step_number);
            }

            // Tangani unggahan ikon langkah
            if(isset($_FILES['step_icon']) && $_FILES['step_icon']['error'] == 0){
                $upload = $this->uploadIcon($_FILES['step_icon']);
                if($upload['success']){
                    $data['step_icon'] = $upload['file_path'];
                } else {
                    echo json_encode(["success" => false, "message" => $upload['message']]);
                    return;
                }
            } else {
                $data['step_icon'] = null;
            }

            // Set step_number yang diinginkan (sudah di-assign jika ada konflik)
            $data['step_number'] = $desired_step_number;

            if($this->model->create($data)){
                echo json_encode(["success" => true, "message" => "Step created successfully.", "step_number" => $data['step_number']]);
            } else {
                echo json_encode(["success" => false, "message" => "Failed to create step."]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Invalid request method."]);
        }
    }

    // Memperbarui langkah berdasarkan ID
    public function update($id){
        // Periksa apakah request menggunakan multipart/form-data
        if ($_SERVER['REQUEST_METHOD'] === 'POST') { // Karena kita menggunakan method override
            // Ambil data POST
            $data = $_POST;

            // Inisialisasi array untuk data yang akan diupdate
            $updateData = [];

            // Cek dan tambahkan field yang disediakan ke array updateData
            if(isset($data['step_number']) && !empty(trim($data['step_number']))){
                if(!is_numeric($data['step_number']) || intval($data['step_number']) < 1){
                    echo json_encode(["success" => false, "message" => "Invalid step number."]);
                    return;
                }
                $new_step_number = intval($data['step_number']);

                // Dapatkan data langkah saat ini
                $current_step = $this->model->getById($id)->fetch(PDO::FETCH_ASSOC);
                if(!$current_step){
                    echo json_encode(["success" => false, "message" => "Step not found."]);
                    return;
                }

                // Jika step_number baru sama dengan step_number saat ini, tidak perlu melakukan apa-apa
                if($new_step_number != $current_step['step_number']){
                    // Cek apakah step_number baru sudah ada
                    $existing_step = $this->getStepByNumber($new_step_number);
                    if($existing_step && $existing_step['step_id'] != $id){
                        // Swap step_number antara langkah yang sedang diedit dengan langkah yang sudah ada
                        $swap_id = $existing_step['step_id'];
                        $swap_step_number = $current_step['step_number'];

                        // Cari temp_step_number yang unik
                        $temp_step_number = $this->findNextAvailableStepNumber() + 1;

                        // Mulai transaksi
                        $conn = $this->model->getConnection();
                        try {
                            $conn->beginTransaction();

                            // Update langkah yang existing dengan temp_step_number
                            $query_swap1 = "UPDATE {$this->model->getTable()} SET step_number = :temp_step_number WHERE step_id = :swap_id";
                            $stmt_swap1 = $conn->prepare($query_swap1);
                            $stmt_swap1->bindParam(":temp_step_number", $temp_step_number, PDO::PARAM_INT);
                            $stmt_swap1->bindParam(":swap_id", $swap_id, PDO::PARAM_INT);
                            $stmt_swap1->execute();

                            // Update langkah yang sedang diedit dengan step_number baru
                            $updateData['step_number'] = $new_step_number;
                            $this->model->update($id, $updateData);

                            // Update langkah yang existing dengan step_number saat ini
                            $query_swap2 = "UPDATE {$this->model->getTable()} SET step_number = :current_step_number WHERE step_id = :swap_id";
                            $stmt_swap2 = $conn->prepare($query_swap2);
                            $stmt_swap2->bindParam(":current_step_number", $swap_step_number, PDO::PARAM_INT);
                            $stmt_swap2->bindParam(":swap_id", $swap_id, PDO::PARAM_INT);
                            $stmt_swap2->execute();

                            $conn->commit();
                            echo json_encode(["success" => true, "message" => "Step number swapped successfully."]);
                            return;
                        } catch (Exception $e) {
                            $conn->rollBack();
                            // Untuk debugging, tambahkan pesan error
                            echo json_encode(["success" => false, "message" => "Failed to swap step numbers. " . $e->getMessage()]);
                            return;
                        }
                    } else {
                        // Tidak ada konflik, set step_number baru
                        $updateData['step_number'] = $new_step_number;
                    }
                }
            }

            if(isset($data['step_title']) && !empty(trim($data['step_title']))){
                $updateData['step_title'] = $data['step_title'];
            }
            if(isset($data['step_description']) && !empty(trim($data['step_description']))){
                $updateData['step_description'] = $data['step_description'];
            }

            // Tangani unggahan ikon langkah jika ada
            if(isset($_FILES['step_icon']) && $_FILES['step_icon']['error'] == 0){
                // Dapatkan data langkah untuk menghapus ikon lama
                $step = $this->model->getById($id)->fetch(PDO::FETCH_ASSOC);
                if($step && $step['step_icon']){
                    // Parse URL untuk mendapatkan path relatif
                    $parsedUrl = parse_url($step['step_icon']);
                    $iconPath = __DIR__ . '/../' . ltrim($parsedUrl['path'], '/');
                    if(file_exists($iconPath)){
                        unlink($iconPath);
                    }
                }

                $upload = $this->uploadIcon($_FILES['step_icon']);
                if($upload['success']){
                    $updateData['step_icon'] = $upload['file_path'];
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
                // Setelah update, periksa apakah perlu mengurutkan ulang step_number
                $this->reorderStepNumbers();
                echo json_encode(["success" => true, "message" => "Step updated successfully."]);
            } else {
                echo json_encode(["success" => false, "message" => "Failed to update step."]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Invalid request method."]);
        }
    }

    // Menghapus langkah berdasarkan ID
    public function delete($id){
        try {
            // Dapatkan data langkah untuk menghapus ikon jika ada
            $step = $this->model->getById($id)->fetch(PDO::FETCH_ASSOC);
            if($step && $step['step_icon']){
                // Parse URL untuk mendapatkan path relatif
                $parsedUrl = parse_url($step['step_icon']);
                $iconPath = __DIR__ . '/../' . ltrim($parsedUrl['path'], '/');
                if(file_exists($iconPath)){
                    unlink($iconPath);
                }
            }

            if($this->model->delete($id)){
                // Setelah delete, urutkan ulang step_number
                $this->reorderStepNumbers();
                echo json_encode(["success" => true, "message" => "Step deleted successfully."]);
            } else {
                echo json_encode(["success" => false, "message" => "Failed to delete step."]);
            }
        } catch (Exception $e) {
            echo json_encode(["success" => false, "message" => "An error occurred while deleting the step."]);
        }
    }

    // Fungsi untuk mengunggah ikon langkah
    private function uploadIcon($file){
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
        $uniqueFileName = uniqid('step_', true) . "." . $imageFileType;
        $finalPath = $targetDir . $uniqueFileName;

        if (move_uploaded_file($file["tmp_name"], $finalPath)) {
            // Mendapatkan base URL
            $baseUrl = $this->getBaseUrl();

            // Kembalikan URL absolut untuk disimpan di database
            return ["success" => true, "file_path" => $baseUrl . 'uploads/step_icons/' . $uniqueFileName];
        } else {
            return ["success" => false, "message" => "Sorry, there was an error uploading your file."];
        }
    }

    // Fungsi untuk menemukan step_number yang kosong (smallest positive integer not used)
    private function findNextAvailableStepNumber(){
        $conn = $this->model->getConnection();
        $table = $this->model->getTable();
        $query = "SELECT step_number FROM {$table} ORDER BY step_number ASC";
        $stmt = $conn->prepare($query);
        $stmt->execute();
        $step_numbers = $stmt->fetchAll(PDO::FETCH_COLUMN, 0);

        $next_number = 1;
        foreach($step_numbers as $number){
            if($number == $next_number){
                $next_number++;
            } else if($number > $next_number){
                break;
            }
        }
        return $next_number;
    }

    // Fungsi untuk mendapatkan langkah berdasarkan step_number
    private function getStepByNumber($step_number){
        $conn = $this->model->getConnection();
        $table = $this->model->getTable();
        $query = "SELECT * FROM {$table} WHERE step_number = :step_number LIMIT 1";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(":step_number", $step_number, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Fungsi untuk menggeser step_number ke atas (+1) mulai dari step_number tertentu
    private function shiftStepNumbers($from_step_number){
        $conn = $this->model->getConnection();
        $table = $this->model->getTable();

        try {
            $conn->beginTransaction();

            // Update semua langkah dengan step_number >= from_step_number, naikkan step_number +1
            // Menggunakan ORDER BY step_number DESC untuk mencegah konflik
            $query = "UPDATE {$table} SET step_number = step_number + 1 WHERE step_number >= :from_step_number ORDER BY step_number DESC";
            $stmt = $conn->prepare($query);
            $stmt->bindParam(":from_step_number", $from_step_number, PDO::PARAM_INT);
            $stmt->execute();

            $conn->commit();
        } catch (Exception $e) {
            $conn->rollBack();
            // Untuk debugging, Anda dapat menambahkan log error
            // error_log($e->getMessage());
        }
    }

    // Fungsi untuk mengurutkan ulang step_number agar gapless
    private function reorderStepNumbers(){
        $conn = $this->model->getConnection();
        $table = $this->model->getTable();

        try {
            $conn->beginTransaction();

            // Ambil semua langkah diurutkan berdasarkan step_number
            $query = "SELECT * FROM {$table} ORDER BY step_number ASC";
            $stmt = $conn->prepare($query);
            $stmt->execute();
            $steps = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Atur ulang step_number mulai dari 1
            $new_step_number = 1;
            foreach($steps as $step){
                if($step['step_number'] != $new_step_number){
                    $update_query = "UPDATE {$table} SET step_number = :new_step_number WHERE step_id = :step_id";
                    $update_stmt = $conn->prepare($update_query);
                    $update_stmt->bindParam(":new_step_number", $new_step_number, PDO::PARAM_INT);
                    $update_stmt->bindParam(":step_id", $step['step_id'], PDO::PARAM_INT);
                    $update_stmt->execute();
                }
                $new_step_number++;
            }

            $conn->commit();
        } catch (Exception $e) {
            $conn->rollBack();
            // Log error jika diperlukan
            // error_log($e->getMessage());
        }
    }
}
?>
