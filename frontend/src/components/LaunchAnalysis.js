// LaunchAnalysis.js
import React, { useState } from 'react';
import axios from 'axios';

const LaunchAnalysis = () => {
  const [observable, setObservable] = useState('');
  const [response, setResponse] = useState('');
  const analyzerId = 'e04c7cdaf80d42c77932d9661da358f4';  // Using the correct analyzer ID

  const handleAnalyze = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/cortex/analyze', {
        observable,
        analyzerId,
      });
      setResponse(JSON.stringify(res.data, null, 2));
    } catch (error) {
      console.error('Error running analysis:', error);
      setResponse('Error running analysis');
    }
  };

  return (
    <div>
      <h2>Launch Cortex Analysis</h2>
      <input
        type="text"
        placeholder="Observable (e.g., IP address)"
        value={observable}
        onChange={(e) => setObservable(e.target.value)}
      />
      <button onClick={handleAnalyze}>Analyze</button>
      <pre>{response}</pre>
    </div>
  );
};

export default LaunchAnalysis;
