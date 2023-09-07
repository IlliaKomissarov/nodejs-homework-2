const nodemailer = require("nodemailer");
require("dotenv").config();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const { META_PASSWORD } = process.env;

const nodemailerConfig = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: "iliakomissarow99@gmail.com",
    pass: META_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (data) => {
  const email = { ...data, from: "iliakomissarow99@gmail.com" };
  await transport
    .sendMail(email)
    .then((msg) => console.log(msg)) // logs response data
    .catch((err) => console.log(err)); // logs any error
};

module.exports = sendEmail;
