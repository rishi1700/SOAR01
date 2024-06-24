import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Paper, Box } from '@mui/material';
import DataTable from './DataTable';
import AlertMessageChart from './AlertMessageChart';
import TimeSeriesChart from './TimeSeriesChart';
import { io } from 'socket.io-client';

const Dashboard = ({ handleLogout }) => {
  const [data, setData] = useState([]);
  const [alertMessages, setAlertMessages] = useState([]);
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [alertTypeData, setAlertTypeData] = useState([]);

  useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.on('dataUpdate', (newData) => {
      setData(newData);

      const alertMessagesData = [];
      const timeSeriesData = [];
      const alertTypeData = {};

      newData.forEach(hit => {
        const message = hit._source.observable_alert_message;
        alertMessagesData.push({
          label: message,
          value: hit._source.count,
        });

        timeSeriesData.push({
          timestamp: hit._source['@timestamp'],
          count: hit._source.count,
        });

        if (alertTypeData[message]) {
          alertTypeData[message] += hit._source.count;
        } else {
          alertTypeData[message] = hit._source.count;
        }
      });

      setAlertMessages(alertMessagesData);
      setTimeSeriesData(timeSeriesData);
      setAlertTypeData(Object.keys(alertTypeData).map(key => ({
        label: key,
        value: alertTypeData[key],
      })));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Container maxWidth="lg">
      <Typography variant="h2" align="center" gutterBottom style={{ marginTop: 20 }}>
        Centralized Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3}>
            <Box p={2}>
              <DataTable data={data} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3}>
            <Box p={2}>
              <AlertMessageChart data={alertMessages} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3}>
            <Box p={2}>
              <TimeSeriesChart data={timeSeriesData} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3}>
            <Box p={2}>
              <AlertTypeChart data={alertTypeData} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
