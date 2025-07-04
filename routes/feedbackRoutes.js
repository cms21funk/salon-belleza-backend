const express = require('express');
const router = express.Router();
const { registrarFeedback, obtenerLikesPorProfesional, obtenerComentariosConDetalles, obtenerFeedbackPorStaff } = require('../controllers/feedbackController');

router.post('/', registrarFeedback);
router.get('/likes', obtenerLikesPorProfesional); 
router.get('/comentarios', obtenerComentariosConDetalles);
router.get('/staff/:staff_id', obtenerFeedbackPorStaff);

module.exports = router;



