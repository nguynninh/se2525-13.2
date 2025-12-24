import React, { useEffect, useState, useCallback } from 'react';
import { fetchShippingRates, updateShippingRate } from '../api/shipping';

const ShippingRates = () => {
  const [rates, setRates] = useState([]);
  const [selected, setSelected] = useState(null);
  const [fee, setFee] = useState('');
  const [eta, setEta] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadRates = useCallback(async () => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const data = await fetchShippingRates();
      const list = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
      setRates(list);
      if (list.length) {
        const first = list[0];
        setSelected(first.id || first._id);
        setFee(first.fee || '');
        setEta(first.eta || '');
      }
    } catch (err) {
      setError(err.message || 'Failed to load rates.');
      setRates([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRates();
  }, [loadRates]);

  const handleUpdate = async () => {
    if (!selected) return;
    setSaving(true);
    setError('');
    setMessage('');
    try {
      await updateShippingRate(selected, { fee, eta });
      setMessage('Rate updated.');
      await loadRates();
    } catch (err) {
      setError(err.message || 'Failed to update rate.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <div>
        <p className="text-sm text-gray-500">Shipping</p>
        <p className="text-lg font-semibold text-gray-900">Shipping rates</p>
      </div>

      {error && <div className="text-sm text-rose-700 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">{error}</div>}
      {message && <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">{message}</div>}

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-700 text-xs uppercase border-b border-gray-100">
            <tr>
              <th className="px-3 py-2 text-left font-semibold">Name</th>
              <th className="px-3 py-2 text-left font-semibold">Fee</th>
              <th className="px-3 py-2 text-left font-semibold">ETA</th>
              <th className="px-3 py-2 text-left font-semibold">Select</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="px-3 py-4 text-center text-sm text-gray-600">
                  Loading rates...
                </td>
              </tr>
            ) : rates.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-3 py-4 text-center text-sm text-gray-600">
                  No shipping rate configured.
                </td>
              </tr>
            ) : (
              rates.map((rate) => (
                <tr key={rate.id || rate._id} className="border-b border-gray-100">
                  <td className="px-3 py-2 font-semibold text-gray-900">{rate.name}</td>
                  <td className="px-3 py-2 text-gray-700">{rate.fee}</td>
                  <td className="px-3 py-2 text-gray-700">{rate.eta}</td>
                  <td className="px-3 py-2">
                    <input
                      type="radio"
                      name="rate"
                      checked={selected === (rate.id || rate._id)}
                      onChange={() => {
                        setSelected(rate.id || rate._id);
                        setFee(rate.fee || '');
                        setEta(rate.eta || '');
                      }}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-800">Fee</label>
          <input
            type="text"
            value={fee}
            onChange={(e) => setFee(e.target.value)}
            className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800">ETA</label>
          <input
            type="text"
            value={eta}
            onChange={(e) => setEta(e.target.value)}
            className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={handleUpdate}
            className="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 disabled:opacity-60"
            disabled={saving || !selected}
          >
            {saving ? 'Saving...' : 'Update rate'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShippingRates;
