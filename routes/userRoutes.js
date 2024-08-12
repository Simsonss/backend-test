const express = require('express');
const { followUser, unfollowUser } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/follow/:user_id', protect, followUser);
router.post('/unfollow/:user_id', protect, unfollowUser);

module.exports = router;
