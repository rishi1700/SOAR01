// IsolateHost.js
import React, { useState } from 'react';
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
    <div>
      <h2>Isolate Host</h2>
      <input
        type="text"
        placeholder="Host ID"
        value={hostId}
        onChange={(e) => setHostId(e.target.value)}
      />
      <button onClick={handleIsolate}>Isolate Host</button>
      <p>{response}</p>
    </div>
  );
};

export default IsolateHost;
