const express = require('express');
const { createTweet, getFeed } = require('../controllers/tweetController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/tweet', protect, createTweet);
router.get('/feed', protect, getFeed);

module.exports = router;
