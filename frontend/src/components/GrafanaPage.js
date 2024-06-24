import React from 'react';
import { Container, Typography } from '@mui/material';

const GrafanaPage = () => {
  return (
    <Container component="main" maxWidth="md">
      <Typography component="h1" variant="h5" style={{ marginTop: 50 }}>
        Grafana Integration
      </Typography>
      <Typography>
        This is a placeholder for the Grafana integration.
      </Typography>
    </Container>
  );
};

export default GrafanaPage;
