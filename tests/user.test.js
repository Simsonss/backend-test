const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // Adjust the path as needed
const User = require('../models/User'); // Adjust the path as needed
const jwt = require('jsonwebtoken');

let userId;
let anotherUserId;
let userToken;

beforeAll(async () => {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    await User.deleteMany({
        username: { $in: ['testuser_follow1', 'testuser_follow2'] }
    });

    // Create test users and get their IDs and tokens
    const user = new User({ username: 'testuser_follow1', password: 'password' });
    await user.save();
    userId = user._id;
    userToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const anotherUser = new User({ username: 'testuser_follow2', password: 'password' });
    await anotherUser.save();
    anotherUserId = anotherUser._id;

    // Simulate user login to get token
    
});

afterAll(async () => {
    // await User.deleteMany({
    //     username: { $in: ['testuser_follow1', 'testuser_follow2'] }
    // });
    await mongoose.connection.close();
});

describe('Follow and Unfollow Endpoints', () => {

    it('should follow another user', async () => {
        const res = await request(app)
            .post(`/follow/${anotherUserId}`)
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe('User followed successfully');

        // Verify that the user is followed
        const user = await User.findById(userId);
        expect(user.following.map(id => id.toString())).toContain(anotherUserId.toString());

        // Verify that the user is followed by the other user
        const anotherUser = await User.findById(anotherUserId);
        expect(anotherUser.followers.map(id => id.toString())).toContain(userId.toString());
    });

    it('should unfollow a user', async () => {
        // First, follow the user
        await request(app)
            .post(`/follow/${anotherUserId}`)
            .set('Authorization', `Bearer ${userToken}`);

        // Then unfollow the user
        const res = await request(app)
            .post(`/unfollow/${anotherUserId}`)
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe('User unfollowed successfully');

        // Verify that the user is unfollowed
        const user = await User.findById(userId);
        expect(user.following.map(id => id.toString())).not.toContain(anotherUserId.toString());

        // Verify that the user is unfollowed by the other user
        const anotherUser = await User.findById(anotherUserId);
        expect(anotherUser.followers.map(id => id.toString())).not.toContain(userId.toString());
    });

    it('should return an error if trying to follow a invalid userID', async () => {
        const res = await request(app)
            .post('/follow/invalidUserId')
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.statusCode).toEqual(400); // Adjust the expected status code as needed
        expect(res.body.message).toBe('Invalid user ID'); // Adjust the expected message as needed
    }); 

    it('should return an error if trying to unfollow a invalid userID', async () => {
        const res = await request(app)
            .post('/unfollow/invalidUserId')
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toBe('Invalid user ID');
    });

    it('should return an error if trying to follow a non-existing user', async () => {
        const res = await request(app)
            .post(`/follow/66bab65ad3a865add30114ec`)
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toBe('User not found');
    });

    it('should return an error if trying to unfollow a non-existing user', async () => {
        const res = await request(app)
            .post(`/unfollow/66bab65ad3a865add30114ec`)
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toBe('User not found');
    });

});