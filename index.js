// const path = require("path");
const express = require("express");
var cors = require("cors");

let registerUser = require("./api/registerUser.js");
let authUser = require("./api/authUser.js");
let getUserInfo = require("./api/getUserInfo.js");

let authMiddleware = require("./middlewares/auth.js");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(express.static("/client/build"));
// app.use('/static', express.static(path.join(__dirname, 'public')))

app.use("/api/registerUser", registerUser);

app.use("/api/authUser", authUser);

app.use("/api/getUserInfo", authMiddleware, getUserInfo);

app.get("/privatePage", authMiddleware, (req, res) => {
  res.status(200).send("Hello world");
});

// app.get("/*", (req, res) => {
//   res.sendFile(path.join(__dirname, "build", "index.html"));
// });

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
