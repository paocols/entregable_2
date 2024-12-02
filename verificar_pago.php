<?php
include("db.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $codigoPago = $_POST['codigoPago'];

    // Validar entrada
    if (empty($codigoPago)) {
        echo "error: Código de pago es obligatorio";
        exit;
    }

    // Preparar la consulta para verificar el pago
    $query = $mysqli->prepare("SELECT * FROM pagos WHERE codigo_pago = ? AND estado = 'pendiente'");
    $query->bind_param("s", $codigoPago);
    $query->execute();
    $result = $query->get_result();

    if ($result->num_rows > 0) {
        // Iniciar transacción para asegurar consistencia
        $mysqli->begin_transaction();

        try {
            // Actualizar estado del pago a confirmado
            $updateQuery = $mysqli->prepare("UPDATE pagos SET estado = 'confirmado' WHERE codigo_pago = ?");
            $updateQuery->bind_param("s", $codigoPago);
            
            if ($updateQuery->execute()) {
                // Confirmar transacción
                $mysqli->commit();
                echo "pago_confirmado";
            } else {
                throw new Exception("No se pudo confirmar el pago");
            }
        } catch (Exception $e) {
            // Revertir transacción en caso de error
            $mysqli->rollback();
            echo "error: " . $e->getMessage();
        }
    } else {
        echo "error: Código de pago inválido o ya utilizado";
    }

    $mysqli->close();
}
?>