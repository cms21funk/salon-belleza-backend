const express = require('express');
const router = express.Router();
const multer = require('multer');
const os = require('os');
const path = require('path');
const fs = require('fs');

// Usa carpeta temporal del sistema
const upload = multer({ dest: os.tmpdir() });

const {
  obtenerServicios,
  crearServicio,
  actualizarServicio,
  eliminarServicio
} = require('../controllers/serviciosController');

// Rutas
router.get('/', obtenerServicios);
router.post('/', upload.single('imagen'), crearServicio);
router.put('/:id', upload.single('imagen'), actualizarServicio);
router.delete('/:id', eliminarServicio);

module.exports = router;