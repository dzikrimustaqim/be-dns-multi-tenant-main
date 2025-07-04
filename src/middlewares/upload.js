const util = require("util");
const multer = require("multer");
const maxSize = 5 * 1024 * 1024;
const path = require("path");

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const ftype = req.query.type;
    const pathImage = `${process.env.IMAGE_PATH}/${req.tenantId}/${ftype}`;
  
    cb(null, pathImage);
  },
  filename: function (req, file, cb) {
    const filetype = req.query.type;
    const fileName = filetype + "-" + Date.now() + Math.floor(Math.random() * (99999 - 10000 + 1) ) + 10000;
    
    cb(
      null,
      file.fieldname + "-" + fileName + path.extname(file.originalname)
    );
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
