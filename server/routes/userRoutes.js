const userRoute = require('express').Router();

const {
  signup,
  login,
  Google,
  Facebook,
} = require('../controllers/authController');

userRoute.post('/signup', signup);
userRoute.post('/login', login);
userRoute.post('/google', Google);
userRoute.post('/facebook', Facebook);

module.exports = userRoute;
