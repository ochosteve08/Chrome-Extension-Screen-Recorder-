const videoRoute = require('express').Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const {
  FetchVideo,
  FetchAllVideos,
  uploadVideo,
  Aws,
  DeleteVideo,
 
} = require('../controllers/videoController');


videoRoute.post('/Aupload', upload.single('recording'), Aws);

videoRoute.post('/upload', uploadVideo);
videoRoute.get('/', FetchAllVideos);
videoRoute.get('/:id', FetchVideo);
videoRoute.delete('/:id', DeleteVideo);

module.exports = videoRoute;
