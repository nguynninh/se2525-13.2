import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AddCategoryModal from "../components/AddCategoryModal";
import { fetchCategories } from "../api/product";

const EditCategoryModal = ({ category, onClose }) => {
  if (!category) return null;

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

        <h2 className="mb-4 text-xl font-semibold text-gray-900">Edit Category</h2>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-800">Category name</label>
            <input
              type="text"
              defaultValue={category.name}
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800">Category image</label>
            <input
              type="file"
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-800">Current image:</p>
            <img src={category.image} alt={category.name} className="mt-2 h-20 w-20 rounded object-cover" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800">Description</label>
            <textarea
              rows="3"
              defaultValue={category.description}
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
            ></textarea>
          </div>

          <button
            type="submit"
            className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

const AddCategory = () => {
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleDelete = (name) => {
    const ok = window.confirm("This only removes the row locally. Continue?");
    if (ok) {
      setCategories((prev) => prev.filter((item) => item.name !== name));
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
          <button
            onClick={() => setIsAddCategoryOpen(true)}
            className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-600"
          >
            + Add Category
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Search category</label>
            <input
              type="text"
              placeholder="Search category"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex w-full gap-2 md:w-auto">
            <button
              type="button"
              onClick={loadCategories}
              className="w-full rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-gray-900 md:w-28"
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={() => setSearch("")}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 md:w-28"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg bg-white shadow">
        {error && (
          <div className="px-6 py-3 text-sm text-red-600 border-b border-gray-100">
            {error}
          </div>
        )}
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
              filteredCategories.map((category, index) => (
                <tr key={`${category.name}-${index}`} className="hover:bg-gray-50">
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
                  <td className="px-6 py-4 text-gray-700">{category.slug}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button
                        className="rounded-lg bg-blue-600 px-3 py-1 text-white shadow-sm transition hover:bg-blue-700"
                        onClick={() => setEditingCategory(category)}
                      >
                        Edit
                      </button>
                      <button
                        className="rounded-lg border px-3 py-1 text-red-600 shadow-sm transition hover:bg-gray-100"
                        onClick={() => handleDelete(category.name)}
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

      {isAddCategoryOpen && <AddCategoryModal onClose={() => setIsAddCategoryOpen(false)} />}
      {editingCategory && <EditCategoryModal category={editingCategory} onClose={() => setEditingCategory(null)} />}
    </div>
  );
};

export default AddCategory;
