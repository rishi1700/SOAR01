// src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { Container, Paper, Typography, TextField, Button, Alert, MenuItem } from '@mui/material';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('analyst');
    const [error, setError] = useState(null);

    const handleRegister = async () => {
        try {
            const response = await axios.post('http://localhost:5000/auth/register', { username, password, role });
            console.log(response.data);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <Container>
            <Paper>
                <Typography variant="h4" gutterBottom>
                    Register
                </Typography>
                {error && <Alert severity="error">{error}</Alert>}
                <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} fullWidth />
                <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
                <TextField select label="Role" value={role} onChange={(e) => setRole(e.target.value)} fullWidth>
                    <MenuItem value="analyst">Analyst</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                </TextField>
                <Button variant="contained" color="primary" onClick={handleRegister}>
                    Register
                </Button>
            </Paper>
        </Container>
    );
};

export default Register;
