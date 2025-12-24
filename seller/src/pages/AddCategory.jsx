import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { extractList } from "../api/client";
import { fetchCategories, createCategory, updateCategory, deleteCategory } from "../api/product";

const AddCategory = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", icon_url: "" });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchCategories();
      setCategories(extractList(data, ["categories"]));
    } catch (err) {
      setError(err.message || "Unable to load categories.");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await updateCategory(editingId, form);
      } else {
        await createCategory(form);
      }
      setForm({ name: "", description: "", icon_url: "" });
      setEditingId(null);
      await loadCategories();
    } catch (err) {
      setError(err.message || "Save category failed.");
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat.id || cat._id);
    setForm({ name: cat.name || "", description: cat.description || "", icon_url: cat.icon_url || cat.image || "" });
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this category?");
    if (!ok) return;
    setError("");
    try {
      await deleteCategory(id);
      await loadCategories();
    } catch (err) {
      setError(err.message || "Delete failed.");
    }
  };

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories;
    const keyword = search.trim().toLowerCase();
    return categories.filter((item) => item.name?.toLowerCase().includes(keyword));
  }, [categories, search]);

  return (
    <div className="p-4">
      <div className="mb-4 rounded-lg bg-white p-4 shadow">
        <div className="mb-4 flex flex-wrap items-center gap-3 justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/product" className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
              Product
            </Link>
            <Link to="/add-product" className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
              Add products
            </Link>
            <span className="rounded-md bg-gray-800 px-4 py-2 text-sm font-semibold text-white shadow">Add Category</span>
          </div>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-3 gap-3" onSubmit={handleSubmit}>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700">Category name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              required
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700">Image URL</label>
            <input
              type="text"
              value={form.icon_url}
              onChange={(e) => setForm((prev) => ({ ...prev, icon_url: e.target.value }))}
              placeholder="https://..."
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>
          <div className="md:col-span-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setForm({ name: "", description: "", icon_url: "" });
                setEditingId(null);
              }}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              Reset
            </button>
            <button
              type="submit"
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800"
              disabled={loading}
            >
              {editingId ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>

      <div className="mb-3 rounded-lg bg-white p-3 shadow">
        <label className="block text-sm font-medium text-gray-700">Search category</label>
        <input
          type="text"
          placeholder="Search category"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
        />
      </div>

      {error && (
        <div className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg bg-white shadow">
        <table className="min-w-full divide-y divide-gray-100 text-sm">
          <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-600">
            <tr>
              <th className="px-6 py-3 text-left">Category</th>
              <th className="px-6 py-3 text-left">Image</th>
              <th className="px-6 py-3 text-left">Slug</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="4" className="px-6 py-6 text-center text-sm text-gray-600">
                  Loading categories...
                </td>
              </tr>
            ) : filteredCategories.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-6 text-center text-sm text-gray-600">
                  No categories available.
                </td>
              </tr>
            ) : (
              filteredCategories.map((category) => (
                <tr key={category.id || category.slug || category.name} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-gray-900">{category.name}</td>
                  <td className="px-6 py-4">
                    {category.icon_url ? (
                      <img src={category.icon_url} alt={category.name} className="h-16 w-16 rounded-md object-cover" />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-md bg-gray-100 text-xs font-semibold text-gray-500">
                        N/A
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{category.slug || "-"}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button
                        className="rounded-lg bg-blue-600 px-3 py-1 text-white shadow-sm transition hover:bg-blue-700"
                        onClick={() => handleEdit(category)}
                      >
                        Edit
                      </button>
                      <button
                        className="rounded-lg border px-3 py-1 text-red-600 shadow-sm transition hover:bg-gray-100"
                        onClick={() => handleDelete(category.id || category._id)}
                      >
                        Delete
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
  );
};

export default AddCategory;
