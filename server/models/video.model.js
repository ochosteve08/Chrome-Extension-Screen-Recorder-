const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
  url: { type: String },
  videoId: {
    type: String,
  },
});

const VideoModel = mongoose.model('Video', VideoSchema);

module.exports = VideoModel;
