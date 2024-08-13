const Tweet = require('../models/Tweet');

const createTweet = async (req, res) => {
    const { content } = req.body;
    try{
    if (!content) {
        return res.status(400).json({ message: 'Tweet content cannot be empty' });
    }
    if (content.length > 200) {
        return res.status(400).json({ message: 'Tweet content exceeds 200 characters' });
    }

    const tweet = await Tweet.create({
        user: req.user._id,
        content,
    });

    res.status(201).json(tweet);
    }catch(error){
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getFeed = async (req, res) => {
    try {
        const tweets = await Tweet.find({
            user: { $in: [...req.user.following, req.user._id] }
        }).sort({ createdAt: -1 });

        res.json(tweets);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { createTweet, getFeed };
