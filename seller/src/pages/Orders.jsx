import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CheckCircle, Clock, Truck, XCircle, Package2, RefreshCcw, Check, X, Pencil } from 'lucide-react';
import {
  confirmSellerOrder,
  getSellerOrders,
  rejectSellerOrder,
  updateSellerOrderDeliveryStatus,
  getSellerOrderDetail,
} from '../api/seller';

const statusStyles = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  shipping: 'bg-purple-50 text-purple-700 border-purple-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
};

const statusIcon = (status) => {
  if (status === 'pending') return <Clock className="w-4 h-4" />;
  if (status === 'confirmed') return <CheckCircle className="w-4 h-4" />;
  if (status === 'shipping') return <Truck className="w-4 h-4" />;
  if (status === 'completed') return <Package2 className="w-4 h-4" />;
  return <XCircle className="w-4 h-4" />;
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [detail, setDetail] = useState(null);
  const shippingRates = [];

  const normalizeOrders = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.items)) return payload.items;
    if (Array.isArray(payload?.data)) return payload.data;
    return [];
  };

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    setActionMessage('');
    try {
      const data = await getSellerOrders();
      setOrders(normalizeOrders(data));
    } catch (err) {
      setError(err.message || 'Unable to load orders.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const runAction = async (fn, orderId, successMsg) => {
    setActionLoading(orderId);
    setError('');
    setActionMessage('');
    try {
      await fn();
      await loadOrders();
      setActionMessage(successMsg);
    } catch (err) {
      setError(err.message || 'Action failed.');
    } finally {
      setActionLoading('');
    }
  };

  const handleConfirm = (orderId) => {
    runAction(() => confirmSellerOrder(orderId), orderId, 'Order confirmed.');
  };

  const handleReject = (orderId) => {
    const reason = window.prompt('Enter rejection reason (optional):', '');
    runAction(() => rejectSellerOrder(orderId, reason ? { reason } : {}), orderId, 'Order rejected.');
  };

  const handleUpdateStatus = (orderId) => {
    const nextStatus = window.prompt('Enter delivery status (e.g. shipping, completed, cancelled):', '');
    if (!nextStatus) return;
    runAction(() => updateSellerOrderDeliveryStatus(orderId, { status: nextStatus }), orderId, 'Status updated.');
  };

  const handleViewDetail = async (orderId) => {
    setError('');
    try {
      const data = await getSellerOrderDetail(orderId);
      setDetail(data);
    } catch (err) {
      setError(err.message || 'Failed to load order detail.');
    }
  };

  const statusCounters = useMemo(() => {
    const counters = orders.reduce((acc, order) => {
      const key = order.status || 'pending';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counters).map(([status, count]) => ({
      status,
      label: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
    }));
  }, [orders]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {statusCounters.length === 0 ? (
          <div className="border rounded-xl px-4 py-3 text-sm text-gray-600 bg-white lg:col-span-5">
            No order status data yet.
          </div>
        ) : (
          statusCounters.map((item) => (
            <div
              key={item.label}
              className={`border rounded-xl px-4 py-3 flex items-center gap-3 ${statusStyles[item.status] || 'border bg-gray-50 text-gray-700'}`}
            >
              <div className="w-10 h-10 rounded-lg bg-white/60 grid place-items-center">
                {statusIcon(item.status)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide">{item.label}</p>
                <p className="text-lg font-bold">{item.value}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold text-gray-900">Order detail</p>
              <button
                className="text-sm font-semibold text-gray-700 border px-3 py-1 rounded-lg hover:bg-gray-50"
                onClick={() => setDetail(null)}
              >
                Close
              </button>
            </div>
            <pre className="text-xs bg-gray-50 border border-gray-200 rounded-lg p-3 overflow-auto max-h-96">
{JSON.stringify(detail, null, 2)}
            </pre>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div>
              <p className="text-sm text-gray-500">Orders</p>
              <p className="text-lg font-semibold text-gray-900">Seller order pipeline</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={loadOrders}
                className="px-3 py-2 text-sm font-medium text-gray-700 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
                disabled={loading}
              >
                <RefreshCcw className="w-4 h-4" />
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>

          {error && (
            <div className="px-4 py-3 text-sm text-rose-700 bg-rose-50 border-b border-rose-100">
              {error}
            </div>
          )}
          {actionMessage && (
            <div className="px-4 py-3 text-sm text-emerald-700 bg-emerald-50 border-b border-emerald-100">
              {actionMessage}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Order</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Customer</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Total</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Payment</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Updated</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-6 text-center text-sm text-gray-600">
                      Loading orders...
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-6 text-center text-sm text-gray-600">
                      No orders yet.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-gray-900">{order.id || order.code}</td>
                      <td className="px-4 py-3 text-gray-800">{order.customer?.name || order.customer_name || 'N/A'}</td>
                      <td className="px-4 py-3 text-gray-900 font-semibold">{order.total || order.total_price || 'N/A'}</td>
                      <td className="px-4 py-3 text-gray-700">{order.payment || order.payment_method || 'N/A'}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full border ${statusStyles[order.status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}
                        >
                          {statusIcon(order.status)}
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{order.updatedAt || order.updated_at || 'N/A'}</td>
                      <td className="px-4 py-3 text-gray-700">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleViewDetail(order.id || order.code)}
                            className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100 disabled:opacity-60"
                            disabled={!!actionLoading}
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleConfirm(order.id || order.code)}
                            className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-60"
                            disabled={!!actionLoading}
                          >
                            <Check className="w-3 h-3" /> Confirm
                          </button>
                          <button
                            onClick={() => handleReject(order.id || order.code)}
                            className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-60"
                            disabled={!!actionLoading}
                          >
                            <X className="w-3 h-3" /> Reject
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(order.id || order.code)}
                            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                            disabled={!!actionLoading}
                          >
                            <Pencil className="w-3 h-3" /> Update status
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

        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold text-gray-900">Shipping rates</p>
              <button className="text-sm font-semibold text-gray-700 hover:text-gray-900">Edit</button>
            </div>
            <div className="space-y-2">
              {shippingRates.length === 0 ? (
                <div className="border border-dashed border-gray-200 rounded-lg p-3 text-sm text-gray-600">
                  No shipping rate configured.
                </div>
              ) : (
                shippingRates.map((rate) => (
                  <div key={rate.name} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-semibold text-gray-900">{rate.name}</p>
                      <p className="text-xs text-gray-500">ETA: {rate.eta}</p>
                    </div>
                    <p className="font-semibold text-gray-900">{rate.fee}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
