import React, { useState } from "react";
import { Link } from "react-router-dom";
import AddCategoryModal from "../components/AddCategoryModal";

const initialCategories = [
  {
    name: "T-Shirts",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=120&h=120&fit=crop",
    description: "Easy-to-pair tees that match a wide range of looks.",
  },
  {
    name: "Jeans",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=120&h=120&fit=crop",
    description: "Youthful, energetic denim in slim, straight, or baggy fits.",
  },
  {
    name: "Hoodies",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=120&h=120&fit=crop&sat=-40",
    description: "Relaxed hoodies with drawstrings - perfect for cool weather.",
  },
  {
    name: "Vests",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&h=120&fit=crop&sat=-70",
    description: "Lightweight vests designed to layer over shirts or long sleeves.",
  },
];

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
  const [rows, setRows] = useState(initialCategories);

  const handleDelete = (name) => {
    const ok = window.confirm("Are you sure you want to delete this category?");
    if (ok) {
      setRows((prev) => prev.filter((item) => item.name !== name));
    }
  };

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
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex w-full gap-2 md:w-auto">
            <button className="w-full rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-gray-900 md:w-28">
              Search
            </button>
            <button className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 md:w-28">
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg bg-white shadow">
        <table className="min-w-full divide-y divide-gray-100 text-sm">
          <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-600">
            <tr>
              <th className="px-6 py-3 text-left">Category</th>
              <th className="px-6 py-3 text-left">Image</th>
              <th className="px-6 py-3 text-left">Description</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((category, index) => (
              <tr key={`${category.name}-${index}`} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-900">{category.name}</td>
                <td className="px-6 py-4">
                  <img src={category.image} alt={category.name} className="h-16 w-16 rounded-md object-cover" />
                </td>
                <td className="px-6 py-4 text-gray-700">{category.description}</td>
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
            ))}
          </tbody>
        </table>
      </div>

      {isAddCategoryOpen && <AddCategoryModal onClose={() => setIsAddCategoryOpen(false)} />}
      {editingCategory && <EditCategoryModal category={editingCategory} onClose={() => setEditingCategory(null)} />}
    </div>
  );
};

export default AddCategory;
