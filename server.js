// server.js  
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Cargar variables de entorno (.env)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS para entornos de desarrollo y producción (Netlify y local)
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://salon-belleza-frontend.netlify.app' // 👈 reemplaza con tu dominio real de Netlify
  ],
  credentials: true
}));

app.use(express.json()); // Parsear JSON

// Servir imágenes desde carpeta pública
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// Importar rutas
const profesionalesRoutes = require('./routes/profesionalesRoutes');
const reservasRoutes = require('./routes/reservasRoutes');
const authRoutes = require('./routes/authRoutes');
const productosRoutes = require('./routes/productosRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const observacionesRoutes = require('./routes/observacionesRoutes');
const serviciosRoutes = require('./routes/serviciosRoutes');
const likesRoutes = require('./routes/likesRoutes');
const likesProductosRoutes = require('./routes/likesProductosRoutes');
const carritoRoutes = require('./routes/carritoRoutes');

// Usar rutas con prefijo /api
app.use('/api/profesionales', profesionalesRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/observaciones', observacionesRoutes);
app.use('/api/servicios', serviciosRoutes);
app.use('/api/likes', likesRoutes);
app.use('/api/likes-productos', likesProductosRoutes);
app.use('/api', carritoRoutes); 

// Ruta raíz
app.get('/', (req, res) => {
  res.send('🧖‍♀️ API Salón de Belleza Sary Salgado funcionando correctamente');
});

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor (excepto si estamos en modo test)
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
}

// Exportar para testing
module.exports = app;