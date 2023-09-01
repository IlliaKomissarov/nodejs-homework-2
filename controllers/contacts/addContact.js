const { Contact } = require("../../models");
const { HttpError } = require("../../helpers");

const addContact = async (req, res) => {
  const { _id: owner } = req.user;
  const { email, phone } = req.body;
  const contactEmail = await Contact.findOne({ email });
  const contactPhone = await Contact.findOne({ phone });

  if (contactEmail) {
    throw HttpError(
      409,
      "This email has already been in database. Please change email address"
    );
  } else if (contactPhone) {
    throw HttpError(
      409,
      "This phone has already been in database. Please change phone number"
    );
  }

  const result = await Contact.create({ ...req.body, owner });
  return res.status(201).json(result);
};

module.exports = addContact;
