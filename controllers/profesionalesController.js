// controllers/profesionalesController.js
const pool = require('../models/db.js');

/**
 * Obtener todos los profesionales desde la tabla USUARIOS.
 * Incluye tanto 'admin' como 'staff'.
 */
const obtenerProfesionales = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, nombre, email, rol, especialidad, genero, comuna, imagen
       FROM usuarios 
       WHERE rol = 'admin' OR rol = 'staff'
       ORDER BY id DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error('❌ Error al obtener profesionales desde usuarios:', error);
    res.status(500).json({ error: 'Error al obtener los profesionales' });
  }
};

/* 
* Las siguientes funciones pertenecen a la antigua tabla "profesionales".
* Mantenlas solo si aún usas esta tabla para fines visuales o pruebas locales.
*/

/**
 * Obtener profesional desde tabla antigua "profesionales" por ID.
 */
const obtenerProfesionalPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM profesionales WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Profesional no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('❌ Error al obtener profesional:', error);
    res.status(500).json({ error: 'Error al obtener el profesional' });
  }
};

/**
 * Crear profesional en tabla antigua "profesionales".
 */
const crearProfesional = async (req, res) => {
  try {
    const { nombre, rol, imagen, likes, dislikes } = req.body;
    const query = `
      INSERT INTO profesionales (nombre, rol, imagen, likes, dislikes)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`;
    const values = [nombre, rol, imagen, likes, dislikes];
    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('❌ Error al crear profesional:', error);
    res.status(500).json({ error: 'Error al crear el profesional' });
  }
};

/**
 * Actualizar profesional en tabla antigua "profesionales".
 */
const actualizarProfesional = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, rol, imagen, likes, dislikes } = req.body;
    const query = `
      UPDATE profesionales 
      SET nombre=$1, rol=$2, imagen=$3, likes=$4, dislikes=$5 
      WHERE id=$6 RETURNING *`;
    const values = [nombre, rol, imagen, likes, dislikes, id];
    const { rows } = await pool.query(query, values);
    if (rows.length === 0) return res.status(404).json({ error: 'Profesional no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    console.error('❌ Error al actualizar profesional:', error);
    res.status(500).json({ error: 'Error al actualizar el profesional' });
  }
};

/**
 * Eliminar profesional desde tabla antigua "profesionales".
 */
const eliminarProfesional = async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query('DELETE FROM profesionales WHERE id=$1', [id]);
    if (rowCount === 0) return res.status(404).json({ error: 'Profesional no encontrado' });
    res.json({ mensaje: 'Profesional eliminado correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar profesional:', error);
    res.status(500).json({ error: 'Error al eliminar el profesional' });
  }
};

// Exportación de funciones
module.exports = {
  obtenerProfesionales,
  obtenerProfesionalPorId,
  crearProfesional,
  actualizarProfesional,
  eliminarProfesional,
};