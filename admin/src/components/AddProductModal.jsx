import React from 'react';

const AddProductModal = ({ onClose }) => {
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

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-800">Product name</label>
            <input
              type="text"
              placeholder="Enter product name"
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800">Selling price</label>
            <input
              type="number"
              placeholder="Selling price"
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800">Purchase price</label>
            <input
              type="number"
              placeholder="Purchase price"
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800">Gender</label>
            <select className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400">
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800">Product category</label>
            <select className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400">
              <option value="">Select category</option>
              <option value="tshirts">T-Shirts</option>
              <option value="jeans">Jeans</option>
              <option value="hoodies">Hoodies</option>
              <option value="vests">Vests</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800">Description</label>
            <textarea
              rows="3"
              placeholder="Description"
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
            ></textarea>
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
