import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ThreatIntelligence = () => {
  const [intel, setIntel] = useState([]);

  useEffect(() => {
    const fetchIntel = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/threat-intelligence');
        setIntel(response.data);
      } catch (error) {
        console.error('Error fetching threat intelligence:', error);
      }
    };
    fetchIntel();
  }, []);

  return (
    <div>
      <h2>Threat Intelligence</h2>
      {intel.map((item, index) => (
        <div key={index}>
          <p>{item.value}</p>
        </div>
      ))}
    </div>
  );
};

export default ThreatIntelligence;
