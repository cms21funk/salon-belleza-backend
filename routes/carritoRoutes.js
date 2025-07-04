// routes/carritoRoutes.js
const express = require('express');
const router = express.Router();
const { enviarCotizacion } = require('../controllers/carritoController');

router.post('/cotizacion', enviarCotizacion);

module.exports = router;
