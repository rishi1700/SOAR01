import React from 'react';
import { Chart as ChartJS, LineElement, PointElement, LineController, CategoryScale, LinearScale, TimeScale, Title, Tooltip, Legend } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';
import { Box, Typography, Paper } from '@mui/material';

ChartJS.register(LineElement, PointElement, LineController, CategoryScale, LinearScale, TimeScale, Title, Tooltip, Legend);

const TimeSeriesChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.timestamp),
    datasets: [
      {
        label: 'Alert Counts Over Time',
        data: data.map(item => item.count),
        fill: false,
        backgroundColor: '#36A2EB',
        borderColor: '#36A2EB',
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'minute',
        },
      },
    },
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Time Series of Alerts
      </Typography>
      <Paper elevation={3}>
        <Box p={2}>
          <Line data={chartData} options={options} />
        </Box>
      </Paper>
    </Box>
  );
};

export default TimeSeriesChart;
