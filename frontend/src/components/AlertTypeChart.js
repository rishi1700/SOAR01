import React from 'react';
import { Pie } from 'react-chartjs-2';

const AlertTypeChart = ({ data }) => {
  const chartData = {
    labels: data.map(d => d.label),
    datasets: [
      {
        label: 'Alert Types',
        data: data.map(d => d.value),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
      },
    ],
  };

  return <Pie data={chartData} />;
};

export default AlertTypeChart;
