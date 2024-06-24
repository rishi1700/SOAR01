import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MISPPage = () => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/misp/events');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data from MISP:', error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1>MISP Data</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default MISPPage;
