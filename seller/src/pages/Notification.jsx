import React, { useEffect, useMemo, useState } from 'react';
import { Bell, RefreshCcw, Loader2, Inbox, Check } from 'lucide-react';
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from '../api/notification';

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Unread', value: 'unread' },
  { label: 'Order', value: 'order' },
  { label: 'Loyalty', value: 'loyalty' },
  { label: 'System', value: 'system' },
];

const typeColors = {
  order: 'bg-blue-100 text-blue-700',
  loyalty: 'bg-amber-100 text-amber-700',
  system: 'bg-gray-200 text-gray-700',
};

const Notification = () => {
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

  const unreadCount = items.filter((n) => n.unread).length;
  const unreadCountServer = items.filter((n) => !n.is_read).length;

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
    <div className="p-4 lg:p-5 space-y-4 bg-content-bg min-h-screen">
      <div className="rounded-xl bg-white border border-gray-200 p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-900 text-white grid place-items-center">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-gray-600">You have {unreadCountServer} unread notifications.</p>
            <p className="text-xs text-gray-500">Tap to mark read or mark all.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 inline-flex items-center gap-1"
            disabled={loading}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
            Refresh
          </button>
          <button
            onClick={markAllRead}
            className="rounded-lg bg-gray-900 text-white px-4 py-2 text-sm font-semibold hover:bg-gray-800 disabled:opacity-60"
            disabled={loading || unreadCountServer === 0}
          >
            Mark all as read
          </button>
        </div>
      </div>

      <div className="rounded-xl bg-white border border-gray-200 p-4 shadow-sm space-y-3">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => {
            const active = activeFilter === f.value;
            const count =
              f.value === 'all'
                ? items.length
                : f.value === 'unread'
                ? unreadCountServer
                : items.filter((n) => (n.type || '').toLowerCase() === f.value).length;
            return (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  active ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {f.label}
                <span
                  className={`ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full text-xs font-bold ${
                    active ? 'bg-white text-gray-900' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="w-full md:w-80">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notifications..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white border border-gray-200 shadow-sm">
        {loading ? (
          <div className="p-6 text-sm text-gray-600 flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading...
          </div>
        ) : error ? (
          <div className="p-6 text-sm text-rose-600">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-6 text-sm text-gray-600 flex items-center gap-2">
            <Inbox className="w-4 h-4" /> No notifications found.
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filtered.map((n) => (
              <li key={n.id} className="p-4 flex items-start gap-3 hover:bg-gray-50">
                <div className="flex-shrink-0">
                  <span
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-xs font-semibold ${typeColors[n.type] || 'bg-gray-100 text-gray-700'}`}
                  >
                    {(n.type || '?')[0]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900">{n.title}</p>
                      {!n.is_read && <span className="h-2 w-2 rounded-full bg-rose-500"></span>}
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">{n.created_at || n.time || ''}</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-700">{n.content || n.message}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${typeColors[n.type] || 'bg-gray-100 text-gray-700'}`}>
                      {n.type || 'unknown'}
                    </span>
                    <button
                      onClick={() => markRead(n.id)}
                      className="rounded-lg border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                      disabled={loading || n.is_read}
                    >
                      {n.is_read ? <Check className="w-3.5 h-3.5 inline mr-1" /> : null}
                      {n.is_read ? 'Read' : 'Mark as read'}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notification;
