// CorrelatedAlerts.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CorrelatedAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({ severity: '', startDate: '', endDate: '' });

  const fetchAlerts = async (pageNumber, filters) => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/correlation', {
        params: { page: pageNumber, limit: 10, ...filters },
      });
      if (Array.isArray(response.data)) {
        setAlerts(prevAlerts => [...prevAlerts, ...response.data]);
      } else {
        setError('Invalid data format received');
      }
    } catch (error) {
      console.error('Error fetching correlated alerts:', error);
      setError('Error fetching correlated alerts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts(page, filter);
  }, [page, filter]);

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setAlerts([]);
    fetchAlerts(1, filter);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Correlated Alerts</h2>
      <form onSubmit={handleFilterSubmit}>
        <label>
          Severity:
          <input type="text" name="severity" value={filter.severity} onChange={handleFilterChange} />
        </label>
        <label>
          Start Date:
          <input type="date" name="startDate" value={filter.startDate} onChange={handleFilterChange} />
        </label>
        <label>
          End Date:
          <input type="date" name="endDate" value={filter.endDate} onChange={handleFilterChange} />
        </label>
        <button type="submit">Apply Filters</button>
      </form>
      {alerts.length === 0 ? (
        <p>No correlated alerts found.</p>
      ) : (
        <ul>
          {alerts.map((alert, index) => (
            <li key={index}>
              <p>Timestamp: {alert['@timestamp']}</p>
              <p>Alert Message: {alert.observable_alert_message || alert['event.original'] || 'N/A'}</p>
              <p>Source IP: {alert.observable_src_ip || 'N/A'}</p>
              <p>Destination IP: {alert.observable_dst_ip || 'N/A'}</p>
            </li>
          ))}
        </ul>
      )}
      <button onClick={handleLoadMore} disabled={loading}>
        {loading ? 'Loading...' : 'Load More'}
      </button>
    </div>
  );
};

export default CorrelatedAlerts;
