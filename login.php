<?php
include("db.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $loginId = $_POST['loginId'];
    $loginContraseña = $_POST['loginContraseña'];

    // Validar entrada
    if (empty($loginId) || empty($loginContraseña)) {
        echo "error: Todos los campos son obligatorios";
        exit;
    }

    // Modificación: Buscar por email, DNI o ID estudiantil
    $query = $mysqli->prepare("SELECT * FROM usuarios WHERE email = ? OR dni = ? OR idEstudiantil = ?");
    $query->bind_param("sss", $loginId, $loginId, $loginId);
    $query->execute();
    $result = $query->get_result();

    if ($result->num_rows > 0) {
        $usuario = $result->fetch_assoc();
        if (password_verify($loginContraseña, $usuario['contraseña'])) {
            // Devolver información adicional para mostrar después del login
            echo "exito:" . $usuario['idEstudiantil'] . ":" . $usuario['nombre'] . " " . $usuario['apellidoPaterno'];
        } else {
            echo "error: Contraseña incorrecta";
        }
    } else {
        echo "error: Usuario no encontrado";
    }

    $mysqli->close();
}
?>