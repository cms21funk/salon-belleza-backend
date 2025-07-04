//profesionalesRoutes.js
const express = require('express');
const router = express.Router();
const profesionalesController = require('../controllers/profesionalesController');

// Obtener todos los profesionales
router.get('/', profesionalesController.obtenerProfesionales);

// Obtener un profesional por ID
router.get('/:id', profesionalesController.obtenerProfesionalPorId);

// Crear un nuevo profesional
router.post('/', profesionalesController.crearProfesional);

// Actualizar un profesional existente
router.put('/:id', profesionalesController.actualizarProfesional);

// Eliminar un profesional
router.delete('/:id', profesionalesController.eliminarProfesional);

module.exports = router;
