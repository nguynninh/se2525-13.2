import React from 'react';
import { Search } from 'lucide-react';

const Header = () => {
  return (
    <div className="bg-white px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-500">March 11, THU</p>
      </div>
      <div className="relative">
        <input
          type="text"
          placeholder="Go to search..."
          className="px-4 py-2 border rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      </div>
    </div>
  );
};

export default Header;
