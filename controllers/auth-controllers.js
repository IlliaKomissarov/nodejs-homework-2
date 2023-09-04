const { HttpError } = require("../helpers");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { SECRET_KEY } = process.env;

const register = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return next(HttpError(409, "Email in use"));
  }

  // хешуємо пароль
  const hashPassword = await bcrypt.hash(password, 10);

  const result = await User.create({ email, password: hashPassword });

  res
    .status(201)
    .json({ user: { email: result.email, subscription: result.subscription } });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(HttpError(401, "Email or password is wrong"));
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

module.exports = { register, login, getCurrent, logout, changeSubscription };
