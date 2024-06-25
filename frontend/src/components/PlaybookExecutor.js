// src/components/PlaybookExecutor.js
import React, { useState } from 'react';
import axios from 'axios';
import { Container, Paper, Typography, TextField, Button, CircularProgress, Alert } from '@mui/material';

const PlaybookExecutor = () => {
    const [alertId, setAlertId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);

    const handleExecutePlaybook = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.post('http://localhost:5000/api/playbooks/execute', { alertId });
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
                    Execute Playbook
                </Typography>
                <TextField
                    label="Alert ID"
                    value={alertId}
                    onChange={(e) => setAlertId(e.target.value)}
                    fullWidth
                />
                <Button variant="contained" color="primary" onClick={handleExecutePlaybook}>
                    Execute Playbook
                </Button>
                {loading && <CircularProgress />}
                {error && <Alert severity="error">{error}</Alert>}
                {response && (
                    <Paper>
                        <Typography variant="h6">Execution Response</Typography>
                        <pre>{JSON.stringify(response, null, 2)}</pre>
                    </Paper>
                )}
            </Paper>
        </Container>
    );
};

export default PlaybookExecutor;
