// controllers/productosController.js
const path = require('path');
const fs = require('fs');
const pool = require('../models/db');

// ===========================
// OBTENER TODOS LOS PRODUCTOS
// ===========================
const obtenerProductos = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM productos ORDER BY id ASC');
    res.json(rows);
  } catch (error) {
    console.error('❌ Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

// ===========================
// AGREGAR PRODUCTO
// ===========================
const agregarProducto = async (req, res) => {
  try {
    // ⚠ Validar que sea admin
    if (req.usuario?.rol !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado. Solo administradores pueden agregar productos.' });
    }

    const { nombre, categoria, precio, detalle } = req.body;
    const imagen = req.file.filename;

    const query = `
      INSERT INTO productos (nombre, detalle, categoria, precio, imagen)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`;
    const values = [nombre, detalle, categoria, precio, imagen];
    const { rows } = await pool.query(query, values);

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('❌ Error al agregar producto:', error);
    res.status(500).json({ error: 'Error al agregar producto' });
  }
};

// ===========================
// ACTUALIZAR PRODUCTO
// ===========================
const actualizarProducto = async (req, res) => {
  try {
    // ⚠ Validar que sea admin
    if (req.usuario?.rol !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado. Solo administradores pueden modificar productos.' });
    }

    const { id } = req.params;
    const { nombre, categoria, precio, detalle } = req.body;
    let imagen = req.body.imagen;

    if (req.file) {
      imagen = req.file.filename;
    }

    const query = `
      UPDATE productos
      SET nombre = $1, detalle = $2, categoria = $3, precio = $4, imagen = $5
      WHERE id = $6
      RETURNING *`;
    const values = [nombre, detalle, categoria, precio, imagen, id];
    const { rows } = await pool.query(query, values);

    res.json(rows[0]);
  } catch (error) {
    console.error('❌ Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};

// ===========================
// ELIMINAR PRODUCTO
// ===========================
const eliminarProducto = async (req, res) => {
  try {
    // ⚠ Validar que sea admin
    if (req.usuario?.rol !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado. Solo administradores pueden eliminar productos.' });
    }

    const { id } = req.params;

    const result = await pool.query(
      'SELECT imagen FROM productos WHERE id = $1',
      [id]
    );

    if (result.rows.length) {
      const imagePath = path.join(__dirname, '../public/images', result.rows[0].imagen);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

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