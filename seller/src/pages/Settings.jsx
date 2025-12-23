import React, { useEffect, useState, useCallback } from 'react';
import { RefreshCcw, Save } from 'lucide-react';
import { getSellerProfile, getMyShop, updateMyShop, updateMyShopStatus, createMyShop } from '../api/seller';

const Settings = () => {
  const [profile, setProfile] = useState({ first_name: '', last_name: '', email: '' });
  const [shop, setShop] = useState({ name: '', email: '', address: '' });
  const [shopId, setShopId] = useState(null);
  const [shopStatus, setShopStatus] = useState('pending');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [p, s] = await Promise.all([
        getSellerProfile(),
        getMyShop().catch((err) => {
          if (err?.status === 404) return null; // chưa tạo shop thì coi như null, không báo lỗi
          throw err;
        }),
      ]);
      if (p?.user) {
        setProfile({
          first_name: p.user.first_name || '',
          last_name: p.user.last_name || '',
          email: p.user.email || '',
        });
      }
      if (s) {
        setShop({
          name: s.name || '',
          email: s.email || s.contact_email || '',
          address: s.address || s.location || '',
        });
        setShopId(s.id || s._id || null);
        setShopStatus(s.status || 'pending');
      } else {
        setShop({ name: '', email: '', address: '' });
        setShopId(null);
        setShopStatus('pending');
      }
    } catch (err) {
      setError(err.message || 'Failed to load settings.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const saveShop = async () => {
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const payload = { ...shop };
      if (shopId) {
        await updateMyShop(payload);
        setMessage('Shop info saved.');
      } else {
        const created = await createMyShop(payload);
        setShopId(created?.id || created?._id || null);
        setMessage('Shop created.');
      }
      await load();
    } catch (err) {
      setError(err.message || 'Failed to save shop info.');
    } finally {
      setSaving(false);
    }
  };

  const saveStatus = async () => {
    if (!shopId) {
      setError('Create shop first.');
      return;
    }
    setSavingStatus(true);
    setError('');
    setMessage('');
    try {
      await updateMyShopStatus({ status: shopStatus });
      setMessage('Shop status updated.');
      await load();
    } catch (err) {
      setError(err.message || 'Failed to update shop status.');
    } finally {
      setSavingStatus(false);
    }
  };

  return (
    <div className="p-4 lg:p-5 space-y-4 bg-content-bg min-h-screen">
      <div className="rounded-xl bg-white border border-gray-200 p-4 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">Manage your seller account and shop.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
            disabled={loading || saving}
          >
            <RefreshCcw className="w-4 h-4 inline mr-1" />
            {loading ? 'Loading...' : 'Reload'}
          </button>
          <button
            onClick={saveShop}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 disabled:opacity-60"
            disabled={saving}
          >
            <Save className="w-4 h-4 inline mr-1" />
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </div>

      {error && <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">{error}</div>}
      {message && <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">{message}</div>}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-3 rounded-xl bg-white border border-gray-200 p-4 shadow-sm space-y-4">
          <h2 className="text-base font-semibold text-gray-900">Profile</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-800">First name</label>
              <input
                type="text"
                value={profile.first_name}
                onChange={(e) => setProfile((prev) => ({ ...prev, first_name: e.target.value }))}
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800">Last name</label>
              <input
                type="text"
                value={profile.last_name}
                onChange={(e) => setProfile((prev) => ({ ...prev, last_name: e.target.value }))}
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800">Email</label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="mt-2 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm shadow-sm text-gray-600"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl bg-white border border-gray-200 p-4 shadow-sm space-y-3">
          <h2 className="text-base font-semibold text-gray-900">Store information</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-800">Store name</label>
              <input
                type="text"
                value={shop.name}
                onChange={(e) => setShop((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Store name"
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800">Contact email</label>
              <input
                type="email"
                value={shop.email}
                onChange={(e) => setShop((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="you@example.com"
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800">Address</label>
              <input
                type="text"
                value={shop.address}
                onChange={(e) => setShop((prev) => ({ ...prev, address: e.target.value }))}
                placeholder="Enter store address"
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white border border-gray-200 p-4 shadow-sm space-y-3">
          <h2 className="text-base font-semibold text-gray-900">Shop status</h2>
          <p className="text-xs text-gray-600">Request update status for your shop.</p>
          <select
            value={shopStatus}
            onChange={(e) => setShopStatus(e.target.value)}
            className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
          >
            <option value="active">active</option>
            <option value="pending">pending</option>
            <option value="approved">approved</option>
            <option value="rejected">rejected</option>
            <option value="inactive">inactive</option>
          </select>
          <button
            type="button"
            onClick={saveStatus}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 disabled:opacity-60 w-full"
            disabled={savingStatus || loading}
          >
            {savingStatus ? 'Updating...' : 'Update status'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
