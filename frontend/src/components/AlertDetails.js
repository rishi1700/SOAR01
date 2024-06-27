// AlertDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const AlertDetails = () => {
  const { id } = useParams();
  const [alertDetails, setAlertDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlertDetails = async () => {
      try {
        const response = await axios.get(`https://192.168.18.10:9200/snort-logs-*/_doc/${id}`, {
          auth: {
            username: 'elastic',
            password: 'ChangeME'
          },
          httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
        });
        setAlertDetails(response.data);
      } catch (error) {
        setError(error);
      }
    };

    fetchAlertDetails();
  }, [id]);

  if (error) {
    return <div>Error fetching alert details: {error.message}</div>;
  }

  if (!alertDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Alert Details</h2>
      <p>Timestamp: {alertDetails._source['@timestamp']}</p>
      <p>Alert Message: {alertDetails._source.observable_alert_message}</p>
      <p>Source IP: {alertDetails._source.observable_src_ip}</p>
      <p>Destination IP: {alertDetails._source.observable_dst_ip}</p>
      <p>Source Port: {alertDetails._source.observable_src_port}</p>
      <p>Destination Port: {alertDetails._source.observable_dst_port}</p>
      <p>Protocol: {alertDetails._source.observable_protocol}</p>
    </div>
  );
};

export default AlertDetails;
