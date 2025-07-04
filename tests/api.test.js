const request = require('supertest');
const app = require('../server'); 

describe('Pruebas de la API REST - Salón de Belleza', () => {
  let token = '';

  // Test login y guardar token
  test('POST /api/auth/login debe autenticar y retornar un token', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'cliente_test1@salon.cl', // usuario existente
      password: '123456'     
    });

    console.log('🔐 TOKEN:', res.body.token);

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();

    token = res.body.token; // guardar para usar en otras pruebas
  });

  // Ruta pública
  test('GET /api/productos debe devolver status 200', async () => {
    const res = await request(app).get('/api/productos');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // Ruta protegida sin token
  test('POST /api/productos sin token debe devolver 401', async () => {
    const res = await request(app)
      .post('/api/productos')
      .send({ nombre: 'Producto Test', precio: 10000 });
    expect(res.statusCode).toBe(401);
  });

  // Ruta con ID no existente
  test('GET /api/productos/9999 debe devolver 404 si no existe', async () => {
    const res = await request(app).get('/api/productos/9999');
    expect(res.statusCode).toBe(404);
  });
});