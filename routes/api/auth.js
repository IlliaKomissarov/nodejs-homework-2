const express = require("express");
const validateBody = require("../../utils/validateBody");
const {
  authenticationSchema,
  subscriptionSchema,
} = require("../../models/user");
const {
  register,
  login,
  getCurrent,
  logout,
  changeSubscription,
} = require("../../controllers/auth-controllers");
const authentication = require("../../middlewares/authenticate ");

const router = express.Router();

router.post("/register", validateBody(authenticationSchema), register);

router.post("/login", validateBody(authenticationSchema), login);

router.post("/logout", authentication, logout);

router.get("/current", authentication, getCurrent);

router.patch(
  "/",
  authentication,
  validateBody(subscriptionSchema),
  changeSubscription
);

module.exports = router;
