import React, { useEffect, useState, useCallback } from 'react';
import { RefreshCcw, Save, Upload } from 'lucide-react';
import { getSellerProfile, getMyShop, updateMyShop, createMyShop, updateMyAvatar } from '../api/seller';
import { fetchProvinces, fetchWards } from '../api/shipping';

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
  // Status is managed by admin, keep local for display only
  const [shopStatus, setShopStatus] = useState('pending');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [provinces, setProvinces] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [loadingProvince, setLoadingProvince] = useState(false);
  const [loadingWard, setLoadingWard] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [p, s] = await Promise.all([
        getSellerProfile(),
        getMyShop().catch((err) => {
          if (err?.status === 404) return null; // no shop yet -> treat as null
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
        const addressLine =
          typeof s.address === 'string' ? s.address : s.address?.address_line || s.location || s.address_line || '';
        setShop({
          name: s.name || '',
          slug: s.slug || '',
          email: s.email || s.contact_email || '',
          address: addressLine,
          description: s.description || '',
          hotline: s.hotline || '',
          logo_url: s.logo_url || '',
          banner_url: s.banner_url || '',
        });
        const wardCode = s.address?.ward?.id || s.address?.ward?.code || s.address?.ward_code || s.ward_id || '';
        const provinceCode = s.address?.ward?.province?.code || s.address?.province_code || '';
        setSelectedWard(wardCode);
        setSelectedProvince(provinceCode);
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
        setSelectedWard('');
        setSelectedProvince('');
      }
    } catch (err) {
      setError(err.message || 'Failed to load settings.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const normalizeList = (payload) => {
      if (Array.isArray(payload)) return payload;
      if (Array.isArray(payload?.provinces)) return payload.provinces;
      if (Array.isArray(payload?.data)) return payload.data;
      return [];
    };

    const loadProvinces = async () => {
      try {
        setLoadingProvince(true);
        const data = await fetchProvinces();
        const list = normalizeList(data);
        setProvinces(list);
      } catch (err) {
        setError(err.message || 'Failed to load provinces.');
      } finally {
        setLoadingProvince(false);
      }
    };
    loadProvinces();
  }, []);

  useEffect(() => {
    const loadWards = async () => {
      if (!selectedProvince) {
        setWards([]);
        return;
      }
      try {
        setLoadingWard(true);
        const data = await fetchWards(selectedProvince);
        const list = Array.isArray(data?.wards) ? data.wards : Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        setWards(list);
      } catch (err) {
        setError(err.message || 'Failed to load wards.');
      } finally {
        setLoadingWard(false);
      }
    };
    loadWards();
  }, [selectedProvince]);

  useEffect(() => {
    load();
  }, [load]);

  const saveShop = async () => {
    setSaving(true);
    setError('');
    setMessage('');
    try {
      if (!shop.address.trim()) {
        setError('Address is required.');
        setSaving(false);
        return;
      }
      const ward = selectedWard || shop.address?.ward_id;
      if (!ward) {
        setError('Please select ward.');
        setSaving(false);
        return;
      }
      const wardValue = (selectedWard || shop.address?.ward_id || '').toString().trim();
      const payload = {
        name: shop.name?.trim(),
        slug: shop.slug?.trim(),
        description: shop.description || '',
        hotline: shop.hotline || '',
        address: {
          address_line: shop.address,
          ward_id: wardValue,
        },
      };
      if (shop.logo_url) payload.logo_url = shop.logo_url;
      if (shop.banner_url) payload.banner_url = shop.banner_url;
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
      const errorsObj = err?.data?.errors;
      const details =
        errorsObj && typeof errorsObj === 'object'
          ? JSON.stringify(errorsObj)
          : err?.data
            ? JSON.stringify(err.data)
            : '';
      setError(details ? `${err.message || 'Failed to save shop info.'} (${details})` : err.message || 'Failed to save shop info.');
    } finally {
      setSaving(false);
    }
  };

  const saveStatus = async () => {
    setMessage('Shop status is managed by admin approval.');
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
                onChange={(e) =>
                  setShop((prev) => ({
                    ...prev,
                    slug: e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]/g, '-')
                      .replace(/-+/g, '-')
                      .replace(/^-+|-+$/g, ''),
                  }))
                }
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
            <div>
              <label className="block text-sm font-medium text-gray-800">Province</label>
              <div className="flex gap-2">
                <select
                  value={selectedProvince}
                  onChange={(e) => {
                    setSelectedProvince(e.target.value);
                    setSelectedWard('');
                  }}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
                >
                  <option value="">{loadingProvince ? 'Loading...' : 'Select province'}</option>
                  {provinces.map((p) => (
                    <option key={p.code || p.id} value={(p.code || p.id || '').toString()}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedProvince('');
                    setSelectedWard('');
                    setLoadingProvince(true);
                    fetchProvinces()
                      .then((data) => {
                        const list = Array.isArray(data?.provinces)
                          ? data.provinces
                          : Array.isArray(data?.data)
                            ? data.data
                            : Array.isArray(data)
                              ? data
                              : [];
                        setProvinces(list);
                      })
                      .catch((err) => setError(err.message || 'Failed to load provinces.'))
                      .finally(() => setLoadingProvince(false));
                  }}
                  className="mt-2 inline-flex items-center rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-60"
                  disabled={loadingProvince}
                >
                  <RefreshCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800">Ward</label>
              <div className="flex gap-2">
                <select
                  value={selectedWard}
                  onChange={(e) => setSelectedWard(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
                  disabled={!selectedProvince}
                >
                  <option value="">{loadingWard ? 'Loading...' : 'Select ward'}</option>
                  {wards.map((w) => (
                    <option key={w.id || w.code} value={(w.id || w.code || '').toString()}>
                      {w.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => {
                    if (!selectedProvince) return;
                    setLoadingWard(true);
                    fetchWards(selectedProvince)
                      .then((data) => {
                        const list = Array.isArray(data?.wards)
                          ? data.wards
                          : Array.isArray(data?.data)
                            ? data.data
                            : Array.isArray(data)
                              ? data
                              : [];
                        setWards(list);
                      })
                      .catch((err) => setError(err.message || 'Failed to load wards.'))
                      .finally(() => setLoadingWard(false));
                  }}
                  className="mt-2 inline-flex items-center rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-60"
                  disabled={!selectedProvince || loadingWard}
                >
                  <RefreshCcw className="w-4 h-4" />
                </button>
              </div>
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
          <p className="text-xs text-gray-600">Status is set by admin approval.</p>
          <div className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-gray-50 text-gray-700">
            {shopId ? shopStatus || 'pending' : 'Create your shop first'}
          </div>
          <button
            type="button"
            onClick={saveStatus}
            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 shadow-sm transition"
            disabled
          >
            Status managed by admin
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
