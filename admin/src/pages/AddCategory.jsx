import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AddCategoryModal from '../components/AddCategoryModal';

const AddCategory = () => {
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);

  const categories = [
    {
      name: 'T-Shirts',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=120&h=120&fit=crop',
      description: 'Easy-to-pair tees that match a wide range of looks.',
    },
    {
      name: 'Jeans',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=120&h=120&fit=crop',
      description: 'Youthful, energetic denim in slim, straight, or baggy fits.',
    },
    {
      name: 'Hoodies',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=120&h=120&fit=crop&sat=-40',
      description: 'Relaxed hoodies with drawstrings - perfect for cool weather.',
    },
    {
      name: 'Vests',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&h=120&fit=crop&sat=-70',
      description: 'Lightweight vests designed to layer over shirts or long sleeves.',
    },
  ];

  return (
    <div className="p-4">
      <div className="mb-4 rounded-lg bg-white p-4 shadow">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Link to="/product" className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Product</Link>
          <Link to="/add-product" className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Add products</Link>
          <span className="rounded-md bg-gray-800 px-4 py-2 text-sm font-semibold text-white shadow">Add Category</span>
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
          <button
            onClick={() => setIsAddCategoryOpen(true)}
            className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-600"
          >
            + Add Category
          </button>
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
            {categories.map((category, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-900">{category.name}</td>
                <td className="px-6 py-4">
                  <img src={category.image} alt={category.name} className="h-16 w-16 rounded-md object-cover" />
                </td>
                <td className="px-6 py-4 text-gray-700">{category.description}</td>
                <td className="px-6 py-4">
                  <button className="rounded-lg border px-3 py-1 text-gray-700 shadow-sm transition hover:bg-gray-100">...</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isAddCategoryOpen && <AddCategoryModal onClose={() => setIsAddCategoryOpen(false)} />}
    </div>
  );
};

export default AddCategory;
