// routes/alerts.js
const express = require('express');
const axios = require('axios');
const https = require('https');
const router = express.Router();

const ELASTICSEARCH_HOST = process.env.ELASTICSEARCH_HOST;
const ELASTICSEARCH_USERNAME = process.env.ELASTICSEARCH_USERNAME;
const ELASTICSEARCH_PASSWORD = process.env.ELASTICSEARCH_PASSWORD;

const httpsAgent = new https.Agent({
  rejectUnauthorized: false, // Ignore self-signed certificate
});

router.get('/trends', async (req, res) => {
    const requestBody = {
        size: 0,
        aggs: {
            alerts_over_time: {
                date_histogram: {
                    field: '@timestamp',
                    fixed_interval: '1d' // Specify interval with a time unit
                }
            }
        }
    };

    console.log('Requesting Elasticsearch with body:', JSON.stringify(requestBody, null, 2));

    try {
        const response = await axios.post(`${ELASTICSEARCH_HOST}/snort-logs-*/_search`, requestBody, { // Use correct index pattern
            auth: {
                username: ELASTICSEARCH_USERNAME,
                password: ELASTICSEARCH_PASSWORD
            },
            httpsAgent
        });

        console.log('Elasticsearch response:', response.data);

        const data = response.data.aggregations.alerts_over_time.buckets.map(bucket => ({
            date: bucket.key_as_string,
            alerts: bucket.doc_count
        }));

        res.json(data);
    } catch (error) {
        console.error('Error fetching alert trends:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
