import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AddProductModal from '../components/AddProductModal';

const AddProduct = () => {
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

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
      description: 'Relaxed hoodies with drawstrings—perfect for cool weather.',
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
          <Link to="/add-product" className="rounded-md bg-gray-800 px-4 py-2 text-sm font-semibold text-white shadow">Add products</Link>
          <Link to="/add-category" className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Add Category</Link>
          <button
            onClick={() => setIsAddProductOpen(true)}
            className="ml-auto rounded-md bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-600"
          >
            + Add Product
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Search product</label>
            <input type="text" className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input type="text" className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Stock</label>
            <div className="mt-2 flex items-center gap-2">
              <input type="text" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400" />
              <span className="text-sm text-gray-500">-</span>
              <input type="text" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Sale</label>
            <div className="mt-2 flex items-center gap-2">
              <input type="text" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400" />
              <span className="text-sm text-gray-500">-</span>
              <input type="text" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400" />
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 md:w-32">
            Edit
          </button>
          <button className="w-full rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-gray-900 md:w-32">
            Send
          </button>
        </div>
      </div>

      <div className="rounded-lg bg-white p-4 shadow">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Product Categories</h3>
          <p className="text-sm text-gray-500">Browse existing categories and their descriptions.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Image</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Description</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {categories.map((category, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">{category.name}</td>
                  <td className="px-4 py-3">
                    <img src={category.image} alt={category.name} className="h-16 w-16 rounded-md object-cover" />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{category.description}</td>
                  <td className="px-4 py-3 text-sm">
                    <button className="rounded-lg border px-3 py-1 text-gray-700 shadow-sm transition hover:bg-gray-100">⋯</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isAddProductOpen && <AddProductModal onClose={() => setIsAddProductOpen(false)} />}
    </div>
  );
};

export default AddProduct;
