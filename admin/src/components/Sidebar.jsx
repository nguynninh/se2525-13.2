import React from 'react';
import { Home, LayoutDashboard, User, MessageCircle, Settings, LogOut } from 'lucide-react';

const Sidebar = () => {
  const menu = [
    { icon: Home, label: 'Home' },
    { icon: LayoutDashboard, label: 'Dashboard', active: true },
    { icon: User, label: 'Admin' },
    { icon: MessageCircle, label: 'Messages' },
    { icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-64 bg-white h-screen p-6 flex flex-col justify-between shadow-lg">
      <div>
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center relative">
            <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-blue-500 ring-2 ring-white"></span>
          </div>
        </div>
        <nav className="space-y-2">
          {menu.map((item, i) => (
            <button
              key={i}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                item.active ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
      <button className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
        <LogOut className="w-5 h-5" />
        <span className="text-sm font-medium">Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;
