import React from 'react';
import { Search, LogOut, ShieldCheck } from 'lucide-react';

const Header = ({ user, onLogout }) => {
  return (
    <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-200 px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Commerce Admin Console</h1>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> {user?.email || 'admin'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search admin, shop, server..."
            className="pl-10 pr-3 py-2 rounded-lg bg-white border border-gray-200 text-sm text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/60"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        </div>
        <button
          onClick={onLogout}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-800 hover:bg-gray-50"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </div>
  );
};

export default Header;
