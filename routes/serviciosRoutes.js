const express = require('express');
const router = express.Router();
const multer = require('multer');
const os = require('os');

const upload = multer({ dest: os.tmpdir() });

const {
  obtenerServicios,
  crearServicio,
  actualizarServicio,
  eliminarServicio
} = require('../controllers/serviciosController');

router.get('/', obtenerServicios);
router.post('/', upload.single('imagen'), crearServicio);
router.put('/:id', upload.single('imagen'), actualizarServicio);
router.delete('/:id', eliminarServicio);

module.exports = router;