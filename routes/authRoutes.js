// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

//Importar controladores de autenticación
const {
  registrarCliente,
  registrarStaff,
  login,
  actualizarUsuario,
  eliminarUsuario
} = require('../controllers/authController');

//Configuración de almacenamiento para imágenes con Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/images')); // Guardar en /public/images
  },
  filename: (req, file, cb) => {
    // Evita nombres duplicados usando timestamp
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

/*RUTAS DE AUTENTICACIÓN*/

//Registro de cliente
router.post('/registro', registrarCliente);

//Registro de staff con imagen (campo "imagen" debe coincidir con input frontend)
router.post('/registro-staff', upload.single('imagen'), registrarStaff);

//Inicio de sesión
router.post('/login', login);

//Actualizar usuario con opción de imagen
router.put('/usuarios/:id', upload.single('imagen'), actualizarUsuario);

//Eliminar usuario por ID
router.delete('/usuarios/:id', eliminarUsuario);

module.exports = router;