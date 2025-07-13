const pool = require('../models/db');

/**
 * Obtener todos los productos registrados.
 */
const obtenerProductos = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM productos ORDER BY id ASC');
    res.json(rows);
  } catch (error) {
    console.error('❌ Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

/**
 * Agregar un nuevo producto.
 * Requiere campos: nombre, detalle, categoria, precio, imagen (URL).
 */
const agregarProducto = async (req, res) => {
  try {
    const { nombre, categoria, precio, detalle, imagen } = req.body;

    const precioNumerico = parseFloat(precio);

    const query = `
      INSERT INTO productos (nombre, detalle, categoria, precio, imagen)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`;
    const values = [nombre, detalle, categoria, precioNumerico, imagen];

    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('❌ Error al agregar producto:', error);
    res.status(500).json({ error: 'Error al agregar producto' });
  }
};

/**
 * Actualizar un producto existente.
 */
const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, categoria, precio, detalle, imagen } = req.body;

    const precioNumerico = parseFloat(precio);

    const query = `
      UPDATE productos
      SET nombre = $1, detalle = $2, categoria = $3, precio = $4, imagen = $5
      WHERE id = $6
      RETURNING *`;
    const values = [nombre, detalle, categoria, precioNumerico, imagen, id];

    const { rows } = await pool.query(query, values);
    res.json(rows[0]);
  } catch (error) {
    console.error('❌ Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};

/**
 * Eliminar un producto por ID.
 */
const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    // Nota: ya no se borra imagen local, pues usamos Cloudinary
    const { rowCount } = await pool.query('DELETE FROM productos WHERE id = $1', [id]);
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
};

module.exports = {
  obtenerProductos,
  agregarProducto,
  actualizarProducto,
  eliminarProducto
};