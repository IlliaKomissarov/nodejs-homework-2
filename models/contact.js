const { Schema, model } = require("mongoose");
const Joi = require("joi");
const handleMongooseError = require("../utils/handleMongooseError");

const emailRegexp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const phoneRegexp = /^[0-9]{10}$/;

const contactSchema = new Schema(
  {
    name: { type: String, required: [true, "Set name for contact"] },
    email: {
      type: String,
      required: [true, "Set email for contact"],
      match: emailRegexp,
    },
    phone: {
      type: String,
      required: [true, "Set phone for contact"],
      match: phoneRegexp,
    },
    favorite: { type: Boolean, default: false },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false }
);

contactSchema.post("save", handleMongooseError);

const requiredSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().regex(emailRegexp).required(),
  phone: Joi.string()
    .regex(phoneRegexp)
    .messages({ "string.pattern.base": `Phone number must have 10 digits.` })
    .required(),
  favorite: Joi.boolean().default(false),
});

const noRequiredSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30),
  email: Joi.string().regex(emailRegexp),
  phone: Joi.string()
    .regex(phoneRegexp)
    .messages({ "string.pattern.base": `Phone number must have 10 digits.` }),
  favorite: Joi.boolean(),
});

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean()
    .required()
    .messages({ "any.required": "missing field favorite" }),
});

const Contact = model("contact", contactSchema);

module.exports = {
  updateFavoriteSchema,
  requiredSchema,
  noRequiredSchema,
  Contact,
};
