import React from 'react';
import { ArrowRight } from 'lucide-react';

const ProgressCircle = ({ percent, label, value }) => {
  const circumference = 2 * Math.PI * 30;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4">
      <div className="relative">
        <svg width="80" height="80" className="-rotate-90">
          <circle cx="40" cy="40" r="30" stroke="#e5e7eb" strokeWidth="8" fill="none" />
          <circle
            cx="40" cy="40" r="30"
            stroke="#3b82f6" strokeWidth="8" fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-blue-600">{percent}%</span>
        </div>
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-600">{label}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-lg font-semibold">{value}</span>
          <button className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600">
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgressCircle;
