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
  const [sellerIdInput, setSellerIdInput] = useState('');
  const [sellerStatus, setSellerStatus] = useState('active');
  const [acting, setActing] = useState(false);

  // Try multiple paths to avoid environment differences (e.g. /api/user/admin vs /api/admin)
  const tryPaths = async (paths, config) => {
    let lastError;
    for (const path of paths) {
      try {
        return await api({ url: path, ...config });
      } catch (err) {
        lastError = err;
        if (err?.response?.status === 404) continue; // fallback to next path
        break;
      }
    }
    throw lastError;
  };

  const isUUID = (val) => typeof val === 'string' && val.trim().length === 36 && val.includes('-');

  const loadUsers = async (signal) => {
    setLoading(true); setError('');
    try {
      const { data } = await tryPaths(
        ['/api/users/admin/users', '/api/user/admin/users', '/api/admin/users'],
        { method: 'get', signal },
      );
      setUsers(safeArray(data));
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

  const handleDeleteSeller = () => {
    if (!sellerIdInput) return setActionMessage('Enter seller ID to delete.');
    if (!isUUID(sellerIdInput)) return setActionMessage('Seller ID phải là UUID hợp lệ (36 ký tự).');
    withAction(() =>
      tryPaths(
        [
          `/api/users/admin/sellers/${sellerIdInput}`,
          `/api/user/admin/sellers/${sellerIdInput}`,
          `/api/admin/sellers/${sellerIdInput}`,
        ],
        { method: 'delete' },
      ),
    );
  };

  const handleUpdateSellerStatus = () => {
    if (!sellerIdInput) return setActionMessage('Enter seller ID to update status.');
    if (!isUUID(sellerIdInput)) return setActionMessage('Seller ID phải là UUID hợp lệ (36 ký tự).');
    withAction(() =>
      tryPaths(
        [
          `/api/users/admin/sellers/${sellerIdInput}/status`,
          `/api/user/admin/sellers/${sellerIdInput}/status`,
          `/api/admin/sellers/${sellerIdInput}/status`,
        ],
        { method: 'patch', data: { status: sellerStatus } },
      ),
    );
  };

  const actOnSellerRow = async (sellerId, action) => {
    if (!sellerId) {
      setActionMessage('User này chưa có seller.');
      return;
    }
    if (!isUUID(sellerId)) {
      setActionMessage('Seller ID không hợp lệ.');
      return;
    }
    if (action === 'delete') {
      withAction(() =>
        tryPaths(
          [`/api/user/admin/sellers/${sellerId}`, `/api/users/admin/sellers/${sellerId}`, `/api/admin/sellers/${sellerId}`],
          { method: 'delete' },
        ),
      );
    } else if (action === 'activate' || action === 'suspend' || action === 'close') {
      const statusMap = { activate: 'active', suspend: 'suspended', close: 'closed' };
      withAction(() =>
        tryPaths(
          [
            `/api/user/admin/sellers/${sellerId}/status`,
            `/api/users/admin/sellers/${sellerId}/status`,
            `/api/admin/sellers/${sellerId}/status`,
          ],
          { method: 'patch', data: { status: statusMap[action] } },
        ),
      );
    }
  };

  const getSellerId = (user) => user.seller?.id || user.seller_id || '';

  return (
    <PanelShell>
      <SectionHeader title="Users (admin)" subtitle="Manage users and sellers" />

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

        <div className="border border-slate-800 rounded-xl p-3 bg-slate-900/50 space-y-2">
          <p className="text-sm font-semibold text-white">Delete seller</p>
          <input
            value={sellerIdInput}
            onChange={(e) => setSellerIdInput(e.target.value)}
            placeholder="Seller ID"
            className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 text-sm text-slate-100"
          />
          <button
            onClick={handleDeleteSeller}
            disabled={acting}
            className="px-3 py-2 rounded-lg text-sm font-semibold bg-rose-500 text-slate-50 disabled:opacity-60"
          >
            Delete seller
          </button>
        </div>

        <div className="border border-slate-800 rounded-xl p-3 bg-slate-900/50 space-y-2">
          <p className="text-sm font-semibold text-white">Update seller status</p>
          <div className="flex gap-2">
            <input
              value={sellerIdInput}
              onChange={(e) => setSellerIdInput(e.target.value)}
              placeholder="Seller ID"
              className="flex-1 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 text-sm text-slate-100"
            />
            <select
              value={sellerStatus}
              onChange={(e) => setSellerStatus(e.target.value)}
              className="rounded-lg border border-slate-800 bg-slate-900/80 px-2 py-2 text-sm text-slate-100"
            >
              <option value="active">active</option>
              <option value="suspended">suspended</option>
              <option value="closed">closed</option>
            </select>
          </div>
          <button
            onClick={handleUpdateSellerStatus}
            disabled={acting}
            className="px-3 py-2 rounded-lg text-sm font-semibold bg-emerald-500 text-slate-950 disabled:opacity-60"
          >
            Update status
          </button>
        </div>
      </div>

      {actionMessage ? (
        <div className="text-sm text-emerald-200 bg-emerald-500/10 border border-emerald-400/40 rounded-xl px-3 py-2 mb-3">
          {actionMessage}
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-900 text-slate-300 text-xs uppercase border-b border-slate-800">
            <tr>
              <th className="px-3 py-2 text-left font-semibold">User ID</th>
              <th className="px-3 py-2 text-left font-semibold">Seller ID</th>
              <th className="px-3 py-2 text-left font-semibold">Email</th>
              <th className="px-3 py-2 text-left font-semibold">Role</th>
              <th className="px-3 py-2 text-left font-semibold">Status</th>
              <th className="px-3 py-2 text-left font-semibold">Phone</th>
              <th className="px-3 py-2 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="px-3 py-4 text-center text-sm text-slate-300">Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan="7" className="px-3 py-4 text-center text-sm text-rose-300">{error}</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="7" className="px-3 py-4"><EmptyState text="No users yet." /></td></tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-b border-slate-800/80">
                  <td className="px-3 py-2 font-semibold text-white">{user.id}</td>
                  <td className="px-3 py-2 text-slate-200">{getSellerId(user) || '--'}</td>
                  <td className="px-3 py-2 text-slate-200 inline-flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-500" /> {user.email}
                  </td>
                  <td className="px-3 py-2"><Badge tone={user.role === 'admin' ? 'success' : 'default'}>{user.role}</Badge></td>
                  <td className="px-3 py-2"><Badge tone="default">{user.status || user.state || '--'}</Badge></td>
                  <td className="px-3 py-2 text-slate-200 inline-flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-500" /> {user.phone || '--'}
                  </td>
                  <td className="px-3 py-2 text-slate-200">
                    <div className="flex flex-wrap gap-1">
                      <button
                        onClick={() => actOnSellerRow(user.seller?.id || user.seller_id, 'activate')}
                        className="px-2 py-1 rounded bg-emerald-500 text-slate-950 text-xs font-semibold disabled:opacity-60"
                        disabled={acting || !getSellerId(user)}
                      >
                        Activate
                      </button>
                      <button
                        onClick={() => actOnSellerRow(user.seller?.id || user.seller_id, 'suspend')}
                        className="px-2 py-1 rounded bg-amber-500 text-slate-950 text-xs font-semibold disabled:opacity-60"
                        disabled={acting || !getSellerId(user)}
                      >
                        Suspend
                      </button>
                      <button
                        onClick={() => actOnSellerRow(user.seller?.id || user.seller_id, 'close')}
                        className="px-2 py-1 rounded bg-slate-700 text-slate-50 text-xs font-semibold disabled:opacity-60"
                        disabled={acting || !getSellerId(user)}
                      >
                        Close
                      </button>
                      <button
                        onClick={() => actOnSellerRow(user.seller?.id || user.seller_id, 'delete')}
                        className="px-2 py-1 rounded bg-rose-500 text-slate-50 text-xs font-semibold disabled:opacity-60"
                        disabled={acting || !getSellerId(user)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </PanelShell>
  );
};

export default Users;
