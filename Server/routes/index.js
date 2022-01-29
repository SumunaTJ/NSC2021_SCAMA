var express = require('express');
var router = express.Router();
const multer = require("multer");
const { v4: uuidv4 } = require('uuid');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);


const upload = multer({ dest: "server/hide/" });
router.post("/upload", upload.single("file"), async function(req, res, next) {
    const {
      file,
      body: { name }
    } = req;

    console.log("Upload");
    console.log(file);

    //if (file.detectedFileExtension != ".jpg") next(new Error("Invalid file type"));
    // const fileName = name + '-' + uuidv4() + '.jpg';

    // await pipeline (
    //   file.stream,
    //   fs.createWriteStream(`${__dirname}/hide/${fileName}`)
    // )

    const fileName = name + file.detectedFileExtension;
    await pipeline(
      file.stream,
      fs.createWriteStream(`${__dirname}/hide/${fileName}`)
    );
  
    res.send("File uploaded as " + fileName);
  });

  
  
module.exports = router;
