const uploadFile = require("../middlewares/upload");
const fs = require("fs");

const upload = async (req, res) => {
  try {
    await uploadFile(req, res);

    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }

    res.status(200).send({
      message: "Uploaded the file successfully: " + req.file.originalname,
      filename: req.file.filename,
    });
  } catch (err) {
    console.log(err);

    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size cannot be larger than 5MB!",
      });
    }

    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
};

const download = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/resources/static/assets/uploads/";

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
};

const remove = (req, res) => {
  const fileName = req.params.name;
  const ftype = req.params.type;
  const directoryPath = `${process.env.IMAGE_PATH}/${req.tenantId}/${ftype}`;
  const filePath = `${directoryPath}/${fileName}`;
  console.log(filePath)

  fs.unlink(filePath, (err) => {
    if (err) {
      console.log('remove file err', err);
      res.status(500).send({
        message: "Could not delete the file. " + err,
      });
    } else {
      res.status(200).send({
        message: "File is deleted.",
      });
    }

  });
};

const showDokumen = (req, res) => {
  const fileName = req.params.name;
  const ftype = req.params.type;
  const directoryPath = `${process.env.IMAGE_PATH}/${req.tenantId}/${ftype}`;
  const filePath = directoryPath + "/" + fileName
  console.log(filePath)

  fs.access(filePath, fs.constants.F_OK, (err) => {
 
    if (err) {
        res.writeHead(404, {
            "Content-Type": "text/plain"
        });
        res.end("404 Not Found");
        return;
    }

    
    const contentType = "image/png";
    

    // Setting the headers
    res.writeHead(200, {
        "Content-Type": contentType
    });

    // Reading the file
    fs.readFile(filePath,
        function (err, content) {
            // Serving the image
            res.end(content);
        });
  });
};

const removeSync = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/resources/static/assets/uploads/";

  try {
    fs.unlinkSync(directoryPath + fileName);

    res.status(200).send({
      message: "File is deleted.",
    });
  } catch (err) {
    res.status(500).send({
      message: "Could not delete the file. " + err,
    });
  }
};

module.exports = {
  upload,
  remove,
  download,
  showDokumen,
  removeSync,
};
