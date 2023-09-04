const express = require("express");
const {
  getContacts,
  addContact,
  getContactsById,
  updateContact,
  updateFavorite,
  deleteContact,
} = require("../../controllers/contacts");
const validateBody = require("../../utils/validateBody");
const {
  requiredSchema,
  noRequiredSchema,
  updateFavoriteSchema,
} = require("../../models/contact");
const isValidId = require("../../utils/isValidId");
const authentication = require("../../middlewares/authenticate ");

const router = express.Router();

router.use(authentication);

router.get("/", getContacts);

router.get("/:contactId", isValidId, getContactsById);

router.post("/", validateBody(requiredSchema), addContact);

router.delete("/:contactId", isValidId, deleteContact);

router.put(
  "/:contactId",
  isValidId,
  validateBody(noRequiredSchema),
  updateContact
);

router.patch(
  "/:contactId/favorite",
  isValidId,
  validateBody(updateFavoriteSchema),
  updateFavorite
);

module.exports = router;
