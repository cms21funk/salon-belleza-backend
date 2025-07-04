
-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(20) CHECK (rol IN ('admin', 'staff', 'cliente')) NOT NULL
);

-- Tabla de profesionales
CREATE TABLE IF NOT EXISTS profesionales (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    rol VARCHAR(50) NOT NULL,
    imagen TEXT,
    likes INTEGER DEFAULT 0,
    dislikes INTEGER DEFAULT 0
);

-- Tabla de reservas
CREATE TABLE IF NOT EXISTS reservas (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER REFERENCES usuarios(id),
    profesional_id INTEGER REFERENCES profesionales(id),
    servicio VARCHAR(100),
    fecha DATE,
    hora TIME,
    estado VARCHAR(20) DEFAULT 'pendiente'
);

-- Tabla de comentarios (observaciones)
CREATE TABLE IF NOT EXISTS comentarios (
    id SERIAL PRIMARY KEY,
    profesional_id INTEGER REFERENCES profesionales(id),
    texto TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    leido BOOLEAN DEFAULT FALSE
);
