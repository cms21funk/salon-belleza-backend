// controllers/carritoController.js

// Importa nodemailer para el envío de correos
const nodemailer = require('nodemailer');

// Carga variables de entorno desde .env
require('dotenv').config();

/**
 * Controlador para enviar la cotización de un carrito por correo electrónico.
 * El mensaje se envía al administrador del salón con el detalle del pedido.
 */
const enviarCotizacion = async (req, res) => {
  try {
    const { nombre, apellido, email, celular, carrito, total } = req.body;

    // Validación de datos obligatorios
    if (!nombre || !apellido || !email || !celular || !carrito || carrito.length === 0 || !total) {
      return res.status(400).json({ error: 'Faltan datos obligatorios o el carrito está vacío' });
    }

    // Configuración del transporte de correo con Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Email origen desde .env
        pass: process.env.EMAIL_PASS, // Contraseña o app password
      },
    });

    // Arma el detalle del carrito en formato legible
    const detalle = carrito.map(item =>
      `🛍 ${item.nombre}\n📸 Imagen: /images/${item.imagen}\n💵 Precio: $${item.precio.toLocaleString()}\n📦 Cantidad: ${item.cantidad}\n`
    ).join('\n');

    // Cuerpo del correo electrónico
    const mensaje = `
✅ Cotización de Productos

🧍 Cliente: ${nombre} ${apellido}
📧 Email: ${email}
📱 Celular: ${celular}

🛒 Detalle del Pedido:
${detalle}

💰 Total: $${total.toLocaleString()}
`;

    // Envío del correo
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, 
      subject: 'Cotización de Productos',
      text: mensaje.trim(),
    });

    res.status(200).json({ mensaje: 'Consulta enviada con éxito' });
  } catch (error) {
    console.error('❌ Error al enviar la cotización:', error);
    res.status(500).json({ error: 'Error al enviar la cotización' });
  }
};

module.exports = { enviarCotizacion };