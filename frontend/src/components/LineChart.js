// src/components/LineChart.js
import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const LineChart = ({ data }) => {
  const chartData = {
    labels: data.map((item) => new Date(item.timestamp).toLocaleString()),
    datasets: [
      {
        label: 'Alert Count',
        data: data.map((item) => item.count),
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
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

  return <Line data={chartData} options={options} />;
};

export default LineChart;
