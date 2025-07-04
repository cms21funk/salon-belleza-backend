// controllers/likeTrabajoController.js

const pool = require('../models/db');

/**
 * Dar o quitar "like" a un trabajo (servicio realizado por una profesional).
 * Si ya existe el like para ese cliente y servicio, lo elimina.
 * Si no existe, lo inserta con los datos completos.
 */
const toggleLikeTrabajo = async (req, res) => {
  const { cliente_id, staff_id, servicio_id, cliente_nombre, staff_nombre, servicio_nombre } = req.body;

  try {
    // Verifica si el cliente ya dio like a ese servicio
    const existe = await pool.query(
      `SELECT * FROM likes_trabajos WHERE cliente_id = $1 AND servicio_id = $2`,
      [cliente_id, servicio_id]
    );

    if (existe.rows.length > 0) {
      // Si ya existe, eliminar (quitar like)
      await pool.query(
        `DELETE FROM likes_trabajos WHERE cliente_id = $1 AND servicio_id = $2`,
        [cliente_id, servicio_id]
      );
      return res.json({ mensaje: 'Like eliminado' });
    } else {
      // Si no existe, insertar nuevo like
      const result = await pool.query(
        `INSERT INTO likes_trabajos 
         (cliente_id, cliente_nombre, staff_id, staff_nombre, servicio_id, servicio_nombre)
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING *`,
        [cliente_id, cliente_nombre, staff_id, staff_nombre, servicio_id, servicio_nombre]
      );
      return res.status(201).json(result.rows[0]);
    }
  } catch (error) {
    console.error('❌ Error al procesar like de trabajo:', error);
    res.status(500).json({ error: 'Error al procesar like de trabajo' });
  }
};

/**
 *Obtiene la cantidad de likes agrupados por tipo de servicio que ha realizado una profesional (staff).
 * Esto permite visualizar qué tipos de servicios son más populares según los likes.
 */
const obtenerLikesPorStaff = async (req, res) => {
  const { staff_id } = req.params;

  try {
    const result = await pool.query(
      `SELECT s.tipo, COUNT(*) as total_likes
       FROM likes_trabajos l
       JOIN servicios s ON l.servicio_id = s.id
       WHERE l.staff_id = $1
       GROUP BY s.tipo`,
      [staff_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error al obtener likes por trabajo:', error);
    res.status(500).json({ error: 'Error al obtener likes por trabajo' });
  }
};

// Exportación de funciones
module.exports = {
  toggleLikeTrabajo,
  obtenerLikesPorStaff
};