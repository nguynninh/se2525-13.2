import React, { useEffect, useState, useCallback } from 'react';
import { Truck, Navigation, Edit, RefreshCcw, Plus, PackageCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getSellerOrders, confirmSellerOrder, rejectSellerOrder } from '../api/seller';
import {
  fetchShipments,
  fetchShippingRates,
  fetchMyAddresses,
  createMyAddress,
  deleteMyAddress,
  setDefaultMyAddress,
  fetchProvinces,
  fetchWards,
  createShipment,
  updateShipmentStatus,
  updateMyAddress,
} from '../api/shipping';

const Shipping = () => {
  const navigate = useNavigate();
  const [shipments, setShipments] = useState([]);
  const [rates, setRates] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [approvedOrderId, setApprovedOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shipmentForm, setShipmentForm] = useState({
    order_id: '',
    address_id: '',
    carrier: '',
    eta: '',
  });
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

  const statusBadge = (status) => {
    const map = {
      shipping: 'bg-purple-50 text-purple-700 border-purple-200',
      completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      pending: 'bg-amber-50 text-amber-700 border-amber-200',
    };
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full border ${map[status] || map.pending}`}>
        {status}
      </span>
    );
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [shipmentData, rateData, addressData, provinceData] = await Promise.all([
        fetchShipments(),
        fetchShippingRates(),
        fetchMyAddresses(),
        fetchProvinces(),
      ]);
      const orderData = await getSellerOrders({ status: 'pending' });
      setOrders(Array.isArray(orderData?.items) ? orderData.items : Array.isArray(orderData) ? orderData : []);
      setShipments(Array.isArray(shipmentData?.items) ? shipmentData.items : Array.isArray(shipmentData) ? shipmentData : []);
      setRates(Array.isArray(rateData?.items) ? rateData.items : Array.isArray(rateData) ? rateData : []);
      setAddresses(Array.isArray(addressData?.items) ? addressData.items : Array.isArray(addressData) ? addressData : []);
      setProvinces(Array.isArray(provinceData?.items) ? provinceData.items : Array.isArray(provinceData) ? provinceData : []);
    } catch (err) {
      setError(err.message || 'Failed to load shipping data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const fetchWardList = async () => {
      if (!selectedProvince) {
        setWards([]);
        return;
      }
      try {
        const wardData = await fetchWards(selectedProvince);
        setWards(Array.isArray(wardData?.items) ? wardData.items : Array.isArray(wardData) ? wardData : []);
      } catch (err) {
        setError(err.message || 'Failed to load wards.');
      }
    };
    fetchWardList();
  }, [selectedProvince]);

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

  const handleCreateShipment = async () => {
    if (!shipmentForm.order_id) {
      setError('Order ID is required.');
      return;
    }
    setError('');
    try {
      await createShipment({
        order_id: shipmentForm.order_id,
        address_id: shipmentForm.address_id || undefined,
        carrier: shipmentForm.carrier || undefined,
        eta: shipmentForm.eta || undefined,
      });
      setShipmentForm({ order_id: '', address_id: '', carrier: '', eta: '' });
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to create shipment.');
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

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gray-900 text-white grid place-items-center">
          <Truck className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-500">Shipments & Rates</p>
          <p className="text-lg font-semibold text-gray-900">Shipping management</p>
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
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-semibold text-gray-900">Pending orders</p>
                <p className="text-xs text-gray-500">Approve/reject before creating shipment</p>
              </div>
            </div>
            <div className="space-y-2">
              {loading ? (
                <div className="border border-dashed border-gray-200 rounded-lg p-3 text-sm text-gray-600">Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="border border-dashed border-gray-200 rounded-lg p-3 text-sm text-gray-600">No pending orders.</div>
              ) : (
                orders.map((order) => (
                  <div key={order.id || order._id} className="border border-gray-100 rounded-lg p-3 text-sm space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="font-semibold text-gray-900">Order #{order.id || order._id}</p>
                        <p className="text-xs text-gray-500">{order.customer?.name || order.customer_name || 'Customer'}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="text-xs font-semibold text-emerald-700 border border-emerald-200 px-2 py-1 rounded-lg hover:bg-emerald-50"
                          onClick={async () => {
                            setError('');
                            try {
                              await confirmSellerOrder(order.id || order._id);
                              const oid = order.id || order._id;
                              setApprovedOrderId(oid);
                              setShipmentForm((prev) => ({ ...prev, order_id: oid }));
                              await loadData();
                            } catch (err) {
                              setError(err.message || 'Failed to confirm order.');
                            }
                          }}
                          disabled={loading}
                        >
                          Approve
                        </button>
                        <button
                          className="text-xs font-semibold text-rose-700 border border-rose-200 px-2 py-1 rounded-lg hover:bg-rose-50"
                          onClick={async () => {
                            const reason = window.prompt('Reject reason (optional):', '');
                            setError('');
                            try {
                              await rejectSellerOrder(order.id || order._id, reason ? { reason } : {});
                              await loadData();
                            } catch (err) {
                              setError(err.message || 'Failed to reject order.');
                            }
                          }}
                          disabled={loading}
                        >
                          Reject
                        </button>
                        <button
                          className="text-xs font-semibold text-gray-700 border border-gray-200 px-2 py-1 rounded-lg hover:bg-gray-50"
                          onClick={() => {
                            const oid = order.id || order._id;
                            setApprovedOrderId(oid);
                            setShipmentForm((prev) => ({ ...prev, order_id: oid }));
                          }}
                        >
                          Use for shipment
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-700">{order.shipping_address?.address || order.address || 'No address'}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-semibold text-gray-900">Shipping rates</p>
                <p className="text-xs text-gray-500">Manage rate settings</p>
              </div>
              <button
                className="text-sm font-semibold text-gray-700 border px-3 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-1"
                onClick={() => navigate('/shipping/rates')}
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
            </div>
            <div className="space-y-2">
              {loading ? (
                <div className="border border-dashed border-gray-200 rounded-lg p-3 text-sm text-gray-600">
                  Loading rates...
                </div>
              ) : rates.length === 0 ? (
                <div className="border border-dashed border-gray-200 rounded-lg p-3 text-sm text-gray-600">
                  No shipping rate configured.
                </div>
              ) : (
                rates.map((rate) => (
                  <div key={rate.name} className="flex items-center justify-between border border-gray-100 rounded-lg px-3 py-2 text-sm">
                    <div>
                      <p className="font-semibold text-gray-900">{rate.name}</p>
                      <p className="text-xs text-gray-500">{rate.eta}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900">{rate.fee}</p>
                      <button
                        className="text-xs font-semibold text-blue-700 border border-blue-200 px-2 py-1 rounded-lg hover:bg-blue-50"
                        onClick={() => navigate('/shipping/rates')}
                        disabled={loading}
                      >
                        Update fee
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

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
                  disabled={!selectedProvince}
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
                            disabled={!selectedProvince}
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
          {approvedOrderId ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-semibold text-gray-900">Create shipment</p>
                  <p className="text-xs text-gray-500">Order {approvedOrderId} · select address</p>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2 mb-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-800">Order ID</label>
                  <input
                    type="text"
                    value={shipmentForm.order_id}
                    onChange={(e) => setShipmentForm((prev) => ({ ...prev, order_id: e.target.value }))}
                    placeholder="Enter order ID"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-800">Destination address</label>
                  <select
                    value={shipmentForm.address_id}
                    onChange={(e) => setShipmentForm((prev) => ({ ...prev, address_id: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  >
                    <option value="">Select saved address (optional)</option>
                    {addresses.map((addr) => (
                      <option key={addr.id || addr._id} value={addr.id || addr._id}>
                        {addr.receiver} - {addr.address}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-800">Carrier</label>
                  <input
                    type="text"
                    value={shipmentForm.carrier}
                    onChange={(e) => setShipmentForm((prev) => ({ ...prev, carrier: e.target.value }))}
                    placeholder="Carrier (optional)"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-800">ETA</label>
                  <input
                    type="text"
                    value={shipmentForm.eta}
                    onChange={(e) => setShipmentForm((prev) => ({ ...prev, eta: e.target.value }))}
                    placeholder="e.g. 2-3 days"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end mb-6">
                <button
                  onClick={handleCreateShipment}
                  className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 disabled:opacity-60"
                  disabled={loading}
                >
                  <PackageCheck className="w-4 h-4" />
                  Create shipment
                </button>
              </div>
            </>
          ) : (
            <div className="border border-dashed border-gray-200 rounded-lg p-4 mb-6 text-sm text-gray-700">
              Approve an order first, then you can create its shipment.
            </div>
          )}

          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold text-gray-900">Shipment list</p>
            <span className="text-xs text-gray-500">By order</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-700 text-xs uppercase border-b border-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">Code</th>
                  <th className="px-3 py-2 text-left font-semibold">Order</th>
                  <th className="px-3 py-2 text-left font-semibold">Destination</th>
                  <th className="px-3 py-2 text-left font-semibold">Carrier</th>
                  <th className="px-3 py-2 text-left font-semibold">Status</th>
                  <th className="px-3 py-2 text-left font-semibold">ETA</th>
                  <th className="px-3 py-2 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-3 py-4 text-center text-sm text-gray-600">
                      Loading shipments...
                    </td>
                  </tr>
                ) : shipments.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-3 py-4 text-center text-sm text-gray-600">
                      No shipments yet.
                    </td>
                  </tr>
                ) : (
                  shipments.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="px-3 py-2 font-semibold text-gray-900">{item.id}</td>
                      <td className="px-3 py-2 text-gray-700">{item.order_id || item.orderId}</td>
                      <td className="px-3 py-2 text-gray-700">
                        {item.address?.address || item.address || '-'}
                      </td>
                      <td className="px-3 py-2 text-gray-700">{item.carrier || '-'}</td>
                      <td className="px-3 py-2">{statusBadge(item.status)}</td>
                      <td className="px-3 py-2 text-gray-700">{item.eta || '-'}</td>
                      <td className="px-3 py-2 text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <select
                            value={item.status}
                            onChange={(e) => {
                              const status = e.target.value;
                              setError('');
                              updateShipmentStatus(item.id, { status })
                                .then(loadData)
                                .catch((err) => setError(err.message || 'Failed to update shipment.'));
                            }}
                            className="rounded-lg border border-gray-200 px-2 py-1 text-xs"
                            disabled={loading}
                          >
                            <option value="shipping">shipping</option>
                            <option value="pending">pending</option>
                            <option value="completed">completed</option>
                          </select>
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
    </div>
  );
};

export default Shipping;
