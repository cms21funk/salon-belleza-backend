// routes/usuariosRoutes.js
const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

//Controladores para gestión de usuarios
const {
  obtenerUsuarios,
  actualizarUsuario,
  eliminarUsuario
} = require('../controllers/usuariosController');

//Configuración de Multer para almacenar imágenes en /public/images
const storage = multer.diskStorage({
  destination: path.join(__dirname, '../public/images'),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

/* RUTAS DE USUARIOS */

//Obtener todos los usuarios
router.get('/', obtenerUsuarios);

//Actualizar usuario (con opción de subir nueva imagen)
router.put('/:id', upload.single('imagen'), actualizarUsuario);

//Eliminar usuario por ID
router.delete('/:id', eliminarUsuario);

//Exportar router
module.exports = router;