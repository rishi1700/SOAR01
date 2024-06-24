import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Box, Typography, Paper } from '@mui/material';

ChartJS.register(ArcElement, Tooltip, Legend);

const AlertMessageChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.label),
    datasets: [
      {
        label: 'Alert Messages',
        data: data.map(item => item.value),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
      }
    ]
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Alert Message Distribution
      </Typography>
      <Paper elevation={3}>
        <Box p={2}>
          <Pie data={chartData} />
        </Box>
      </Paper>
    </Box>
  );
};

export default AlertMessageChart;
