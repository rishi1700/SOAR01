// virustotal.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/analyze', async (req, res) => {
  const { observable, type } = req.body; // type can be ip, domain, or hash
  try {
    const response = await axios.get(`https://www.virustotal.com/api/v3/${type}/${observable}`, {
      headers: {
        'x-apikey': process.env.VIRUSTOTAL_API_KEY,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data from VirusTotal:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
