const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema(
  {
    url: { type: String },
    videoId: {
      type: String,
    },
    transcript: {
      transcript: { type: String, default: '' },
      confidence: { type: Number, default: 0 },
      words: { type: [String], default: [] },
    },
  },
  { timestamps: true }
);

const VideoModel = mongoose.model('Video', VideoSchema);

module.exports = VideoModel;
