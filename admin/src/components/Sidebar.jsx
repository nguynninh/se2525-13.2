import React from 'react';

const Sidebar = () => {
  const menuItems = [
    { icon: '/icons/Activity.png', label: 'Dashboard', active: true },
    { icon: '/icons/Ticket.png', label: 'Product' },
    { icon: '/icons/Document.png', label: 'Delivery' },
    { icon: '/icons/Bag.png', label: 'Messages' },
    { icon: '/icons/Notification.png', label: 'Notification' },
  ];

  return (
    <div className="w-64 bg-gray-100 h-screen flex flex-col">
      <div className="p-6">
        <h1 className="text-lg font-bold text-gray-800 mb-8">Dashboard</h1>
        <nav className="space-y-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                item.active
                  ? 'bg-gray-200 text-gray-800'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                item.active ? 'bg-gray-300' : 'bg-gray-200'
              }`}>
                <img src={item.icon} alt={item.label} className="w-4 h-4 object-contain" />
              </div>
              <span className={`text-sm ${item.active ? 'font-semibold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>
      </div>
      
      <div className="mt-auto p-6">
        <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg">
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">Charles</p>
            <p className="text-xs text-gray-500 truncate">DistroBoy Store</p>
          </div>
          <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;


