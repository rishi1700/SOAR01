import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/integrations/thehive/alerts');
        setAlerts(res.data);
      } catch (err) {
        console.error('Error fetching alerts', err);
      }
    };

    fetchAlerts();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Alerts
      </Typography>
      <Paper elevation={3}>
        <Box p={2}>
          <List>
            {alerts.map((alert) => (
              <ListItem key={alert.id}>
                <ListItemText
                  primary={alert.title}
                  secondary={alert.description}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Paper>
    </Container>
  );
};

export default Alerts;
