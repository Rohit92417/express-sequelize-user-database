const multer = require("multer");
const path = require("path");
var storage = multer.diskStorage({
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== "jpg" && ext !== "jpeg" && ext !== "png") {
      cb(new Error("File type is not support"), false);
      return;
    }
    cb(null, true);
  },
});

var upload = multer({ storage: storage });
module.exports = upload;
