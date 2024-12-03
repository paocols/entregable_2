<?php
$host = "entregable2.mysql.database.azure.com";
$usuario = "Admi@entregable2";
$contraseña = "entregable.2";  // Por defecto en XAMPP, sin contraseña
$baseDeDatos = "matricula1";

// Añadir más información de depuración
$mysqli = new mysqli($host, $usuario, $contraseña, $baseDeDatos);

// Modo de depuración extendido
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

if ($mysqli->connect_errno) {
    die("Error de conexión (" . $mysqli->connect_errno . "): " 
        . $mysqli->connect_error);
}

// Verificación adicional
if (!$mysqli) {
    die("Conexión fallida: " . mysqli_connect_error());
}

$mysqli->set_charset("utf8mb4");
?>
