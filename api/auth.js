const router = require("express").Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

router.post("/login", async (req, res) => {
  console.log(req.body);
  if (!req.body.email || !req.body.password) {
    return response.status(400).json({ msg: "Enter all fields" });
  }

  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).json("user not found");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validPassword && res.status(400).json("wrong password");

    jwt.sign(
      { id: user._id }, // put user id in token's payload
      config.get("jwtSecret"), // a secret key
      { expiresIn: 3600 }, // expires in 1 hr
      (err, token) => {
        if (err) throw err;
        const { password, ...other } = user._doc;
        return res.status(200).json({
          token,
          user: other,
        });
      }
    );
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route /api/registerUser
// Public
// registers a user and generates a token

router.post("/register", async (req, res) => {
  console.log(req.body);
  if (!req.body.username || !req.body.email || !req.body.password) {
    return res.status(400).json({ msg: "Enter all fields" });
  }

  const user = await User.findOne({ email: req.body.email });
  user && res.status(404).json("user already registered");

  try {
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    //save user and respond
    const user = await newUser.save();

    jwt.sign(
      { id: user._id }, // put user id in token's payload
      config.get("jwtSecret"), // a secret key
      { expiresIn: 3600 }, // expires in 1 hr
      (err, token) => {
        if (err) throw err;
        return res.status(200).json({
          token,
          user,
        });
      }
    );
    // res.status(200).json({
    //   user,
    // });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
