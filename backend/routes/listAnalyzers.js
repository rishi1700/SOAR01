const axios = require('axios');

const CORTEX_URL = 'http://192.168.18.12:9001';  // Replace with your Cortex instance URL
const CORTEX_API_KEY = 'Z2q2oZRz29s/VXT9JvWA3WV5cLJ0eXer';  // Replace with your Cortex API key

const listAnalyzers = async () => {
  try {
    const response = await axios.get(`${CORTEX_URL}/api/analyzer`, {
      headers: {
        'Authorization': `Bearer ${CORTEX_API_KEY}`
      }
    });
    console.log('Available Analyzers:', response.data);
  } catch (error) {
    console.error('Error fetching analyzers:', error.message);
  }
};

listAnalyzers();
