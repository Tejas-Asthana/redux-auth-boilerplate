const express = require("express");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");

let allUsers = require("../users.js");

const Router = express.Router();

Router.route("/").post((req, response) => {
  if (!req.body.email || !req.body.password) {
    return response.status(400).json({ msg: "Enter all fields" });
  }

  const currentUser = {
    email: req.body.email,
    password: req.body.password,
  };

  console.log(allUsers.length);
  let match = false;
  for (let i = 0; i < allUsers.length; i++) {
    if (allUsers[i].email === currentUser.email) {
      match = true;
      bcrypt.compare(currentUser.password, allUsers[i].password).then((res) => {
        if (!res) {
          return response.status(400).json({ msg: "invalid credentials" });
        }
        jwt.sign(
          { id: allUsers[i].id }, // put user id in token's payload
          config.get("jwtSecret"), // a secret key
          { expiresIn: 3600 }, // expires in 1 hr
          (err, token) => {
            if (err) throw err;
            return response.json({
              token,
              user: {
                id: allUsers[i].id,
                email: allUsers[i].email,
                username: allUsers[i].username,
              },
            });
          }
        );
      });
    } else if (i === allUsers.length - 1 && !match) {
      return response.status(400).json({ msg: "invalid credentials" });
    }
  }
  // console.log(allUsers);
});

module.exports = Router;
