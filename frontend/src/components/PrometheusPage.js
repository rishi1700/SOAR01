import React from 'react';
import { Container, Typography } from '@mui/material';

const PrometheusPage = () => {
  return (
    <Container component="main" maxWidth="md">
      <Typography component="h1" variant="h5" style={{ marginTop: 50 }}>
        Prometheus Integration
      </Typography>
      <Typography>
        This is a placeholder for the Prometheus integration.
      </Typography>
    </Container>
  );
};

export default PrometheusPage;
