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
  updateAvatar,
} = require("../../controllers/auth-controllers");
const authentication = require("../../middlewares/authenticate");
const upload = require("../../middlewares/upload");

const router = express.Router();

router.post("/register", validateBody(authenticationSchema), register);

router.post("/login", validateBody(authenticationSchema), login);

router.post("/logout", authentication, logout);

router.get("/current", authentication, getCurrent);

router.patch("/avatars", authentication, upload.single("avatar"), updateAvatar);

router.patch(
  "/",
  authentication,
  validateBody(subscriptionSchema),
  changeSubscription
);

module.exports = router;
