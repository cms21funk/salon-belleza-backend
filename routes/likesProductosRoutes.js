//likesProductosRoutes.js 
const express = require('express');
const router = express.Router();
const {
  toggleLikeProducto,
  obtenerProductosPopulares
} = require('../controllers/likesProductosController');

router.post('/', toggleLikeProducto);
router.get('/populares', obtenerProductosPopulares);

module.exports = router;
