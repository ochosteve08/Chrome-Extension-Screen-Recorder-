const mongoose = require('mongoose');

const recordingSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  s3Url: String,
  sharedWith: [String], // Array of user email addresses or IDs
});

module.exports = mongoose.model('Recording', recordingSchema);

