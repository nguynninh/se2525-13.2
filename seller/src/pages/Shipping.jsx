import React, { useEffect, useState, useCallback } from 'react';
import { Truck, RefreshCcw, Check, X } from 'lucide-react';
import { getSellerOrders, confirmSellerOrder, rejectSellerOrder, updateSellerOrderDeliveryStatus } from '../api/seller';
import { extractList } from '../api/client';

const Shipping = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rejectingOrderId, setRejectingOrderId] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [updatingStatusOrderId, setUpdatingStatusOrderId] = useState('');
  const [newStatus, setNewStatus] = useState('completed');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const allOrdersData = await getSellerOrders();
      setOrders(extractList(allOrdersData, ['orders']));
    } catch (err) {
      setError(err.message || 'Failed to load shipping data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
          <p className="text-sm text-gray-500">Shipping</p>
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

      <div className="grid grid-cols-1">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
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
