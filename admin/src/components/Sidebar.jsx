import React from 'react';

const Sidebar = () => {
  const menuItems = [
    { icon: 'dashboard-grid', label: 'Dashboard', active: true },
    { icon: '/icons/Buy-1.png', label: 'Product' },
    { icon: '/icons/Ticket.png', label: 'Delivery' },
    { icon: '/icons/message.png', label: 'Chat', badge: 49 },
    { icon: '/icons/Notification.png', label: 'Notification' },
    { icon: '/icons/settings.jpg', label: 'Settings' },
  ];

  return (
    <div className="w-52 bg-gray-50 h-screen flex flex-col border-r border-gray-200">
      <div className="p-6">
        <nav className="space-y-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className={`w-full flex items-center justify-between gap-4 px-4 py-3.5 rounded-xl transition-colors ${
                item.active
                  ? 'bg-gray-100 text-gray-800'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  item.active ? 'bg-gray-200' : 'bg-gray-100'
              }`}>
                  {item.icon === 'dashboard-grid' ? (
                    <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <rect x="3" y="3" width="6" height="6" rx="1.5" />
                      <rect x="11" y="3" width="6" height="6" rx="1.5" />
                      <rect x="3" y="11" width="6" height="6" rx="1.5" />
                      <rect x="11" y="11" width="6" height="6" rx="1.5" />
                    </svg>
                  ) : item.icon === 'settings-gear' ? (
                    <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.983 8.75a3.25 3.25 0 110 6.5 3.25 3.25 0 010-6.5z" />
                      <path d="M12.93 2.25a1 1 0 00-1.86 0l-.414 1.095a1 1 0 01-1.09.64l-1.173-.17a1 1 0 00-1.088.66l-.007.02-.45 1.16a1 1 0 01-.89.63l-1.186.06a1 1 0 00-.95.99l.003.02.115 1.19a1 1 0 01-.59 1.02l-1.088.49a1 1 0 00-.53 1.3l.008.02.47 1.1a1 1 0 01-.18 1.12l-.82.85a1 1 0 000 1.42l.014.013.86.79a1 1 0 01.27 1.1l-.39 1.12a1 1 0 00.48 1.23l.02.01 1.06.53a1 1 0 01.53 1.01l-.08 1.19a1 1 0 00.9 1.04h.02l1.19.1a1 1 0 01.96.73l.34 1.14a1 1 0 001.23.68l.02-.006 1.14-.34a1 1 0 011.03.29l.83.9a1 1 0 001.44 0l.83-.9a1 1 0 011.03-.29l1.14.34a1 1 0 001.23-.68l.34-1.14a1 1 0 01.96-.73l1.19-.1a1 1 0 00.9-1.03l-.08-1.2a1 1 0 01.53-1.01l1.06-.53a1 1 0 00.48-1.23l-.39-1.12a1 1 0 01.27-1.1l.86-.79a1 1 0 000-1.43l-.82-.85a1 1 0 01-.18-1.12l.47-1.1a1 1 0 00-.52-1.3l-1.08-.49a1 1 0 01-.59-1.02l.11-1.19a1 1 0 00-.95-1.04l-1.19-.06a1 1 0 01-.9-.63l-.45-1.16a1 1 0 00-1.09-.64l-1.17.17a1 1 0 01-1.09-.64L12.93 2.25z" fillRule="evenodd" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <img src={item.icon} alt={item.label} className="w-5 h-5 object-contain" />
                  )}
                </div>
                <span className={`text-[15px] whitespace-nowrap ${item.active ? 'font-semibold' : 'font-medium'}`}>
                  {item.label}
                </span>
              </div>
              {typeof item.badge === 'number' && item.badge > 0 && (
                <span className="ml-auto inline-flex items-center justify-center flex-shrink-0 text-[10px] leading-none font-semibold px-2 py-0.5 rounded-full bg-pink-100 text-pink-600">
                  {item.badge}
              </span>
              )}
            </button>
          ))}
        </nav>
      </div>
      
    </div>
  );
};

export default Sidebar;


