// src/components/SeverityBreakdownChart.js
import React, { useRef, useEffect } from 'react';
import { Chart } from 'chart.js';

const SeverityBreakdownChart = ({ data }) => {
  const chartRef = useRef(null);

  const severityLabels = ['Low', 'Medium', 'High'];
  const severityCounts = [0, 0, 0];

  data.forEach(item => {
    if (item.severity === 'low') severityCounts[0] += item.count;
    else if (item.severity === 'medium') severityCounts[1] += item.count;
    else if (item.severity === 'high') severityCounts[2] += item.count;
  });

  useEffect(() => {
    const chartInstance = new Chart(chartRef.current, {
      type: 'pie',
      data: {
        labels: severityLabels,
        datasets: [
          {
            data: severityCounts,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
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

export default SeverityBreakdownChart;
