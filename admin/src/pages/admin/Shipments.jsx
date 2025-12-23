import React, { useState } from 'react';
import api from '../../api/client';
import { Badge, EmptyState, PanelShell, SectionHeader, safeArray } from './shared.jsx';

const Shipments = () => {
  const [orderId, setOrderId] = useState('');
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadShipmentsByOrder = async () => {
    if (!orderId) {
      setError('Enter order ID before loading');
      setShipments([]);
      return;
    }
    setLoading(true); setError('');
    try {
      const { data } = await api.get(`/api/orders/${orderId}/shipments`);
      setShipments(safeArray(data));
    } catch (err) {
      setError(err.message || 'Failed to load shipments');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PanelShell>
      <div className="flex flex-wrap items-center gap-3">
        <input
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Enter order ID"
          className="flex-1 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-100"
        />
        <button
          onClick={loadShipmentsByOrder}
          className="text-sm font-semibold text-slate-950 bg-emerald-400 px-4 py-2 rounded-xl hover:bg-emerald-300"
        >
          Load shipments
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-900 text-slate-300 text-xs uppercase border-b border-slate-800">
            <tr>
              <th className="px-3 py-2 text-left font-semibold">Shipment ID</th>
              <th className="px-3 py-2 text-left font-semibold">Order ID</th>
              <th className="px-3 py-2 text-left font-semibold">Status</th>
              <th className="px-3 py-2 text-left font-semibold">Carrier</th>
              <th className="px-3 py-2 text-left font-semibold">ETA</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="px-3 py-4 text-center text-sm text-slate-300">Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan="5" className="px-3 py-4 text-center text-sm text-rose-300">{error}</td></tr>
            ) : shipments.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-3 py-4">
                  <EmptyState text="No shipments yet." />
                </td>
              </tr>
            ) : (
              shipments.map((ship) => (
                <tr key={ship.id} className="border-b border-slate-800/80">
                  <td className="px-3 py-2 font-semibold text-white">{ship.id}</td>
                  <td className="px-3 py-2 text-slate-200">{ship.order_id || ship.orderId}</td>
                  <td className="px-3 py-2"><Badge tone="warning">{ship.status}</Badge></td>
                  <td className="px-3 py-2 text-slate-200">{ship.carrier || '--'}</td>
                  <td className="px-3 py-2 text-slate-200">{ship.eta || '--'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </PanelShell>
  );
};

export default Shipments;
