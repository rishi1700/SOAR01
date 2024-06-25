// routes/threatIntelligence.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

const ABUSEIPDB_API_KEY = process.env.ABUSEIPDB_API_KEY;

router.post('/check-ip', async (req, res) => {
    const { ip } = req.body;
    try {
        const response = await axios.get(`https://api.abuseipdb.com/api/v2/check`, {
            params: { ipAddress: ip },
            headers: { 'Key': ABUSEIPDB_API_KEY, 'Accept': 'application/json' }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error checking IP:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
