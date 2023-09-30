const dotenv = require('dotenv');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const { error } = require('./lib-handler');
const { connectToMongoDb, environmentVariables } = require('./config');
const multer = require('multer');
const apiRouter = require('./routes');
const VideoModel = require('./models/video.model');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');


dotenv.config({
  path: './.env',
});

const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(cors());
app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, Please try again in an hour',
});

app.get('/', (req, res) => {
  res.json({ message: 'api is working' });
});

app.use('/api', limiter);

app.post('/video/upload', async (req, res) => {
  console.log(req.file);
  // Get the file name and extension with multer
  const storage = multer.diskStorage({
    filename: (req, file, cb) => {
      const fileExt = file.originalname.split('.').pop();
      const filename = `${new Date().getTime()}.${fileExt}`;
      cb(null, filename);
    },
  });

  // Filter the file to validate if it meets the required video extension
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

  // Set the storage, file filter and file size with multer
  const upload = multer({
    storage,
    limits: {
      fieldNameSize: 200,
      fileSize: 30 * 1024 * 1024,
    },
    fileFilter,
  }).single('video');

  upload(req, res, (err) => {
    if (err) {
      return res.send(err);
    }

    // SEND FILE TO CLOUDINARY
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const { path } = req.file; // file becomes available in req at this point
    console.log('path:', req.file);
    const fName = req.file.originalname.split('.')[0];
    cloudinary.uploader.upload(
      path,
      {
        resource_type: 'video',
        public_id: `VideoUploads/${fName}`,
        chunk_size: 6000000,
        eager: [
          {
            width: 300,
            height: 300,
            crop: 'pad',
            audio_codec: 'none',
          },
          {
            width: 160,
            height: 100,
            crop: 'crop',
            gravity: 'south',
            audio_codec: 'none',
          },
        ],
      },

      // Send cloudinary response or catch error
      async (err, video) => {
        if (err) return res.send(err);

        fs.unlinkSync(path);
        const newVideo = new VideoModel({
          url: video.url,
        });

        try {
          const savedVideo = await newVideo.save();
          return res.send(savedVideo);
        } catch (dbErr) {
          return res
            .status(500)
            .send({ message: 'Error saving video to database', error: dbErr });
        }
      }
    );
  });
});
app.use(apiRouter);

// global error handler
app.use(error.handler);

const main = async () => {
  console.info('Starting server');
  await connectToMongoDb();
  console.info('Connected to MongoDB');
  app.listen(environmentVariables.APP_PORT || 8000, (err) => {
    try {
      console.info(
        `Server running on ${environmentVariables.APP_HOST}:${environmentVariables.APP_PORT}`
      );
    } catch (error) {
      console.log(error);
    }
  });
};

main();
