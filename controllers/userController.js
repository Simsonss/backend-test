const mongoose = require('mongoose');
const User = require('../models/User'); // Adjust the path as needed

const followUser = async (req, res) => {
    const userId = req.user._id;
    const userToFollowId = req.params.user_id;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(userToFollowId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const user = await User.findById(userId);
        const userToFollow = await User.findById(userToFollowId);

        if (!user || !userToFollow) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.following.push(userToFollow._id);
        userToFollow.followers.push(user._id);

        await user.save();
        await userToFollow.save();

        res.json({ message: 'User followed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const unfollowUser = async (req, res) => {
    const userId = req.user._id;
    const userToUnfollowId = req.params.user_id;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(userToUnfollowId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const user = await User.findById(userId);
        const userToUnfollow = await User.findById(userToUnfollowId);

        if (!user || !userToUnfollow) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.following = user.following.filter(
            (followingId) => followingId.toString() !== userToUnfollow._id.toString()
        );
        userToUnfollow.followers = userToUnfollow.followers.filter(
            (followerId) => followerId.toString() !== user._id.toString()
        );

        await user.save();
        await userToUnfollow.save();

        res.json({ message: 'User unfollowed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { followUser, unfollowUser };