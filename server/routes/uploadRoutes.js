const videoRoute = require('express').Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const {
  FetchVideo,
  FetchAllVideos,
  Cloud,
  Cloudinary,
  Aws,
  DeleteVideo,
  Firebase,
} = require('../controllers/videoController')

videoRoute.post('/Fupload', upload.single('video'), Firebase);
videoRoute.post('/Aupload', upload.single('recording'), Aws);
videoRoute.post('/Cupload', upload.single('file'), Cloudinary);
videoRoute.post('/upload', upload.single('file', Cloud));
videoRoute.get('/', FetchAllVideos);
videoRoute.get('/:id', FetchVideo);
videoRoute.delete('/:id', DeleteVideo);



module.exports = videoRoute;