// server.js (versión ES Modules)
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Configurar __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno (.env)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Lista de dominios permitidos
const allowedOrigins = [
  'http://localhost:5173',
  'https://mellifluous-sunburst-de2725.netlify.app'
];

// Middleware de CORS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por política CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Servir imágenes públicas
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// Rutas importadas (✅ ES Modules)
import profesionalesRoutes from './routes/profesionalesRoutes.js';
import reservasRoutes from './routes/reservasRoutes.js';
import authRoutes from './routes/authRoutes.js';
import productosRoutes from './routes/productosRoutes.js';
import usuariosRoutes from './routes/usuariosRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import observacionesRoutes from './routes/observacionesRoutes.js';
import serviciosRoutes from './routes/serviciosRoutes.js';
import likesRoutes from './routes/likesRoutes.js';
import likesProductosRoutes from './routes/likesProductosRoutes.js';
import carritoRoutes from './routes/carritoRoutes.js';

// Usar rutas
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

// Ruta 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor si no está en test
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
}

export default app;