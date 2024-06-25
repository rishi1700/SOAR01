const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/case', async (req, res) => {
  const { title, description, severity } = req.body;
  console.log('Received create case request:', req.body);

  if (!title || !description || !severity) {
    return res.status(400).json({ error: 'Title, description, and severity are required' });
  }

  try {
    const response = await axios.post(
      `${process.env.THEHIVE_URL}/api/case`,
      {
        title,
        description,
        severity: parseInt(severity),
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.THEHIVE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error creating case in TheHive:', error.message);
    res.status(500).json({ error: 'Error creating case in TheHive' });
  }
});

module.exports = router;
