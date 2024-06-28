// RealTimeAlerts.js
import React, { useEffect, useState } from 'react';
import { Container, Grid, Card, CardContent, Typography } from '@mui/material';
import io from 'socket.io-client';
import { Link } from 'react-router-dom';

const RealTimeAlerts = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    socket.on('dataUpdate', (newAlerts) => {
      console.log('Received new alerts:', newAlerts);
      setAlerts((prevAlerts) => [...newAlerts, ...prevAlerts].slice(0, 10));
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        Real-Time Alerts
      </Typography>
      <Grid container spacing={2}>
        {alerts.map((alert, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6">Timestamp: {new Date(alert._source['@timestamp']).toLocaleString()}</Typography>
                <Typography variant="body2">Alert Message: {alert._source.observable_alert_message || alert._source.event.original || 'N/A'}</Typography>
                <Typography variant="body2">Source IP: {alert._source.observable_src_ip || 'N/A'}</Typography>
                <Typography variant="body2">Destination IP: {alert._source.observable_dst_ip || 'N/A'}</Typography>
                <Link to={`/alerts/${alert._id}`}>View Details</Link>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default RealTimeAlerts;
