// backend/routes/correlation.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const https = require('https');
// routes/correlation.js
router.get('/', async (req, res) => {
    const { page = 1, limit = 10, severity, startDate, endDate } = req.query;
    const from = (page - 1) * limit;
  
    const filters = [];
    if (severity) filters.push({ match: { "alert_priority": severity } });
    if (startDate) filters.push({ range: { "@timestamp": { gte: startDate } } });
    if (endDate) filters.push({ range: { "@timestamp": { lte: endDate } } });
  
    const query = {
      from,
      size: limit,
      sort: [{ "@timestamp": { "order": "desc" } }],
      query: filters.length ? { bool: { must: filters } } : { match_all: {} },
      _source: ["@timestamp", "observable_alert_message", "observable_src_ip", "observable_dst_ip", "event.original"]
    };
  
    try {
      const response = await axios.post('https://192.168.18.10:9200/snort-logs-*/_search', query, {
        auth: {
          username: process.env.ELASTICSEARCH_USERNAME,
          password: process.env.ELASTICSEARCH_PASSWORD,
        },
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        headers: { 'Content-Type': 'application/json' }
      });
  
      const hits = response.data.hits.hits.map(hit => hit._source);
      res.json(hits);
    } catch (error) {
      console.error('Error correlating alerts:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
module.exports = router;
