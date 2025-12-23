import React, { useEffect, useState, useCallback } from 'react';
import { Truck, Navigation, RefreshCcw, Plus, Check, X } from 'lucide-react';
import {
  getSellerOrders,
  confirmSellerOrder,
  rejectSellerOrder,
  updateSellerOrderDeliveryStatus,
} from '../api/seller';
import {
  fetchMyAddresses,
  createMyAddress,
  deleteMyAddress,
  setDefaultMyAddress,
  fetchProvinces,
  fetchWards,
  updateMyAddress,
} from '../api/shipping';

// Simplified shipping page for seller: manage pending orders and addresses only.
// Shipments/rates are admin-only on backend, so we avoid calling those endpoints.

const Shipping = () => {
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rejectingOrderId, setRejectingOrderId] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [updatingStatusOrderId, setUpdatingStatusOrderId] = useState('');
  const [newStatus, setNewStatus] = useState('completed');
  const [editAddrId, setEditAddrId] = useState('');
  const [editAddrForm, setEditAddrForm] = useState({
    receiver: '',
    phone: '',
    address: '',
    province_code: '',
    ward_code: '',
  });
  const [addrForm, setAddrForm] = useState({
    receiver: '',
    phone: '',
    address: '',
    province_code: '',
    ward_code: '',
  });

  const normalizeList = (payload) => {
    if (Array.isArray(payload)) return payload;
    const candidates = ['items', 'data', 'provinces', 'wards', 'results', 'list'];
    for (const key of candidates) {
      if (Array.isArray(payload?.[key])) return payload[key];
      if (Array.isArray(payload?.data?.[key])) return payload.data[key];
    }
    if (Array.isArray(payload?.data)) return payload.data;
    return [];
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [addressData, provinceData] = await Promise.all([fetchMyAddresses(), fetchProvinces()]);
      const allOrdersData = await getSellerOrders();
      setOrders(normalizeList(allOrdersData));
      setAddresses(normalizeList(addressData));
      setProvinces(normalizeList(provinceData));
    } catch (err) {
      setError(err.message || 'Failed to load shipping data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const activeProvince = selectedProvince || addrForm.province_code || editAddrForm.province_code || '';

  useEffect(() => {
    const fetchWardList = async () => {
      if (!activeProvince) {
        setWards([]);
        return;
      }
      try {
        const wardData = await fetchWards(activeProvince);
        setWards(normalizeList(wardData));
      } catch (err) {
        setError(err.message || 'Failed to load wards.');
      }
    };
    fetchWardList();
  }, [activeProvince]);

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createMyAddress(addrForm);
      setAddrForm({ receiver: '', phone: '', address: '', province_code: '', ward_code: '' });
      setSelectedProvince('');
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to create address.');
    }
  };

  const handleDeleteAddress = async (id) => {
    const ok = window.confirm('Delete this address?');
    if (!ok) return;
    setError('');
    try {
      await deleteMyAddress(id);
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to delete address.');
    }
  };

  const handleSetDefault = async (id) => {
    setError('');
    try {
      await setDefaultMyAddress(id);
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to set default address.');
    }
  };

  const startEditAddress = (addr) => {
    setEditAddrId(addr.id || addr._id);
    setSelectedProvince(addr.province_code || addr.province?.code || '');
    setEditAddrForm({
      receiver: addr.receiver || '',
      phone: addr.phone || '',
      address: addr.address || '',
      province_code: addr.province_code || addr.province?.code || '',
      ward_code: addr.ward_code || addr.ward?.code || '',
    });
  };

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    if (!editAddrId) return;
    setError('');
    try {
      await updateMyAddress(editAddrId, editAddrForm);
      setEditAddrId('');
      setEditAddrForm({ receiver: '', phone: '', address: '', province_code: '', ward_code: '' });
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to update address.');
    }
  };

  const handleCreateShipment = async (orderId, currentStatus) => {
    if (currentStatus && currentStatus !== 'confirmed') {
      setError('Only confirmed orders can create a shipment.');
      return;
    }
    setError('');
    try {
      await updateSellerOrderDeliveryStatus(orderId, { status: 'shipping' });
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to create shipment.');
    }
  };

  const openRejectModal = (orderId) => {
    setRejectingOrderId(orderId);
    setRejectReason('');
  };

  const closeRejectModal = () => {
    setRejectingOrderId('');
    setRejectReason('');
  };

  const submitReject = async () => {
    if (!rejectingOrderId) return;
    setError('');
    try {
      await rejectSellerOrder(rejectingOrderId, rejectReason ? { reason: rejectReason } : {});
      closeRejectModal();
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to reject');
    }
  };

  const openUpdateStatusModal = (orderId, currentStatus) => {
    if (currentStatus !== 'shipping') {
      setError('Chỉ cập nhật khi đơn đang shipping.');
      return;
    }
    setUpdatingStatusOrderId(orderId);
    setNewStatus('completed');
  };

  const closeUpdateStatusModal = () => {
    setUpdatingStatusOrderId('');
    setNewStatus('completed');
  };

  const submitUpdateStatus = async () => {
    if (!updatingStatusOrderId) return;
    setError('');
    try {
      await updateSellerOrderDeliveryStatus(updatingStatusOrderId, { status: newStatus });
      closeUpdateStatusModal();
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to update status.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gray-900 text-white grid place-items-center">
          <Truck className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-500">Shipping & Addresses</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="flex items-center gap-2 text-sm font-semibold text-gray-700 border px-3 py-2 rounded-lg hover:bg-gray-50"
            disabled={loading}
          >
            <RefreshCcw className="w-4 h-4" />
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg bg-gray-100 grid place-items-center">
                <Navigation className="w-4 h-4 text-gray-800" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Shipping addresses</p>
                <p className="text-xs text-gray-500">Manage saved addresses</p>
              </div>
            </div>
            <form className="space-y-2 mb-3" onSubmit={handleAddressSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Receiver name"
                  value={addrForm.receiver}
                  onChange={(e) => setAddrForm((prev) => ({ ...prev, receiver: e.target.value }))}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
                <input
                  type="tel"
                  required
                  placeholder="Phone"
                  value={addrForm.phone}
                  onChange={(e) => setAddrForm((prev) => ({ ...prev, phone: e.target.value }))}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
                <select
                  value={addrForm.province_code}
                  onChange={(e) => {
                    setSelectedProvince(e.target.value);
                    setAddrForm((prev) => ({ ...prev, province_code: e.target.value, ward_code: '' }));
                  }}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="">Select province</option>
                  {provinces.map((p) => (
                    <option key={p.code || p.id} value={p.code || p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <select
                  value={addrForm.ward_code}
                  onChange={(e) => setAddrForm((prev) => ({ ...prev, ward_code: e.target.value }))}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  disabled={!activeProvince}
                >
                  <option value="">Select ward/district</option>
                  {wards.map((w) => (
                    <option key={w.code || w.id} value={w.code || w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  required
                  placeholder="Address detail"
                  value={addrForm.address}
                  onChange={(e) => setAddrForm((prev) => ({ ...prev, address: e.target.value }))}
                  className="md:col-span-2 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1 rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white"
                  disabled={loading}
                >
                  <Plus className="w-4 h-4" /> Add address
                </button>
              </div>
            </form>
            <div className="space-y-2">
              {loading ? (
                <div className="border border-dashed border-gray-200 rounded-lg p-3 text-sm text-gray-600">
                  Loading addresses...
                </div>
              ) : addresses.length === 0 ? (
                <div className="border border-dashed border-gray-200 rounded-lg p-3 text-sm text-gray-600">
                  No addresses yet.
                </div>
              ) : (
                addresses.map((addr) => (
                  <div key={addr.id || addr.address} className="border border-gray-100 rounded-lg p-3 text-sm">
                    {editAddrId === (addr.id || addr._id) ? (
                      <form className="space-y-2" onSubmit={handleUpdateAddress}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <input
                            type="text"
                            required
                            placeholder="Receiver name"
                            value={editAddrForm.receiver}
                            onChange={(e) => setEditAddrForm((prev) => ({ ...prev, receiver: e.target.value }))}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                          />
                          <input
                            type="tel"
                            required
                            placeholder="Phone"
                            value={editAddrForm.phone}
                            onChange={(e) => setEditAddrForm((prev) => ({ ...prev, phone: e.target.value }))}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                          />
                          <select
                            value={editAddrForm.province_code}
                            onChange={(e) => {
                              setSelectedProvince(e.target.value);
                              setEditAddrForm((prev) => ({ ...prev, province_code: e.target.value, ward_code: '' }));
                            }}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                          >
                            <option value="">Select province</option>
                            {provinces.map((p) => (
                              <option key={p.code || p.id} value={p.code || p.id}>
                                {p.name}
                              </option>
                            ))}
                          </select>
                          <select
                            value={editAddrForm.ward_code}
                            onChange={(e) => setEditAddrForm((prev) => ({ ...prev, ward_code: e.target.value }))}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            disabled={!activeProvince}
                          >
                            <option value="">Select ward/district</option>
                            {wards.map((w) => (
                              <option key={w.code || w.id} value={w.code || w.id}>
                                {w.name}
                              </option>
                            ))}
                          </select>
                          <input
                            type="text"
                            required
                            placeholder="Address detail"
                            value={editAddrForm.address}
                            onChange={(e) => setEditAddrForm((prev) => ({ ...prev, address: e.target.value }))}
                            className="md:col-span-2 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            className="text-xs font-semibold text-gray-700 border border-gray-200 px-2 py-1 rounded-lg hover:bg-gray-50"
                            onClick={() => {
                              setEditAddrId('');
                              setEditAddrForm({ receiver: '', phone: '', address: '', province_code: '', ward_code: '' });
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="text-xs font-semibold text-emerald-700 border border-emerald-200 px-2 py-1 rounded-lg hover:bg-emerald-50"
                            disabled={loading}
                          >
                            Save
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-gray-900">
                            {addr.receiver} ({addr.phone})
                          </p>
                          <div className="flex gap-2">
                            <button
                              className="text-xs font-semibold text-blue-700 border border-blue-200 px-2 py-1 rounded-lg hover:bg-blue-50"
                              onClick={() => startEditAddress(addr)}
                              disabled={loading}
                            >
                              Edit
                            </button>
                            <button
                              className="text-xs font-semibold text-emerald-700 border border-emerald-200 px-2 py-1 rounded-lg hover:bg-emerald-50"
                              onClick={() => handleSetDefault(addr.id)}
                              disabled={loading}
                            >
                              Set default
                            </button>
                            <button
                              className="text-xs font-semibold text-rose-700 border border-rose-200 px-2 py-1 rounded-lg hover:bg-rose-50"
                              onClick={() => handleDeleteAddress(addr.id)}
                              disabled={loading}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-700">{addr.address}</p>
                        {addr.default && (
                          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full inline-block mt-1">
                            Default
                          </span>
                        )}
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 xl:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-semibold text-gray-900">Seller orders</p>
              <p className="text-xs text-gray-500">Manage and update delivery status</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-700 text-xs uppercase border-b border-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">Order</th>
                  <th className="px-3 py-2 text-left font-semibold">Customer</th>
                  <th className="px-3 py-2 text-left font-semibold">Total</th>
                  <th className="px-3 py-2 text-left font-semibold">Status</th>
                  <th className="px-3 py-2 text-left font-semibold">Updated</th>
                      <th className="px-3 py-2 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-3 py-4 text-center text-sm text-gray-600">
                      Loading orders...
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-3 py-4 text-center text-sm text-gray-600">
                      No orders yet.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id || order._id} className="border-b border-gray-100">
                      <td className="px-3 py-2 font-semibold text-gray-900">{order.id || order._id}</td>
                      <td className="px-3 py-2 text-gray-700">{order.customer?.name || order.customer_name || 'N/A'}</td>
                      <td className="px-3 py-2 text-gray-700">{order.total_price || order.total || '-'}</td>
                      <td className="px-3 py-2 text-gray-700">{order.status || 'pending'}</td>
                      <td className="px-3 py-2 text-gray-700">{order.updated_at || order.updatedAt || '-'}</td>
                      <td className="px-3 py-2 text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <button
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-semibold ${
                              order.status === 'confirmed'
                                ? 'text-gray-700 border-gray-200 hover:bg-gray-50'
                                : 'text-gray-400 border-gray-200 bg-gray-50'
                            }`}
                            onClick={() => handleCreateShipment(order.id || order._id, order.status)}
                            disabled={loading}
                            title={order.status === 'confirmed' ? 'Create shipment' : 'Order must be confirmed first'}
                          >
                            Create shipment
                          </button>
                          <button
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-semibold text-blue-700 border-blue-200 hover:bg-blue-50"
                            onClick={() => openUpdateStatusModal(order.id || order._id, order.status)}
                            disabled={loading}
                            title="Cập nhật trạng thái giao hàng"
                          >
                            Update status
                          </button>
                          <button
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-semibold text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                            onClick={() => confirmSellerOrder(order.id || order._id).then(loadData).catch((err) => setError(err.message || 'Failed to confirm'))}
                            disabled={loading}
                          >
                            <Check className="w-3.5 h-3.5" /> Confirm
                          </button>
                          <button
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-semibold text-rose-700 border-rose-200 hover:bg-rose-50"
                            onClick={() => openRejectModal(order.id || order._id)}
                            disabled={loading}
                          >
                            <X className="w-3.5 h-3.5" /> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {rejectingOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white border border-gray-200 shadow-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">Reject order</h3>
              <button className="text-gray-500 hover:text-gray-700" onClick={closeRejectModal}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600">Optional reason for rejection:</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
              placeholder="Enter reason (optional)"
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                onClick={closeRejectModal}
              >
                Cancel
              </button>
              <button
                className="px-3 py-2 text-sm font-semibold text-white rounded-lg bg-gray-900 hover:bg-gray-800"
                onClick={submitReject}
                disabled={loading}
              >
                Confirm reject
              </button>
            </div>
          </div>
        </div>
      )}

      {updatingStatusOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white border border-gray-200 shadow-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">Cập nhật trạng thái</h3>
              <button className="text-gray-500 hover:text-gray-700" onClick={closeUpdateStatusModal}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600">Chỉ áp dụng cho đơn đang shipping.</p>
            <label className="text-sm text-gray-800 font-medium">Chọn trạng thái</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
            >
              <option value="completed">completed</option>
              <option value="shipping">shipping</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                onClick={closeUpdateStatusModal}
              >
                Hủy
              </button>
              <button
                className="px-3 py-2 text-sm font-semibold text-white rounded-lg bg-gray-900 hover:bg-gray-800"
                onClick={submitUpdateStatus}
                disabled={loading}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shipping;
