import React from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadarController, RadialLinearScale, PointElement, LineElement, Tooltip } from 'chart.js';

ChartJS.register(RadarController, RadialLinearScale, PointElement, LineElement, Tooltip);

const RadarChart = () => {
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Type of Load',
        data: [65, 59, 90, 81, 56, 55, 40],
        fill: true,
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderColor: '#10b981',
        pointBackgroundColor: '#10b981',
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="font-semibold mb-4">Type of Load</h3>
      <Radar data={data} options={{ responsive: true, scales: { r: { angleLines: { display: false } } } }} />
    </div>
  );
};

export default RadarChart;