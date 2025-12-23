import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const menuItems = [
    { icon: 'dashboard-grid', label: 'Dashboard', path: '/' },
    { icon: '/icons/Buy-1.png', label: 'Product', path: '/product' },
    { icon: '/icons/Ticket.png', label: 'Delivery', path: '/delivery' },
    { icon: '/icons/sale.png', label: 'Discounts', path: '/discounts' },
    { icon: '/icons/Notification.png', label: 'Notification', path: '/notifications' },
    { icon: '/icons/settings.jpg', label: 'Settings', path: '/settings' },
    { icon: '/icons/signout.png', label: 'Sign out', path: null },
  ];

  const handleSignOut = () => {
    const ok = window.confirm('Are you sure you want to sign out?');
    if (!ok) return;
    // TODO: wire to real sign-out flow
    alert('Signed out (demo).');
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
                    <img src={item.icon} alt={item.label} className="w-5 h-5 object-contain" />
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
                        {item.icon === 'dashboard-grid' ? (
                          <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <rect x="3" y="3" width="6" height="6" rx="1.5" />
                            <rect x="11" y="3" width="6" height="6" rx="1.5" />
                            <rect x="3" y="11" width="6" height="6" rx="1.5" />
                            <rect x="11" y="11" width="6" height="6" rx="1.5" />
                          </svg>
                        ) : (
                          <img src={item.icon} alt={item.label} className="w-5 h-5 object-contain" />
                        )}
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
