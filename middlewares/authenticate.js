const jwt = require("jsonwebtoken");

const { HttpError } = require("../helpers");
const { User } = require("../models");
const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer" || !token) {
    next(HttpError(401, "User is unauthorized"));
  }

  try {
    const { id } = jwt.verify(token, SECRET_KEY);

    const user = await User.findById(id);
    if (!user) {
      next(HttpError(401, "This user is not in the database"));
    }

    if (!user.token || user.token !== token) {
      next(HttpError(401, "The token is invalid"));
    }

    req.user = user;

    next();
  } catch {
    next(HttpError(401, "The token is invalid"));
  }
};

module.exports = authenticate;
