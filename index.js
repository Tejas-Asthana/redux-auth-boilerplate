const mongoose = require("mongoose");
const multer = require("multer");
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("config");
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const urlMetadata = require("url-metadata");

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
// const { correctFileName } = require("./middlewares/auth");
// const fileUpload = require("./api/fileUpload");

const authMiddleware = require("./middlewares/auth.js");

const port = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  console.log(req.body.name);
  try {
    // console.log(res, "hii");
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.error(error);
  }
});

app.get("/api/files/:fileName", (req, res) => {
  if (!req.params.fileName) res.status(400).json({ err: "Enter all fields" });
  console.log(req.params.fileName);
  const path = "./uploads/" + req.params.fileName;
  // const data = await fs.readFile('/uploads/'+req.body.fileName, { encoding: 'utf8' });
  fs.readFile(path, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).json({ err });
    }
    console.log(data);
    res.status(200).send(data);
  });
});

app.get("/api/metaData/:url", async (req, res) => {
  urlMetadata(req.params.url).then(
    function (metadata) {
      // success handler
      console.log(metadata);
      res.status(200).json(metadata);
    },
    function (error) {
      // failure handler
      console.log(error);
      res.status(500).json({ error });
    }
  );
});

app.use("/api/auth", auth);
app.use("/api/user", user);
app.use("/api/messages", messages);
app.use("/api/conversations", conversations);

// app.get("/privatePage", authMiddleware, (req, res) => {
//   res.status(200).send("Hello world");
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
    console.log("user joined" + userId);
    io.emit("getUsers", users);
  });

  //send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text, fileName }) => {
    const user = getUser(receiverId);
    io.to(user?.socketId).emit("getMessage", {
      senderId,
      text,
      fileName,
    });
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
