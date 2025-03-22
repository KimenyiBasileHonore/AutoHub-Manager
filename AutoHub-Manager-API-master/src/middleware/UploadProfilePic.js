const multer = require("multer")
const path = require("path");


const destination = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`);
    }
})

const isImage = (req, file, callback) => {
    if (file.mimetype.startsWith('image')) {
        callback(null, true)
    }
    else {
        callback(new Error('only images allowed'))
    }
}

const upload = multer({

    storage: destination,
    fileFilter: isImage
})

module.exports = upload.single();