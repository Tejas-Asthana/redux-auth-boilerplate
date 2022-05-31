const User = require("../models/User");
const router = require("express").Router();

//get a user
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get friends
router.get("/friends", async (req, res) => {
  try {
    if (!req.body.userId) res.status(400).json("Enter userId");
    const user = await User.findById(req.body.userId);
    const friends = await Promise.all(
      user.friends.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username } = friend;
      friendList.push({ _id, username });
    });
    res.status(200).json(friendList);
  } catch (err) {
    res.status(500).json(err);
  }
});

//add friend
router.post("/friends/add/", async (req, res) => {
  if (!req.body.userId || !req.body.friendId)
    res.status(400).json({ err: "Enter all fields" });
  if (req.body.userId !== req.body.friendId) {
    try {
      const user = await User.findById(req.body.friendId);
      const currentUser = await User.findById(req.body.userId);
      if (!user.friends.includes(req.body.userId)) {
        await user.updateOne({ $push: { friends: req.body.userId } });
        await currentUser.updateOne({ $push: { friends: req.body.friendId } });
        res.status(200).json("user has been added as friends");
      } else {
        res.status(403).json("you are already friends with this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant befriend yourself");
  }
});

//unfriend a user
router.put("/friends/remove/", async (req, res) => {
  if (req.body.userId !== req.body.friendId) {
    try {
      const user = await User.findById(req.body.friendId);
      const currentUser = await User.findById(req.body.userId);
      if (user.friends.includes(req.body.userId)) {
        await user.updateOne({ $pull: { friends: req.body.userId } });
        await currentUser.updateOne({ $pull: { friends: req.body.friendId } });
        res.status(200).json("user has been unfriended");
      } else {
        res.status(403).json("you dont follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant unfriend yourself");
  }
});

module.exports = router;
