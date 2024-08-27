const transporter = require('../config/nodemailer');
const  serverConfig  = require('../config/server-config');
const messages = require('../utils/message');

async function sendEmail(to, subject, text) {
  const mailOptions = {
    from: serverConfig.MAIL,
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);
  } catch (error) {
    console.error(`${messages.INTERNAL_SERVER_ERROR}: Error sending email to ${to}:`, error);
  }
}

module.exports = { sendEmail };
