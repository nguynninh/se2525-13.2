import React, { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, UserRound, Search } from 'lucide-react';
import api from '../../api/client';
import { Badge, EmptyState, PanelShell, SectionHeader, safeArray, formatDate } from './shared.jsx';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailCache, setDetailCache] = useState({});
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState('');
  const [detailError, setDetailError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [acting, setActing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

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

  const loadUsers = async (signal, opts = {}) => {
    setLoading(true);
    setError('');
    try {
      const searchVal = opts.search !== undefined ? opts.search : searchTerm;
      const roleVal = opts.role !== undefined ? opts.role : roleFilter;
      const { data } = await tryPaths(
        ['/api/users/admin/users', '/api/user/admin/users', '/api/admin/users'],
        {
          method: 'get',
          signal,
          params: {
            search: searchVal?.trim() || undefined,
            role: roleVal || undefined,
          },
        },
      );
      const list = safeArray(data);
      setUsers(list);
      if (list.length === 0) {
        setSelectedUser(null);
        setDetail(null);
        setDetailError('');
      }
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

  const fetchUserDetail = async (userId) => {
    if (!userId) return null;
    const cached = detailCache[userId];
    if (cached) {
      setDetail(cached);
      setDetailError('');
      return cached;
    }
    setDetailLoading(true);
    setDetailError('');
    try {
      const res = await tryPaths(
        [`/api/user/admin/users/${userId}`, `/api/users/admin/users/${userId}`, `/api/admin/users/${userId}`],
        { method: 'get' },
      );
      const payload = res?.data ?? res;
      setDetail(payload);
      setDetailCache((prev) => ({ ...prev, [userId]: payload }));
      return payload;
    } catch (err) {
      if (err?.name !== 'CanceledError') setDetailError(err.message || 'Failed to load user detail');
      throw err;
    } finally {
      setDetailLoading(false);
    }
  };

  const handleSelect = async (user) => {
    if (!user) return;
    setSelectedUser(user);
    if (!detailCache[user.id]) setDetail(null);
    try {
      await fetchUserDetail(user.id);
    } catch {
      /* detailError handled in fetchUserDetail */
    }
  };

  const reload = async () => loadUsers();
  const applyFilters = async (overrides = {}) => loadUsers(undefined, overrides);

  const deleteUser = async (user) => {
    if (!user?.id) return;
    const ok = window.confirm('Are you sure you want to delete this user? This will cascade linked records.');
    if (!ok) return;
    await withAction(() =>
      tryPaths(
        [`/api/user/admin/users/${user.id}`, `/api/users/admin/users/${user.id}`, `/api/admin/users/${user.id}`],
        { method: 'delete' },
      ),
    );
    setSelectedUser(null);
    setDetail(null);
    await reload();
  };

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

  const resolveSellerId = async (user) => {
    const existing = user.seller?.id || user.seller_id;
    if (existing) return existing;
    const detailRes = await tryPaths(
      [`/api/user/admin/users/${user.id}`, `/api/users/admin/users/${user.id}`, `/api/admin/users/${user.id}`],
      { method: 'get' },
    );
    const sid = detailRes?.data?.seller?.id || detailRes?.seller?.id || '';
    if (!sid) throw new Error('Seller not found for this user');
    return sid;
  };

  const actOnSellerRow = async (user, action) => {
    try {
      const sellerId = await resolveSellerId(user);
      if (!isUUID(sellerId)) return setActionMessage('Seller ID is invalid.');
      const statusMap = { activate: 'active', suspend: 'suspended', close: 'closed' };
      if (!window.confirm(`Execute ${action} for this seller?`)) return;

      if (action === 'delete') {
        await withAction(() =>
          tryPaths(
            [`/api/user/admin/sellers/${sellerId}`, `/api/users/admin/sellers/${sellerId}`, `/api/admin/sellers/${sellerId}`],
            { method: 'delete' },
          ),
        );
      } else if (statusMap[action]) {
        await withAction(() =>
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
    } catch (err) {
      setActionMessage(err?.message || 'Seller not found for this user');
    }
  };

  const normalizeRole = (u) => String(u.role || '').trim().toLowerCase();
  const customers = users.filter((u) => normalizeRole(u) === 'customer');
  const sellers = users.filter((u) => normalizeRole(u) === 'seller');

  const renderTable = (title, list) => {
    const colCount = 6;
    return (
      <div className="overflow-x-auto">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wide">{title}</h3>
          <span className="text-xs text-slate-400">{list.length} users</span>
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
            {list.length === 0 ? (
              <tr>
                <td colSpan={colCount} className="px-3 py-4">
                  <EmptyState text="No users in this group." />
                </td>
              </tr>
            ) : (
              list.map((user) => (
                <tr
                  key={user.id}
                  className={`border-b border-slate-800/80 ${selectedUser?.id === user.id ? 'bg-slate-900/50' : ''}`}
                >
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
                  <td className="px-3 py-2">
                    <button
                      onClick={() => handleSelect(user)}
                      className="px-3 py-2 rounded-lg border border-slate-800 bg-slate-900/80 text-xs font-semibold text-slate-100 hover:border-emerald-400/60"
                    >
                      View detail
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

  const renderDetailPanel = () => {
    if (!selectedUser) return <EmptyState text="Select a user to view detail." />;
    const payload = detail || detailCache[selectedUser.id];
    if (detailLoading && !payload) return <EmptyState text="Loading detail..." />;
    if (detailError && !payload) return <div className="text-sm text-rose-300">{detailError}</div>;

    const user = payload?.user || selectedUser || {};
    const customer = payload?.customer;
    const seller = payload?.seller;
    const adminProfile = payload?.admin;
    const addresses = safeArray(payload?.shipping_addresses);
    const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || '--';

    return (
      <div className="space-y-3">
        {detailError ? <div className="text-xs text-amber-200 bg-amber-500/10 border border-amber-400/40 rounded-lg px-2 py-1">{detailError}</div> : null}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-slate-400">User</p>
            <p className="text-base font-semibold text-white break-all">{user.email || 'N/A'}</p>
            <p className="text-xs text-slate-500 break-all">{user.id}</p>
          </div>
          <Badge tone={user.role === 'admin' ? 'success' : user.role === 'seller' ? 'warning' : 'default'}>
            {user.role || 'unknown'}
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-200">
          <div className="space-y-1">
            <p className="text-xs text-slate-400">Full name</p>
            <p className="inline-flex items-center gap-2 font-semibold">
              <UserRound className="w-4 h-4 text-slate-500" /> {fullName}
            </p>
            <p className="text-xs text-slate-400">Phone</p>
            <p className="inline-flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-500" /> {user.phone || '--'}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-slate-400">Associations</p>
            <p>Customer: {customer ? `${customer.id} | points: ${customer.loyalty_points}` : '--'}</p>
            <p>Seller: {seller ? `${seller.id} | ${seller.status}` : '--'}</p>
            <p>Admin: {adminProfile ? adminProfile.id : '--'}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-white">Shipping addresses</p>
            <span className="text-xs text-slate-400">{addresses.length} total</span>
          </div>
          {addresses.length === 0 ? (
            <EmptyState text="No shipping addresses." />
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {addresses.map((addr) => {
                const addressLine = addr?.address?.address_line || '--';
                const ward = addr?.address?.ward?.name || '';
                const province = addr?.address?.ward?.province?.name || '';
                return (
                  <div key={addr.id} className="border border-slate-800 rounded-lg p-3 bg-slate-900/50 space-y-1">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="break-all">{addr.id}</span>
                      {addr.is_default ? <Badge tone="success">Default</Badge> : null}
                    </div>
                    <p className="text-sm font-semibold text-white">{addr.receiver_name || '--'}</p>
                    <p className="text-sm text-slate-200">{addr.receiver_phone || '--'}</p>
                    <p className="text-sm text-slate-200 flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-slate-500 mt-0.5" />
                      <span className="leading-tight">
                        {addressLine}
                        {ward ? `, ${ward}` : ''}
                        {province ? `, ${province}` : ''}
                      </span>
                    </p>
                    <p className="text-xs text-slate-500">Updated: {formatDate(addr.updated_at || addr.updatedAt)}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-xs text-slate-400">Actions</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => deleteUser(selectedUser)}
              className="px-3 py-2 rounded-lg text-sm font-semibold bg-rose-500 text-slate-50 hover:bg-rose-400 disabled:opacity-60"
              disabled={acting}
            >
              Delete user
            </button>
            {seller ? (
              <>
                <button
                  onClick={() => actOnSellerRow(selectedUser, 'activate')}
                  disabled={acting}
                  className="px-3 py-2 rounded-lg text-sm font-semibold border border-slate-800 text-slate-100 hover:border-emerald-400/60 disabled:opacity-60"
                >
                  Set active
                </button>
                <button
                  onClick={() => actOnSellerRow(selectedUser, 'suspend')}
                  disabled={acting}
                  className="px-3 py-2 rounded-lg text-sm font-semibold border border-slate-800 text-slate-100 hover:border-amber-400/60 disabled:opacity-60"
                >
                  Suspend
                </button>
                <button
                  onClick={() => actOnSellerRow(selectedUser, 'close')}
                  disabled={acting}
                  className="px-3 py-2 rounded-lg text-sm font-semibold border border-slate-800 text-slate-100 hover:border-rose-400/60 disabled:opacity-60"
                >
                  Close
                </button>
                <button
                  onClick={() => actOnSellerRow(selectedUser, 'delete')}
                  disabled={acting}
                  className="px-3 py-2 rounded-lg text-sm font-semibold bg-slate-800 text-slate-100 hover:border-rose-400/60 disabled:opacity-60"
                >
                  Delete seller role
                </button>
              </>
            ) : null}
          </div>
          {actionMessage ? (
            <div className="text-xs text-emerald-200 bg-emerald-500/10 border border-emerald-400/40 rounded-lg px-2 py-1">
              {actionMessage}
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <PanelShell>
      <SectionHeader title="Users (admin)" subtitle="Manage users" />

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            applyFilters();
          }}
          className="flex items-center gap-2 flex-1 min-w-[240px]"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by email"
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900/70 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-400/60 outline-none"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => {
              const value = e.target.value;
              setRoleFilter(value);
              applyFilters({ role: value });
            }}
            className="rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 text-sm text-slate-100"
          >
            <option value="">All roles</option>
            <option value="customer">Customer</option>
            <option value="seller">Seller</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            className="px-3 py-2 rounded-lg text-sm font-semibold bg-emerald-500 text-slate-950 hover:bg-emerald-400"
          >
            Search
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setRoleFilter('');
              applyFilters({ search: '', role: '' });
            }}
            className="px-3 py-2 rounded-lg text-sm font-semibold border border-slate-800 text-slate-100 hover:border-emerald-400/60"
          >
            Clear
          </button>
        </form>
      </div>

      {loading ? (
        <div className="px-3 py-4 text-center text-sm text-slate-300">Loading...</div>
      ) : error ? (
        <div className="px-3 py-4 text-center text-sm text-rose-300">{error}</div>
      ) : users.length === 0 ? (
        <EmptyState text="No users yet." />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2 space-y-4">
            {renderTable('Customers', customers)}
            {renderTable('Sellers', sellers)}
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-white">User detail</p>
            {renderDetailPanel()}
          </div>
        </div>
      )}
    </PanelShell>
  );
};

export default Users;
