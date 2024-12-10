<?php
session_start();
if (!isset($_SESSION['user'])) {
    header('Location: ../signin/signin.html');
    exit();
}

$user = $_SESSION['user'];
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
</head>

<body>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="#">Almeraa Laundry</a>
        <div class="ml-auto">
            <img src="../images/profiles/<?php echo $user['profile_image']; ?>" alt="Profile" class="rounded-circle"
                style="width: 40px; height: 40px;">
            <span class="ml-2"><?php echo $user['name']; ?></span>
        </div>
    </nav>

    <div class="container mt-5">
        <h1>Welcome, <?php echo $user['name']; ?>!</h1>
    </div>
</body>

</html>