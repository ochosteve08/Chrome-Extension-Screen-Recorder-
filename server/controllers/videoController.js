const admin = require('firebase-admin');
const serviceAccount = require('../firebase-adminsdk.json');
const VideoModel = require('../models/video.model');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const { transcribeRemoteVideo } = require('../utils/transcription');

const project_id = 'mern-auth-ee4b0';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: `${project_id}.appspot.com`,
});
const bucket = admin.storage().bucket();

const Firebase = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const file = req.file;

  const blob = bucket.file(Date.now() + '-' + file.originalname);
  const blobStream = blob.createWriteStream();

  blobStream.on('finish', async () => {
    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
      bucket.name
    }/o/${encodeURI(blob.name)}?alt=media`;

    try {
      await VideoModel.create({ url: publicUrl });
      res.json({ message: 'Video uploaded successfully!', link: publicUrl });
    } catch (err) {
      res.status(500).json({ error: 'Failed to save link to MongoDB' });
    }
  });

  blobStream.end(file.buffer);
};

const Aws = async (req, res) => {
  // Upload file to S3
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `recordings/${Date.now()}-${req.file.originalname}`,
    Body: req.file.buffer,
  };
  s3.upload(params, async (error, data) => {
    if (error) {
      res.status(500).json({ error: 'Failed to upload file.' });
      return;
    }

    const video = await new VideoModel({
      url: data.Location,
    });
    await VideoModel.save();

    res.json({
      message: 'Recording uploaded successfully!',
      video,
    });
  });
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const Cloudinary = async (req, res, next) => {
  try {
    const { uploader } = cloudinary;
    await uploader
      .upload_stream({ resource_type: 'video' }, (error, result) => {
        if (error) throw error;
        console.log(result);

        new VideoModel({ url: result.secure_url });
        VideoModel.save((err, doc) => {
          if (err) throw err;
          res.json({ url: doc.url });
        });
      })
      .end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ error: 'Upload failed' });
  }
};

const FetchAllVideos = async (req, res) => {
  const videos = await VideoModel.find();
  if (!videos) {
    return res.status(404).json('no videos found');
  }
  res.json(videos);
};

const FetchVideo = async (req, res) => {
  const video = await VideoModel.findById(req.params.id);
  if (!video) {
    return res.status(404).json({ error: 'Recording not found' });
  }

  res.json({ video });
};

const DeleteVideo = async (req, res) => {
  const video = await VideoModel.findOneAndDelete({ _id: req.params.id });
  if (!video) {
    return res.status(404).json({ error: 'Recording not found' });
  }

  res.status(200).json({ video, message: 'Recording deleted successfully!' });
};

const uploadVideo = async (req, res) => {
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

  upload(req, res, (err) => {
    if (err) {
      return res.send(err);
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const { path } = req.file;

    const fName = req.file.originalname.split('.')[0];

    cloudinary.uploader.upload(
      path,
      {
        resource_type: 'video',
        public_id: `${fName}`,
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

      async (err, video) => {
        if (err) return res.send(err);

        let transcript;
        try {
          transcript = await transcribeRemoteVideo(video.url);
        } catch (transcriptionError) {
          console.error('Error in transcription:', transcriptionError);
        }

        // let transcriptText;
        // if (
        //   transcript.channels &&
        //   transcript.channels[0].alternatives &&
        //   transcript.channels[0].alternatives[0]
        // ) {
        //   transcriptText = transcript.channels[0].alternatives[0];
        // }

        fs.unlinkSync(path);
        const newVideo = new VideoModel({
          url: video.url,
          // transcript: transcriptText,
        });

        try {
          const savedVideo = await newVideo.save();
          return res.send(savedVideo);
        } catch (dbErr) {
          return res
            .status(500)
            .json({ message: 'Error saving video to database', error: dbErr });
        }
      }
    );
  });
};

module.exports = {
  FetchVideo,
  FetchAllVideos,
  uploadVideo,
  Cloudinary,
  Aws,
  DeleteVideo,
  Firebase,
};
