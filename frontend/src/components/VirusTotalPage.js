import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Paper, Box } from '@mui/material';

const VirusTotalPage = () => {
  const [data, setData] = useState(null);
  const [hash, setHash] = useState('');

  const fetchData = async () => {
    try {
      const response = await axios.get(`/api/virustotal/scan/${hash}`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data from VirusTotal:', error);
    }
  };

  useEffect(() => {
    if (hash) {
      fetchData();
    }
  }, [hash]);

  return (
    <Container>
      <Paper elevation={3} style={{ marginTop: 20, padding: 20 }}>
        <Typography variant="h4" gutterBottom>
          VirusTotal Analysis
        </Typography>
        <Box component="form" onSubmit={(e) => { e.preventDefault(); fetchData(); }}>
          <input
            type="text"
            value={hash}
            onChange={(e) => setHash(e.target.value)}
            placeholder="Enter file hash"
          />
          <button type="submit">Scan</button>
        </Box>
        {data && (
          <Box mt={4}>
            <Typography variant="h6">Results:</Typography>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default VirusTotalPage;
