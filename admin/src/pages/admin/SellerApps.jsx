import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { Badge, EmptyState, PanelShell, SectionHeader, safeArray, formatDate } from './shared.jsx';

const SellerApps = () => {
  const [pending, setPending] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actingId, setActingId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      setLoading(true); setError('');
      try {
        const [p, h] = await Promise.all([
          api.get('/api/seller-applications/admin/pending', { signal: controller.signal }),
          api.get('/api/seller-applications/admin/history', { signal: controller.signal }),
        ]);
        setPending(safeArray(p.data));
        setHistory(safeArray(h.data));
      } catch (err) {
        if (err.name !== 'CanceledError') setError(err.message || 'Failed to load seller applications');
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, []);

  const review = async (id, status) => {
    if (!id) return;
    setActingId(id);
    try {
      await api.patch(`/api/seller-applications/admin/${id}/review`, { status });
      // reload both lists after action
      const [p, h] = await Promise.all([
        api.get('/api/seller-applications/admin/pending'),
        api.get('/api/seller-applications/admin/history'),
      ]);
      setPending(safeArray(p.data));
      setHistory(safeArray(h.data));
    } catch (err) {
      setError(err.message || 'Failed to update application status');
    } finally {
      setActingId('');
    }
  };

  return (
    <div className="space-y-4">
      <PanelShell>
        {loading ? <EmptyState text="Loading..." /> : null}
        {error ? <div className="text-sm text-rose-300">{error}</div> : null}
        {!loading && !error && pending.length === 0 ? <EmptyState text="No pending applications." /> : null}
        <div className="space-y-2">
          {pending.map((app) => (
            <div key={app.id} className="flex items-center justify-between border border-slate-800 rounded-xl px-3 py-2 bg-slate-900/40">
              <div>
                <p className="font-semibold text-white">{app.id}</p>
                <p className="text-xs text-slate-400">{app.user_id || app.user || '--'}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone="warning">{app.status || 'pending'}</Badge>
                <Badge tone="default">{formatDate(app.created_at || app.createdAt)}</Badge>
                <button
                  disabled={actingId === app.id}
                  onClick={() => review(app.id, 'approved')}
                  className="text-xs font-semibold px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 disabled:opacity-60"
                >
                  Approve
                </button>
                <button
                  disabled={actingId === app.id}
                  onClick={() => review(app.id, 'rejected')}
                  className="text-xs font-semibold px-3 py-1 rounded-lg bg-rose-500 text-slate-50 disabled:opacity-60"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </PanelShell>

      <PanelShell>
        {loading && history.length === 0 ? <EmptyState text="Loading..." /> : null}
        {!loading && history.length === 0 ? <EmptyState text="No history yet." /> : null}
        <div className="space-y-2">
          {history.map((app) => (
            <div key={`history-${app.id}`} className="flex items-center justify-between border border-slate-800 rounded-xl px-3 py-2 bg-slate-900/40">
              <div>
                <p className="font-semibold text-white">{app.id}</p>
                <p className="text-xs text-slate-400">reviewed_by: {app.reviewed_by || app.reviewedBy || '--'}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={app.status === 'approved' ? 'success' : 'danger'}>{app.status}</Badge>
                <Badge tone="default">{formatDate(app.updated_at || app.updatedAt)}</Badge>
              </div>
            </div>
          ))}
        </div>
      </PanelShell>
    </div>
  );
};

export default SellerApps;
