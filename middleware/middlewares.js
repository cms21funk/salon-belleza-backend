// middlewares.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config(); 

/**
 * Middleware para verificar el token JWT en rutas protegidas.
 * Si el token es válido, se añade el usuario decodificado a req.usuario.
 * Si no hay token o es inválido, se responde con un error 401 o 403.
 */
const verificarToken = (req, res, next) => {
  // Se espera el token en formato: Bearer <token>
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // El payload del token queda accesible
    next(); // Continúa hacia la ruta protegida
  } catch (error) {
    console.error('❌ Token inválido o expirado:', error.message);
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
};

module.exports = { verificarToken };