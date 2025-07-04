// controllers/usuariosController.js
const pool = require('../models/db');
const bcrypt = require('bcrypt');

/**
 * Obtener todos los usuarios
 * Retorna todos los registros desde la tabla `usuarios`.
 */
const obtenerUsuarios = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM usuarios');
    res.json(rows);
  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

/**
 * Actualizar un usuario
 * Permite modificar los datos del usuario, incluyendo imagen y password.
 * Si se proporciona una nueva contraseña, se encripta antes de actualizar.
 */
const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, password, rol, especialidad, genero, comuna } = req.body;
    const imagen = req.file ? req.file.filename : null;

    let passwordEncriptada = null;

    //Si se envía una nueva contraseña, se encripta
    if (password) {
      passwordEncriptada = await bcrypt.hash(password, 10);
    }

    //Armado dinámico del query SQL según si hay o no nueva contraseña
    const query = `
      UPDATE usuarios SET 
        nombre = $1,
        email = $2,
        ${password ? 'password = $3,' : ''} 
        rol = $4,
        especialidad = $5,
        genero = $6,
        comuna = $7,
        imagen = $8
      WHERE id = $9
      RETURNING *
    `;

    const values = password
      ? [nombre, email, passwordEncriptada, rol, especialidad, genero, comuna, imagen, id]
      : [nombre, email, rol, especialidad, genero, comuna, imagen, id];

    const { rows } = await pool.query(query, values);
    res.status(200).json({ mensaje: 'Usuario actualizado', usuario: rows[0] });
  } catch (error) {
    console.error('❌ Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

/**
 * Eliminar un usuario
 * Elimina definitivamente un registro de la tabla `usuarios` por su ID.
 */
const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
    res.status(200).json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};

//Exportación del módulo
module.exports = {
  obtenerUsuarios,
  actualizarUsuario,
  eliminarUsuario
};