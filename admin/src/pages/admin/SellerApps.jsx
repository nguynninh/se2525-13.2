import React, { useEffect, useMemo, useState } from 'react';
import api from '../../api/client';
import { Badge, EmptyState, PanelShell, SectionHeader, safeArray, formatDate } from './shared.jsx';

const SellerApps = () => {
  const [pending, setPending] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actingId, setActingId] = useState('');
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);

  const stats = useMemo(
    () => ({
      pending: pending.length,
      approved: history.filter((h) => h.status === 'approved').length,
      rejected: history.filter((h) => h.status === 'rejected').length,
    }),
    [pending, history],
  );

  const load = async (controller) => {
    setLoading(true);
    setError('');
    try {
      const [p, h] = await Promise.all([
        api.get('/api/seller-applications/admin/pending', controller ? { signal: controller.signal } : undefined),
        api.get('/api/seller-applications/admin/history', controller ? { signal: controller.signal } : undefined),
      ]);
      const pList = safeArray(p.data);
      const hList = safeArray(h.data);
      setPending(pList);
      setHistory(hList);
      if (!selected) {
        setSelected(pList[0] || hList[0] || null);
      } else {
        const merged = [...pList, ...hList];
        const found = merged.find((x) => x.id === selected.id);
        setSelected(found || merged[0] || null);
      }
    } catch (err) {
      if (err.name !== 'CanceledError') setError(err.message || 'Failed to load seller applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    load(controller);
    return () => controller.abort();
  }, []);

  const review = async (id, status) => {
    if (!id) return;
    setActingId(id);
    try {
      await api.patch(`/api/seller-applications/admin/${id}/review`, { status });
      // reload both lists after action
      await load();
    } catch (err) {
      setError(err.message || 'Failed to update application status');
    } finally {
      setActingId('');
    }
  };

  const renderCard = (app, compact = false) => (
    <button
      key={app.id}
      onClick={() => setSelected(app)}
      className={`w-full text-left border border-slate-800 rounded-xl px-3 py-2 bg-slate-900/40 hover:border-emerald-400/40 transition ${
        selected?.id === app.id ? 'ring-1 ring-emerald-400/60' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-white truncate">{app.id}</p>
          <p className="text-xs text-slate-400 truncate">{app.user?.email || app.user_id || '--'}</p>
          {!compact ? <p className="text-xs text-slate-500">submitted: {formatDate(app.created_at || app.createdAt)}</p> : null}
        </div>
        <div className="flex items-center gap-2">
          <Badge tone={app.status === 'approved' ? 'success' : app.status === 'rejected' ? 'danger' : 'warning'}>
            {app.status || 'pending'}
          </Badge>
          {!compact ? <Badge tone="default">{app.reviewed_by || app.reviewedBy || 'unreviewed'}</Badge> : null}
        </div>
      </div>
    </button>
  );

  const renderDetail = () => {
    if (!selected) return <EmptyState text="Select an application to view detail." />;
    const user = selected.user || {};
    return (
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-slate-400">Application ID</p>
            <p className="text-base font-semibold text-white break-all">{selected.id}</p>
          </div>
          <Badge tone={selected.status === 'approved' ? 'success' : selected.status === 'rejected' ? 'danger' : 'warning'}>
            {selected.status || 'pending'}
          </Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-200">
          <div className="space-y-1">
            <p className="text-xs text-slate-400">User</p>
            <p className="font-semibold">{user.email || 'N/A'}</p>
            <p className="text-slate-400">{[user.first_name, user.last_name].filter(Boolean).join(' ')}</p>
            <p className="text-slate-400">{user.phone || '—'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-slate-400">Meta</p>
            <p>Submitted: {formatDate(selected.created_at || selected.createdAt)}</p>
            <p>Reviewed at: {formatDate(selected.updated_at || selected.updatedAt)}</p>
            <p>Reviewed by: {selected.reviewed_by || selected.reviewedBy || '—'}</p>
          </div>
        </div>
        <div className="text-sm text-slate-200 space-y-1">
          <p className="text-xs text-slate-400">Accepted terms</p>
          <p>{selected.accepted_terms ? 'Yes' : 'No'}</p>
        </div>
        {selected.rejection_reason ? (
          <div className="text-sm text-slate-200 space-y-1">
            <p className="text-xs text-rose-300">Rejection reason</p>
            <p className="bg-slate-900/60 border border-slate-800 rounded-lg p-2 text-rose-100">{selected.rejection_reason}</p>
          </div>
        ) : null}
        {selected.status === 'pending' ? (
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              disabled={actingId === selected.id}
              onClick={() => review(selected.id, 'approved')}
              className="px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 font-semibold text-sm disabled:opacity-60"
            >
              Approve
            </button>
            <button
              disabled={actingId === selected.id}
              onClick={() => review(selected.id, 'rejected')}
              className="px-4 py-2 rounded-lg bg-rose-500 text-slate-50 font-semibold text-sm disabled:opacity-60"
            >
              Reject
            </button>
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Seller Applications"
        subtitle="Review and track seller onboarding"
        action="Reload"
        onAction={() => load()}
      />
      {error ? <div className="text-sm text-rose-300">{error}</div> : null}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <PanelShell>
          <p className="text-xs text-slate-400">Pending</p>
          <p className="text-2xl font-bold text-white">{stats.pending}</p>
        </PanelShell>
        <PanelShell>
          <p className="text-xs text-slate-400">Approved</p>
          <p className="text-2xl font-bold text-emerald-300">{stats.approved}</p>
        </PanelShell>
        <PanelShell>
          <p className="text-xs text-slate-400">Rejected</p>
          <p className="text-2xl font-bold text-rose-300">{stats.rejected}</p>
        </PanelShell>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <PanelShell>
          <p className="text-sm font-semibold text-white">Pending</p>
          {loading && pending.length === 0 ? <EmptyState text="Loading..." /> : null}
          {!loading && pending.length === 0 ? <EmptyState text="No pending applications." /> : null}
          <div className="space-y-2">{pending.map((app) => renderCard(app))}</div>
        </PanelShell>

        <PanelShell>
          <p className="text-sm font-semibold text-white">History</p>
          {loading && history.length === 0 ? <EmptyState text="Loading..." /> : null}
          {!loading && history.length === 0 ? <EmptyState text="No history yet." /> : null}
          <div className="space-y-2">{history.map((app) => renderCard(app, true))}</div>
        </PanelShell>

        <PanelShell>
          <p className="text-sm font-semibold text-white">Application detail</p>
          {renderDetail()}
        </PanelShell>
      </div>
    </div>
  );
};

export default SellerApps;
