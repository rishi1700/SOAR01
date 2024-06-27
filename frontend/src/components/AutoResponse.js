import React, { useState } from 'react';
import axios from 'axios';

const AutoResponse = () => {
  const [response, setResponse] = useState('');

  const handleAutoResponse = async () => {
    try {
      const correlatedAlerts = {
        '192.168.18.35': [
          // Example alert data, replace with actual data structure
          { _source: { alert_priority: 'high', message: 'SQL Injection Attempt' } },
          { _source: { alert_priority: 'high', message: 'Brute Force Attempt' } }
        ]
      };
      const res = await axios.post('http://localhost:5000/playbooks/auto-response', { correlatedAlerts });
      setResponse(res.data.message);
    } catch (error) {
      console.error('Error executing automated response:', error);
      setResponse('Error executing automated response');
    }
  };

  return (
    <div>
      <h2>Automated Response</h2>
      <button onClick={handleAutoResponse}>Trigger Automated Response</button>
      <p>{response}</p>
    </div>
  );
};

export default AutoResponse;
