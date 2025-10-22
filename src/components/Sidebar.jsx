import React from 'react';
import { Home, LayoutDashboard, User, MessageCircle, Settings, LogOut } from 'lucide-react';

const Sidebar = () => {
  const menu = [
    { icon: Home, label: 'Home', active: true },
    { icon: LayoutDashboard, label: 'Dashboard' },
    { icon: User, label: 'Admin' },
    { icon: MessageCircle, label: 'Messages' },
    { icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-64 bg-sidebar p-6 h-screen flex flex-col justify-between shadow-lg">
      <div>
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
        </div>
        <nav className="space-y-2">
          {menu.map((item, i) => (
            <button
              key={i}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                item.active ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
      <button className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg">
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;