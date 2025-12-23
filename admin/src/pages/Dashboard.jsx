import React from 'react';
import AreaChart from '../components/AreaChart';

const StatCard = ({ icon, label, value, iconBg, iconColor }) => {
  const renderIcon = () => {
    if (icon === 'heart') {
      return (
        <svg className={`w-5 h-5 ${iconColor}`} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
      );
    }
    if (icon === 'order') {
      return (
        <div className="bg-pink-500 w-8 h-8 rounded-lg flex items-center justify-center relative flex-shrink-0">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-white rounded-full border border-pink-500"></span>
        </div>
      );
    }
    if (icon === 'revenue') {
      return (
        <svg className={`w-5 h-5 ${iconColor}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
        </svg>
      );
    }
    return <img src={icon} alt={label} className="w-5 h-5 object-contain" />;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center gap-3">
        <div className={iconBg ? `${iconBg} p-2 rounded-lg flex-shrink-0` : 'flex-shrink-0'}>
          {renderIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-gray-500 text-xs mb-1 truncate">{label}</p>
          <p className="text-lg font-bold text-gray-800 truncate">{value}</p>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const statCards = [
    {
      icon: '/icons/Heart.png',
      label: 'Total number of visitors',
      value: 0,
      iconBg: 'bg-red-50',
      iconColor: 'text-red-500',
    },
    {
      icon: '/icons/Order.png',
      label: 'Order',
      value: 0,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-500',
    },
    {
      icon: '/icons/Revenue.png',
      label: 'Revenue',
      value: 0,
      iconBg: 'bg-pink-50',
      iconColor: 'text-pink-500',
    },
    {
      icon: '/icons/Canceled.png',
      label: 'Canceled',
      value: 0,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-400',
    },
  ];
  const recentOrders = [];
  const bestSellers = [];

  return (
    <div className="space-y-4 bg-content-bg min-h-screen p-3 lg:p-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {statCards.map((card) => (
          <StatCard
            key={card.label}
            icon={card.icon}
            label={card.label}
            value={card.value || 'N/A'}
            iconBg={card.iconBg}
            iconColor={card.iconColor}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-5">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-3 overflow-hidden">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Recent Orders</h3>
          <div className="overflow-x-auto -mx-3 px-3">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 text-gray-600 font-semibold text-xs uppercase whitespace-nowrap">
                    PRODUCT NAME
                    <svg className="inline w-2.5 h-2.5 ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </th>
                  <th className="text-left py-2 px-3 text-gray-600 font-semibold text-xs uppercase whitespace-nowrap">
                    PRODUCT CODE
                    <svg className="inline w-2.5 h-2.5 ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </th>
                  <th className="text-left py-2 px-3 text-gray-600 font-semibold text-xs uppercase whitespace-nowrap">
                    PRICE
                    <svg className="inline w-2.5 h-2.5 ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </th>
                  <th className="text-left py-2 px-3 text-gray-600 font-semibold text-xs uppercase whitespace-nowrap">
                    TOTAL ORDER
                    <svg className="inline w-2.5 h-2.5 ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-6 px-3 text-center text-sm text-gray-600">
                      No recent orders to display.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={order.image}
                            alt={order.name}
                            className="w-10 h-10 rounded object-cover flex-shrink-0"
                          />
                          <span className="text-gray-800 font-medium text-sm truncate">{order.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-gray-800 font-medium text-sm whitespace-nowrap">{order.code}</td>
                      <td className="py-3 px-3 text-gray-600 text-sm whitespace-nowrap">{order.price}</td>
                      <td className="py-3 px-3 text-gray-600 text-sm whitespace-nowrap">{order.totalOrder}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-3">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Best seller</h3>
          {bestSellers.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-600 text-center">
              No best sellers available.
            </div>
          ) : (
            <div className="space-y-3">
              {bestSellers.map((product, index) => (
                <div key={index} className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-14 h-14 rounded object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-800 mb-1 text-sm truncate">{product.name}</h4>
                    <div className="flex items-center gap-0.5 mb-1">
                      {[...Array(product.rating)].map((_, idx) => (
                        <svg key={idx} className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-800 font-semibold text-sm">{product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AreaChart />
    </div>
  );
};

export default Dashboard;
