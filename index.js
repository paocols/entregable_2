$(document).ready(function () {
    // Datos de vacantes por nivel, grado y sección
    const vacantes = {
        'Primaria': {
            '1': { 'A': 10, 'B': 30, 'C': 30 },
            '2': { 'A': 10, 'B': 29, 'C': 27 },
            '3': { 'A': 10, 'B': 26, 'C': 24 },
            '4': { 'A': 10, 'B': 23, 'C': 21 },
            '5': { 'A': 10, 'B': 21, 'C': 19 },
            '6': { 'A': 10, 'B': 21, 'C': 19 }
        },
        'Secundaria': {
            '1': { 'A': 35, 'B': 36, 'C': 34 },
            '2': { 'A': 33, 'B': 34, 'C': 32 },
            '3': { 'A': 30, 'B': 31, 'C': 29 },
            '4': { 'A': 27, 'B': 28, 'C': 26 },
            '5': { 'A': 25, 'B': 26, 'C': 24 }
        }
    };

    // Función para cambiar de sección
    function mostrarSeccion(seccion) {
        $(".section").hide();  // Ocultar todas las secciones
        $("#" + seccion).show();  // Mostrar la sección seleccionada
    }

    // Validación de correo electrónico
    function validarEmail(email) {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return regex.test(email);
    }

    // Validación de número de teléfono
    function validarTelefono(telefono) {
        const regex = /^[0-9]{9}$/;  // Asumiendo un formato de 9 dígitos
        return regex.test(telefono);
    }

    // Validación de fecha de nacimiento (debe ser una fecha válida)
    function validarFecha(fecha) {
        return !isNaN(Date.parse(fecha));  // Verifica que sea una fecha válida
    }

    // Cargar niveles en el select al cargar la página
    function cargarNiveles() {
        const niveles = Object.keys(vacantes);
        const $nivelSelect = $("#nivel");
        $nivelSelect.empty().append('<option value="">Seleccione un nivel</option>');
        niveles.forEach(nivel => {
            $nivelSelect.append(`<option value="${nivel}">${nivel}</option>`);
        });
    }

    // Cargar grados según el nivel seleccionado
    $("#nivel").on('change', function() {
        const nivelSeleccionado = $(this).val();
        const $gradoSelect = $("#grado");
        const $seccionSelect = $("#seccion");
        const $vacantesInfo = $("#vacantesInfo");

        // Limpiar selects de grado y sección
        $gradoSelect.empty().append('<option value="">Seleccione un grado</option>');
        $seccionSelect.empty().append('<option value="">Seleccione una sección</option>');
        $vacantesInfo.text('');

        if (nivelSeleccionado) {
            // Cargar grados para el nivel seleccionado
            const grados = Object.keys(vacantes[nivelSeleccionado]);
            grados.forEach(grado => {
                $gradoSelect.append(`<option value="${grado}">${grado}</option>`);
            });
        }
    });

    // Continuación de la primera parte...

    // Cargar secciones según el grado seleccionado
    $("#grado").on('change', function() {
        const nivelSeleccionado = $("#nivel").val();
        const gradoSeleccionado = $(this).val();
        const $seccionSelect = $("#seccion");
        const $vacantesInfo = $("#vacantesInfo");

        // Limpiar select de sección y vacantes
        $seccionSelect.empty().append('<option value="">Seleccione una sección</option>');
        $vacantesInfo.text('');

        if (nivelSeleccionado && gradoSeleccionado) {
            // Cargar secciones para el grado seleccionado
            const secciones = Object.keys(vacantes[nivelSeleccionado][gradoSeleccionado]);
            secciones.forEach(seccion => {
                const vacantesDisponibles = vacantes[nivelSeleccionado][gradoSeleccionado][seccion];
                $seccionSelect.append(`<option value="${seccion}">${seccion} (${vacantesDisponibles} vacantes)</option>`);
            });
        }
    });

    // Mostrar información de vacantes al seleccionar una sección
    $("#seccion").on('change', function() {
        const nivelSeleccionado = $("#nivel").val();
        const gradoSeleccionado = $("#grado").val();
        const seccionSeleccionada = $(this).val();
        const $vacantesInfo = $("#vacantesInfo");

        if (nivelSeleccionado && gradoSeleccionado && seccionSeleccionada) {
            const vacantesDisponibles = vacantes[nivelSeleccionado][gradoSeleccionado][seccionSeleccionada];
            $vacantesInfo.text(`Vacantes disponibles: ${vacantesDisponibles}`);
        } else {
            $vacantesInfo.text('');
        }
    });

    // Función para generar código de pago
    function generarCodigoPago() {
        const prefix = 'PAG';
        const randomNumbers = Math.floor(100000 + Math.random() * 900000);
        return `${prefix}-${randomNumbers}`;
    }

    // Manejar el formulario de registro
    // Manejar el formulario de registro
    $("#formRegistro").submit(function (event) {
        event.preventDefault(); // Evitar el envío del formulario tradicional
    
        // Obtener los valores del formulario
        const nombre = $("#nombre").val().trim();
        const apellidoPaterno = $("#apellidoPaterno").val().trim();
        const apellidoMaterno = $("#apellidoMaterno").val().trim();
        const dni = $("#dni").val().trim();
        const fechaNacimiento = $("#fechaNacimiento").val();
        const email = $("#email").val().trim();
        const telefono = $("#telefono").val().trim();
        const contraseña = $("#contraseña").val().trim();
        
        // Validación básica
        if (!nombre || !apellidoPaterno || !apellidoMaterno || !dni || !fechaNacimiento || !email || !telefono || !contraseña) {
            $("#registroErrores").text("Todos los campos son obligatorios.");
            return;
        }
    
        // Validación de email
        if (!validarEmail(email)) {
            $("#registroErrores").text("El correo electrónico no es válido.");
            return;
        }
    
        // Validación de teléfono
        if (!validarTelefono(telefono)) {
            $("#registroErrores").text("El número de teléfono no es válido. Debe tener 9 dígitos.");
            return;
        }
    
        // Validación de fecha de nacimiento
        if (!validarFecha(fechaNacimiento)) {
            $("#registroErrores").text("La fecha de nacimiento no es válida.");
            return;
        }
    
        // Realizar la solicitud AJAX para el registro
        $.ajax({
            url: "registro.php",
            method: "POST",
            data: {
                nombre: nombre,
                apellidoPaterno: apellidoPaterno,
                apellidoMaterno: apellidoMaterno,
                dni: dni,
                fechaNacimiento: fechaNacimiento,
                email: email,
                telefono: telefono,
                contraseña: contraseña
            },
            success: function (response) {
                if (response.startsWith("exito")) {
                    const idEstudiantil = response.split(":")[1];
    
                    // Mostrar alert con ID del estudiante y contraseña
                    alert(`Registro exitoso.\n\nSu ID de estudiante es: ${idEstudiantil}\nContraseña: ${contraseña}`);
    
                    mostrarSeccion("login");
                    $("#registroErrores").html(`
                        <div class="success">
                            Registro exitoso. 
                            <strong>Su ID de estudiante es: ${idEstudiantil}</strong>. 
                            Por favor, inicie sesión.
                        </div>
                    `);
                } else {
                    $("#registroErrores").text(response.replace("error: ", "") || "Hubo un error en el registro.");
                }
            },
            error: function () {
                $("#registroErrores").text("Error al comunicarse con el servidor.");
            }
        });
    });


    // Manejar el formulario de inicio de sesión
    $("#formLogin").submit(function (event) {
        event.preventDefault();

        const loginId = $("#loginId").val().trim();
        const loginContraseña = $("#loginContraseña").val().trim();

        // Validación básica
        if (!loginId || !loginContraseña) {
            $("#loginErrores").text("Todos los campos son obligatorios.");
            return;
        }

        // Realizar la solicitud AJAX para verificar el login
        $.ajax({
            url: "login.php",
            method: "POST",
            data: {
                loginId: loginId,
                loginContraseña: loginContraseña
            },
            success: function (response) {
                if (response.startsWith("exito")) {
                    // Separar ID estudiantil y nombre
                    const [, idEstudiantil, nombreUsuario] = response.split(":");
                    
                    // Almacenar datos en sessionStorage
                    sessionStorage.setItem('idEstudiantil', idEstudiantil);
                    sessionStorage.setItem('nombreUsuario', nombreUsuario);

                    mostrarSeccion("seleccion");
                } else {
                    $("#loginErrores").text(response.replace("error: ", "") || "ID de usuario o contraseña incorrectos.");
                }
            },
            error: function () {
                $("#loginErrores").text("Error al comunicarse con el servidor.");
            }
        });
    });

    // Manejar el formulario de selección de matrícula
    $("#formSeleccion").submit(function (event) {
        event.preventDefault();

        const nivel = $("#nivel").val().trim();
        const grado = $("#grado").val().trim();
        const seccion = $("#seccion").val().trim();
        const idEstudiantil = sessionStorage.getItem('idEstudiantil');

        // Validación básica
        if (!nivel || !grado || !seccion) {
            $("#seleccionErrores").text("Todos los campos son obligatorios.");
            return;
        }

        // Verificar disponibilidad de vacantes
        const vacantesDisponibles = vacantes[nivel][grado][seccion];
        if (vacantesDisponibles <= 0) {
            $("#seleccionErrores").text("Lo siento, no hay vacantes disponibles en esta sección.");
            return;
        }

        // Generar código de pago
        const codigoPago = generarCodigoPago();

        // Realizar la solicitud AJAX para la selección
        $.ajax({
            url: "seleccion.php",
            method: "POST",
            data: {
                idEstudiantil: idEstudiantil,
                nivel: nivel,
                grado: grado,
                seccion: seccion,
                codigoPago: codigoPago
            },
            success: function (response) {
                if (response.startsWith("exito")) {
                    // Separar los diferentes componentes de la respuesta
                    const [, idEstudiantil, nivel, grado, seccion, vacantesRestantes] = response.split(":");

                    // Reducir vacantes
                    vacantes[nivel][grado][seccion] = parseInt(vacantesRestantes);

                    mostrarSeccion("verificacionPago");
                    $("#instruccionesPago").html(`
                        Detalles de la matrícula:<br>
                        ID Estudiante: ${idEstudiantil}<br>
                        Nivel: ${nivel}<br>
                        Grado: ${grado}<br>
                        Sección: ${seccion}<br>
                        Vacantes restantes: ${vacantesRestantes}<br>
                        <strong>Código de Pago: ${codigoPago}</strong><br>
                        <p class="text-info">Por favor, guarde este código para la verificación de pago.</p>
                    `);

                    // Almacenar código de pago en sessionStorage
                    sessionStorage.setItem('codigoPago', codigoPago);
                } else {
                    $("#seleccionErrores").text(response.replace("error: ", "") || "Hubo un error al procesar la selección.");
                }
            },
            error: function () {
                $("#seleccionErrores").text("Error al comunicarse con el servidor.");
            }
        });
    });

    // Manejar el formulario de verificación de pago
    $("#pagoVerificacion").submit(function (event) {
        event.preventDefault();

        const codigoPago = $("#codigoPago").val().trim();

        if (!codigoPago) {
            $("#pagoErrores").text("Por favor ingresa el código de pago.");
            return;
        }

        // Verificar el código de pago con AJAX
        $.ajax({
            url: "verificar_pago.php",
            method: "POST",
            data: {
                codigoPago: codigoPago
            },
            success: function (response) {
                if (response === "pago_confirmado") {
                    mostrarSeccion("confirmacionMatricula");
                    $("#detallesMatricula").text("¡Tu matrícula ha sido completada con éxito!");
                } else {
                    $("#pagoErrores").text(response.replace("error: ", "") || "Código de pago inválido o expirado.");
                }
            },
            error: function () {
                $("#pagoErrores").text("Error al comunicarse con el servidor.");
            }
        });
    });

    // Mostrar ID estudiantil en la sección de selección
    const idEstudiantil = sessionStorage.getItem('idEstudiantil');
    const nombreUsuario = sessionStorage.getItem('nombreUsuario');
    
    if (idEstudiantil && nombreUsuario) {
        $("#idEstudiantilText").text(idEstudiantil);
        $("#idEstudiantilDisplay").show();
        
        // Personalizar bienvenida
        $("#seleccion h2").append(` - Bienvenido, ${nombreUsuario}`);
    }

    // Cargar niveles al inicio
    cargarNiveles();

    // Mostrar la sección de registro inicialmente
    mostrarSeccion("registro");
});