// emailSender.js
const transporter = require("./config/emailConfig");

async function sendEmail(to, subject, text) {
  try {
    let info = await transporter.sendMail({
      from: '"Time_manager" timemanager@brevo.com',
      to,
      subject,
      text,
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

module.exports = { sendEmail };
