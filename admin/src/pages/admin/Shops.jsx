import React, { useEffect, useState } from 'react';
import { BadgeCheck, Globe2 } from 'lucide-react';
import api from '../../api/client';
import { Badge, EmptyState, PanelShell, SectionHeader, safeArray } from './shared.jsx';

const Shops = () => {
  const [shops, setShops] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actingId, setActingId] = useState('');
  const [actionMsg, setActionMsg] = useState('');
  const [statusSelect, setStatusSelect] = useState('active');

  const load = async (signal) => {
    setLoading(true); setError('');
    try {
      const { data } = await api.get('/api/shop/admin', { signal });
      const feat = await api.get('/api/shop/admin/featured', { signal });
      setShops(safeArray(data));
      setFeatured(safeArray(feat.data));
    } catch (err) {
      if (err.name !== 'CanceledError') setError(err.message || 'Failed to load shops');
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

  const withAction = async (fn, shopId) => {
    setActingId(shopId || '');
    setActionMsg('');
    try {
      await fn();
      await reload();
      setActionMsg('Action executed successfully.');
    } catch (err) {
      setActionMsg(err?.message || 'Action failed.');
    } finally {
      setActingId('');
    }
  };

  return (
    <PanelShell>
      <SectionHeader title="Shop (admin)" subtitle="Manage shops: status, featured, delete" />
      {actionMsg ? <div className="text-sm text-emerald-200 bg-emerald-500/10 border border-emerald-400/40 rounded-xl px-3 py-2 mb-3">{actionMsg}</div> : null}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {loading ? <EmptyState text="Loading shops..." /> : null}
        {error ? <div className="text-sm text-rose-300">{error}</div> : null}
        {!loading && !error && shops.length === 0 ? <EmptyState text="No shops yet." /> : null}
        {shops.map((shop) => (
          <div key={shop.id} className="border border-slate-800 rounded-xl p-3 bg-slate-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">{shop.name}</p>
                <p className="text-xs text-slate-400">{shop.slug}</p>
              </div>
              <Badge tone={shop.status === 'active' ? 'success' : 'warning'}>{shop.status}</Badge>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Globe2 className="w-4 h-4" /> {shop.domain || shop.address || '--'}
            </div>
            {shop.is_featured ? (
              <div className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full border border-amber-400/40 text-amber-100 bg-amber-500/10">
                <BadgeCheck className="w-3.5 h-3.5" /> Featured
              </div>
            ) : null}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={statusSelect}
                onChange={(e) => setStatusSelect(e.target.value)}
                className="rounded-lg border border-slate-800 bg-slate-900/80 px-2 py-2 text-sm text-slate-100"
              >
                <option value="active">active</option>
                <option value="suspended">suspended</option>
                <option value="closed">closed</option>
              </select>
              <button
                onClick={() => withAction(() => api.patch(`/api/shop/admin/${shop.id}/status`, { status: statusSelect }), shop.id)}
                disabled={actingId === shop.id}
                className="px-3 py-2 rounded-lg text-sm font-semibold bg-emerald-500 text-slate-950 disabled:opacity-60"
              >
                Update status
              </button>
              <button
                onClick={() => withAction(() => api.patch(`/api/shop/admin/${shop.id}/feature`, { is_featured: !shop.is_featured }), shop.id)}
                disabled={actingId === shop.id}
                className="px-3 py-2 rounded-lg text-sm font-semibold border border-slate-800 text-slate-100 hover:border-emerald-400/50 disabled:opacity-60"
              >
                {shop.is_featured ? 'Unfeature' : 'Feature'}
              </button>
              <button
                onClick={() => withAction(() => api.delete(`/api/shop/admin/${shop.id}`), shop.id)}
                disabled={actingId === shop.id}
                className="px-3 py-2 rounded-lg text-sm font-semibold bg-rose-500 text-slate-50 disabled:opacity-60"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {featured.length > 0 ? (
        <div className="mt-3">
          <p className="text-xs uppercase text-amber-200 mb-2 flex items-center gap-2"><BadgeCheck className="w-4 h-4" /> Featured shops</p>
          <div className="flex flex-wrap gap-2">
            {featured.map((shop) => (
              <span key={`featured-${shop.id}`} className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-100 text-sm">
                {shop.name}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </PanelShell>
  );
};

export default Shops;
