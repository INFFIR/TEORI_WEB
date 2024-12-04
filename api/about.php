<?php
// api/about.php
// php -S localhost:8000

require_once __DIR__ . '/../controllers/AboutController.php';

// Set headers untuk CORS dan response JSON
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Tangani metode OPTIONS untuk preflight CORS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    exit(0);
}

// Instantiate controller
$controller = new AboutController();

// Tentukan metode HTTP
$method = $_SERVER['REQUEST_METHOD'];

// Ambil ID dari URL jika ada
$id = isset($_GET['id']) ? intval($_GET['id']) : null;

// Tangani routing berdasarkan metode HTTP
switch($method){
    case 'GET':
        if($id){
            $controller->getById($id);
        } else {
            $controller->getAll();
        }
        break;
    case 'POST':
        // Cek apakah ini aksi update atau create
        if(isset($_POST['action']) && $_POST['action'] === 'update' && $id){
            // Tangani pengiriman form, termasuk upload file untuk update
            $controller->updateWithImage($id);
        } else {
            // Tangani pengiriman form, termasuk upload file untuk create
            $controller->create();
        }
        break;
    case 'PUT':
        // Opsional: Anda bisa menghapus bagian ini atau tetap menggunakannya untuk update tanpa gambar
        // Sebaiknya konsisten menggunakan POST untuk update jika ingin mendukung upload gambar
        if($id){
            parse_str(file_get_contents("php://input"), $put_vars);
            $controller->update($id, $put_vars);
        } else {
            echo json_encode(["message" => "ID is required for update.", "success" => false]);
        }
        break;
    case 'DELETE':
        if($id){
            $controller->delete($id);
        } else {
            echo json_encode(["message" => "ID is required for deletion.", "success" => false]);
        }
        break;
    default:
        echo json_encode(["message" => "Method not allowed.", "success" => false]);
        break;
}
?>
