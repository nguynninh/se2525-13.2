import React, { useState } from 'react';
import { createShipment } from '../api/shipping';

const CreateShipment = () => {
  const [form, setForm] = useState({ order_id: '', carrier: '', eta: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await createShipment(form);
      setMessage('Shipment created.');
      setForm({ order_id: '', carrier: '', eta: '' });
    } catch (err) {
      setError(err.message || 'Failed to create shipment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-4 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <div>
        <p className="text-sm text-gray-500">Shipments</p>
        <p className="text-lg font-semibold text-gray-900">Create shipment</p>
      </div>

      {error && <div className="text-sm text-rose-700 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">{error}</div>}
      {message && <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">{message}</div>}

      <form className="space-y-3" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-800">Order ID</label>
          <input
            type="text"
            value={form.order_id}
            onChange={(e) => setForm((prev) => ({ ...prev, order_id: e.target.value }))}
            required
            className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800">Carrier</label>
          <input
            type="text"
            value={form.carrier}
            onChange={(e) => setForm((prev) => ({ ...prev, carrier: e.target.value }))}
            className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800">ETA</label>
          <input
            type="text"
            value={form.eta}
            onChange={(e) => setForm((prev) => ({ ...prev, eta: e.target.value }))}
            placeholder="e.g. 2025-12-31"
            className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create shipment'}
        </button>
      </form>
    </div>
  );
};

export default CreateShipment;
