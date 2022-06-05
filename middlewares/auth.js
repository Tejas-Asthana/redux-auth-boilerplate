const config = require("config");
const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.header("x-auth-token");

  // check token
  if (!token) {
    // return res.redirect("/");
    return res.status(401).json({ msg: "authorization denied" });
  }

  try {
    // verify token
    const decoded = jwt.verify(token, config.get("jwtSecret"));

    // add user to token payload
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ msg: "token invalid. access denied" });
  }
}

const correctFileName = (req, res, next) => {
  let path = req.body.name.replaceAll("'", "_");
  path = path.body.name.replaceAll(" ", "_");
  req.body.name = path;
  next();
};

module.exports = { auth, correctFileName };
