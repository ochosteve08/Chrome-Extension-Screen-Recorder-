const admin = require('firebase-admin');
const cloudinary = require('cloudinary');
const serviceAccount = require('../firebase-adminsdk.json');
const VideoModel = require('../models/video.model');

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
    console.log(req.url)
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

const Cloud = async (req, res) => {
  const file = req.file.buffer;
  await cloudinary.uploader
    .upload_stream({ resource_type: 'video' }, (error, result) => {
      if (error) {
        return res.status(500).json('Upload to Cloudinary failed.');
      }

      new VideoModel({ url: result.url });
      VideoModel.save((err) => {
        if (err) {
          return res.status(500).json('MongoDB save operation failed.');
        }
        res.json({ url: result.url });
      });
    })
    .end(file);
};

const FetchAllVideos = async (req, res) => {
  const videos = await VideoModel.find();
  if (!videos) {
    return res.status(404).json('no videos found');
  }
  res.json({ videos });
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

module.exports = {
  FetchVideo,
  FetchAllVideos,
  Cloud,
  Cloudinary,
  Aws,
  DeleteVideo,
  Firebase,
};
