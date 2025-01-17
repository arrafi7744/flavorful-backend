const multer = require("multer");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('hit')
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

module.exports = multer({
  storage,
});
