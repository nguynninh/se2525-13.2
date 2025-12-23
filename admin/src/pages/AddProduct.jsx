import React from 'react';

const AddProduct = () => {
  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="flex space-x-4 mb-4">
          <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">Product</button>
          <button className="bg-gray-800 text-white px-4 py-2 rounded-lg">Add products</button>
        </div>
        <h2 className="text-xl font-bold mb-4">Add New Product</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Product name</label>
            <input type="text" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category Name</label>
            <input type="text" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Stock</label>
            <input type="text" className="mt-1 block w-24 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div className="col-span-1 lg:col-span-3 flex justify-end space-x-2">
            <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">Edit</button>
            <button className="bg-gray-800 text-white px-4 py-2 rounded-lg">Send</button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="mb-4">
          <input type="text" placeholder="Category Name" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1 border-r pr-4">
            <ul>
              <li className="text-red-500 font-bold">Menswear</li>
              <li>Women's Clothing</li>
              <li>Men's Shoes</li>
              <li>Women's Shoes</li>
              <li>Electronic</li>
              <li>Mobile Phones</li>
              <li>Computers & Accessories</li>
              <li>Grooming & Beauty</li>
              <li>Home Supplies</li>
            </ul>
          </div>
          <div className="col-span-1 border-r pr-4">
            <ul>
              <li>Superior</li>
              <li>Long pants</li>
              <li>Shorts</li>
              <li>Jeans</li>
              <li className="text-red-500">Jackets, Cardigans, Sweaters</li>
              <li>Coats & Vests</li>
            </ul>
          </div>
          <div className="col-span-1">
            <div className="grid grid-cols-3 gap-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border-2 border-dashed rounded-lg h-24 flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button className="bg-gray-800 text-white px-4 py-2 rounded-lg">Save</button>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
