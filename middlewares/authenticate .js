const { HttpError } = require("../helpers");
const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { SECRET_KEY } = process.env;

const authentication = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [baerer, token] = authorization.split(" ");

  if (baerer !== "Bearer") {
    next(HttpError(401, "Not authorized"));
  }

  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);

    if (!user || !user.token || user.token !== token) {
      next(HttpError(401, "Not authorized"));
    }
    req.user = user;
    next();
  } catch {
    next(HttpError(401, "Not authorized"));
  }
};

module.exports = authentication;
