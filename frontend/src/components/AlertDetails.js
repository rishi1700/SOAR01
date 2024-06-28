import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Paper, Grid, Chip } from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const AlertDetails = () => {
    const { id } = useParams();
    const [alert, setAlert] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAlert = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/alerts/${id}`);
                console.log('Response:', response.data); // Add this line
                if (response.data.hits && response.data.hits.hits.length > 0) {
                    setAlert(response.data.hits.hits[0]._source);
                } else {
                    setError('No alert found');
                }
            } catch (error) {
                console.error('Error fetching alert details:', error);
                setError('Error fetching alert details');
            }
        };

        fetchAlert();
    }, [id]);

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    if (!alert) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Alert Details
            </Typography>
            <Paper elevation={3} style={{ padding: '16px' }}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="h6">Timestamp</Typography>
                        <Typography>{alert['@timestamp']}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6">Message</Typography>
                        <Typography>{alert.observable_alert_message}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="h6">Source IP</Typography>
                        <Chip icon={<PublicIcon />} label={alert.observable_src_ip} color="primary" />
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="h6">Destination IP</Typography>
                        <Chip icon={<LocationOnIcon />} label={alert.observable_dst_ip} color="secondary" />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6">Priority</Typography>
                        <Typography>{alert.alert_priority}</Typography>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default AlertDetails;
