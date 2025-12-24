import React, { useEffect, useState } from 'react';
import { Mail, Phone } from 'lucide-react';
import api from '../../api/client';
import { Badge, EmptyState, PanelShell, SectionHeader, safeArray } from './shared.jsx';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [userIdInput, setUserIdInput] = useState('');
  const [acting, setActing] = useState(false);

  const tryPaths = async (paths, config) => {
    let lastError;
    for (const path of paths) {
      try {
        return await api({ url: path, ...config });
      } catch (err) {
        lastError = err;
        if (err?.response?.status === 404) continue;
        break;
      }
    }
    throw lastError;
  };

  const isUUID = (val) => typeof val === 'string' && val.trim().length === 36 && val.includes('-');

  const loadUsers = async (signal) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await tryPaths(
        ['/api/users/admin/users', '/api/user/admin/users', '/api/admin/users'],
        { method: 'get', signal },
      );
      const list = safeArray(data);
      // Chỉ hiển thị customer
      const customers = list.filter((u) => String(u.role || '').trim().toLowerCase() === 'customer');
      setUsers(customers);
    } catch (err) {
      if (err.name !== 'CanceledError') setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    loadUsers(controller.signal);
    return () => controller.abort();
  }, []);

  const reload = async () => loadUsers();

  const withAction = async (fn) => {
    setActing(true);
    setActionMessage('');
    try {
      await fn();
      await reload();
      setActionMessage('Action executed successfully.');
    } catch (err) {
      setActionMessage(err?.response?.data?.message || err?.message || 'Action failed.');
    } finally {
      setActing(false);
    }
  };

  const handleDeleteUser = () => {
    if (!userIdInput) return setActionMessage('Enter user ID to delete.');
    if (!isUUID(userIdInput)) return setActionMessage('User ID phải là UUID hợp lệ (36 ký tự).');
    if (!window.confirm('Delete this user?')) return;
    withAction(() =>
      tryPaths(
        [
          `/api/users/admin/users/${userIdInput}`,
          `/api/user/admin/users/${userIdInput}`,
          `/api/admin/users/${userIdInput}`,
        ],
        { method: 'delete' },
      ),
    );
  };

  const deleteUserRow = (id) => {
    if (!isUUID(id)) return setActionMessage('User ID phải là UUID hợp lệ (36 ký tự).');
    if (!window.confirm('Delete this user?')) return;
    withAction(() =>
      tryPaths(
        [`/api/users/admin/users/${id}`, `/api/user/admin/users/${id}`, `/api/admin/users/${id}`],
        { method: 'delete' },
      ),
    );
  };

  const renderTable = () => {
    const colCount = 6;
    return (
      <div className="overflow-x-auto">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wide">Customers</h3>
          <span className="text-xs text-slate-400">{users.length} users</span>
        </div>
        <table className="min-w-full text-sm">
          <thead className="bg-slate-900 text-slate-300 text-xs uppercase border-b border-slate-800">
            <tr>
              <th className="px-3 py-2 text-left font-semibold">ID</th>
              <th className="px-3 py-2 text-left font-semibold">Email</th>
              <th className="px-3 py-2 text-left font-semibold">Role</th>
              <th className="px-3 py-2 text-left font-semibold">Status</th>
              <th className="px-3 py-2 text-left font-semibold">Phone</th>
              <th className="px-3 py-2 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={colCount} className="px-3 py-4">
                  <EmptyState text="No users in this group." />
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-b border-slate-800/80">
                  <td className="px-3 py-2 font-semibold text-white">{user.id}</td>
                  <td className="px-3 py-2 text-slate-200 inline-flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-500" /> {user.email}
                  </td>
                  <td className="px-3 py-2">
                    <Badge tone={user.role === 'admin' ? 'success' : 'default'}>{user.role}</Badge>
                  </td>
                  <td className="px-3 py-2">
                    <Badge tone="default">{user.status || user.state || '--'}</Badge>
                  </td>
                  <td className="px-3 py-2 text-slate-200 inline-flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-500" /> {user.phone || '--'}
                  </td>
                  <td className="px-3 py-2 text-slate-200">
                    <button
                      onClick={() => deleteUserRow(user.id)}
                      className="px-3 py-1.5 rounded bg-rose-500 text-slate-50 text-xs font-semibold disabled:opacity-60"
                      disabled={acting}
                    >
                      Delete user
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <PanelShell>
      <SectionHeader title="Users" subtitle="Manage users (customers only)" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <div className="border border-slate-800 rounded-xl p-3 bg-slate-900/50 space-y-2">
          <p className="text-sm font-semibold text-white">Delete user</p>
          <input
            value={userIdInput}
            onChange={(e) => setUserIdInput(e.target.value)}
            placeholder="User ID"
            className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 text-sm text-slate-100"
          />
          <button
            onClick={handleDeleteUser}
            disabled={acting}
            className="px-3 py-2 rounded-lg text-sm font-semibold bg-rose-500 text-slate-50 disabled:opacity-60"
          >
            Delete user
          </button>
        </div>
      </div>

      {actionMessage ? (
        <div className="text-sm text-emerald-200 bg-emerald-500/10 border border-emerald-400/40 rounded-xl px-3 py-2 mb-3">
          {actionMessage}
        </div>
      ) : null}

      {loading ? (
        <div className="px-3 py-4 text-center text-sm text-slate-300">Loading...</div>
      ) : error ? (
        <div className="px-3 py-4 text-center text-sm text-rose-300">{error}</div>
      ) : users.length === 0 ? (
        <EmptyState text="No users yet." />
      ) : (
        renderTable()
      )}
    </PanelShell>
  );
};

export default Users;
