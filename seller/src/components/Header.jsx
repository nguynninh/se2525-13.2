import React from 'react';
import { Shield } from 'lucide-react';

const Header = ({ title, user }) => {
  return (
    <div className="bg-white px-4 lg:px-6 py-3 lg:py-4 flex items-center justify-between border-b border-gray-200">
      <div>
        <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Seller portal</p>
        <h1 className="text-lg lg:text-xl font-bold text-gray-800">{title}</h1>
      </div>
      <div className="flex items-center gap-3 lg:gap-4">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-sm font-semibold text-gray-900">{user?.email || 'seller'}</span>
          <span className="text-xs text-gray-500 inline-flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" /> Seller
          </span>
        </div>
      </div>
    </div>
  );
};

export default Header;
