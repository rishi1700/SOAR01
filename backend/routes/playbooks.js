const express = require('express');
const router = express.Router();
const axios = require('axios');
const https = require('https');
const { sendAlertEmail } = require('../services/emailService');

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

    const alert = alertResponse.data;
    console.log('Full alert response:', JSON.stringify(alert, null, 2));

    const alertSource = alert._source;
    console.log('Fetched alert source:', alertSource);

    // Send an email with alert details
    sendAlertEmail(
      'prasadrishi170@gmail.com',
      'Alert Notification',
      `Alert Details:\n\nMessage: ${alertSource.event ? alertSource.event.original : 'N/A'}\nSeverity: ${alertSource.alert_priority || 'Unknown'}\nTimestamp: ${alertSource['@timestamp']}`
    );

    res.json({ message: 'Playbook executed successfully', alert: alertSource });
  } catch (error) {
    console.error('Error executing playbook:', error);
    res.status(500).json({ error: 'Error executing playbook', details: error.response ? error.response.data : error.message });
  }
});

module.exports = router;
