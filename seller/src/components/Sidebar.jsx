import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Truck, MessageSquare, PackageSearch, Settings, LogOut } from 'lucide-react';

const Sidebar = ({ onLogout }) => {

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: PackageSearch, label: 'Products', path: '/products' },
    { icon: MessageSquare, label: 'Q&A', path: '/qa' },
    { icon: Truck, label: 'Shipping', path: '/shipping' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: LogOut, label: 'Sign out', path: null },
  ];

  const handleSignOut = async () => {
    const ok = window.confirm('Are you sure you want to sign out?');
    if (!ok) return;
    await onLogout?.();
  };

  return (
    <div className="w-52 bg-gray-50 h-screen flex flex-col border-r border-gray-200">
      <div className="p-6">
        <nav className="space-y-2">
          {menuItems.map((item, index) =>
            item.label === 'Sign out' ? (
              <button
                key={index}
                onClick={handleSignOut}
                className="w-full flex items-center justify-between gap-4 px-4 py-3.5 rounded-xl transition-colors text-gray-500 hover:bg-gray-100"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-gray-100">
                    {item.icon ? <item.icon className="w-5 h-5 text-gray-500" /> : null}
                  </div>
                  <span className="text-[15px] whitespace-nowrap font-medium">
                    {item.label}
                  </span>
                </div>
              </button>
            ) : (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `w-full flex items-center justify-between gap-4 px-4 py-3.5 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-gray-100 text-gray-800'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isActive ? 'bg-gray-200' : 'bg-gray-100'
                      }`}>
                        {item.icon ? <item.icon className="w-5 h-5 text-gray-500" /> : null}
                      </div>
                      <span className={`text-[15px] whitespace-nowrap ${isActive ? 'font-semibold' : 'font-medium'}`}>
                        {item.label}
                      </span>
                    </div>
                  </>
                )}
              </NavLink>
            )
          )}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
