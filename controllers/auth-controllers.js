const { HttpError, sendEmail } = require("../helpers");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const { nanoid } = require("nanoid");

require("dotenv").config();

const { SECRET_KEY } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return next(HttpError(409, "Email in use"));
  }

  // хешуємо пароль
  const hashPassword = await bcrypt.hash(password, 10);

  const avatarURL = gravatar.url(email);

  const verificationToken = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    text: "Please confirm your email",
    html: `<a _blank='target' href="http://localhost:3000/users/verify/${verificationToken}">Click there for confirm your email!<a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL,
    },
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(HttpError(401, "Email or password is wrong"));
  }

  if (!user.verify) {
    return next(HttpError(401, "Email not verified"));
  }

  const comparedPassword = await bcrypt.compare(password, user.password);

  if (!comparedPassword) {
    return next(HttpError(401, "Email or password is wrong"));
  }

  const { _id: id } = user;

  // jwt шифрує payload - тобто id користувача, а в authentication ми його розшифровуємо
  const token = jwt.sign({ id }, SECRET_KEY, { expiresIn: "24h" });
  await User.findByIdAndUpdate(id, { token });

  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const verifyEmail = async (req, res, next) => {
  const { verificationToken } = req.params;

  const user = await User.findOne({ verificationToken });

  if (!user) {
    return next(HttpError(404, "User not found"));
  }

  await User.findByIdAndUpdate(user._id, {
    verificationToken: null,
    verify: true,
  });

  res.status(200).json({
    message: "Verification successful",
  });
};

const resendVerifyEmail = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(HttpError(404, "Email is uncorrect"));
  }

  if (user.verify) {
    return next(HttpError(400, "Verification has already been passed"));
  }

  const verifyEmail = {
    to: user.email,
    subject: "Verify email",
    text: "Please confirm your email",
    html: `<a _blank='target' href="http://localhost:3000/users/verify/${user.verificationToken}">Click there for confirm your email!<a>`,
  };

  await sendEmail(verifyEmail);

  res.status(200).json({
    message: "Verification email sent",
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json({
    message: "Logout success",
  });
};

const getCurrent = (req, res) => {
  const { email, subscription } = req.user;

  res.status(200).json({ user: { email, subscription } });
};

const changeSubscription = async (req, res, next) => {
  const { _id } = req.user;
  if (Object.keys(req.body).length === 0) {
    next(HttpError(400, "missing field subscription"));
  }
  const contact = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  });

  if (!contact.owner.equals(_id)) {
    return next(HttpError(403, "Access denied"));
  }
  res.status(200).json({ contact: contact });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUploadDir, originalname } = req.file;
  const filename = `${_id}_${originalname}`;

  const resultUpload = path.join(avatarsDir, filename);

  await fs.rename(tempUploadDir, resultUpload);

  Jimp.read(resultUpload, (err, img) => {
    if (err) throw err;
    img.resize(250, 250).write(resultUpload);
  });

  const avatarURL = path.join("avatars", filename);

  await User.findByIdAndUpdate(_id, { avatarURL });

  await User.findByIdAndUpdate(_id, { avatarURL });

  res.status(200).json({ avatarURL });
};

module.exports = {
  register,
  login,
  getCurrent,
  logout,
  changeSubscription,
  updateAvatar,
  verifyEmail,
  resendVerifyEmail,
};
