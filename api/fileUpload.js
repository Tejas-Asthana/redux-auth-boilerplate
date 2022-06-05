const router = require("express").Router();

router.post("/", async (req, res) => {
  console.log(req.body);
  if (req.body.file === null) {
    return res.status(400).json({ msg: "No file uploaded" });
  }

  const file = req.body.file;

  file.mv(`${__dirname}/uploads/${file.name}`, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }

    res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
  });
});

// router.get("/", (req , res) => {
//     req.body.file &&
// })

module.exports = router;
