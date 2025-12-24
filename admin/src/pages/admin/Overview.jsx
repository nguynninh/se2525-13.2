import React, { useEffect, useState } from 'react';
import { Users, BadgeCheck, Store, ClipboardList } from 'lucide-react';
import api from '../../api/client';
import { StatCard, PanelShell, SectionHeader, EmptyState, safeArray } from './shared.jsx';

const Overview = ({ onNavigate }) => {
  const [users, setUsers] = useState([]);
  const [sellerApps, setSellerApps] = useState([]);
  const [shops, setShops] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const loadAll = async () => {
      setLoading(true); setError('');
      try {
        const [u, sApp, sh, ord] = await Promise.all([
          api.get('/api/users/admin/users', { signal: controller.signal }),
          api.get('/api/seller-applications/admin/pending', { signal: controller.signal }),
          api.get('/api/shop/admin', { signal: controller.signal }),
          api.get('/api/user/admin/orders', { signal: controller.signal }),
        ]);
        setUsers(safeArray(u.data));
        setSellerApps(safeArray(sApp.data));
        setShops(safeArray(sh.data));
        setOrders(safeArray(ord.data));
      } catch (err) {
        if (err.name !== 'CanceledError') setError(err.message || 'Failed to load overview data');
      } finally {
        setLoading(false);
      }
    };
    loadAll();
    return () => controller.abort();
  }, []);

  const counters = [
    { icon: Users, label: 'Users', value: users.length || '—', tone: 'bg-emerald-400' },
    { icon: BadgeCheck, label: 'Seller apps', value: sellerApps.length || '—', tone: 'bg-amber-400' },
    { icon: Store, label: 'Shops', value: shops.length || '—', tone: 'bg-sky-400' },
    { icon: ClipboardList, label: 'Orders', value: orders.length || '—', tone: 'bg-indigo-400' },
  ];

  return (
    <div className="space-y-6 text-slate-50">
      <div className="bg-gradient-to-br from-emerald-600/20 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-emerald-200">Admin API console</p>
            <p className="text-sm text-slate-400 mt-1">Users • Seller applications • Shops • Orders • Shipments • Shipping rates</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onNavigate?.('orders')}
              className="px-4 py-2 rounded-xl border border-emerald-400/50 text-sm font-semibold text-emerald-100 hover:bg-emerald-500/10"
            >
              Go to orders
            </button>
            <button
              onClick={() => onNavigate?.('shops')}
              className="px-4 py-2 rounded-xl border border-slate-800 text-sm font-semibold text-slate-100 hover:border-emerald-400/60"
            >
              Go to shops
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-5">
          {counters.map((item) => (
            <StatCard key={item.label} {...item} />
          ))}
        </div>
      </div>

      <PanelShell>
        <SectionHeader title="Quick status" subtitle={loading ? 'Loading...' : error ? error : 'Admin data summary'} />
        {error ? <EmptyState text={error} /> : null}
        {!loading && !error ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 text-sm text-slate-200">
            <div className="p-3 border border-slate-800 rounded-xl bg-slate-900/50">Users: <b>{users.length || 0}</b></div>
            <div className="p-3 border border-slate-800 rounded-xl bg-slate-900/50">Pending seller apps: <b>{sellerApps.length || 0}</b></div>
            <div className="p-3 border border-slate-800 rounded-xl bg-slate-900/50">Shops: <b>{shops.length || 0}</b></div>
            <div className="p-3 border border-slate-800 rounded-xl bg-slate-900/50">Orders: <b>{orders.length || 0}</b></div>
          </div>
        ) : null}
      </PanelShell>
    </div>
  );
};

export default Overview;
