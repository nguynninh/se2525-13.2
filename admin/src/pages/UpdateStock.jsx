import React, { useEffect, useState, useCallback } from 'react';
import { fetchProducts, fetchProductDetail, createProductStock, updateProductStock } from '../api/product';

const UpdateStock = () => {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [stocks, setStocks] = useState([]);
  const [form, setForm] = useState({ sku: '', quantity: '', price: '', attributes: '' });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchProducts();
      const list = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
      setProducts(list);
      if (list.length) {
        setSelectedProductId(list[0].id || list[0]._id);
      }
    } catch (err) {
      setError(err.message || 'Failed to load products.');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadStocks = useCallback(async (productId) => {
    if (!productId) {
      setStocks([]);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const detail = await fetchProductDetail(productId);
      const list = Array.isArray(detail?.stocks) ? detail.stocks : [];
      setStocks(list);
    } catch (err) {
      setError(err.message || 'Failed to load stocks.');
      setStocks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    loadStocks(selectedProductId);
  }, [selectedProductId, loadStocks]);

  const handleCreateStock = async (e) => {
    e.preventDefault();
    if (!selectedProductId) return;
    setSaving(true);
    setError('');
    setMessage('');
    try {
      await createProductStock({
        product_id: selectedProductId,
        sku: form.sku,
        quantity: Number(form.quantity),
        price: Number(form.price),
        attributes: form.attributes,
      });
      setMessage('Stock created.');
      setForm({ sku: '', quantity: '', price: '', attributes: '' });
      await loadStocks(selectedProductId);
    } catch (err) {
      setError(err.message || 'Failed to create stock.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateStock = async (stockId) => {
    const quantity = window.prompt('New quantity:');
    const price = window.prompt('New price:');
    if (quantity === null && price === null) return;
    setSaving(true);
    setError('');
    setMessage('');
    try {
      await updateProductStock(stockId, {
        quantity: quantity === null ? undefined : Number(quantity),
        price: price === null ? undefined : Number(price),
      });
      setMessage('Stock updated.');
      await loadStocks(selectedProductId);
    } catch (err) {
      setError(err.message || 'Failed to update stock.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 bg-content-bg min-h-screen p-3 lg:p-5">
      <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 shadow-sm max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">SKU & Stock</p>
            <p className="text-lg font-semibold text-gray-900">Update stock</p>
          </div>
        </div>

        {error && <div className="text-sm text-rose-700 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">{error}</div>}
        {message && <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">{message}</div>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-800">Select product</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
            >
              {products.map((p) => (
                <option key={p.id || p._id} value={p.id || p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-4 gap-3" onSubmit={handleCreateStock}>
          <div>
            <label className="block text-sm font-medium text-gray-800">SKU</label>
            <input
              type="text"
              value={form.sku}
              onChange={(e) => setForm((prev) => ({ ...prev, sku: e.target.value }))}
              required
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800">Quantity</label>
            <input
              type="number"
              value={form.quantity}
              onChange={(e) => setForm((prev) => ({ ...prev, quantity: e.target.value }))}
              required
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800">Price</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
              required
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-800">Attributes</label>
            <input
              type="text"
              value={form.attributes}
              onChange={(e) => setForm((prev) => ({ ...prev, attributes: e.target.value }))}
              placeholder='e.g. "Color: Red, Size: M"'
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>
          <div className="md:col-span-2 flex items-end">
            <button
              type="submit"
              className="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 disabled:opacity-60"
              disabled={saving || loading}
            >
              {saving ? 'Saving...' : 'Create stock'}
            </button>
          </div>
        </form>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-700 text-xs uppercase border-b border-gray-100">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">SKU</th>
                <th className="px-3 py-2 text-left font-semibold">Attributes</th>
                <th className="px-3 py-2 text-left font-semibold">Stock</th>
                <th className="px-3 py-2 text-left font-semibold">Price</th>
                <th className="px-3 py-2 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-3 py-4 text-center text-sm text-gray-600">Loading stock...</td>
                </tr>
              ) : stocks.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-3 py-4 text-center text-sm text-gray-600">No SKU/variant yet.</td>
                </tr>
              ) : (
                stocks.map((s) => (
                  <tr key={s.id || s._id || s.sku} className="border-b border-gray-100">
                    <td className="px-3 py-2 font-semibold text-gray-900">{s.sku || s.id}</td>
                    <td className="px-3 py-2 text-gray-700">
                      {Array.isArray(s.attributes)
                        ? s.attributes.map((a) => `${a.name}: ${a.value}`).join(', ')
                        : s.attributes || s.attrs || ''}
                    </td>
                    <td className="px-3 py-2 text-gray-700">{s.quantity ?? s.stock}</td>
                    <td className="px-3 py-2 font-semibold text-gray-900">{s.price}</td>
                    <td className="px-3 py-2">
                      <button
                        className="text-xs font-semibold text-gray-700 border border-gray-200 px-2 py-1 rounded-lg hover:bg-gray-50"
                        onClick={() => handleUpdateStock(s.id || s._id)}
                        disabled={saving}
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UpdateStock;
