// controllers/feedbackController.js
const pool = require('../models/db');

/**
 *Registra el feedback de un cliente hacia una profesional del staff.
 * Se guarda like, dislike, comentario y calificación con estrellas.
 */
const registrarFeedback = async (req, res) => {
  try {
    const { cliente_id, staff_id, like, dislike, comentario, estrellas } = req.body;

    const result = await pool.query(
      `INSERT INTO feedback_staff (cliente_id, staff_id, "like", "dislike", comentario, estrellas)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [cliente_id, staff_id, like, dislike, comentario, estrellas]
    );

    res.status(201).json({ mensaje: 'Feedback registrado', feedback: result.rows[0] });
  } catch (error) {
    console.error('❌ Error al guardar feedback:', error);
    res.status(500).json({ error: 'Error al guardar feedback' });
  }
};

/**
 *Devuelve la cantidad de likes totales que ha recibido cada profesional del staff.
 */
const obtenerLikesPorProfesional = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT staff_id, COUNT(*) as total_likes
      FROM feedback_staff
      WHERE "like" = true
      GROUP BY staff_id
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error al obtener likes:', error);
    res.status(500).json({ error: 'Error al obtener likes' });
  }
};

/**
 * Devuelve todos los comentarios de clientes hacia cada profesional,
 * incluyendo profesionales que no han recibido comentarios aún.
 */
const obtenerComentariosConDetalles = async (req, res) => {
  try {
    const query = `
      SELECT 
        u_staff.id AS staff_id,
        u_staff.nombre AS staff_nombre,
        u_staff.especialidad,
        u_staff.imagen,
        f.id AS feedback_id,
        f.comentario,
        f.estrellas,
        f."like",
        f."dislike",
        f.fecha,
        u_cliente.nombre AS cliente_nombre,
        u_cliente.email AS cliente_email
      FROM usuarios u_staff
      LEFT JOIN feedback_staff f ON f.staff_id = u_staff.id
      LEFT JOIN usuarios u_cliente ON f.cliente_id = u_cliente.id
      WHERE u_staff.rol = 'staff'
      ORDER BY u_staff.id, f.fecha DESC
    `;

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error('❌ Error al obtener comentarios con detalles:', error);
    res.status(500).json({ error: 'Error al obtener comentarios con detalles' });
  }
};

/**
 * Obtiene todos los registros de feedback asociados a un profesional específico.
 */
const obtenerFeedbackPorStaff = async (req, res) => {
  const { staff_id } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM feedback_staff WHERE staff_id = $1`,
      [staff_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error al obtener feedback:', error);
    res.status(500).json({ error: 'Error al obtener feedback' });
  }
};

// Exportación de funciones para uso en rutas
module.exports = {
  registrarFeedback,
  obtenerLikesPorProfesional,
  obtenerComentariosConDetalles,
  obtenerFeedbackPorStaff
};