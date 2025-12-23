import React, { useEffect, useState } from 'react';
import { CalendarClock } from 'lucide-react';
import api from '../../api/client';
import { Badge, EmptyState, PanelShell, SectionHeader, safeArray, formatMoney } from './shared.jsx';

const Rates = () => {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [feeInput, setFeeInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      setLoading(true); setError('');
      try {
        const { data } = await api.get('/api/shipping-rates', { signal: controller.signal });
        setRates(safeArray(data));
      } catch (err) {
        if (err.name !== 'CanceledError') setError(err.message || 'Failed to load shipping rates');
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, []);

  const startEdit = (rate) => {
    setEditingId(rate.id);
    const price = rate.fee ?? rate.price ?? rate.amount ?? '';
    setFeeInput(price === null || price === undefined ? '' : String(price));
    setActionMessage('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFeeInput('');
    setSaving(false);
  };

  const saveFee = async (id) => {
    const feeNumber = Number(feeInput);
    if (Number.isNaN(feeNumber) || feeNumber < 0) {
      setActionMessage('Fee must be a non-negative number.');
      return;
    }
    setSaving(true);
    setActionMessage('');
    try {
      await api.patch(`/api/shipping-rates/${id}`, { fee: feeNumber });
      // refresh list
      const { data } = await api.get('/api/shipping-rates');
      setRates(safeArray(data));
      setActionMessage('Updated successfully.');
      cancelEdit();
    } catch (err) {
      setActionMessage(err?.message || 'Failed to update shipping fee.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PanelShell>
      {actionMessage ? (
        <div className="text-sm text-emerald-200 bg-emerald-500/10 border border-emerald-400/40 rounded-xl px-3 py-2">
          {actionMessage}
        </div>
      ) : null}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {loading ? <EmptyState text="Loading shipping rates..." /> : null}
        {error ? <div className="text-sm text-rose-300">{error}</div> : null}
        {!loading && !error && rates.length === 0 ? <EmptyState text="No rates yet." /> : null}
        {rates.map((rate) => {
          const title = rate.name || rate.method || rate.region || rate.id || 'Shipping rate';
          const regionOrMethod = rate.region || rate.method || 'N/A';
          const leadTime = rate.eta || rate.lead_time || rate.leadTime || 'N/A';
          const price = rate.fee ?? rate.price ?? rate.amount ?? 0;
          return (
            <div key={rate.id || rate.name || title} className="border border-slate-800 rounded-xl p-3 bg-slate-900/40 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-white truncate">{title}</p>
                <Badge tone="success">{formatMoney(price)}</Badge>
              </div>
              <p className="text-xs text-slate-400 truncate">Method: {regionOrMethod} | Same province: {String(rate.same_province ?? rate.sameProvince ?? false)}</p>
              <p className="text-xs text-slate-400 inline-flex items-center gap-1">
                <CalendarClock className="w-3.5 h-3.5" /> Lead time: {leadTime}
              </p>
              {editingId === rate.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="1000"
                    min="0"
                    value={feeInput}
                    onChange={(e) => setFeeInput(e.target.value)}
                    className="flex-1 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 text-sm text-slate-100"
                  />
                  <button
                    onClick={() => saveFee(rate.id)}
                    disabled={saving}
                    className="px-3 py-2 rounded-lg text-sm font-semibold bg-emerald-500 text-slate-950 disabled:opacity-60"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    disabled={saving}
                    className="px-3 py-2 rounded-lg text-sm font-semibold bg-slate-800 text-slate-100 border border-slate-700 disabled:opacity-60"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => startEdit(rate)}
                  className="px-3 py-2 rounded-lg text-sm font-semibold border border-slate-800 text-slate-100 hover:border-emerald-400/50"
                >
                  Edit fee
                </button>
              )}
            </div>
          );
        })}
      </div>
    </PanelShell>
  );
};

export default Rates;
