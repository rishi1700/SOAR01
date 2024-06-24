// src/components/TrendChart.js
import React, { useRef, useEffect } from 'react';
import { Chart } from 'chart.js';

const TrendChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartInstance = new Chart(chartRef.current, {
      type: 'line',
      data: {
        labels: data.map(d => new Date(d.timestamp).toLocaleString()),
        datasets: [
          {
            label: 'Alerts Over Time',
            data: data.map(d => d.count),
            fill: false,
            backgroundColor: 'rgba(75,192,192,0.2)',
            borderColor: 'rgba(75,192,192,1)',
          },
        ],
      },
    });

    return () => {
      chartInstance.destroy();
    };
  }, [data]);

  return <canvas ref={chartRef} />;
};

export default TrendChart;
