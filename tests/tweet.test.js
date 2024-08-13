const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/User');
const Tweet = require('../models/Tweet');
const jwt = require('jsonwebtoken');

let userId;
let userToken;

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    await User.deleteOne({ username: 'testuser_feed' });
    const user = await User.create({
        username: 'testuser_feed',
        password: 'password123',
    });
    userId = user._id;
    userToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });


});

afterAll(async () => {
    // await User.deleteOne({ username: 'testuser_feed' });
    // await Tweet.deleteMany({user: userId});
    await mongoose.connection.close();
});

describe('Tweet Endpoints', () => {


    it('should create a new tweet', async () => {
        
        const res = await request(app)
            .post('/tweet')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ content: 'Hello World!' });

        expect(res.statusCode).toEqual(201);
        expect(res.body.content).toBe('Hello World!');
    });

    it('should fetch the tweet feed', async () => {
        await Tweet.create({user: userId , content: 'Hello World!'});

        const res = await request(app)
            .get('/feed')
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('should not allow creating a tweet without a content', async () => {
        const res = await request(app)
            .post('/tweet')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ content: '' });

        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toBe('Tweet content cannot be empty');
    });

    it('should not allow tweeting a message longer than 200 characters.', async () => {
        const res = await request(app)
            .post('/tweet')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ content: 'this message is longer than 200 characters this message is longer than 200 characters this message is longer than 200 characters this message is longer than 200 characters  this message is longer than 200 characters this message is longer than 200 characters  this message is longer than 200 characters  this message is longer than 200 characters  ' });

        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toBe('Tweet content exceeds 200 characters');
    });

    it('should not allow creating a tweet without authorization', async () => {
        const res = await request(app)
            .post('/tweet')
            .send({ content: 'Hello World!' });

        expect(res.statusCode).toEqual(401);
        expect(res.body.message).toBe('Not authorized, no token');
    });
});
