import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import './CortexPage.css';

const CortexPage = () => {
  const [analyzers, setAnalyzers] = useState([]);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalyzers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/cortex/analyzers');
        setAnalyzers(response.data);
      } catch (error) {
        console.error('Error fetching analyzers:', error);
        setError(error.response ? error.response.data : error.message);
      }
    };

    fetchAnalyzers();
  }, []);

  useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.on('dataUpdate', (newData) => {
      const ipAddresses = newData.map(hit => hit._source.observable_src_ip);
      runAnalyzers(ipAddresses);
    });

    return () => {
      socket.disconnect();
    };
  }, [analyzers]);

  const runAnalyzers = async (ipAddresses) => {
    const results = [];
    for (const ip of ipAddresses) {
      for (const analyzer of analyzers) {
        try {
          const response = await axios.post('http://localhost:5000/api/cortex/analyze', {
            observable: ip,
            analyzerId: analyzer.id,
          });

          const jobId = response.data.id;
          const report = await pollForResult(jobId);
          results.push({
            ip,
            analyzer: analyzer.name,
            result: report,
            status: report.status,
            date: new Date(report.updatedAt).toLocaleString(),
            maliciousEngines: report.report.summary.taxonomies.length,
            details: report.report.full.results[0].result.map(item => ({
              date: item.date,
              info: item.info,
              tags: item.Tag.map(tag => tag.name).join(', '),
            })),
          });
        } catch (error) {
          console.error(`Error analyzing ${ip} with ${analyzer.name}:`, error);
          results.push({
            ip,
            analyzer: analyzer.name,
            error: error.response ? error.response.data : error.message,
          });
        }
      }
    }

    setResults(results.slice(-5));
  };

  const pollForResult = async (jobId) => {
    const maxRetries = 10;
    let attempts = 0;

    while (attempts < maxRetries) {
      try {
        const response = await axios.get(`http://localhost:5000/api/cortex/job/${jobId}/report`);
        if (response.data.status !== 'InProgress') {
          return response.data;
        }
        await new Promise(resolve => setTimeout(resolve, 5000));
        attempts++;
      } catch (error) {
        console.error('Error polling for result:', error);
        throw error;
      }
    }
    throw new Error('Max polling attempts reached');
  };

  return (
    <div>
      <h1>Cortex Analyzer</h1>
      <h2>Enabled Analyzers</h2>
      <ul>
        {analyzers.map(analyzer => (
          <li key={analyzer.id}>{analyzer.name}</li>
        ))}
      </ul>
      <h2>Analysis Results</h2>
      <table>
        <thead>
          <tr>
            <th>IP</th>
            <th>Analyzer</th>
            <th>Status</th>
            <th>Message</th>
            <th>Date</th>
            <th>Malicious Engines</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr key={index}>
              <td>{result.ip}</td>
              <td>{result.analyzer}</td>
              <td>{result.status}</td>
              <td>{result.message || 'N/A'}</td>
              <td>{result.date}</td>
              <td>{result.maliciousEngines}</td>
              <td>
                {result.details && result.details.length > 0 ? (
                  <ul>
                    {result.details.map((detail, idx) => (
                      <li key={idx}>
                        {detail.date} - {detail.info} ({detail.tags})
                      </li>
                    ))}
                  </ul>
                ) : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {error && (
        <div>
          <h2>Error</h2>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default CortexPage;
