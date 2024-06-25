// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { Container, Paper, Typography, TextField, Button, Alert } from '@mui/material';

const Login = ({ setAuth }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5000/auth/login', { username, password });
            localStorage.setItem('token', response.data.token);
            setAuth(true);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <Container>
            <Paper>
                <Typography variant="h4" gutterBottom>
                    Login
                </Typography>
                {error && <Alert severity="error">{error}</Alert>}
                <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} fullWidth />
                <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
                <Button variant="contained" color="primary" onClick={handleLogin}>
                    Login
                </Button>
            </Paper>
        </Container>
    );
};

export default Login;
