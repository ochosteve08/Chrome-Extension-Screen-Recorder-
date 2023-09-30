const multer = require('multer');
const cloudinary = require('cloudinary');
const VideoModel = require('../models/video.model');

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    const fileExt = file.originalname.split('.').pop();
    const filename = `${new Date().getTime()}.${fileExt}`;
    cb(null, filename);
  },
});


const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'video/mp4') {
    cb(null, true);
  } else {
    cb(
      {
        message: 'Unsupported File Format',
      },
      false
    );
  }
};


const upload = multer({
  storage,
  limits: {
    fieldNameSize: 200,
    fileSize: 30 * 1024 * 1024,
  },
  fileFilter,
}).single('video');
