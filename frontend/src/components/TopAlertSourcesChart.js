// src/components/TopAlertSourcesChart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const TopAlertSourcesChart = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item.source),
    datasets: [
      {
        label: 'Alert Count',
        data: data.map((item) => item.count),
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      },
    ],
  };

  return <Bar data={chartData} />;
};

export default TopAlertSourcesChart;
