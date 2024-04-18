import transporter from "./config/emailConfig";

async function sendEmail(to, subject, html) {
  try {
    let info = await transporter.sendMail({
      from: '"Time_manager" <timemanager@brevo.com>',
      to,
      subject,
      html
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

module.exports = sendEmail;