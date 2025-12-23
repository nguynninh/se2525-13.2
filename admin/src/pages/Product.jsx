import React from 'react';
import { Link } from 'react-router-dom';

const products = [
  {
    name: 'T-Shirt Groot Black',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop',
    variation: '-',
    price: '100.000',
    stock: 200,
    rating: 4,
    status: 'Ubah',
  },
  {
    name: 'Sepatu Nike',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop',
    variation: '-',
    price: '800.000',
    stock: 60,
    rating: 4,
    status: 'Ubah',
  },
  {
    name: 'T-Shirt Love Kills',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=100&h=100&fit=crop',
    variation: '-',
    price: '100.000',
    stock: 120,
    rating: 4,
    status: 'Ubah',
  },
  {
    name: 'Tas Selempang Pria',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=100&h=100&fit=crop',
    variation: '-',
    price: '80.000',
    stock: 50,
    rating: 4,
    status: 'Ubah',
  },
];

const Product = () => {
  return (
    <div className="p-4 lg:p-5 space-y-4 bg-content-bg min-h-screen">
      <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Link to="/product" className="rounded-md bg-gray-800 px-4 py-2 text-sm font-semibold text-white shadow">
            Product
          </Link>
          <Link to="/add-product" className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
            Add products
          </Link>
          <Link to="/add-category" className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
            Add Category
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Product name</label>
            <input
              type="text"
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input
              type="text"
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Stock</label>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
              <span className="text-sm text-gray-500">-</span>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Sale</label>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
              <span className="text-sm text-gray-500">-</span>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>
          </div>
          <div className="md:col-span-2 flex items-end gap-2">
            <button className="w-full rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-gray-900">
              Search
            </button>
            <button className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50">
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto border border-gray-100">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Product name</th>
              <th scope="col" className="px-6 py-3">Variation</th>
              <th scope="col" className="px-6 py-3">Price</th>
              <th scope="col" className="px-6 py-3">Stock</th>
              <th scope="col" className="px-6 py-3">Rating</th>
              <th scope="col" className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index} className="bg-white border-b last:border-0">
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex items-center">
                  <img src={product.image} alt={product.name} className="w-10 h-10 rounded-md mr-4" />
                  {product.name}
                </td>
                <td className="px-6 py-4">{product.variation}</td>
                <td className="px-6 py-4">{product.price}</td>
                <td className="px-6 py-4">{product.stock}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < product.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <a href="#" className="font-medium text-blue-600 hover:underline">
                    {product.status}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Product;
