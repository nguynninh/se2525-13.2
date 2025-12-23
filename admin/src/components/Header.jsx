import React from 'react';

const Header = () => {
  return (
    <div className="bg-gray-700 px-4 lg:px-6 py-3 lg:py-4 flex items-center justify-between">
      <h1 className="text-lg lg:text-xl font-bold text-white">Dashboard</h1>
      <div className="flex items-center gap-2 lg:gap-4">
        <div className="relative">
          <select className="bg-gray-600 text-white px-3 lg:px-4 py-2 pr-7 lg:pr-8 rounded-lg text-xs lg:text-sm focus:outline-none appearance-none cursor-pointer">
            <option value="may2022">May 2022</option>
            <option value="apr2022">April 2022</option>
            <option value="mar2022">March 2022</option>
          </select>
          <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 lg:w-4 lg:h-4 text-white pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <button className="relative flex-shrink-0">
          <svg className="w-5 h-5 lg:w-6 lg:h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
        <div className="flex items-center gap-2 flex-shrink-0">
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="Profile"
            className="w-7 h-7 lg:w-8 lg:h-8 rounded-full border-2 border-gray-500"
          />
          <svg className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Header;


