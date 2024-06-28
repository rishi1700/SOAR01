import React, { useState } from 'react';
import axios from 'axios';
import { Container, Button, Typography, CircularProgress } from '@mui/material';

const AutoResponse = () => {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAutoResponse = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/playbooks/auto-response');
      setResponse(res.data.message);
    } catch (error) {
      console.error('Error executing automated response:', error);
      setResponse('Error executing automated response');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Automated Response</Typography>
      <Button variant="contained" color="primary" onClick={handleAutoResponse} disabled={loading}>
        {loading ? <CircularProgress size={24} /> : 'Trigger Automated Response'}
      </Button>
      {response && (
        <Typography variant="body1" color="textSecondary" style={{ marginTop: '20px' }}>
          {response}
        </Typography>
      )}
    </Container>
  );
};

export default AutoResponse;
