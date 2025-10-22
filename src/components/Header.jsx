import React from 'react';

const Header = () => {
  return (
    <div className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-500">March 11, THU</p>
      </div>
      <input
        type="text"
        placeholder="Go to search..."
        className="px-4 py-2 border rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
};

export default Header;