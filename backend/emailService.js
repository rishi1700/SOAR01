// emailService.js
const nodemailer = require('nodemailer');
require('dotenv').config();
//console.log('EMAIL_USER:', process.env.EMAIL_USER); // Add this line to check if the environment variables are loaded correctly
//console.log('EMAIL_PASS:', process.env.EMAIL_PASS); // Add this line to check if the environment variables are loaded correctly

const smtpTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

const sendEmail = (to, subject, text) => {
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

module.exports = { sendEmail };
