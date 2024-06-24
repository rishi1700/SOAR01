// components/NavigationBar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const NavigationBar = ({ isAuthenticated, handleLogout }) => (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h6" style={{ flexGrow: 1 }}>
        Centralized Dashboard
      </Typography>
      <Button color="inherit" component={Link} to="/">Home</Button>
      {isAuthenticated && (
        <>
          <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
          <Button color="inherit" component={Link} to="/thehive">TheHive</Button>
          <Button color="inherit" component={Link} to="/misp">MISP</Button>
          <Button color="inherit" component={Link} to="/kibana">Kibana</Button>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </>
      )}
    </Toolbar>
  </AppBar>
);

export default NavigationBar;
