require('dotenv').config();

module.exports = {
  ENVIRONMENT: process.env.ENVIRONMENT || 'ochosteve',
  APP_PORT: process.env.APP_PORT || '8080',
  APP_HOST: process.env.APP_HOST,
  MONGO_URL: process.env.MONGO_URL,
  NODE_ENV: process.env.NODE_ENV,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  CLOUDINARY_URL: process.env.CLOUDINARY_URL,
  DG_KEY:process.env.DG_KEY
};
