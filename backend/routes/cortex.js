// routes/cortex.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

const { sendAlertEmail } = require('../services/emailService');

const CORTEX_URL = process.env.CORTEX_URL;
const CORTEX_API_KEY = process.env.CORTEX_API_KEY;
const THEHIVE_URL = process.env.THEHIVE_URL;
const THEHIVE_API_KEY = process.env.THEHIVE_API_KEY;

const processedIPs = new Set();

const createCaseInTheHive = async (title, description, severity) => {
    try {
        const response = await axios.post(
            `${THEHIVE_URL}/api/case`,
            { title, description, severity },
            {
                headers: {
                    Authorization: `Bearer ${THEHIVE_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error creating case in TheHive:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// List Analyzers
router.get('/analyzers', async (req, res) => {
    try {
        const response = await axios.get(`${CORTEX_URL}/api/analyzer`, {
            headers: {
                'Authorization': `Bearer ${CORTEX_API_KEY}`
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching analyzers:', error);
        res.status(500).json({ error: error.message });
    }
});

// Run Analyzer
router.post('/analyze', async (req, res) => {
    const { observable, analyzerId } = req.body;
    try {
        const response = await axios.post(
            `${CORTEX_URL}/api/analyzer/${analyzerId}/run`,
            {
                data: observable,
                dataType: 'ip',
                tlp: 0,
                message: 'Running analysis',
                parameters: {}
            },
            {
                headers: {
                    'Authorization': `Bearer ${CORTEX_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const jobId = response.data.id;
        const report = await pollForResult(jobId);

        // Check if malicious engines are greater than or equal to 1
        if (report.report.summary.taxonomies.length >= 1) {
            // Fetch the analyzer name
            const analyzerResponse = await axios.get(`${CORTEX_URL}/api/analyzer/${analyzerId}`, {
                headers: {
                    'Authorization': `Bearer ${CORTEX_API_KEY}`
                }
            });
            const analyzerName = analyzerResponse.data.name;

            // Only send email if the IP is not already processed
            if (!processedIPs.has(observable)) {
                const recipientEmail = 'prasadrishi170@gmail.com'; // Define the recipient email
                const subject = `Malicious Activity Detected on IP ${observable}`;
                const emailBody = `A malicious activity has been detected on IP ${observable} using analyzer ${analyzerName}.\n\nDetails:\n${JSON.stringify(report.report.full.results[0].result, null, 2)}`;

                sendAlertEmail(recipientEmail, subject, emailBody);

                const caseTitle = `Malicious Activity Detected on IP ${observable}`;
                const caseDescription = `Details:\n${JSON.stringify(report.report.full.results[0].result, null, 2)}`;
                const caseSeverity = 2; // Example severity level

                try {
                    const hiveCase = await createCaseInTheHive(caseTitle, caseDescription, caseSeverity);
                    console.log('Case created successfully in TheHive:', hiveCase);
                } catch (error) {
                    console.error('Failed to create case in TheHive:', error);
                }

                processedIPs.add(observable);
            }
        }

        res.json(report);  // Ensure response is sent once
    } catch (error) {
        console.error(`Error running analyzer ${analyzerId} on ${observable}:`, error);
        if (!res.headersSent) {
            res.status(500).json({ error: error.message });
        }
    }
});

const pollForResult = async (jobId) => {
    const maxRetries = 10;
    let attempts = 0;
    while (attempts < maxRetries) {
        try {
            const response = await axios.get(`${CORTEX_URL}/api/job/${jobId}/waitreport?atMost=1minute`, {
                headers: {
                    'Authorization': `Bearer ${CORTEX_API_KEY}`
                }
            });
            if (response.data.status !== 'InProgress') {
                return response.data;
            }
            await new Promise(resolve => setTimeout(resolve, 5000));
            attempts++;
        } catch (error) {
            console.error('Error polling for result:', error);
            throw error;
        }
    }
    throw new Error('Max polling attempts reached');
};

module.exports = router;
