const Tweet = require('../models/Tweet');

const createTweet = async (req, res) => {
    const { content } = req.body;

    if (content.length > 200) {
        return res.status(400).json({ message: 'Tweet content exceeds 200 characters' });
    }

    const tweet = await Tweet.create({
        user: req.user._id,
        content,
    });

    res.status(201).json(tweet);
};

const getFeed = async (req, res) => {
    const tweets = await Tweet.find({
        user: { $in: [...req.user.following, req.user._id] }
    }).sort({ createdAt: -1 });

    res.json(tweets);
};

module.exports = { createTweet, getFeed };
