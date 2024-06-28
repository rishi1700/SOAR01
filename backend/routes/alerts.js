const express = require('express');
const router = express.Router();
const { Client } = require('@elastic/elasticsearch');

const ES_URL = process.env.ELASTICSEARCH_HOST;
const ES_USERNAME = process.env.ELASTICSEARCH_USERNAME;
const ES_PASSWORD = process.env.ELASTICSEARCH_PASSWORD;

const client = new Client({
  node: ES_URL,
  auth: {
    username: ES_USERNAME,
    password: ES_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await client.search({
            index: 'snort-logs-*',
            body: {
                query: {
                    match: { _id: id }
                }
            }
        });
        console.log('Elasticsearch response:', result); // Add this line
        res.json(result);
    } catch (error) {
        console.error('Error fetching alert details:', error);
        res.status(500).json({ error: 'Error fetching alert details' });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await client.search({
        index: 'snort-logs-*',
        body: {
          query: {
            ids: {
              values: [id],
            },
          },
        },
      });
  
      if (result && result.hits && result.hits.hits.length > 0) {
        res.json(result.hits.hits[0]._source);
      } else {
        res.status(404).json({ error: 'Alert not found' });
      }
    } catch (error) {
      console.error('Error fetching alert details:', error);
      res.status(500).json({ error: 'Error fetching alert details' });
    }
  });

module.exports = router;
