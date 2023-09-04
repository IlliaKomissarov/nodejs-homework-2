const { HttpError } = require("../helpers");
const { Contact } = require("../models/contact");

const getContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10, ...filter } = req.query;
  const skip = (page - 1) * limit;
  console.log(filter);

  const contacts = await Contact.find({
    owner,
    ...(Object.keys(filter).length !== 0 && filter),
  })
    .skip(skip)
    .limit(limit)
    .populate("owner", "email");

  res.status(200).json({ contacts: contacts });
};

const getContactsById = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  const contact = await Contact.findOne({ _id: contactId, owner });

  if (!contact) {
    return next(HttpError(404, "Contact not found"));
  }

  res.status(200).json({ contact: contact });
};

const addContact = async (req, res, next) => {
  const { name, email, phone } = req.body;
  const { _id: owner } = req.user;
  const contact = await Contact.create({ name, email, phone, owner }).populate(
    "owner",
    "email"
  );

  res.status(201).json({ contact: contact });
};

const deleteContact = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;

  const deleteContact = await Contact.findOneAndDelete({
    _id: contactId,
    owner,
  });

  if (!deleteContact) {
    next();
  }

  res.status(200).json({ contact: deleteContact });
};

const updateContact = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;

  if (Object.keys(req.body).length === 0) {
    next(HttpError(400, "missing fields"));
  }

  const contact = await Contact.findOneAndUpdate(
    {
      _id: contactId,
      owner,
    },
    req.body,
    {
      new: true,
    }
  );

  if (!contact) {
    next();
  }

  res.status(200).json({ contact: contact });
};

const updateFavorite = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;

  if (Object.keys(req.body).length === 0) {
    next(HttpError(400, "missing field favorite"));
  }
  const contact = await Contact.findOneAndUpdate(
    {
      _id: contactId,
      owner,
    },
    req.body,
    {
      new: true,
    }
  );

  res.status(200).json({ contact: contact });
};

module.exports = {
  getContacts,
  getContactsById,
  addContact,
  deleteContact,
  updateContact,
  updateFavorite,
};
