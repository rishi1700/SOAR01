const express = require('express');
const router = express.Router();
const axios = require('axios');
const https = require('https');
const { sendAlertEmail } = require('../services/emailService');
const { exec } = require('child_process');

// Elasticsearch credentials and URL
const ES_URL = process.env.ELASTICSEARCH_HOST;
const ES_USERNAME = process.env.ELASTICSEARCH_USERNAME;
const ES_PASSWORD = process.env.ELASTICSEARCH_PASSWORD;

// Create a new HTTPS agent with self-signed certificate handling
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

// Function to block IP using iptables
const blockIP = async (ip) => {
  return new Promise((resolve, reject) => {
    const command = `ssh rishi@192.168.18.14 "sudo /sbin/iptables -A INPUT -s ${ip} -j DROP && sudo /sbin/iptables -A OUTPUT -d ${ip} -j DROP"`;
    console.log(`Executing command: ${command}`);  // Log the command
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error blocking IP: ${stderr}`);
        reject(`Error blocking IP: ${stderr}`);
      } else {
        console.log(`Command output: ${stdout}`);
        resolve(`IP ${ip} blocked successfully: ${stdout}`);
      }
    });
  });
};

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

router.post('/isolate-host', async (req, res) => {
  const { hostId } = req.body;

  try {
    console.log(`Attempting to isolate host with ID: ${hostId}`);  // Add a log for the hostId
    const isolateResponse = await blockIP(hostId);
    res.json({ message: 'Host isolated successfully', details: isolateResponse });
  } catch (error) {
    console.error('Error isolating host:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error });
  }
});

router.post('/auto-response', async (req, res) => {
  const { correlatedAlerts } = req.body;

  try {
    console.log('Received correlated alerts:', JSON.stringify(correlatedAlerts, null, 2));
    for (const ip in correlatedAlerts) {
      // Example: Isolate host if multiple high severity alerts are detected for the same IP
      const alerts = correlatedAlerts[ip];
      console.log(`Processing alerts for IP: ${ip}`, alerts);
      const highSeverityAlerts = alerts.filter(alert => alert._source && alert._source.alert_priority === 'high');
      console.log(`High severity alerts for IP ${ip}:`, highSeverityAlerts);
      if (highSeverityAlerts.length > 1) {
        console.log(`Blocking IP: ${ip} due to multiple high severity alerts`);
        await blockIP(ip);
      } else {
        console.log(`No action needed for IP: ${ip}`);
      }
    }
    res.json({ message: 'Automated response executed successfully' });
  } catch (error) {
    console.error('Error executing automated response:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
