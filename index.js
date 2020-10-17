const path = require("path");
const express = require("express");
var cors = require("cors");

let registerUser = require("./api/registerUser.js");
let authUser = require("./api/authUser.js");

let authMiddleware = require("./middlewares/auth.js");

const app = express();
const port = process.env.PORT || 5000;

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("/client/build"));
// app.use('/static', express.static(path.join(__dirname, 'public')))

app.use("/api/registerUser", registerUser);

app.use("/api/authUser", authUser);

app.get("/privatePage", authMiddleware, (req, res) => {
  // res.status(200).send("Hello world");
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
  // res.json("public page");
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
