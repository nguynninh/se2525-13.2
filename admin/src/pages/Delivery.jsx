import React from 'react';

const orders = [
  {
    customer: 'Gojo Sulaiman',
    orderNo: '2201223FJAQG',
    products: [
      {
        name: 'T-Shirt Groot Black',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop',
        price: '100.000d',
        status: 'Need to be sent',
        statusDetail: 'Before 28/05/2022',
        quantity: 1,
        deliveryService: 'J&T',
      },
      {
        name: 'Sepatu Nike',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop',
        price: '800.000d',
        status: 'Need to be sent',
        statusDetail: 'Before 28/05/2022',
        quantity: 1,
        deliveryService: 'J&T',
      },
    ],
  },
  {
    customer: 'Alan',
    orderNo: '2197139TYQPWO',
    products: [
      {
        name: 'T-Shirt Love Kills',
        image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=100&h=100&fit=crop',
        price: '100.000d',
        status: 'Need to be sent',
        statusDetail: 'Before 28/05/2022',
        quantity: 2,
        deliveryService: 'Sicepat',
      },
    ],
  },
];

const flattenedProducts = orders.flatMap((order) =>
  order.products.map((product) => ({
    ...product,
    customer: order.customer,
    orderNo: order.orderNo,
  }))
);

const Delivery = () => {
  return (
    <div className="p-4 lg:p-5 space-y-4 bg-content-bg min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900">Delivery</h1>

      <div className="rounded-xl bg-white border border-gray-200 p-4 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {['Delivery', 'In Transit', 'Completed'].map((tab, idx) => (
            <button
              key={tab}
              className={`rounded-lg border px-4 py-2 text-sm font-semibold ${
                idx === 0 ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-4 lg:grid-cols-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Order number</label>
            <input
              type="text"
              placeholder="Enter the order number"
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Customer</label>
            <input
              type="text"
              placeholder="Search customer"
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
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

      <div className="bg-white rounded-xl shadow-sm overflow-x-auto border border-gray-200">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-600">
            <tr>
              <th className="px-6 py-3">Product name</th>
              <th className="px-6 py-3">Customer / Order</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Quantity</th>
              <th className="px-6 py-3">Delivery Services</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {flattenedProducts.map((product, index) => (
              <tr key={index} className="bg-white border-b last:border-0">
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex items-center">
                  <img src={product.image} alt={product.name} className="w-10 h-10 rounded-md mr-4" />
                  {product.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <div className="font-semibold text-gray-900">{product.customer}</div>
                  <div className="text-xs text-gray-500">Order No. {product.orderNo}</div>
                </td>
                <td className="px-6 py-4 text-gray-800">{product.price}</td>
                <td className="px-6 py-4 text-gray-800">
                  <div>{product.status}</div>
                  <div className="text-xs text-gray-500">{product.statusDetail}</div>
                </td>
                <td className="px-6 py-4 text-gray-800">{product.quantity}</td>
                <td className="px-6 py-4 text-gray-800">{product.deliveryService}</td>
                <td className="px-6 py-4">
                  <a href="#" className="font-medium text-blue-600 hover:underline">
                    Arrange Delivery
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

export default Delivery;
