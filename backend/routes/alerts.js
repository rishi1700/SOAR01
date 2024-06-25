const express = require('express');
const axios = require('axios');
const router = express.Router();

const ES_URL = process.env.ELASTICSEARCH_HOST;
const ES_USERNAME = process.env.ELASTICSEARCH_USERNAME;
const ES_PASSWORD = process.env.ELASTICSEARCH_PASSWORD;

router.get('/alerts', async (req, res) => {
    try {
        const response = await axios.get(`${ES_URL}/snort-logs-*/_search`, {
            auth: {
                username: ES_USERNAME,
                password: ES_PASSWORD
            },
            params: {
                size: 1000,
                sort: [{ '@timestamp': { order: 'desc' } }]
            },
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const alerts = response.data.hits.hits.map(hit => hit._source);
        res.json(alerts);
    } catch (error) {
        console.error('Error fetching alerts from Elasticsearch:', error.message);
        res.status(500).json({ error: 'Error fetching alerts from Elasticsearch' });
    }
});

module.exports = router;
