const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("config");
const express = require("express");
const cors = require("cors");

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

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/auth", auth);
app.use("/api/user", authMiddleware, user);
app.use("api/messages", authMiddleware, messages);
app.use("api/conversations", authMiddleware, conversations);

app.get("/privatePage", authMiddleware, (req, res) => {
  res.status(200).send("Hello world");
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
