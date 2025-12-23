import React from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const RadarChart = ({ data = [] }) => {
  const chartData = {
    labels: ['Position 01', 'Position 02', 'Position 03', 'Position 04', 'Position 05', 'Position 06'],
    datasets: [
      {
        label: 'Dataset 1',
        data: data,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: '#3b82f6',
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#3b82f6',
      },
      {
        label: 'Dataset 2',
        data: [28, 48, 40, 19, 96, 27],
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderColor: '#10b981',
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#10b981',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      r: {
        angleLines: { display: false },
        grid: { color: '#e5e7eb' },
        pointLabels: { color: '#6b7280' },
        ticks: { display: false },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800">Type of Load</h3>
        <div className="flex gap-1">
          <button className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded-md">Month</button>
          <button className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded-md">Day</button>
          <button className="px-3 py-1 text-xs bg-blue-500 text-white rounded-md">Year</button>
        </div>
      </div>
      <div className="h-64">
        <Radar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default RadarChart;
