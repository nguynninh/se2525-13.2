import React from 'react';

const Header = ({ title, showDatePicker = false }) => {
  return (
    <div className="bg-white px-4 lg:px-6 py-3 lg:py-4 flex items-center justify-between">
      <h1 className="text-lg lg:text-xl font-bold text-gray-800">{title}</h1>
      <div className="flex items-center gap-2 lg:gap-4">
        {showDatePicker && (
          <div className="relative">
            <select className="bg-gray-100 text-gray-800 px-3 lg:px-4 py-2 pr-7 lg:pr-8 rounded-lg text-xs lg:text-sm focus:outline-none appearance-none cursor-pointer">
              <option value="may2022">May 2022</option>
              <option value="apr2022">April 2022</option>
              <option value="mar2022">March 2022</option>
            </select>
            <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 lg:w-4 lg:h-4 text-gray-800 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}
        <div className="flex items-center gap-2 flex-shrink-0">
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="Profile"
            className="w-7 h-7 lg:w-8 lg:h-8 rounded-full border-2 border-gray-300"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
