const pool = require('../models/db');
const nodemailer = require('nodemailer');
require('dotenv').config();

/**
 * Crear una nueva reserva y enviar correo de confirmación al administrador.
 * Realiza validación previa para evitar reservas duplicadas en mismo horario.
 */
const crearReserva = async (req, res) => {
  try {
    const {
      servicio,
      profesional,
      fecha,
      hora,
      nombre,
      apellido,
      correo,
      telefono
    } = req.body;

    // Validar si ya existe una reserva en la misma fecha/hora para la misma profesional
    const validacionQuery = `
      SELECT * FROM reserva_hora
      WHERE profesional = $1 AND fecha = $2 AND hora = $3
    `;
    const validacion = await pool.query(validacionQuery, [profesional, fecha, hora]);

    if (validacion.rows.length > 0) {
      return res.status(409).json({
        error: 'La hora ya está reservada para esta profesional. Elija otra.'
      });
    }

    // Insertar la nueva reserva
    const insertQuery = `
      INSERT INTO reserva_hora
      (servicio, profesional, fecha, hora, nombre_cliente, apellido_cliente, correo_cliente, telefono_cliente)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;
    const values = [servicio, profesional, fecha, hora, nombre, apellido, correo, telefono];
    await pool.query(insertQuery, values);

    // Enviar notificación al correo del salón
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mensaje = `
✅ Nueva Reserva Recibida:

💧 Servicio: ${servicio}
💇 Profesional: ${profesional}
📅 Fecha: ${fecha}
⏰ Hora: ${hora}

👤 Cliente: ${nombre} ${apellido}
📧 Correo: ${correo}
📞 Teléfono: ${telefono}
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'Nueva Reserva - Salón Sary Salgado',
      text: mensaje
    });

    // Respuesta exitosa
    res.status(201).json({ mensaje: 'Reserva registrada y correo enviado' });

  } catch (error) {
    console.error('❌ Error al registrar la reserva:', error);
    res.status(500).json({ error: 'Error al procesar la reserva' });
  }
};

module.exports = { crearReserva };