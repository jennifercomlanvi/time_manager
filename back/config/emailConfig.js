const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: "comlanviida@yahoo.fr",
    pass: "Y2nFDCsABUcZEPLK",
  },
});

module.exports = transporter;
