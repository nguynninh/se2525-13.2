import React from 'react';

const AddCategoryModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/60 px-4 py-8 backdrop-blur-sm">
      <div className="relative w-full max-w-xl rounded-xl bg-white px-6 py-6 shadow-2xl sm:px-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 transition hover:text-gray-600 focus:outline-none"
          aria-label="Close"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <h2 className="mb-6 text-2xl font-semibold text-gray-900">Add Product Category</h2>

        <form className="space-y-5">
          <label className="block">
            <span className="text-sm font-medium text-gray-800">Category Name</span>
            <input
              type="text"
              name="categoryName"
              placeholder="Enter category name"
              className="mt-2 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 shadow-sm outline-none transition focus:border-gray-500 focus:ring-1 focus:ring-gray-400"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-800">Category Image</span>
            <input
              type="file"
              name="categoryImage"
              className="mt-2 block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-gray-200 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-gray-800 hover:file:bg-gray-300 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-800">Description</span>
            <textarea
              name="description"
              placeholder="Add a short description for this category"
              rows="3"
              className="mt-2 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 shadow-sm outline-none transition focus:border-gray-500 focus:ring-1 focus:ring-gray-400"
            ></textarea>
          </label>

          <button
            type="submit"
            className="mt-2 inline-flex items-center justify-center rounded-lg bg-emerald-600 px-6 py-2.5 text-base font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;
