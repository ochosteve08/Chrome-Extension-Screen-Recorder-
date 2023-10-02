const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema(
  {
    url: { type: String },
    videoId: {
      type: String,
    },
    transcript: {
      words: [
        {
          word: String,
          start: Number,
          end: Number,
          confidence: Number,
        },
      ],
    },
  },
  { timestamps: true }
);

const VideoModel = mongoose.model('Video', VideoSchema);

module.exports = VideoModel;
