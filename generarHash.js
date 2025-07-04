// generarHash.js
const bcrypt = require('bcrypt');

async function generarHash() {
  const password = 'admin123'; // pone la contraseña aquí que quieras encriptar
  const hash = await bcrypt.hash(password, 10);
  console.log('Hash generado:', hash);
}

generarHash();
