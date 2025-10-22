import React from 'react';

const ProgressCircle = ({ percent, label, value }) => {
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm text-center flex-1">
      <div className="relative inline-block">
        <svg width="100" height="100" className="-rotate-90">
          <circle cx="50" cy="50" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="#3b82f6"
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-primary">{percent}%</span>
        </div>
      </div>
      <p className="mt-3 text-sm text-gray-600">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
      <button className="mt-2 text-primary text-sm flex items-center gap-1 mx-auto">
        View <span className="text-xs">→</span>
      </button>
    </div>
  );
};

export default ProgressCircle;