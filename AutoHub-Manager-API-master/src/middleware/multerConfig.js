import multer from 'multer';
import fs from 'fs';
import path from 'path';

const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('Destination:', uploadDir); 
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate a unique filename to prevent overwriting
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 5, // Maximum 5 files
  },
  fileFilter: function (req, file, cb) {
    // Accepted image MIME types
    const imageMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp'
    ];
  
    // Check file type
    if (imageMimeTypes.includes(file.mimetype)) {
      cb(null, true); 
    } else {
      // Reject file with an error
      cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'), false); 
    }
  },
});

export default upload;