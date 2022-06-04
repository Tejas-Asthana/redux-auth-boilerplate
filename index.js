const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("config");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const uri = config.get("MONGO_URL");

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log(err));

const auth = require("./api/auth.js");
const user = require("./api/users.js");
const messages = require("./api/messages.js");
const conversations = require("./api/conversations.js");

const authMiddleware = require("./middlewares/auth.js");

const port = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/auth", auth);
app.use("/api/user", user);
app.use("/api/messages", messages);
app.use("/api/conversations", conversations);

app.get("/privatePage", authMiddleware, (req, res) => {
  res.status(200).send("Hello world");
});

// app.listen(port, () => {
//   console.log(`Listening at http://localhost:${port}`);
// });

http.listen(port, () => {
  const host = http.address().address;
  console.log(`Listening at http://${host}:${port}`);
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  //when ceonnect
  console.log("a user connected.");

  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  //send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    io.to(user.socketId).emit("getMessage", {
      senderId,
      text,
    });
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
