import { Contact } from "../../schemas/contacts.js";
import { HttpError } from "../../helpers/HttpErrors.js";
import { ctrlWrapper } from "../../helpers/ctrlWrapper.js";

const add = async (req, res) => {
  const { name, email, phone } = req.body;
  const { _id: owner } = req.user;

  if (!name) {
    throw HttpError(400, `Missing required name field`);
  }

  const result = await Contact.create({ name, email, phone, owner });
  контакту;

  res.status(201).json({
    status: "success",
    code: 201,
    data: { contact: result },
  });
};

export const addContact = ctrlWrapper(add);
