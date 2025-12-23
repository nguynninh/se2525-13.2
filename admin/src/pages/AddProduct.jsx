import React, { useState } from "react";
import { Link } from "react-router-dom";
import AddProductModal from "../components/AddProductModal";

const categories = [
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
    description: "Relaxed hoodies with drawstrings—perfect for cool weather.",
  },
  {
    name: "Vests",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&h=120&fit=crop&sat=-70",
    description: "Lightweight vests designed to layer over shirts or long sleeves.",
  },
];

const AddProduct = () => {
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  return (
    <div className="p-4">
      <div className="mb-4 rounded-lg bg-white p-4 shadow">
        <div className="mb-4 flex flex-wrap items-center gap-3 justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/product" className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
              Product
            </Link>
            <Link to="/add-product" className="bg-gray-800 text-white px-4 py-2 rounded-lg">
              Add products
            </Link>
            <Link to="/add-category" className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
              Add Category
            </Link>
          </div>
          <button
            onClick={() => setIsAddProductOpen(true)}
            className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600"
          >
            + Add Product
          </button>
        </div>

        <h2 className="text-xl font-bold mb-4">Add New Product</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Product name</label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Stock</label>
            <input
              type="text"
              className="mt-1 block w-24 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="md:col-span-2 flex items-end gap-2">
            <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">Edit</button>
            <button className="bg-gray-800 text-white px-4 py-2 rounded-lg">Send</button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100 bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Category</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Product</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Image</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Stock</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Description</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((category, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-semibold text-gray-900">{category.name}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{category.name}</td>
                <td className="px-4 py-3">
                  <img src={category.image} alt={category.name} className="h-16 w-16 rounded-md object-cover" />
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">-</td>
                <td className="px-4 py-3 text-sm text-gray-700">{category.description}</td>
                <td className="px-4 py-3 text-sm">
                  <button className="rounded-lg border px-3 py-1 text-gray-700 shadow-sm transition hover:bg-gray-100">...</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isAddProductOpen && <AddProductModal onClose={() => setIsAddProductOpen(false)} />}
    </div>
  );
};

export default AddProduct;
