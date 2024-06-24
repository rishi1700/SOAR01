import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, AppBar, Toolbar, Button, Box } from '@mui/material';
import DataTable from './DataTable';
import AlertMessageChart from './AlertMessageChart';
import TimeSeriesChart from './TimeSeriesChart';
import { io } from 'socket.io-client';

const Dashboard = ({ handleLogout }) => {
  const [data, setData] = React.useState([]);
  const [alertMessages, setAlertMessages] = React.useState([]);
  const [timeSeriesData, setTimeSeriesData] = React.useState([]);

  React.useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.on('dataUpdate', (newData) => {
      setData(newData);

      const alertMessagesData = [];
      const timeSeriesData = [];

      newData.forEach(hit => {
        alertMessagesData.push({
          label: hit._source.observable_alert_message,
          value: hit._source.count,
        });

        timeSeriesData.push({
          timestamp: hit._source['@timestamp'],
          count: hit._source.count,
        });
      });

      setAlertMessages(alertMessagesData);
      setTimeSeriesData(timeSeriesData);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Container maxWidth="lg">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Centralized Dashboard
          </Typography>
          <Button color="inherit" component={Link} to="/rules">
            Manage Rules
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Typography variant="h2" align="center" gutterBottom style={{ marginTop: 20 }}>
        Centralized Dashboard
      </Typography>
      <Box my={4}>
        <DataTable data={data} />
      </Box>
      <Box my={4}>
        <AlertMessageChart data={alertMessages} />
      </Box>
      <Box my={4}>
        <TimeSeriesChart data={timeSeriesData} />
      </Box>
    </Container>
  );
};

export default Dashboard;
