const User = require('../models/User');

const followUser = async (req, res) => {
    const user = await User.findById(req.user._id);
    const userToFollow = await User.findById(req.params.user_id);

    //handle follow yourself
    if (user._id.toString() === userToFollow._id.toString()) {
        return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    if (!user || !userToFollow) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (user.following.includes(userToFollow._id)) {
        return res.status(400).json({ message: 'Already following' });
    }


    user.following.push(userToFollow._id);
    userToFollow.followers.push(user._id);

    await user.save();
    await userToFollow.save();

    res.json({ message: 'User followed' });
};

const unfollowUser = async (req, res) => {
    const user = await User.findById(req.user._id);
    const userToUnfollow = await User.findById(req.params.user_id);

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

    res.json({ message: 'User unfollowed' });
};

module.exports = { followUser, unfollowUser };
