const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const { verificarToken } = require('../middleware/middlewares');

const {
  obtenerProductos,
  agregarProducto,
  actualizarProducto,
  eliminarProducto,
  obtenerTopProductosPopulares
} = require('../controllers/productosController');

// Multer para subir imágenes local (si usas Cloudinary ya no es necesario)
const storage = multer.diskStorage({
  destination: path.join(__dirname, '../public/images'),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

/* RUTAS DE PRODUCTOS */

// Obtener todos los productos
router.get('/', obtenerProductos);

// Obtener Top 10 productos con más likes
router.get('/populares', obtenerTopProductosPopulares);

// Obtener un producto por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await require('../models/db').query('SELECT * FROM productos WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear producto
router.post('/', verificarToken, upload.single('imagen'), agregarProducto);

// Actualizar producto
router.put('/:id', verificarToken, upload.single('imagen'), actualizarProducto);

// Eliminar producto
router.delete('/:id', verificarToken, eliminarProducto);

module.exports = router;