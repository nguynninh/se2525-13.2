import React from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ProgressCircle from './components/ProgressCircle';
import LineChart from './components/LineChart';
import RadarChart from './components/RadarChart';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const App = () => {
  const stats = {
    circles: [
      { percent: 25, label: "Lorem ipsum", value: 100 },
      { percent: 50, label: "Dolor sit amet", value: 100 },
      { percent: 75, label: "Consectetur", value: 100 },
      { percent: 100, label: "Adipiscing elit", value: 100 },
    ],
    lineData: [120, 100, 140, 100, 160, 150, 170, 160, 180, 170, 190],
    radarData: [65, 59, 90, 81, 56, 55],
    barData: [
      { name: 'Jan', uv: 400, pv: 240 },
      { name: 'Feb', uv: 300, pv: 139 },
      { name: 'Mar', uv: 200, pv: 980 },
      { name: 'Apr', uv: 278, pv: 390 },
      { name: 'May', uv: 189, pv: 480 },
      { name: 'Jun', uv: 239, pv: 380 },
      { name: 'Jul', uv: 349, pv: 430 },
    ],
    activity: [
      { value: '9600$', trend: '+12%' },
      { value: '960$', trend: '+5%' },
    ]
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {stats.circles.map((item, i) => (
              <ProgressCircle key={i} {...item} />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
              <LineChart data={stats.lineData} />
            </div>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4">Daily charts</h3>
                <div style={{ height: '150px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.barData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="uv" fill="#8884d8" barSize={10} />
                      <Bar dataKey="pv" fill="#82ca9d" barSize={10} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <RadarChart data={stats.radarData} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Activity</h3>
              {stats.activity.map((item, i) => (
                <div key={i} className="flex items-center justify-between mb-3">
                  <span className="font-bold text-lg">{item.value}</span>
                  <span className={`text-sm font-semibold ${i === 0 ? 'text-blue-500' : 'text-green-500'}`}>{item.trend}</span>
                </div>
              ))}
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Analysis</h3>
              {/* Placeholder for the second analysis component */}
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-center justify-center">
              <div className="text-center">
                <div className="relative w-32 h-16">
                  <svg viewBox="0 0 100 50" className="w-full h-full">
                    <path d="M 10 50 A 40 40 0 0 1 90 50" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                    <path d="M 10 50 A 40 40 0 0 1 50 10" stroke="#3b82f6" strokeWidth="8" fill="none" />
                  </svg>
                  <div className="absolute bottom-0 w-full text-center">
                    <span className="text-2xl font-bold text-blue-600">50%</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600">Lorem ipsum dolor sit</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
