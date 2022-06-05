const router = require("express").Router();
const Conversation = require("../models/Conversation");

// get conv of a user
router.get("/:userId", async (req, res) => {
  if (!req.params.userId) res.status(400).json({ err: "Enter all fields" });
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

// post new conv
router.post("/", async (req, res) => {
  console.log(req.body);
  if (!req.body.receiverId || !req.body.senderId)
    res.status(400).json({ err: "enter all fields" });
  else {
    const newConversation = new Conversation({
      members: [req.body.senderId, req.body.receiverId],
    });

    try {
      const savedConversation = await newConversation.save();
      res.status(200).json(savedConversation);
    } catch (err) {
      res.status(500).json({ err });
    }
  }
});

// get conv includes two userId
router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
  if (!req.params.firstUserId || !req.params.secondUserId)
    res.status(400).json({ err: "enter all fields" });
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    console.log(conversation);
    if (conversation === null) {
      const newConversation = new Conversation({
        members: [req.params.firstUserId, req.params.secondUserId],
      });

      try {
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);
      } catch (err) {
        res.status(500).json({ err });
      }
    }
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
