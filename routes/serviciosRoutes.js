// routes/serviciosRoutes.js
const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

//Controladores de servicios
const {
  obtenerServicios,
  crearServicio,
  actualizarServicio,
  eliminarServicio
} = require('../controllers/serviciosController');

//Configuración de Multer para subir imágenes a /public/images
const storage = multer.diskStorage({
  destination: path.join(__dirname, '../public/images'),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

/* RUTAS DE SERVICIOS */

//Obtener todos los servicios
router.get('/', obtenerServicios);

//Crear un nuevo servicio (permite subir imagen)
router.post('/', upload.single('imagen'), crearServicio);

//Actualizar un servicio existente (imagen opcional)
router.put('/:id', upload.single('imagen'), actualizarServicio);

//Eliminar un servicio por ID
router.delete('/:id', eliminarServicio);

module.exports = router;