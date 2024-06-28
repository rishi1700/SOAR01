import React, { useState } from 'react';
import { Container, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';

const IsolateHost = () => {
  const [hostId, setHostId] = useState('');
  const [response, setResponse] = useState('');

  const handleIsolate = async () => {
    try {
      const res = await axios.post('http://localhost:5000/playbooks/isolate-host', { hostId });
      setResponse(res.data.message);
    } catch (error) {
      console.error('Error isolating host:', error);
      setResponse('Error isolating host');
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Isolate Host</Typography>
      <TextField
        label="Host ID"
        value={hostId}
        onChange={(e) => setHostId(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleIsolate}>Isolate Host</Button>
      <Typography variant="body1" color="textSecondary" style={{ marginTop: '20px' }}>{response}</Typography>
    </Container>
  );
};

export default IsolateHost;
