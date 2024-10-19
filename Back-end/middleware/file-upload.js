const { v4: uuidv4 } = require('uuid');
const multer = require("multer")

/* 
    Aux to extract extension of received file
*/
const MIME_TYPE_MAP = {
    "image/png" : "png",
    "image/jpg" : "jpg",
    "image/jpeg": "jpeg",
}

/* Configuring Storage */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/images');
    },
    /* Configuring filename and extension */
    filename: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype]
      cb(null, uuidv4() + "." + ext);
    },
    fileFilter : (req, file, cb) => {
        /* 
            Falsy Check -> If Undefined, parsed as falsely, converted to truthy.
            Finally converted to boolean falsely 
        */
        const isValid = !!MIME_TYPE_MAP[file.mimetype]
        const error = isValid ? null : new Error("Invalid mime Type");
        /* If first argument is null then accept. Else reject */
        cb(error,isValid);
    },
  });
  
// Create the multer instance
const upload = multer({limits : 500000, storage: storage });
module.exports = upload;