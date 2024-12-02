<?php
include("db.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Collect user registration data
    $nombre = $_POST['nombre'] ?? '';
    $apellidoPaterno = $_POST['apellidoPaterno'] ?? '';
    $apellidoMaterno = $_POST['apellidoMaterno'] ?? '';
    $dni = $_POST['dni'] ?? '';
    $fechaNacimiento = $_POST['fechaNacimiento'] ?? '';
    $email = $_POST['email'] ?? '';
    $telefono = $_POST['telefono'] ?? '';
    $contraseña = $_POST['contraseña'] ?? '';

    // Validate input
    if (empty($nombre) || empty($apellidoPaterno) || empty($apellidoMaterno) || 
        empty($dni) || empty($fechaNacimiento) || empty($email) || 
        empty($telefono) || empty($contraseña)) {
        echo "error: Todos los campos son obligatorios";
        exit;
    }

    // Check if email or DNI already exists
    $checkUser = $mysqli->prepare("SELECT * FROM usuarios WHERE email = ? OR dni = ?");
    $checkUser->bind_param("ss", $email, $dni);
    $checkUser->execute();
    $resultUser = $checkUser->get_result();

    if ($resultUser->num_rows > 0) {
        echo "error: El correo electrónico o DNI ya están registrados";
        exit;
    }

    // Hash the password (use password_hash for security)
    $hashedPassword = password_hash($contraseña, PASSWORD_DEFAULT);

    // Generate a unique student ID (you might want to implement a more sophisticated method)
    $idEstudiantil = 'EST' . str_pad(mt_rand(1, 99999), 5, '0', STR_PAD_LEFT);

    // Insert user into database
    $insertQuery = $mysqli->prepare("INSERT INTO usuarios (idEstudiantil, nombre, apellidoPaterno, apellidoMaterno, dni, fechaNacimiento, email, telefono, contraseña) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $insertQuery->bind_param("sssssssss", $idEstudiantil, $nombre, $apellidoPaterno, $apellidoMaterno, $dni, $fechaNacimiento, $email, $telefono, $hashedPassword);

    if ($insertQuery->execute()) {
        // Return success with generated student ID
        echo "exito:" . $idEstudiantil;
    } else {
        echo "error: No se pudo completar el registro";
    }

    // Close connections
    $insertQuery->close();
    $checkUser->close();
    $mysqli->close();
}
?>