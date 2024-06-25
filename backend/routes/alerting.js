// routes/alerting.js
const express = require('express');
const axios = require('axios');
const nodemailer = require('nodemailer');
const https = require('https');
const router = express.Router();

const { ELASTICSEARCH_HOST, ELASTICSEARCH_USERNAME, ELASTICSEARCH_PASSWORD, EMAIL_USER, EMAIL_PASS, SMTP_HOST, SMTP_PORT } = process.env;

const httpsAgent = new https.Agent({
  rejectUnauthorized: false, // Ignore self-signed certificate
});

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

router.post('/set-alert', async (req, res) => {
    const { criteria, email } = req.body;
    try {
        const query = {
            query: {
                match: {
                    message: criteria
                }
            }
        };

        // Execute query to fetch matching alerts from the correct index
        const alertResponse = await axios.post(`${ELASTICSEARCH_HOST}/snort-logs-*/_search`, query, {
            auth: {
                username: ELASTICSEARCH_USERNAME,
                password: ELASTICSEARCH_PASSWORD
            },
            httpsAgent
        });

        const alerts = alertResponse.data.hits.hits;

        // Send email notification with matching alerts (simplified)
        const mailOptions = {
          from: EMAIL_USER,
          to: email,
          subject: 'New Alerts Matching Your Criteria',
          text: JSON.stringify(alerts, null, 2)
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ error: error.message });
          }
          console.log('Email sent:', info.response);
          res.json({ message: 'Alert set successfully and email sent', data: info.response });
        });
    } catch (error) {
        console.error('Error setting alert:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
