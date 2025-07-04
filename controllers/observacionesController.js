// controllers/observacionesController.js
const pool = require('../models/db');

/**
 * Crear una observación nueva dirigida a una profesional del staff.
 * Se guarda con el ID del administrador, ID del staff y el mensaje.
 */
const crearObservacion = async (req, res) => {
  const { staff_id, admin_id, mensaje } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO observaciones_staff (staff_id, admin_id, mensaje)
       VALUES ($1, $2, $3) RETURNING *`,
      [staff_id, admin_id, mensaje]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error al crear observación:', error);
    res.status(500).json({ error: 'Error al crear observación' });
  }
};

/**
 * Obtener todas las observaciones registradas para una profesional específica del staff.
 * Ordenadas por fecha descendente.
 */
const obtenerObservacionesPorStaff = async (req, res) => {
  const { staff_id } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM observaciones_staff
       WHERE staff_id = $1
       ORDER BY fecha DESC`,
      [staff_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error al obtener observaciones:', error);
    res.status(500).json({ error: 'Error al obtener observaciones' });
  }
};

/**
 * Marcar una observación como "Leído" al ser visualizada por la profesional.
 */
const marcarComoLeido = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(
      `UPDATE observaciones_staff SET estado = 'Leído' WHERE id = $1`,
      [id]
    );
    res.json({ mensaje: 'Estado actualizado a Leído' });
  } catch (error) {
    console.error('❌ Error al actualizar estado:', error);
    res.status(500).json({ error: 'Error al actualizar estado' });
  }
};

/**
 * Eliminar una observación específica.
 */
const eliminarObservacion = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(
      `DELETE FROM observaciones_staff WHERE id = $1`,
      [id]
    );
    res.json({ mensaje: 'Observación eliminada' });
  } catch (error) {
    console.error('❌ Error al eliminar observación:', error);
    res.status(500).json({ error: 'Error al eliminar observación' });
  }
};

/**
 * Editar el contenido del mensaje de una observación específica.
 */
const editarObservacion = async (req, res) => {
  const { id } = req.params;
  const { mensaje } = req.body;
  try {
    await pool.query(
      `UPDATE observaciones_staff SET mensaje = $1 WHERE id = $2`,
      [mensaje, id]
    );
    res.json({ mensaje: 'Observación actualizada' });
  } catch (error) {
    console.error('❌ Error al editar observación:', error);
    res.status(500).json({ error: 'Error al editar observación' });
  }
};

// Exportar todas las funciones del controlador
module.exports = {
  crearObservacion,
  obtenerObservacionesPorStaff,
  marcarComoLeido,
  eliminarObservacion,
  editarObservacion
};