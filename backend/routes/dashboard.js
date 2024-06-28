const express = require('express');
const router = express.Router();
const { Client } = require('@elastic/elasticsearch');
const https = require('https');

const client = new Client({
  node: 'https://192.168.18.10:9200',
  auth: {
    username: process.env.ELASTICSEARCH_USERNAME,
    password: process.env.ELASTICSEARCH_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

router.get('/alert-stats', async (req, res) => {
  try {
    const result = await client.search({
      index: 'snort-logs-*',
      body: {
        size: 0,
        aggs: {
          by_severity: {
            terms: {
              field: 'alert_priority.keyword'
            }
          },
          by_time: {
            date_histogram: {
              field: '@timestamp',
              calendar_interval: 'day'
            }
          },
          top_src_ips: {
            terms: {
              field: 'observable_src_ip.keyword',
              size: 10
            }
          },
          top_dst_ips: {
            terms: {
              field: 'observable_dst_ip.keyword',
              size: 10
            }
          }
        }
      }
    });

    //console.log('Elasticsearch response:', JSON.stringify(result, null, 2));
    res.json(result.aggregations);
  } catch (error) {
    //console.error('Error fetching alert stats:', error);
    res.status(500).json({ error: 'Error fetching alert stats' });
  }
});

router.get('/alerts/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await client.get({
        index: 'snort-logs-*',
        id: id
      });
      res.json(result);
    } catch (error) {
      console.error('Error fetching alert details:', error);
      res.status(500).json({ error: 'Error fetching alert details' });
    }
});

module.exports = router;
