import React, { useEffect, useMemo, useState } from 'react';
import { Bell, RefreshCcw, Loader2, Inbox, Check, Filter } from 'lucide-react';
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from '../../api/notification';
import { Badge, PanelShell, SectionHeader, EmptyState } from './shared.jsx';

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Unread', value: 'unread' },
  { label: 'Order', value: 'order' },
  { label: 'Loyalty', value: 'loyalty' },
  { label: 'System', value: 'system' },
];

const toneByType = {
  order: 'info',
  loyalty: 'warning',
  system: 'default',
};

const Notifications = () => {
  const [items, setItems] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchNotifications({ limit: 50, page: 1 });
      const list = Array.isArray(data?.notifications) ? data.notifications : Array.isArray(data) ? data : [];
      setItems(list);
    } catch (err) {
      setError(err.message || 'Failed to load notifications.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const unreadCount = useMemo(() => items.filter((n) => !n.is_read).length, [items]);

  const filtered = useMemo(() => {
    return items.filter((n) => {
      const matchFilter =
        activeFilter === 'all'
          ? true
          : activeFilter === 'unread'
          ? !n.is_read
          : (n.type || '').toLowerCase() === activeFilter;
      const text = `${n.title || ''} ${n.content || ''}`.toLowerCase();
      const matchSearch = text.includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [items, activeFilter, search]);

  const markReadLocal = (id) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n)));
  };

  const markRead = async (id) => {
    try {
      await markNotificationRead(id);
      markReadLocal(id);
    } catch (err) {
      setError(err.message || 'Failed to mark read.');
    }
  };

  const markAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setItems((prev) => prev.map((n) => ({ ...n, is_read: true, read_at: new Date().toISOString() })));
    } catch (err) {
      setError(err.message || 'Failed to mark all read.');
    }
  };

  return (
    <PanelShell>
      <SectionHeader title="Notifications" subtitle="Review and manage system/order alerts" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
        <div className="border border-slate-800 rounded-xl p-4 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-400/40 grid place-items-center text-emerald-300">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-slate-200 font-semibold">Unread</p>
              <p className="text-xs text-slate-400">Notifications chưa đọc</p>
            </div>
            <div className="ml-auto text-lg font-bold text-white">{unreadCount}</div>
          </div>
          <button
            onClick={markAllRead}
            disabled={loading || unreadCount === 0}
            className="mt-4 w-full rounded-lg bg-emerald-500 text-slate-950 text-sm font-semibold py-2 hover:bg-emerald-400 disabled:opacity-60"
          >
            Mark all as read
          </button>
        </div>
        <div className="border border-slate-800 rounded-xl p-4 bg-slate-900/60">
          <p className="text-sm text-slate-200 font-semibold flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filters
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {filters.map((f) => {
              const active = activeFilter === f.value;
              const count =
                f.value === 'all'
                  ? items.length
                  : f.value === 'unread'
                  ? unreadCount
                  : items.filter((n) => (n.type || '').toLowerCase() === f.value).length;
              return (
                <button
                  key={f.value}
                  onClick={() => setActiveFilter(f.value)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    active
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {f.label}
                  <span className="ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-slate-800 text-[11px] text-slate-200 px-1">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="border border-slate-800 rounded-xl p-4 bg-slate-900/60">
          <p className="text-sm text-slate-200 font-semibold">Search</p>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title/content..."
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
          />
          <button
            onClick={load}
            className="mt-3 inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-200 hover:border-emerald-400"
            disabled={loading}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
            Refresh
          </button>
        </div>
      </div>

      <div className="border border-slate-800 rounded-xl bg-slate-900/60">
        {loading ? (
          <div className="p-6 text-sm text-slate-200 flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading...
          </div>
        ) : error ? (
          <div className="p-6 text-sm text-rose-300">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState text="No notifications found." />
          </div>
        ) : (
          <ul className="divide-y divide-slate-800">
            {filtered.map((n) => (
              <li key={n.id} className="p-4 flex items-start gap-3 hover:bg-slate-800/50">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full border border-slate-700 grid place-items-center text-xs font-bold text-slate-200">
                    {(n.type || '?')[0].toUpperCase()}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-white">{n.title}</p>
                      {!n.is_read && <span className="h-2 w-2 rounded-full bg-emerald-400"></span>}
                    </div>
                    <span className="text-xs text-slate-400 whitespace-nowrap">{n.created_at || n.time || ''}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-200">{n.content || n.message}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge tone={toneByType[n.type] || 'default'}>{n.type || 'unknown'}</Badge>
                    <button
                      onClick={() => markRead(n.id)}
                      className="rounded-lg border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-200 hover:border-emerald-400 disabled:opacity-60"
                      disabled={loading || n.is_read}
                    >
                      {n.is_read ? (
                        <>
                          <Check className="w-3.5 h-3.5 inline mr-1" />
                          Read
                        </>
                      ) : (
                        'Mark as read'
                      )}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PanelShell>
  );
};

export default Notifications;
