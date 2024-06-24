// src/components/ElasticsearchDashboard.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from './DataTable'; // Assuming you have a DataTable component

const ElasticsearchDashboard = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/elasticsearch');
        setData(response.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>Error fetching data: {error}</div>;
  }

  return (
    <div>
      <h1>Elasticsearch Dashboard</h1>
      <DataTable data={data} />
    </div>
  );
};

export default ElasticsearchDashboard;
