const User = require("../models/User");
const router = require("express").Router();

//get a user
router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get friends
router.get("/friends/:userId", async (req, res) => {
  try {
    if (!req.params.userId) res.status(400).json("Enter userId");
    const user = await User.findById(req.params.userId);
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
router.post("/friends/add/:userId/:friendId", async (req, res) => {
  if (!req.params.userId || !req.params.friendId)
    res.status(400).json({ err: "Enter all fields" });
  if (req.params.userId !== req.params.friendId) {
    try {
      const user = await User.findById(req.params.friendId);
      const currentUser = await User.findById(req.params.userId);
      if (!user.friends.includes(req.params.userId)) {
        await user.updateOne({ $push: { friends: req.params.userId } });
        await currentUser.updateOne({
          $push: { friends: req.params.friendId },
        });
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

router.get("/allUsers", async (req, res) => {
  try {
    User.find({}, function (err, users) {
      var userMap = {};

      users.forEach(function (user) {
        userMap[user._id] = user;
      });

      res.status(200).json(userMap);
    });
  } catch (err) {
    res.status(500).json(err);
    // res.status(400).json({});
  }
});

router.get("/searchUsers/:q", async (req, res) => {
  if (!req.params.q) res.status(400).json({ err: "Enter all fields" });
  try {
    User.find({ username: req.params.q }, (err, users) => {
      if (err) throw err;
      var userMap = [];
      users.forEach((user) => {
        userMap.push(user);
      });
      res.status(200).send(userMap);
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
