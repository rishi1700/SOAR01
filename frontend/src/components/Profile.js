import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, TextField, Button, Paper } from '@mui/material';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState({});
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(res.data);
      setUsername(res.data.username);
    };

    fetchUserProfile();
  }, []);

  const handleUpdateProfile = async () => {
    const token = localStorage.getItem('token');
    await axios.put(
      'http://localhost:5000/auth/me',
      { username },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // Optionally, add a success message or some feedback here
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} style={{ marginTop: 50 }}>
        <Box p={3}>
          <Typography component="h1" variant="h5">
            User Profile
          </Typography>
          <form>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleUpdateProfile}
              style={{ marginTop: 20 }}
            >
              Update Profile
            </Button>
          </form>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;
