<?php
session_start();  // Mulai session

// Hapus semua data session
session_unset();

// Hancurkan session
session_destroy();

// Arahkan kembali ke halaman login
header("Location: /page/signin/signin.html");
exit;
?>