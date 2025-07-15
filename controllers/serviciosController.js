const pool = require('../models/db');
const cloudinary = require('cloudinary').v2;
const fs = require('fs/promises');

// Configura Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const subirACloudinary = async (file) => {
  try {
    const resultado = await cloudinary.uploader.upload(file.path, {
      folder: 'servicios_sary',
    });
    await fs.unlink(file.path); // Borra el archivo temporal
    return resultado.secure_url;
  } catch (error) {
    console.error('❌ Error al subir imagen a Cloudinary:', error.message);
    throw new Error('No se pudo subir la imagen a Cloudinary');
  }
};

const obtenerServicios = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT s.*, u.nombre AS nombre_profesional
      FROM servicios s
      JOIN usuarios u ON s.staff_id = u.id
    `);
    res.json(rows);
  } catch (error) {
    console.error('❌ Error al obtener servicios:', error.message);
    res.status(500).json({ error: 'Error al obtener servicios' });
  }
};

const crearServicio = async (req, res) => {
  try {
    const { servicio, tipo, detalle, precio, staff_id } = req.body;

    let imagen = null;
    if (req.file) {
      imagen = await subirACloudinary(req.file);
    }

    const query = `
      INSERT INTO servicios (servicio, tipo, detalle, precio, imagen, staff_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [servicio, tipo, detalle, precio, imagen, staff_id];
    const { rows } = await pool.query(query, values);

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('❌ Error al crear servicio:', error.message);
    res.status(500).json({ error: 'Error al crear servicio' });
  }
};

const actualizarServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const { servicio, tipo, detalle, precio, staff_id } = req.body;

    let imagen = null;
    if (req.file) {
      imagen = await subirACloudinary(req.file);
    }

    const query = `
      UPDATE servicios SET
        servicio = $1,
        tipo = $2,
        detalle = $3,
        precio = $4,
        imagen = COALESCE($5, imagen),
        staff_id = $6
      WHERE id = $7
      RETURNING *;
    `;
    const values = [servicio, tipo, detalle, precio, imagen, staff_id, id];
    const { rows } = await pool.query(query, values);

    res.json(rows[0]);
  } catch (error) {
    console.error('❌ Error al actualizar servicio:', error.message);
    res.status(500).json({ error: 'Error al actualizar servicio' });
  }
};

const eliminarServicio = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM servicios WHERE id = $1', [id]);
    res.json({ mensaje: 'Servicio eliminado correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar servicio:', error.message);
    res.status(500).json({ error: 'Error al eliminar servicio' });
  }
};

module.exports = {
  obtenerServicios,
  crearServicio,
  actualizarServicio,
  eliminarServicio
};