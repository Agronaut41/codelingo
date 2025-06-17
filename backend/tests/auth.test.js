const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/User');
const MONGODB_URI = process.env.MONGODB_URI;

const BASE_URL = '/api/auth';

beforeAll(async () => {
  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe('Auth API', () => {
  test('registro - deve criar um novo usuário', async () => {
    const res = await request(app)
      .post(`${BASE_URL}/register`)
      .send({
        name: 'usuario1',
        email: 'usuario1@email.com',
        password: 'senha123',
      });

      console.log(res.statusCode, res.body)
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Usuário registrado com sucesso');
  });

  test('login - sucesso', async () => {
    await request(app)
      .post(`${BASE_URL}/register`)
      .send({ name: 'usuario2', email: 'u2@email.com', password: 'senha123' });

    const res = await request(app)
      .post(`${BASE_URL}/login`)
      .send({ name: 'usuario2', password: 'senha123' });

      
      console.log(res.statusCode, res.body)

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test('login - senha incorreta', async () => {
    await request(app)
      .post(`${BASE_URL}/register`)
      .send({ name: 'usuario3', email: 'u3@email.com', password: 'senha123' });

    const res = await request(app)
      .post(`${BASE_URL}/login`)
      .send({ name: 'usuario3', password: 'errada' });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Senha incorreta');
  });

  test('rota protegida - deve falhar sem token', async () => {
    const res = await request(app).get(`${BASE_URL}/home`);
    expect(res.statusCode).toBe(401);
  });

  test('complementar perfil - deve salvar e-mail', async () => {
    const user = await User.create({
      name: 'gituser',
      githubId: 'github123',
    });

    const res = await request(app)
      .post(`${BASE_URL}/complete-profile`)
      .send({ githubId: 'github123', email: 'git@email.com' });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();

    const updated = await User.findOne({ githubId: 'github123' });
    expect(updated.email).toBe('git@email.com');
  });
});
