const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/User');

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    await User.deleteOne({ username: 'testuser_authen' });
});

afterAll(async () => {
    // await User.deleteOne({ username: 'testuser_authen' });
    await mongoose.connection.close();
});

let token;

describe('Auth Endpoints', () => {
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/register')
            .set('Content-Type', 'application/json')
            .send({
                username: 'testuser_authen',
                password: 'password123'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');
    });

    it('should not register with same username', async () => {
        const res = await request(app)
            .post('/register')
            .set('Content-Type', 'application/json')
            .send({
                username: 'testuser_authen',
                password: 'password123'
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toBe('Username already exists');
    });

    it('should login the user', async () => {
        const res = await request(app)
            .post('/login')
            .set('Content-Type', 'application/json')
            .send({
                username: 'testuser_authen',
                password: 'password123'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should not login with invalid credentials', async () => {
        const res = await request(app)
            .post('/login')
            .set('Content-Type', 'application/json')
            .send({
                username: 'testuser_authen',
                password: 'wrongpassword'
            });
        expect(res.statusCode).toEqual(401);
        expect(res.body.message).toBe('Invalid username or password');
    });
});