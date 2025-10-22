import React from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ProgressCircle from './components/ProgressCircle';
import LineChart from './components/LineChart';
import RadarChart from './components/RadarChart';

const App = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        <div className="p-6">
          {/* Progress Circles */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <ProgressCircle percent={25} label="Lorem ipsum dolor sit amet" value="100" />
            <ProgressCircle percent={50} label="Consectetur adipiscing elit" value="100" />
            <ProgressCircle percent={75} label="Sed do eiusmod tempor" value="100" />
            <ProgressCircle percent={100} label="Incididunt ut labore" value="100" />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <LineChart />
            </div>
            <div>
              <RadarChart />
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-semibold mb-4">Activity</h3>
              <div className="space-y-3">
                <div className="flex justify-between"><span>9600$</span> <span className="text-accent">+12%</span></div>
                <div className="flex justify-between"><span>960$</span> <span className="text-green-500">+5%</span></div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm flex items-center justify-center">
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="64" cy="64" r="56" stroke="#e5e7eb" strokeWidth="12" fill="none" />
                    <circle cx="64" cy="64" r="56" stroke="#3b82f6" strokeWidth="12" fill="none"
                      strokeDasharray="352" strokeDashoffset="176" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold">50%</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600">Lorem ipsum dolor sit</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-semibold mb-4">Daily charts</h3>
              <div className="h-32 bg-gray-100 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;