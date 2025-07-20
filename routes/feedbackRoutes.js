const express = require('express'); 
const router = express.Router();
const {
  registrarFeedback,
  obtenerLikesPorProfesional,
  obtenerComentariosConDetalles,
  obtenerFeedbackPorStaff,
  eliminarFeedback
} = require('../controllers/feedbackController');

router.post('/', registrarFeedback);
router.get('/likes', obtenerLikesPorProfesional); 
router.get('/comentarios', obtenerComentariosConDetalles);
router.get('/staff/:staff_id', obtenerFeedbackPorStaff);
router.delete('/:id', eliminarFeedback); // ✅ NUEVA RUTA

module.exports = router;