const express = require('express');
const router = express.Router();
const axios = require('axios');
const https = require('https');
const { sendEmail } = require('../emailService'); // Import sendEmail

// Elasticsearch credentials and URL
const ES_URL = process.env.ELASTICSEARCH_HOST;
const ES_USERNAME = process.env.ELASTICSEARCH_USERNAME;
const ES_PASSWORD = process.env.ELASTICSEARCH_PASSWORD;

// Create a new HTTPS agent with self-signed certificate handling
const httpsAgent = new https.Agent({  
  rejectUnauthorized: false
});

// Execute playbook route
router.post('/execute', async (req, res) => {
  const { alertId, index } = req.body;
  console.log('Received execute request:', req.body);

  if (!alertId || !index) {
    return res.status(400).json({ error: 'Alert ID and index are required' });
  }

  try {
    // Fetch the alert document from Elasticsearch
    const alertResponse = await axios.get(`${ES_URL}/${index}/_doc/${alertId}`, {
      auth: {
        username: ES_USERNAME,
        password: ES_PASSWORD,
      },
      httpsAgent
    });

    const alert = alertResponse.data._source;
    console.log('Fetched alert:', alert);

    // Implement the playbook logic here
    // Example: Send an email notification
    const emailSubject = `Alert: ${alert.severity || 'Unknown'} severity - ${alert.message}`;
    const emailText = `Alert Details:\n\nMessage: ${alert.message}\nSeverity: ${alert.severity || 'Unknown'}\nTimestamp: ${alert['@timestamp']}`;

    sendEmail('prasadrishi170@gmail.com', emailSubject, emailText); // Use your own email address for testing

    res.json({ message: 'Playbook executed successfully', alert });
  } catch (error) {
    console.error('Error executing playbook:', error);
    res.status(500).json({ error: 'Error executing playbook', details: error.response ? error.response.data : error.message });
  }
});

module.exports = router;
