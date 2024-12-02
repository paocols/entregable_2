-- Tabla de matrícula (configuración de vacantes)
CREATE TABLE matricula (
    nivel VARCHAR(20) NOT NULL,
    grado VARCHAR(2) NOT NULL,
    seccion VARCHAR(1) NOT NULL,
    vacantes INT NOT NULL,
    PRIMARY KEY (nivel, grado, seccion)
);
-- Tabla de usuarios
CREATE TABLE usuarios (
    idEstudiantil VARCHAR(9) PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellidoPaterno VARCHAR(50) NOT NULL,
    apellidoMaterno VARCHAR(50) NOT NULL,
    dni VARCHAR(8) UNIQUE NOT NULL,
    fechaNacimiento DATE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(9) NOT NULL,
    contraseña VARCHAR(255) NOT NULL
);
-- Tabla de pagos
CREATE TABLE pagos (
    codigo_pago VARCHAR(20) PRIMARY KEY,
    idEstudiantil VARCHAR(9),
    monto DECIMAL(10,2) NOT NULL,
    estado ENUM('pendiente', 'confirmado') DEFAULT 'pendiente',
    fecha_generacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idEstudiantil) REFERENCES usuarios(idEstudiantil)
);
-- Tabla de matriculaciones de estudiantes
CREATE TABLE matriculas (
    idEstudiantil VARCHAR(9),
    nivel VARCHAR(20) NOT NULL,
    grado VARCHAR(2) NOT NULL,
    seccion VARCHAR(1) NOT NULL,
    fecha_matricula TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idEstudiantil) REFERENCES usuarios(idEstudiantil)
);
-- Insertar nivel, grado, seccion y vacantes a tabla "matricula"
INSERT INTO matricula (nivel, grado, seccion, vacantes) VALUES 
 ('Primaria', '1', 'A', 10),
('Primaria', '1', 'B', 30),
('Primaria', '1', 'C', 30),
 ('Primaria', '2', 'A', 10),
 ('Primaria', '2', 'B', 29),
 ('Primaria', '2', 'C', 27),
 ('Primaria', '3', 'A', 10),
 ('Primaria', '3', 'B', 26),
 ('Primaria', '3', 'C', 24),
 ('Primaria', '4', 'A', 10),
 ('Primaria', '4', 'B', 23),
 ('Primaria', '4', 'C', 21),
 ('Primaria', '5', 'A', 10),
 ('Primaria', '5', 'B', 21),
 ('Primaria', '5', 'C', 19),
 ('Primaria', '6', 'A', 10),
 ('Primaria', '6', 'B', 21),
 ('Primaria', '6', 'C', 19),
 ('Secundaria', '1', 'A', 35),
 ('Secundaria', '1', 'B', 36),
 ('Secundaria', '1', 'C', 34),
 ('Secundaria', '2', 'A', 33),
 ('Secundaria', '2', 'B', 34),
 ('Secundaria', '2', 'C', 32),
 ('Secundaria', '3', 'A', 30),
 ('Secundaria', '3', 'B', 31),
 ('Secundaria', '3', 'C', 29),
 ('Secundaria', '4', 'A', 27),
 ('Secundaria', '4', 'B', 28),
 ('Secundaria', '4', 'C', 26),
 ('Secundaria', '5', 'A', 25),
 ('Secundaria', '5', 'B', 26),
 ('Secundaria', '5', 'C', 24);
