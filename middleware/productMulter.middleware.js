// const multer = require("multer");

// // console.log("inside multer middle ware");
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, "./public/images/"));
//   },
//   filename: function (req, file, cb) {
//     cb(
//       null,
//       file.fieldname + "-" + Date.now() + file.originalname.match(/\..*$/)[0]
//     );
//   },
// });

// const multi_upload = multer({
//   storage,
//   limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
//   fileFilter: (req, file, cb) => {
//     if (
//       file.mimetype == "image/png" ||
//       file.mimetype == "image/jpg" ||
//       file.mimetype == "image/jpeg"
//     ) {
//       cb(null, true);
//     } else {
//       cb(null, false);
//       const err = new Error("Only .png, .jpg and .jpeg format allowed!");
//       err.name = "ExtensionError";
//       return cb(err);
//     }
//   },
// }).array("productsImg", 3);

// module.exports = {
//   multi_upload,
// };
