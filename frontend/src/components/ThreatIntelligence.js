// src/components/ThreatIntelligence.js
import React, { useState } from 'react';
import axios from 'axios';
import { Container, Paper, Typography, TextField, Button, CircularProgress, Alert } from '@mui/material';

const ThreatIntelligence = () => {
    const [ip, setIP] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [results, setResults] = useState(null);

    const handleCheckIP = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post('http://localhost:5000/api/threat-intelligence/check-ip', { ip });
            setResults(response.data);
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
                    Threat Intelligence Check
                </Typography>
                <TextField
                    label="IP Address"
                    value={ip}
                    onChange={(e) => setIP(e.target.value)}
                    fullWidth
                />
                <Button variant="contained" color="primary" onClick={handleCheckIP}>
                    Check IP
                </Button>
                {loading && <CircularProgress />}
                {error && <Alert severity="error">{error}</Alert>}
                {results && (
                    <Paper>
                        <Typography variant="h6">Check Results</Typography>
                        <pre>{JSON.stringify(results, null, 2)}</pre>
                    </Paper>
                )}
            </Paper>
        </Container>
    );
};

export default ThreatIntelligence;
