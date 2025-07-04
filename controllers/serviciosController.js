// controllers/serviciosController.js
const pool = require('../models/db');

/**
 * Obtener todos los servicios disponibles
 * Incluye datos del profesional asociado a cada servicio.
 */
const obtenerServicios = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT s.*, u.nombre AS nombre_profesional
      FROM servicios s
      JOIN usuarios u ON s.staff_id = u.id
    `);
    res.json(rows);
  } catch (error) {
    console.error('❌ Error al obtener servicios:', error);
    res.status(500).json({ error: 'Error al obtener servicios' });
  }
};

/**
 * Crear un nuevo servicio
 * Requiere datos completos del servicio + imagen + profesional asignado.
 */
const crearServicio = async (req, res) => {
  try {
    const { servicio, tipo, detalle, precio, staff_id } = req.body;
    const imagen = req.file ? req.file.filename : null;

    const query = `
      INSERT INTO servicios (servicio, tipo, detalle, precio, imagen, staff_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [servicio, tipo, detalle, precio, imagen, staff_id];
    const { rows } = await pool.query(query, values);

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('❌ Error al crear servicio:', error);
    res.status(500).json({ error: 'Error al crear servicio' });
  }
};

/**
 * Actualizar un servicio existente
 * Soporta actualización de imagen (si se carga una nueva).
 */
const actualizarServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const { servicio, tipo, detalle, precio, staff_id } = req.body;
    const imagen = req.file ? req.file.filename : null;

    const query = `
      UPDATE servicios SET
        servicio = $1,
        tipo = $2,
        detalle = $3,
        precio = $4,
        imagen = COALESCE($5, imagen),
        staff_id = $6
      WHERE id = $7
      RETURNING *
    `;
    const values = [servicio, tipo, detalle, precio, imagen, staff_id, id];
    const { rows } = await pool.query(query, values);

    res.json(rows[0]);
  } catch (error) {
    console.error('❌ Error al actualizar servicio:', error);
    res.status(500).json({ error: 'Error al actualizar servicio' });
  }
};

/**
 * Eliminar un servicio
 * Elimina de forma permanente un servicio por su ID.
 */
const eliminarServicio = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM servicios WHERE id = $1', [id]);
    res.json({ mensaje: 'Servicio eliminado correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar servicio:', error);
    res.status(500).json({ error: 'Error al eliminar servicio' });
  }
};

//Exportar funciones del controlador
module.exports = {
  obtenerServicios,
  crearServicio,
  actualizarServicio,
  eliminarServicio
};