// src/components/Alerting.js
import React, { useState } from 'react';
import axios from 'axios';
import { Container, Paper, Typography, TextField, Button, CircularProgress, Alert } from '@mui/material';

const Alerting = () => {
    const [criteria, setCriteria] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);

    const handleSetAlert = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.post('http://localhost:5000/api/alerting/set-alert', { criteria, email });
            setResponse(res.data);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    return (
        <Container>
            <Paper>
                <Typography variant="h4" gutterBottom>
                    Set Alert
                </Typography>
                <TextField
                    label="Criteria"
                    value={criteria}
                    onChange={(e) => setCriteria(e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                />
                <Button variant="contained" color="primary" onClick={handleSetAlert}>
                    Set Alert
                </Button>
                {loading && <CircularProgress />}
                {error && <Alert severity="error">{error}</Alert>}
                {response && (
                    <Paper>
                        <Typography variant="h6">Alert Response</Typography>
                        <pre>{JSON.stringify(response, null, 2)}</pre>
                    </Paper>
                )}
            </Paper>
        </Container>
    );
};

export default Alerting;
