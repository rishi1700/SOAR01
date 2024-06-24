import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Paper, List, ListItem, ListItemText } from '@mui/material';
import { io } from 'socket.io-client';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.on('notification', (notification) => {
      setNotifications((prevNotifications) => [notification, ...prevNotifications]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} style={{ marginTop: 50 }}>
        <Box p={3}>
          <Typography component="h1" variant="h5">
            Notifications
          </Typography>
          <List>
            {notifications.map((notification, index) => (
              <ListItem key={index}>
                <ListItemText primary={notification.message} secondary={new Date(notification.timestamp).toLocaleString()} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Paper>
    </Container>
  );
};

export default Notifications;
