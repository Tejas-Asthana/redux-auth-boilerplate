const router = require("express").Router();
const Message = require("../models/Message");

//add
router.post("/", async (req, res) => {
  console.log(req.body);
  if (
    !req.body.data.conversationId ||
    !req.body.data.sender ||
    !req.body.data.text
  )
    res.status(400).json({ err: "Enter all fields" });
  const newMessage = new Message(req.body.data);

  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get
router.get("/:conversationId", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
