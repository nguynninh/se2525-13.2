import React from 'react';

const Header = ({ title }) => {
  return (
    <div className="bg-white px-4 lg:px-6 py-3 lg:py-4 flex items-center justify-between">
      <h1 className="text-lg lg:text-xl font-bold text-gray-800">{title}</h1>
      <div className="flex items-center gap-2 lg:gap-4">
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full border-2 border-gray-300 bg-gray-800 text-white grid place-items-center text-xs font-semibold">
            A
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
