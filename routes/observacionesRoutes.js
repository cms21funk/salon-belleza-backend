//observacionesRoutes.js
const express = require('express');
const router = express.Router();
const {
  crearObservacion,
  obtenerObservacionesPorStaff,
  marcarComoLeido,
  eliminarObservacion,
  editarObservacion
} = require('../controllers/observacionesController');

router.post('/', crearObservacion);
router.get('/:staff_id', obtenerObservacionesPorStaff);
router.put('/leido/:id', marcarComoLeido);
router.put('/editar/:id', editarObservacion);
router.delete('/:id', eliminarObservacion);

module.exports = router;