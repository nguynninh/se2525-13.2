import React, { useMemo, useState } from "react";

const initialOrders = [
  { code: "ORD111", customer: "Gojo Sulaiman", phone: "0335 244 686", total: "300,000d", createdAt: "01/12/2025 07:26", status: "Delivered" },
  { code: "ORD110", customer: "Gojo Sulaiman", phone: "0335 244 686", total: "180,000d", createdAt: "01/12/2025 07:24", status: "Delivered" },
  { code: "ORD109", customer: "Gojo Sulaiman", phone: "0335 244 686", total: "180,000d", createdAt: "01/12/2025 07:24", status: "Pending" },
  { code: "ORD108", customer: "Gojo Sulaiman", phone: "0335 244 686", total: "300,000d", createdAt: "23/11/2025 19:58", status: "Delivered" },
  { code: "ORD107", customer: "Gojo Sulaiman", phone: "0335 244 686", total: "450,000d", createdAt: "22/11/2025 18:29", status: "Canceled" },
  { code: "ORD096", customer: "Gojo Sulaiman", phone: "0335 244 686", total: "300,000d", createdAt: "19/11/2025 10:00", status: "Canceled" },
  { code: "ORD095", customer: "Gojo Sulaiman", phone: "0335 244 686", total: "300,000d", createdAt: "17/11/2025 18:08", status: "Delivered" },
];

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Pending", value: "Pending" },
  { label: "Approved", value: "Approved" },
  { label: "Shipping", value: "Shipping" },
  { label: "Delivered", value: "Delivered" },
  { label: "Canceled", value: "Canceled" },
];

const statusStyles = {
  Pending: "bg-amber-100 text-amber-800",
  Approved: "bg-blue-100 text-blue-800",
  Shipping: "bg-indigo-100 text-indigo-800",
  Delivered: "bg-emerald-100 text-emerald-800",
  Canceled: "bg-rose-100 text-rose-800",
};

const Delivery = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [activeStatus, setActiveStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [shipTarget, setShipTarget] = useState(null);
  const [trackingNumber, setTrackingNumber] = useState("");

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchStatus = activeStatus === "all" || order.status === activeStatus;
      const matchSearch = order.code.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [orders, activeStatus, search]);

  const approveOrder = (code) => {
    setOrders((prev) => prev.map((o) => (o.code === code ? { ...o, status: "Approved" } : o)));
    alert("Order has been approved.");
  };

  const openShipModal = (order) => {
    setShipTarget(order);
    setTrackingNumber("");
  };

  const confirmShip = () => {
    if (!shipTarget) return;
    setOrders((prev) =>
      prev.map((o) => (o.code === shipTarget.code ? { ...o, status: "Shipping", tracking: trackingNumber } : o))
    );
    setShipTarget(null);
    setTrackingNumber("");
  };

  const cancelOrder = (code) => {
    const ok = window.confirm("Are you sure you want to cancel this order?");
    if (!ok) return;
    setOrders((prev) => prev.map((o) => (o.code === code ? { ...o, status: "Canceled" } : o)));
  };

  return (
    <div className="p-4 lg:p-5 space-y-4 bg-content-bg min-h-screen">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-600">Total orders in store: {orders.length}</p>
      </div>

      <div className="rounded-xl bg-white border border-gray-200 p-4 shadow-sm space-y-3">
        <h3 className="text-base font-semibold text-gray-900">Filter by status</h3>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((opt) => {
            const count = orders.filter((o) => opt.value === "all" || o.status === opt.value).length;
            const active = activeStatus === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setActiveStatus(opt.value)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  active ? "bg-rose-500 text-white border-rose-500" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {opt.label}
                <span className={`ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full text-xs font-bold ${
                  active ? "bg-white text-rose-500" : "bg-gray-100 text-gray-700"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl bg-white border border-gray-200 p-4 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order code..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-600">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Created At</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.code} className="border-b last:border-0">
                  <td className="px-4 py-3 font-semibold text-gray-900">#{order.code}</td>
                  <td className="px-4 py-3 text-gray-800">{order.customer}</td>
                  <td className="px-4 py-3 text-gray-800">{order.phone}</td>
                  <td className="px-4 py-3 text-gray-800">{order.total}</td>
                  <td className="px-4 py-3 text-gray-800">{order.createdAt}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[order.status] || "bg-gray-100 text-gray-700"}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <button
                        className="rounded-lg bg-blue-600 px-3 py-1 text-white shadow-sm transition hover:bg-blue-700"
                        onClick={() => approveOrder(order.code)}
                      >
                        Approve
                      </button>
                      <button
                        className="rounded-lg bg-emerald-600 px-3 py-1 text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed"
                        disabled={order.status !== "Approved"}
                        onClick={() => openShipModal(order)}
                      >
                        Ship
                      </button>
                      <button
                        className="rounded-lg border px-3 py-1 text-red-600 shadow-sm transition hover:bg-gray-100"
                        onClick={() => cancelOrder(order.code)}
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {shipTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/60 px-4 py-8 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-xl bg-white px-6 py-6 shadow-2xl sm:px-8">
            <button
              onClick={() => setShipTarget(null)}
              className="absolute right-4 top-4 text-gray-400 transition hover:text-gray-600 focus:outline-none"
              aria-label="Close"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Add Tracking Number</h2>
            <label className="block text-sm font-medium text-gray-800">Tracking number</label>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={confirmShip}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
              >
                Save
              </button>
              <button
                onClick={() => setShipTarget(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Delivery;
