const express = require('express');
const axios = require('axios');
const router = express.Router();

const MISP_API = process.env.MISP_API;
const MISP_KEY = process.env.MISP_KEY;

router.get('/threat-intelligence', async (req, res) => {
  try {
    const response = await axios.get(`${MISP_API}/attributes/restSearch`, {
      headers: {
        'Authorization': MISP_KEY,
        'Accept': 'application/json',
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching threat intelligence' });
  }
});

module.exports = router;
