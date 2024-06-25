// emailService.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const smtpTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

const sendAlertEmail = (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  smtpTransport.sendMail(mailOptions, (error, response) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', response);
    }
  });
};

module.exports = { sendAlertEmail };
