import express from 'express';
import {
  crearObservacion,
  obtenerObservacionesPorStaff,
  marcarComoLeido,
  eliminarObservacion,
  editarObservacion
} from '../controllers/observacionesController.js';

const router = express.Router();

router.post('/', crearObservacion);
router.get('/:staff_id', obtenerObservacionesPorStaff);
router.put('/leido/:id', marcarComoLeido);
router.put('/editar/:id', editarObservacion);
router.delete('/:id', eliminarObservacion);

export default router;