<?php
include("db.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $idEstudiantil = $_POST['idEstudiantil'];
    $nivel = $_POST['nivel'];
    $grado = $_POST['grado'];
    $seccion = $_POST['seccion'];
    $codigoPago = $_POST['codigoPago'] ?? ''; // Nuevo parámetro para código de pago

    // Validar entrada
    if (empty($idEstudiantil) || empty($nivel) || empty($grado) || empty($seccion)) {
        echo "error: Todos los campos son obligatorios";
        exit;
    }

    // Verificar si el estudiante ya está matriculado en la tabla 'matriculas'
    $checkMatricula = $mysqli->prepare("SELECT * FROM matriculas WHERE idEstudiantil = ? AND nivel = ? AND grado = ? AND seccion = ?");
    $checkMatricula->bind_param("ssss", $idEstudiantil, $nivel, $grado, $seccion);
    $checkMatricula->execute();
    $resultMatricula = $checkMatricula->get_result();

    if ($resultMatricula->num_rows > 0) {
        echo "error: El estudiante ya está matriculado";
        exit;
    }

    // Consultar vacantes en la tabla 'matricula'
    $query = $mysqli->prepare("SELECT vacantes FROM matricula WHERE nivel = ? AND grado = ? AND seccion = ?");
    $query->bind_param("sss", $nivel, $grado, $seccion);
    $query->execute();
    $result = $query->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        if ($row['vacantes'] > 0) {
            // Iniciar transacción para asegurar consistencia
            $mysqli->begin_transaction();

            try {
                // Reducir vacantes en la tabla 'matricula'
                $vacantesRestantes = $row['vacantes'] - 1;
                $updateQuery = $mysqli->prepare("UPDATE matricula SET vacantes = ? WHERE nivel = ? AND grado = ? AND seccion = ?");
                $updateQuery->bind_param("isss", $vacantesRestantes, $nivel, $grado, $seccion);

                // Registrar matrícula del estudiante en la tabla 'matriculas'
                $matriculaQuery = $mysqli->prepare("INSERT INTO matriculas (idEstudiantil, nivel, grado, seccion) VALUES (?, ?, ?, ?)");
                $matriculaQuery->bind_param("ssss", $idEstudiantil, $nivel, $grado, $seccion);

                // Registrar código de pago en la tabla 'pagos'
                $pagoQuery = $mysqli->prepare("INSERT INTO pagos (codigo_pago, estado, idEstudiantil) VALUES (?, 'pendiente', ?)");
                $pagoQuery->bind_param("ss", $codigoPago, $idEstudiantil);

                // Ejecutar todas las consultas
                if ($updateQuery->execute() && $matriculaQuery->execute() && $pagoQuery->execute()) {
                    // Confirmar transacción
                    $mysqli->commit();
                    echo "exito:" . $idEstudiantil . ":" . $nivel . ":" . $grado . ":" . $seccion . ":" . $vacantesRestantes;
                } else {
                    throw new Exception("Error al procesar la matrícula");
                }
            } catch (Exception $e) {
                // Revertir transacción en caso de error
                $mysqli->rollback();
                echo "error: " . $e->getMessage();
            }
        } else {
            echo "error: No hay vacantes disponibles";
        }
    } else {
        echo "error: Sección no encontrada";
    }

    // Cerrar la conexión
    $mysqli->close();
}
?>