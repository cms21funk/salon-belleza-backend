import pool from '../models/db.js';

// Crear observación
export const crearObservacion = async (req, res) => {
  try {
    const { staff_id, admin_id, mensaje, estado } = req.body;
    const fecha = new Date();

    const result = await pool.query(
      'INSERT INTO observaciones_staff (staff_id, admin_id, mensaje, fecha, estado) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [staff_id, admin_id, mensaje, fecha, estado]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear observación:', error);
    res.status(500).json({ error: 'Error al crear la observación' });
  }
};

// Obtener observaciones por profesional
export const obtenerObservacionesPorStaff = async (req, res) => {
  const { staff_id } = req.params;
  try {
    const result = await pool.query(
      'SELECT id, mensaje, fecha, estado FROM observaciones_staff WHERE staff_id = $1 ORDER BY fecha DESC',
      [staff_id]
    );

    if (result.rows.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener observaciones:', error);
    res.status(500).json({ error: 'Error al obtener observaciones' });
  }
};

// Marcar como leído
export const marcarComoLeido = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('UPDATE observaciones_staff SET estado = $1 WHERE id = $2', ['Leído', id]);
    res.status(200).json({ mensaje: 'Observación marcada como leída' });
  } catch (error) {
    console.error('Error al marcar como leído:', error);
    res.status(500).json({ error: 'Error al actualizar el estado' });
  }
};

// Editar observación
export const editarObservacion = async (req, res) => {
  const { id } = req.params;
  const { mensaje } = req.body;

  try {
    await pool.query('UPDATE observaciones_staff SET mensaje = $1 WHERE id = $2', [mensaje, id]);
    res.status(200).json({ mensaje: 'Observación editada correctamente' });
  } catch (error) {
    console.error('Error al editar observación:', error);
    res.status(500).json({ error: 'Error al editar la observación' });
  }
};

// Eliminar observación
export const eliminarObservacion = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM observaciones_staff WHERE id = $1', [id]);
    res.status(200).json({ mensaje: 'Observación eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar observación:', error);
    res.status(500).json({ error: 'Error al eliminar la observación' });
  }
};