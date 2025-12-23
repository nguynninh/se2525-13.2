import React, { useEffect, useState, useCallback } from 'react';
import { RefreshCcw, Save, Upload } from 'lucide-react';
import { getSellerProfile, getMyShop, updateMyShop, updateMyShopStatus, createMyShop, updateMyAvatar } from '../api/seller';

const Settings = () => {
  const [profile, setProfile] = useState({ first_name: '', last_name: '', email: '', profile_url: '' });
  const [shop, setShop] = useState({
    name: '',
    slug: '',
    email: '',
    address: '',
    description: '',
    hotline: '',
    logo_url: '',
    banner_url: '',
  });
  const [shopId, setShopId] = useState(null);
  const [shopStatus, setShopStatus] = useState('pending');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
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
          profile_url: p.user.profile_url || '',
        });
        setAvatarPreview(p.user.profile_url || '');
      }
      if (s) {
        setShop({
          name: s.name || '',
          slug: s.slug || '',
          email: s.email || s.contact_email || '',
          address: s.address || s.location || '',
          description: s.description || '',
          hotline: s.hotline || '',
          logo_url: s.logo_url || '',
          banner_url: s.banner_url || '',
        });
        setShopId(s.id || s._id || null);
        setShopStatus(s.status || 'pending');
      } else {
        setShop({
          name: '',
          slug: '',
          email: '',
          address: '',
          description: '',
          hotline: '',
          logo_url: '',
          banner_url: '',
        });
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

  const handleSelectAvatar = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const saveAvatar = async () => {
    if (!avatarFile) {
      setError('Choose an image before uploading.');
      return;
    }
    setUploadingAvatar(true);
    setError('');
    setMessage('');
    try {
      await updateMyAvatar(avatarFile);
      setMessage('Avatar updated.');
      setAvatarFile(null);
      await load();
    } catch (err) {
      setError(err.message || 'Failed to update avatar.');
    } finally {
      setUploadingAvatar(false);
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
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-24 h-24 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center text-xl font-semibold text-gray-600">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
              ) : (
                (profile.first_name?.[0] || 'A').toUpperCase()
              )}
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm bg-white hover:bg-gray-50 cursor-pointer w-fit">
                  <Upload className="w-4 h-4 mr-2" />
                  Choose image
                  <input type="file" accept="image/*" className="hidden" onChange={handleSelectAvatar} />
                </label>
                <button
                  type="button"
                  onClick={saveAvatar}
                  disabled={uploadingAvatar || !avatarFile}
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-md bg-gray-900 text-white shadow-sm hover:bg-gray-800 disabled:opacity-60"
                >
                  {uploadingAvatar ? 'Uploading...' : 'Save avatar'}
                </button>
              </div>
              {avatarFile && <p className="text-xs text-gray-600">Selected: {avatarFile.name}</p>}
              <p className="text-xs text-gray-500">Recommended: square image, max 5MB.</p>
            </div>
          </div>
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
              <label className="block text-sm font-medium text-gray-800">Slug</label>
              <input
                type="text"
                value={shop.slug}
                onChange={(e) => setShop((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder="store-slug"
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800">Hotline</label>
              <input
                type="text"
                value={shop.hotline}
                onChange={(e) => setShop((prev) => ({ ...prev, hotline: e.target.value }))}
                placeholder="Phone"
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
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-800">Description</label>
              <textarea
                value={shop.description}
                onChange={(e) => setShop((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your shop"
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800">Logo URL</label>
              <input
                type="url"
                value={shop.logo_url}
                onChange={(e) => setShop((prev) => ({ ...prev, logo_url: e.target.value }))}
                placeholder="https://..."
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
              {shop.logo_url && (
                <div className="mt-2">
                  <img src={shop.logo_url} alt="Logo preview" className="h-16 w-16 object-cover rounded-lg border" />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800">Banner URL</label>
              <input
                type="url"
                value={shop.banner_url}
                onChange={(e) => setShop((prev) => ({ ...prev, banner_url: e.target.value }))}
                placeholder="https://..."
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
              {shop.banner_url && (
                <div className="mt-2">
                  <img src={shop.banner_url} alt="Banner preview" className="h-20 w-full object-cover rounded-lg border" />
                </div>
              )}
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
