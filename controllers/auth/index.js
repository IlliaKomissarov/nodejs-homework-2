const { ctrlWrapper } = require("../../helpers");

module.exports = {
  register: ctrlWrapper(require("./register")),
  login: ctrlWrapper(require("./login")),
  getCurrentUser: ctrlWrapper(require("./getCurrentUser")),
  logout: ctrlWrapper(require("./logout")),
  updateSubscription: ctrlWrapper(require("./updateSubscription")),
  updateAvatar: ctrlWrapper(require("./updateAvatar")),
};
