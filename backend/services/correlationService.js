// services/correlationService.js
const { Client } = require('@elastic/elasticsearch');
const esClient = new Client({ node: 'https://192.168.18.10:9200' });

async function correlateAlerts(index) {
  const query = {
    "query": {
      "bool": {
        "should": [
          { "match_all": {} },
          { "match": { "index": "misp-events" } }
        ]
      }
    },
    "sort": [
      { "@timestamp": { "order": "desc" } }
    ]
  };
  const response = await esClient.search({ index, body: query });
  const alerts = response.body.hits.hits;

  // Additional correlation logic
  const correlatedAlerts = alerts.reduce((acc, alert) => {
    const srcIp = alert._source.observable_src_ip;
    const correlated = alerts.filter(a => a._source.observable_src_ip === srcIp);
    acc.push(...correlated);
    return acc;
  }, []);

  return correlatedAlerts;
}

module.exports = { correlateAlerts };
