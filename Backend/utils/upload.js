// utils/upload.js
const multer = require('multer');

// Multer memory storage configuration
const storage = multer.memoryStorage();

// File filter (only allow image types: jpeg, jpg, png)
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(file.originalname.toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Only image files (jpeg, jpg, png) are allowed');
  }
};

const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;
