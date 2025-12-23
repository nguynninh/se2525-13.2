import React from 'react';
import { Search, Bell, ShieldCheck, Globe2 } from 'lucide-react';

const Header = () => {
  return (
    <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-200 px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Commerce Admin Console</h1>
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
      </div>
    </div>
  );
};

export default Header;
