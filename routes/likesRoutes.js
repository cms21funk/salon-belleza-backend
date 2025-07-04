//likesRoutes.js
const express = require('express');
const router = express.Router();
const {
  toggleLikeTrabajo,
  obtenerLikesPorStaff
} = require('../controllers/likesController');

router.post('/', toggleLikeTrabajo);
router.get('/staff/:staff_id', obtenerLikesPorStaff);

module.exports = router;