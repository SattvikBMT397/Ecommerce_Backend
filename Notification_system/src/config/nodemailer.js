const nodemailer = require('nodemailer');
const serverConfig = require('./server-config');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: serverConfig.MAIL,
    pass: serverConfig.PASS,
  },
});

module.exports = transporter;
