// controllers/likesProductosController.js
const pool = require('../models/db');

/**
 * Dar o quitar "like" a un producto por parte de un cliente.
 * Si ya dio like anteriormente, se elimina (unlike).
 * Si no lo ha hecho, se registra el like.
 */
const toggleLikeProducto = async (req, res) => {
  const {
    cliente_id,
    cliente_nombre,
    producto_id,
    producto_nombre,
    categoria
  } = req.body;

  try {
    // Verificar si ya existe el like
    const existe = await pool.query(
      'SELECT * FROM likes_productos WHERE cliente_id = $1 AND producto_id = $2',
      [cliente_id, producto_id]
    );

    if (existe.rows.length > 0) {
      // Si existe, eliminar el like (unlike)
      await pool.query(
        'DELETE FROM likes_productos WHERE cliente_id = $1 AND producto_id = $2',
        [cliente_id, producto_id]
      );
      return res.json({ mensaje: 'Like eliminado' });
    } else {
      // Si no existe, registrar el like
      const resultado = await pool.query(
        `INSERT INTO likes_productos
         (cliente_id, cliente_nombre, producto_id, producto_nombre, categoria)
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`,
        [cliente_id, cliente_nombre, producto_id, producto_nombre, categoria]
      );
      return res.status(201).json(resultado.rows[0]);
    }
  } catch (error) {
    console.error('❌ Error al hacer toggle de like en producto:', error);
    res.status(500).json({ error: 'Error al procesar like' });
  }
};

/**
 * Obtener los 10 productos más populares por cantidad de likes.
 * Se agrupan por ID y se cuenta la cantidad de likes de cada producto.
 */
const obtenerProductosPopulares = async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT 
        p.id AS producto_id,
        p.nombre AS producto_nombre,
        p.categoria,
        p.imagen,
        COUNT(lp.id) AS total_likes
      FROM likes_productos lp
      JOIN productos p ON lp.producto_id = p.id
      GROUP BY p.id, p.nombre, p.categoria, p.imagen
      ORDER BY total_likes DESC
      LIMIT 10
    `);

    res.json(resultado.rows);
  } catch (error) {
    console.error('❌ Error al obtener productos populares:', error);
    res.status(500).json({ error: 'Error al obtener productos populares' });
  }
};

// Exportación de funciones del controlador
module.exports = {
  toggleLikeProducto,
  obtenerProductosPopulares
};