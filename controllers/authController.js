import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../models/db.js';

// =======================================
// REGISTRAR CLIENTE
// =======================================
export const registrarCliente = async (req, res) => {
  try {
    const { nombre, email, password, comuna, genero, rol, especialidad } = req.body;
    const passwordEncriptada = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO usuarios (nombre, email, password, comuna, genero, rol) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [nombre, email, passwordEncriptada, comuna, genero, rol || 'cliente']
    );

    res.status(201).json({ mensaje: 'Cliente registrado exitosamente', usuario: result.rows[0] });
  } catch (error) {
    console.error('Error al registrar cliente:', error);
    res.status(500).json({ error: 'Error al registrar cliente' });
  }
};

// =======================================
// REGISTRAR STAFF
// =======================================
export const registrarStaff = async (req, res) => {
  try {
    let imagen = req.body.imagen;

    if (req.file && req.file.path) {
      imagen = `/images/${req.file.filename}`;
    } else if (imagen && imagen.startsWith('https://res.cloudinary.com')) {
      // ✅ usar directamente la URL Cloudinary
    } else {
      imagen = null;
    }

    const { nombre, email, password, comuna, genero, rol, especialidad } = req.body;
    const passwordEncriptada = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO usuarios (nombre, email, password, comuna, genero, rol, especialidad, imagen) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [nombre, email, passwordEncriptada, comuna, genero, rol, especialidad, imagen]
    );

    res.status(201).json({ mensaje: 'Staff registrado exitosamente', usuario: result.rows[0] });
  } catch (error) {
    console.error('Error al registrar staff:', error);
    res.status(500).json({ error: 'Error al registrar staff' });
  }
};

// =======================================
// LOGIN
// =======================================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Correo no registrado' });
    }

    const usuario = result.rows[0];
    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const payload = {
      id: usuario.id,
      rol: usuario.rol,
      nombre: usuario.nombre
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });
    delete usuario.password;

    res.status(200).json({ mensaje: 'Login exitoso', token, usuario });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en login' });
  }
};

// =======================================
// ACTUALIZAR USUARIO
// =======================================
export const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, rol, especialidad, genero, comuna, password } = req.body;
    let imagen = req.body.imagen;

if (imagen && imagen.startsWith('https://res.cloudinary.com')) {
  // se deja tal como está
} else if (req.file && req.file.filename) {
  imagen = `/images/${req.file.filename}`;
} else {
  imagen = null;
}

    let passwordEncriptada = null;
    if (password && password.trim() !== '') {
      passwordEncriptada = await bcrypt.hash(password, 10);
    }

    let campos = [];
    let valores = [];
    let index = 1;

    if (nombre) { campos.push(`nombre = $${index++}`); valores.push(nombre); }
    if (email) { campos.push(`email = $${index++}`); valores.push(email); }
    if (passwordEncriptada) { campos.push(`password = $${index++}`); valores.push(passwordEncriptada); }
    if (rol) { campos.push(`rol = $${index++}`); valores.push(rol); }
    if (especialidad) { campos.push(`especialidad = $${index++}`); valores.push(especialidad); }
    if (genero) { campos.push(`genero = $${index++}`); valores.push(genero); }
    if (comuna) { campos.push(`comuna = $${index++}`); valores.push(comuna); }
    if (imagen) { campos.push(`imagen = $${index++}`); valores.push(imagen); }

    if (campos.length === 0) {
      return res.status(400).json({ error: 'No se enviaron datos para actualizar' });
    }

    const query = `UPDATE usuarios SET ${campos.join(', ')} WHERE id = $${index} RETURNING *`;
    valores.push(id);

    const result = await pool.query(query, valores);
    res.status(200).json({ mensaje: 'Usuario actualizado', usuario: result.rows[0] });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

// =======================================
// ELIMINAR USUARIO
// =======================================
export const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
    res.status(200).json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};