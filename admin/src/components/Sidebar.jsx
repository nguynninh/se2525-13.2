import React from 'react';
import { ShieldCheck, LogOut } from 'lucide-react';

const Sidebar = ({ active = 'admin', onSelect }) => {
  const items = [
    { icon: ShieldCheck, label: 'Admin APIs', key: 'admin' },
    { icon: LogOut, label: 'Sign out', key: 'signout' },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen p-6 flex flex-col">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-11 h-11 bg-gradient-to-br from-gray-200 to-gray-400 rounded-2xl flex items-center justify-center text-gray-900 font-bold shadow-sm shadow-gray-300/60">
          AD
        </div>
        <div>
          <p className="text-sm text-gray-500">Admin console</p>
          <p className="text-lg font-semibold text-gray-800">Server Admin</p>
        </div>
      </div>

      <nav className="space-y-2">
        {items.map((item) => (
          <button
            key={item.key}
            onClick={() => {
              if (item.key === 'signout') {
                window.alert('Signed out.');
                return;
              }
              onSelect?.(item.key);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all border ${
              active === item.key
                ? 'bg-gray-100 border-gray-300 text-gray-900 shadow-sm'
                : 'bg-white border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
