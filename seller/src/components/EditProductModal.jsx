import React, { useState, useEffect } from "react";
import { uploadProductImage } from "../api/product";

const EditProductModal = ({ product, onClose, onSave, onReload, categories }) => {
  if (!product) return null;

  const [form, setForm] = useState({
    name: product.name || "",
    price: product.price || product.sellingPrice || "",
    category_id: product.category?.id || product.category_id || "",
    description: product.description || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    setForm({
      name: product.name || "",
      price: product.price || product.sellingPrice || "",
      category_id: product.category?.id || product.category_id || "",
      description: product.description || "",
    });
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      await onSave?.({
        name: form.name,
        price: Number(form.price),
        category_id: form.category_id || undefined,
        description: form.description,
      });
      setMessage("Product updated.");
      await onReload?.();
    } catch (err) {
      setError(err?.message || "Failed to update product.");
    } finally {
      setSaving(false);
    }
  };

  const handleUploadImage = async (e) => {
    e.preventDefault();
    if (!imageFile) return;
    setError("");
    setMessage("");
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("product_id", product.id || product._id);
    try {
      await uploadProductImage(formData);
      setMessage("Image uploaded.");
      await onReload?.();
    } catch (err) {
      setError(err?.message || "Upload failed.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/60 px-4 py-8 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-xl bg-white px-6 py-6 shadow-2xl sm:px-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 transition hover:text-gray-600 focus:outline-none"
          aria-label="Close"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <h2 className="mb-4 text-xl font-semibold text-gray-900">Edit Product</h2>

        {error && <div className="text-sm text-rose-700 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2 mb-2">{error}</div>}
        {message && <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2 mb-2">{message}</div>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-800">Product name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800">Price</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800">Category</label>
              <select
                value={form.category_id}
                onChange={(e) => setForm((prev) => ({ ...prev, category_id: e.target.value }))}
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
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
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
              disabled={saving}
            >
              {saving ? "Saving..." : "Update"}
            </button>
          </div>
        </form>

        <div className="mt-6 space-y-4 rounded-lg border border-gray-200 p-4">
          <p className="text-sm font-semibold text-gray-900">Images</p>
          <form className="space-y-3" onSubmit={handleUploadImage}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 disabled:opacity-60"
              disabled={saving}
            >
              Upload image
            </button>
          </form>
        </div>

        {/* Variant/stock management removed */}
      </div>
    </div>
  );
};

export default EditProductModal;
