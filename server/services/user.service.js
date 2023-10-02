const UserModel = require('../models/user.model');
const bcrypt = require('bcryptjs');

exports.signup = async ({ name, email, avatar, password }) => {
  const existingUser = await UserModel.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('This user already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  return await UserModel.create({
    name,
    email,
    avatar,
    password: hashedPassword,
  });
};

exports.login = async ({ email, password }) => {
  // Check if a user with the provided email exists in the database
  const validUser = await UserModel.findOne({ where: { email } });

  // If no user is found, throw an error indicating that the user was not found
  if (!validUser) {
    throw new Error('User not found');
  }

  // Compare the provided password with the hashed password stored in the database
  const match = await bcrypt.compare(password, validUser.password);

  // If the passwords do not match, throw an error indicating wrong credentials
  if (!match) {
    throw newError('Wrong credentials');
  }

  // If the passwords match, return the valid user object
  return validUser;
};

exports.Google = async ({ name, email, avatar }) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    return await UserModel.create({
      name,
      email,
      avatar,
    });
  } else {
    return user;
  }
};

exports.Facebook = async ({ name, email, avatar }) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    return await UserModel.create({
      name,
      email,
      avatar,
    });
  } else {
    return user;
  }
};
