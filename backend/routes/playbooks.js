const express = require('express');
const router = express.Router();
const axios = require('axios');
const https = require('https');
const { exec } = require('child_process');
const { sendAlertEmail } = require('../services/emailService');

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
    console.log(`Executing command: ${command}`);
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

router.post('/execute', async (req, res) => {
  const { alertId, index } = req.body;
  console.log('Received execute request:', req.body);

  if (!alertId || !index) {
    return res.status(400).json({ error: 'Alert ID and index are required' });
  }

  try {
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
    console.log(`Attempting to isolate host with ID: ${hostId}`);
    const isolateResponse = await blockIP(hostId);
    res.json({ message: 'Host isolated successfully', details: isolateResponse });
  } catch (error) {
    console.error('Error isolating host:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error });
  }
});

// Function to fetch correlated alerts from Elasticsearch
const fetchCorrelatedAlerts = async () => {
  try {
    const response = await axios.get(`${ES_URL}/snort-logs-*/_search`, {
      auth: {
        username: ES_USERNAME,
        password: ES_PASSWORD,
      },
      httpsAgent,
      params: {
        size: 10,
        sort: '@timestamp:desc',
        query: {
          match_all: {}
        }
      }
    });
    return response.data.hits.hits;
  } catch (error) {
    console.error('Error fetching correlated alerts:', error);
    throw new Error('Failed to fetch correlated alerts');
  }
};

router.post('/auto-response', async (req, res) => {
  try {
    const alerts = await fetchCorrelatedAlerts();
    const correlatedAlerts = {};

    alerts.forEach(alert => {
      const srcIp = alert._source.observable_src_ip;
      if (!correlatedAlerts[srcIp]) {
        correlatedAlerts[srcIp] = [];
      }
      correlatedAlerts[srcIp].push(alert);
    });

    console.log('Received correlated alerts:', JSON.stringify(correlatedAlerts, null, 2));
    for (const ip in correlatedAlerts) {
      const alerts = correlatedAlerts[ip];
      console.log(`Processing alerts for IP: ${ip}`, alerts);
      const highSeverityAlerts = alerts.filter(alert => alert._source && (alert._source.alert_priority === 'high' || alert._source.alert_priority === '0'));
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
