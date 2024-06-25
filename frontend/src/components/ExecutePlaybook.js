import React, { useState } from 'react';
import axios from 'axios';

const ExecutePlaybook = () => {
  const [alertId, setAlertId] = useState('iZJyTJABheeGgZ8WY1lv'); // Replace with the new document ID
  const [index, setIndex] = useState('snort-logs-2024.06.13');
  const [response, setResponse] = useState('');

  const handleExecute = async () => {
    try {
      const res = await axios.post('http://localhost:5000/playbooks/execute', { alertId, index });
      setResponse(res.data.message);
    } catch (error) {
      console.error('Error executing playbook:', error);
      setResponse('Error executing playbook');
    }
  };

  return (
    <div>
      <h2>Execute Playbook</h2>
      <input
        type="text"
        placeholder="Alert ID"
        value={alertId}
        onChange={(e) => setAlertId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Index"
        value={index}
        onChange={(e) => setIndex(e.target.value)}
      />
      <button onClick={handleExecute}>Execute Playbook</button>
      <p>{response}</p>
    </div>
  );
};

export default ExecutePlaybook;
