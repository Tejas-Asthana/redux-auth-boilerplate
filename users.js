const bcrypt = require("bcryptjs");

let users = [
  {
    id: 0,
    username: "test1",
    email: "test1@email",
    password: "test1",
  },
];

bcrypt.genSalt(10, (err, salt) => {
  if (err) throw err;
  bcrypt.hash(users[0].password, salt, (err, hash) => {
    if (err) throw err;
    users[0].password = hash;
    // console.log("hashed pswrd: ", users[0].password);
  });
});

module.exports = { users };
