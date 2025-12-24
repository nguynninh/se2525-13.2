import React, { useState } from "react";
import { createProduct, uploadProductImage } from "../api/product";

const AddProductModal = ({ onClose, onCreated, categories }) => {
  const [form, setForm] = useState({
    name: "",
    category_id: "",
    description: "",
    image_url: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const created = await createProduct({
        name: form.name,
        // Backend requires price & quantity; use defaults since UI hides them.
        price: 1000,
        quantity: 0,
        category_id: form.category_id || undefined,
        description: form.description,
        status: "active",
      });
      const productId = created?.id || created?._id || created?.product_id || created?.product?.id;
      if (productId && form.image_url.trim()) {
        await uploadProductImage({
          product_id: productId,
          image_url: form.image_url.trim(),
          is_main: true,
        });
      }
      onCreated?.();
      onClose?.();
    } catch (err) {
      setError(err.message || "Failed to create product.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/60 px-4 py-8 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-xl bg-white px-6 py-6 shadow-2xl sm:px-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 transition hover:text-gray-600 focus:outline-none"
          aria-label="Close"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <h2 className="mb-4 text-xl font-semibold text-gray-900">Add Product</h2>

        {error && <div className="text-sm text-rose-700 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2 mb-2">{error}</div>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-800">Product name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Enter product name"
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800">Product category</label>
            <select
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
              value={form.category_id}
              onChange={(e) => setForm((prev) => ({ ...prev, category_id: e.target.value }))}
            >
              <option value="">Select category</option>
              {(categories || []).map((c) => (
                <option key={c.id || c._id || c.slug || c.name} value={c.id || c._id || c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800">Description</label>
            <textarea
              rows="3"
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Description"
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800">Image URL</label>
            <input
              type="url"
              value={form.image_url}
              onChange={(e) => setForm((prev) => ({ ...prev, image_url: e.target.value }))}
              placeholder="https://..."
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
            <p className="mt-1 text-xs text-gray-500">Paste image URL; will be set as main image.</p>
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
            disabled={saving}
          >
            {saving ? "Saving..." : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
