const fs = require('fs');
const https = require('https');
const http = require('http');

const { execSync: exec } = require('child_process');
const { Deepgram } = require('@deepgram/sdk');
const ffmpegStatic = require('ffmpeg-static');
const deepgram = new Deepgram(process.env.DG_KEY);

const transcribeLocalVideo = async (filePath) => {
  ffmpeg(`-hide_banner -y -i ${filePath} ${filePath}.wav`);
  const audioFile = {
    buffer: fs.readFileSync(`${filePath}.wav`),
    mimetype: 'audio/wav',
  };
  const response = await deepgram.transcription.preRecorded(audioFile, {
    punctuation: true,
  });
  return response.results;
};

const transcribeRemoteVideo = async (url) => {
  const filePath = await downloadFile(url);
  const transcript = await transcribeLocalVideo(filePath);
   return transcript;
};

const downloadFile = async (url) => {
  return new Promise((resolve, reject) => {
    const request = http.get(url, (response) => {
      const fileName = url.split('/').slice(-1)[0];
      const fileStream = fs.createWriteStream(fileName);
      response.pipe(fileStream);
      response.on('end', () => {
        fileStream.close();
        resolve(fileName);
      });
    });
  });
};

const ffmpeg = async (command) => {
  return new Promise((resolve, reject) => {
    exec(`${ffmpegStatic} ${command}`, (err, stderr, stdout) => {
      if (err) reject(err);
      resolve(stdout);
    });
  });
};

module.exports = {
  transcribeLocalVideo,
  transcribeRemoteVideo,
};
