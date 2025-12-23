import React from 'react';
import {
  Gauge,
  Users,
  BadgeCheck,
  Store,
  ClipboardList,
  Truck,
  DollarSign,
  LogOut,
} from 'lucide-react';

const Sidebar = ({ active = 'overview', onSelect, onLogout, user }) => {
  const items = [
    { icon: Gauge, label: 'Overview', key: 'overview' },
    { icon: Users, label: 'Users', key: 'users' },
    { icon: BadgeCheck, label: 'Seller Applications', key: 'sellerApps' },
    { icon: Store, label: 'Shops', key: 'shops' },
    { icon: ClipboardList, label: 'Orders', key: 'orders' },
    { icon: Truck, label: 'Shipments', key: 'shipments' },
    { icon: DollarSign, label: 'Shipping Rates', key: 'rates' },
  ];

  return (
    <div className="w-72 bg-slate-900/60 backdrop-blur border-r border-slate-800 min-h-screen p-6 flex flex-col text-slate-100">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-11 h-11 bg-gradient-to-br from-emerald-400 to-sky-500 rounded-2xl flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
          AD
        </div>
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wide">Admin console</p>
          <p className="text-base font-semibold text-slate-50">{user?.email || 'Server Admin'}</p>
        </div>
      </div>

      <nav className="space-y-2 flex-1">
        {items.map((item) => (
          <button
            key={item.key}
            onClick={() => onSelect?.(item.key)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all border ${
              active === item.key
                ? 'bg-slate-800/80 border-emerald-400/60 text-white shadow-lg shadow-emerald-500/15'
                : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-sm font-semibold flex-1 text-left">{item.label}</span>
          </button>
        ))}
      </nav>

      <button
        onClick={onLogout}
        className="mt-6 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl w-full border border-slate-800 bg-slate-900/80 text-sm font-semibold text-slate-200 hover:bg-slate-800/80"
      >
        <LogOut className="w-4 h-4" /> Sign out
      </button>
    </div>
  );
};

export default Sidebar;
