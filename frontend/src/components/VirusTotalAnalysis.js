// VirusTotalAnalysis.js
import React, { useState } from 'react';
import axios from 'axios';

const VirusTotalAnalysis = () => {
  const [observable, setObservable] = useState('');
  const [type, setType] = useState('ip');
  const [response, setResponse] = useState('');

  const handleAnalyze = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/virustotal/analyze', { observable, type });
      setResponse(res.data);
    } catch (error) {
      console.error('Error analyzing with VirusTotal:', error);
      setResponse('Error analyzing with VirusTotal');
    }
  };

  return (
    <div>
      <h2>VirusTotal Analysis</h2>
      <input
        type="text"
        placeholder="Observable"
        value={observable}
        onChange={(e) => setObservable(e.target.value)}
      />
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="ip">IP</option>
        <option value="domain">Domain</option>
        <option value="hash">File Hash</option>
      </select>
      <button onClick={handleAnalyze}>Analyze</button>
      <pre>{JSON.stringify(response, null, 2)}</pre>
    </div>
  );
};

export default VirusTotalAnalysis;
