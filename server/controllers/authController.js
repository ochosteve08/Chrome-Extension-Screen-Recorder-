const jwt = require('jsonwebtoken');
const UserService = require('./../services/user.service');
const {
  signInValidationSchema,
  signupValidationSchema,
} = require('../validations');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// signup user
exports.signup = async (req, res, next) => {
  const { name, email, avatar, password } =
    await signupValidationSchema.validateAsync(req.body);
  const user = await UserService.signup({
    name,
    email,
    avatar,
    password,
  });

  if (!user) {
    throw new Error('User not created successfully');
  }
  const token = signToken(user.id);

  res.cookie('access_token', token, {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
    expiresIn: process.env.JWT_SECRET,
  });

  res.status(201).json({
    status: 'success',
    user,
    token,
  });
}

//login user
exports.login = async (req, res, next) => {
  const { email, password } = await signInValidationSchema.validateAsync(
    req.body
  );
  const user = await UserService.login({ email, password });
  if (user) {
    const token = signToken(user.id);
    const { password: hashPassword, ...User } = user.dataValues;

    res.cookie('access_token', token, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      expiresIn: process.env.JWT_SECRET,
    });
    return res.status(200).json({ ...User, token });
  }
}


//  signup/login with twitter
exports.Facebook = async (req, res, next) => {
  const { name, email, avatar } = req.body;

  const user = await UserService.Facebook({ name, email, avatar });
  if (user) {
    const token = signToken(user.id);

    res
      .cookie('access_token', token, {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
        expiresIn: process.env.JWT_SECRET,
      })
      .status(201)
      .json({ status: 'success', user, token });
  }
}

// signup/login with google
exports.Google = async (req, res, next) => {
  const { name, email, avatar } = req.body;

  const user = await UserService.Google({ name, email, avatar });
  if (user) {
    const token = signToken(user.id);

    res
      .cookie('access_token', token, {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
        expiresIn: process.env.JWT_SECRET,
      })
      .status(201)
      .json({ status: 'success', user, token });
  }
}
