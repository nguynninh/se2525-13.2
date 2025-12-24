import React, { useEffect, useState } from 'react';
import { Activity, ClipboardList, RefreshCcw, ShieldCheck } from 'lucide-react';
import api from '../../api/client';
import { Badge, EmptyState, PanelShell, SectionHeader, StatCard, safeArray, formatDate, formatMoney } from './shared.jsx';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statsError, setStatsError] = useState('');
  const [statsLoading, setStatsLoading] = useState(false);

  const load = async (signal) => {
    setLoading(true); setError('');
    try {
      const { data } = await api.get('/api/user/admin/orders', { signal });
      setOrders(safeArray(data));
    } catch (err) {
      if (err.name !== 'CanceledError') setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, []);

  const reload = async () => load();

  const fetchStats = async () => {
    setStatsLoading(true);
    setStatsError('');
    try {
      const stat = await api.get('/api/user/admin/orders/stats');
      setStats(stat?.data ?? stat);
    } catch (err) {
      setStats(null);
      setStatsError(err?.response?.data?.message || err?.message || 'Failed to load order stats');
    } finally {
      setStatsLoading(false);
    }
  };

  return (
    <PanelShell>
      <SectionHeader title="Orders (admin)" subtitle="List, update status, refund" />

      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={fetchStats}
          disabled={statsLoading}
          className="px-3 py-2 rounded-lg text-sm font-semibold border border-slate-800 text-slate-100 hover:border-emerald-400/50 disabled:opacity-60"
        >
          {statsLoading ? 'Loading stats...' : 'Refresh stats'}
        </button>
        {statsError ? (
          <span className="text-sm text-amber-200 bg-amber-500/10 border border-amber-400/40 rounded-lg px-2 py-1">
            {statsError}
          </span>
        ) : null}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-3">
        <StatCard icon={Activity} label="Total orders" value={stats?.totalOrders ?? orders.length ?? '—'} desc="order stats" tone="bg-purple-400" />
        <StatCard icon={ClipboardList} label="Processing" value={stats?.processing ?? '—'} desc="status=processing" tone="bg-amber-400" />
        <StatCard icon={ShieldCheck} label="Completed" value={stats?.completed ?? '—'} desc="status=completed" tone="bg-emerald-400" />
        <StatCard icon={RefreshCcw} label="Refunded" value={stats?.refunded ?? '—'} tone="bg-rose-300" />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-900 text-slate-300 text-xs uppercase border-b border-slate-800">
            <tr>
              <th className="px-3 py-2 text-left font-semibold">Order ID</th>
              <th className="px-3 py-2 text-left font-semibold">User</th>
              <th className="px-3 py-2 text-left font-semibold">Status</th>
              <th className="px-3 py-2 text-left font-semibold">Total</th>
              <th className="px-3 py-2 text-left font-semibold">Updated</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="px-3 py-4 text-center text-sm text-slate-300">Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan="5" className="px-3 py-4 text-center text-sm text-rose-300">{error}</td></tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-3 py-4">
                  <EmptyState text="No orders yet." />
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-b border-slate-800/80">
                  <td className="px-3 py-2 font-semibold text-white">{order.id}</td>
                  <td className="px-3 py-2 text-slate-200">{order.user?.email || order.user || '--'}</td>
                  <td className="px-3 py-2"><Badge tone={order.status === 'completed' ? 'success' : order.status === 'cancelled' ? 'danger' : 'warning'}>{order.status}</Badge></td>
                  <td className="px-3 py-2 font-semibold text-white">{formatMoney(order.total || order.total_price)}</td>
                  <td className="px-3 py-2 text-slate-200">{formatDate(order.updated_at || order.updatedAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </PanelShell>
  );
};

export default Orders;
