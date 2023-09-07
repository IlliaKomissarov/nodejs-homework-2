const { Schema, model } = require("mongoose");
const Joi = require("joi");
const handleMongooseError = require("../utils/handleMongooseError");

const emailRegexp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema({
  password: {
    type: String,
    required: [true, "Set password for user"],
    minLength: [6, "The password must consist of 6 or more characters"],
  },
  email: {
    type: String,
    match: [emailRegexp, "The email must be a valid email address"],
    required: [true, "Email is required"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: { type: String, default: "" },
  avatarURL: {
    type: String,
    required: [true, "Set avatar for contact"],
  },
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: [true, "Verify token is required"],
  },
});

userSchema.post("save", handleMongooseError);

const authenticationSchema = Joi.object({
  email: Joi.string().regex(emailRegexp).required().messages({
    "string.pattern.base": "The email must be a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).messages({
    "string.min": "The password must consist of 6 or more characters",
  }),
});

const subscriptionSchema = Joi.object({
  subscription: Joi.string()
    .valid("starter", "pro", "business")
    .required()
    .messages({
      "any.required": "name subscription is required",
      "any.invalid": "Invalid subscription value",
    }),
});

const emailSchema = Joi.object({
  email: Joi.string().regex(emailRegexp).required().messages({
    "string.pattern.base": "The email must be a valid email address",
    "any.required": "Email is required",
  }),
});

const User = model("user", userSchema);

module.exports = {
  subscriptionSchema,
  authenticationSchema,
  emailSchema,
  User,
};
