import React from 'react';
import { Button, Container, Typography, Box, Paper, AppBar, Toolbar, CssBaseline } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Centralized Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper elevation={3} style={{ marginTop: 50 }}>
        <Box p={3} display="flex" flexDirection="column" alignItems="center">
          <Typography component="h1" variant="h5" gutterBottom>
            Welcome to the Centralized Dashboard
          </Typography>
          <Typography variant="body1" align="center" gutterBottom>
            Monitor, analyze, and visualize your security data in real-time.
          </Typography>
          <Box mt={4} width="100%" display="flex" justifyContent="space-around">
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate('/register')}
            >
              Register
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default LandingPage;
