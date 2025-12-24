import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const AreaChart = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  const zeroes = new Array(months.length).fill(0);

  const chartData = {
    labels: months,
    datasets: [
      {
        label: 'Balance',
        data: zeroes,
        borderColor: 'rgba(147, 51, 234, 1)',
        backgroundColor: 'rgba(147, 51, 234, 0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Income',
        data: zeroes,
        borderColor: 'rgba(59, 130, 246, 0.8)',
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Expenses',
        data: zeroes,
        borderColor: 'rgba(37, 99, 235, 0.8)',
        backgroundColor: 'rgba(37, 99, 235, 0.15)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'end',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: '#e5e7eb',
        },
        ticks: {
          color: '#6b7280',
          callback: function(value) {
            if (value >= 1000) {
              return value / 1000 + 'k';
            }
            return value;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 overflow-hidden">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-800 text-base">Total Product Sales</h3>
          <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <select className="bg-white border border-gray-200 text-gray-700 px-3 py-1 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 flex-shrink-0">
          <option>past 6 months</option>
          <option>past year</option>
          <option>all time</option>
        </select>
      </div>
      <div className="h-72 w-full">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default AreaChart;
