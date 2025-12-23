import React, { useEffect, useState } from 'react';
import { Users, ShieldCheck, Store, ClipboardList, Truck, BadgeCheck } from 'lucide-react';
import api from '../api/client';

const Badge = ({ children }) => (
  <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full border border-gray-200 text-gray-700">
    {children}
  </span>
);

const EmptyState = ({ text }) => (
  <div className="border border-dashed border-gray-200 rounded-lg p-3 text-sm text-gray-600 text-center">
    {text}
  </div>
);

const StatCard = ({ icon: Icon, label, value, tone }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
    <div className={`w-10 h-10 rounded-lg grid place-items-center ${tone}`}>
      <Icon className="w-5 h-5 text-gray-900" />
    </div>
    <div className="min-w-0">
      <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">{label}</p>
      <p className="text-xl font-semibold text-gray-900">{value}</p>
    </div>
  </div>
);

const AdminPanel = () => {
  const [section, setSection] = useState('users');
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [errorUsers, setErrorUsers] = useState('');

  const [sellerApps, setSellerApps] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [errorApps, setErrorApps] = useState('');

  const [shops, setShops] = useState([]);
  const [loadingShops, setLoadingShops] = useState(false);
  const [errorShops, setErrorShops] = useState('');

  const [adminOrders, setAdminOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [errorOrders, setErrorOrders] = useState('');

  const [shipments, setShipments] = useState([]);
  const [loadingShipments, setLoadingShipments] = useState(false);
  const [errorShipments, setErrorShipments] = useState('');
  const [shipmentOrderId, setShipmentOrderId] = useState('');

  const [shippingRates, setShippingRates] = useState([]);
  const [loadingRates, setLoadingRates] = useState(false);
  const [errorRates, setErrorRates] = useState('');

  const stats = [
    { icon: Users, label: 'Admin users', value: '—', tone: 'bg-gray-100' },
    { icon: ShieldCheck, label: 'Seller applications', value: '—', tone: 'bg-emerald-100' },
    { icon: Store, label: 'Admin shops', value: '—', tone: 'bg-blue-100' },
    { icon: ClipboardList, label: 'Admin orders', value: '—', tone: 'bg-amber-100' },
  ];

  const tabs = [
    { key: 'users', label: 'Users' },
    { key: 'sellerApps', label: 'Seller applications' },
    { key: 'shops', label: 'Shops' },
    { key: 'orders', label: 'Orders' },
    { key: 'shipments', label: 'Shipments' },
    { key: 'rates', label: 'Shipping rates' },
  ];

  const safeArray = (payload) => payload?.data ?? payload?.items ?? payload ?? [];

  useEffect(() => {
    const controller = new AbortController();

    const loadUsers = async () => {
      setLoadingUsers(true); setErrorUsers('');
      try {
        const { data } = await api.get('/api/user/admin/users', { signal: controller.signal });
        setUsers(safeArray(data));
      } catch (err) {
        if (err.name !== 'CanceledError') setErrorUsers(err.message || 'Failed to load users.');
      } finally {
        setLoadingUsers(false);
      }
    };

    const loadSellerApps = async () => {
      setLoadingApps(true); setErrorApps('');
      try {
        const { data } = await api.get('/api/seller-applications/admin/pending', { signal: controller.signal });
        setSellerApps(safeArray(data));
      } catch (err) {
        if (err.name !== 'CanceledError') setErrorApps(err.message || 'Failed to load applications.');
      } finally {
        setLoadingApps(false);
      }
    };

    const loadShops = async () => {
      setLoadingShops(true); setErrorShops('');
      try {
        const { data } = await api.get('/api/admin/shops', { signal: controller.signal });
        setShops(safeArray(data));
      } catch (err) {
        if (err.name !== 'CanceledError') setErrorShops(err.message || 'Failed to load shops.');
      } finally {
        setLoadingShops(false);
      }
    };

    const loadOrders = async () => {
      setLoadingOrders(true); setErrorOrders('');
      try {
        const { data } = await api.get('/api/user/admin/orders', { signal: controller.signal });
        setAdminOrders(safeArray(data));
      } catch (err) {
        if (err.name !== 'CanceledError') setErrorOrders(err.message || 'Failed to load orders.');
      } finally {
        setLoadingOrders(false);
      }
    };

    const loadRates = async () => {
      setLoadingRates(true); setErrorRates('');
      try {
        const { data } = await api.get('/api/shipping-rates', { signal: controller.signal });
        setShippingRates(safeArray(data));
      } catch (err) {
        if (err.name !== 'CanceledError') setErrorRates(err.message || 'Failed to load shipping rates.');
      } finally {
        setLoadingRates(false);
      }
    };

    switch (section) {
      case 'users': loadUsers(); break;
      case 'sellerApps': loadSellerApps(); break;
      case 'shops': loadShops(); break;
      case 'orders': loadOrders(); break;
      case 'rates': loadRates(); break;
      default: break;
    }

    return () => controller.abort();
  }, [section]);

  const loadShipmentsByOrder = async () => {
    if (!shipmentOrderId) {
      setErrorShipments('Please enter an order ID');
      setShipments([]);
      return;
    }
    setLoadingShipments(true); setErrorShipments('');
    try {
      const { data } = await api.get(`/api/orders/${shipmentOrderId}/shipments`);
      setShipments(safeArray(data));
    } catch (err) {
      setErrorShipments(err.message || 'Failed to load shipments.');
    } finally {
      setLoadingShipments(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {stats.map((item) => (
          <StatCard key={item.label} {...item} />
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-3">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSection(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold border ${
                section === tab.key
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {section === 'users' && (
      <section className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Users (admin endpoints)</p>
            <p className="font-semibold text-gray-900">List / detail / delete</p>
          </div>
          <button className="text-sm font-semibold text-gray-700 border px-3 py-2 rounded-lg hover:bg-gray-50">
            Filter
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-700 text-xs uppercase border-b border-gray-100">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">User ID</th>
                <th className="px-3 py-2 text-left font-semibold">Email</th>
                <th className="px-3 py-2 text-left font-semibold">Role</th>
                <th className="px-3 py-2 text-left font-semibold">Phone</th>
              </tr>
            </thead>
            <tbody>
              {loadingUsers ? (
                <tr><td colSpan="4" className="px-3 py-4 text-center text-sm text-gray-600">Loading users...</td></tr>
              ) : errorUsers ? (
                <tr><td colSpan="4" className="px-3 py-4 text-center text-sm text-red-600">{errorUsers}</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan="4" className="px-3 py-4"><EmptyState text="No users yet." /></td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100">
                    <td className="px-3 py-2 font-semibold text-gray-900">{user.id}</td>
                    <td className="px-3 py-2 text-gray-700">{user.email}</td>
                    <td className="px-3 py-2"><Badge>{user.role}</Badge></td>
                    <td className="px-3 py-2 text-gray-700">{user.phone || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
      )}

      {section === 'sellerApps' && (
      <section className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Seller applications</p>
            <p className="font-semibold text-gray-900">Pending / history / review</p>
          </div>
          <button className="text-sm font-semibold text-gray-700 border px-3 py-2 rounded-lg hover:bg-gray-50">
            Review
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-700 text-xs uppercase border-b border-gray-100">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">Application ID</th>
                <th className="px-3 py-2 text-left font-semibold">User</th>
                <th className="px-3 py-2 text-left font-semibold">Status</th>
                <th className="px-3 py-2 text-left font-semibold">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {loadingApps ? (
                <tr><td colSpan="4" className="px-3 py-4 text-center text-sm text-gray-600">Loading applications...</td></tr>
              ) : errorApps ? (
                <tr><td colSpan="4" className="px-3 py-4 text-center text-sm text-red-600">{errorApps}</td></tr>
              ) : sellerApps.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-3 py-4">
                    <EmptyState text="No applications yet." />
                  </td>
                </tr>
              ) : (
                sellerApps.map((app) => (
                  <tr key={app.id} className="border-b border-gray-100">
                    <td className="px-3 py-2 font-semibold text-gray-900">{app.id}</td>
                    <td className="px-3 py-2 text-gray-700">{app.user}</td>
                    <td className="px-3 py-2"><Badge>{app.status}</Badge></td>
                    <td className="px-3 py-2 text-gray-700">{app.createdAt}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
      )}

      {section === 'shops' && (
      <section className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Shops (admin)</p>
            <p className="font-semibold text-gray-900">Featured / status / delete</p>
          </div>
          <button className="text-sm font-semibold text-gray-700 border px-3 py-2 rounded-lg hover:bg-gray-50">
            New shop
          </button>
        </div>
        <div className="space-y-3">
          {loadingShops ? (
            <EmptyState text="Loading shops..." />
          ) : errorShops ? (
            <div className="text-sm text-red-600">{errorShops}</div>
          ) : shops.length === 0 ? (
            <EmptyState text="No shops yet." />
          ) : (
            shops.map((shop) => (
              <div key={shop.id} className="border border-gray-100 rounded-lg px-3 py-2 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{shop.name}</p>
                  <p className="text-xs text-gray-500">{shop.slug}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>{shop.status}</Badge>
                  {shop.is_featured ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full border border-amber-200 text-amber-700">
                      <BadgeCheck className="w-3.5 h-3.5" /> Featured
                    </span>
                  ) : null}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
      )}

      {section === 'orders' && (
      <section className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Orders (admin)</p>
            <p className="font-semibold text-gray-900">List / detail / status / stats</p>
          </div>
          <button className="text-sm font-semibold text-gray-700 border px-3 py-2 rounded-lg hover:bg-gray-50">
            Filter
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-700 text-xs uppercase border-b border-gray-100">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">Order ID</th>
                <th className="px-3 py-2 text-left font-semibold">User</th>
                <th className="px-3 py-2 text-left font-semibold">Status</th>
                <th className="px-3 py-2 text-left font-semibold">Total</th>
                <th className="px-3 py-2 text-left font-semibold">Updated</th>
              </tr>
            </thead>
            <tbody>
              {loadingOrders ? (
                <tr><td colSpan="5" className="px-3 py-4 text-center text-sm text-gray-600">Loading orders...</td></tr>
              ) : errorOrders ? (
                <tr><td colSpan="5" className="px-3 py-4 text-center text-sm text-red-600">{errorOrders}</td></tr>
              ) : adminOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-3 py-4">
                    <EmptyState text="No orders yet." />
                  </td>
                </tr>
              ) : (
                adminOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100">
                    <td className="px-3 py-2 font-semibold text-gray-900">{order.id}</td>
                    <td className="px-3 py-2 text-gray-700">{order.user}</td>
                    <td className="px-3 py-2"><Badge>{order.status}</Badge></td>
                    <td className="px-3 py-2 font-semibold text-gray-900">{order.total}</td>
                    <td className="px-3 py-2 text-gray-700">{order.updatedAt}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
      )}

      {section === 'shipments' && (
      <section className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Shipments (admin)</p>
              <p className="font-semibold text-gray-900">Lookup by order ID</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              value={shipmentOrderId}
              onChange={(e) => setShipmentOrderId(e.target.value)}
              placeholder="Enter order ID"
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800"
            />
            <button
              onClick={loadShipmentsByOrder}
              className="text-sm font-semibold text-white bg-gray-900 px-3 py-2 rounded-lg"
            >
              Load
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-700 text-xs uppercase border-b border-gray-100">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">Shipment ID</th>
                <th className="px-3 py-2 text-left font-semibold">Order ID</th>
                <th className="px-3 py-2 text-left font-semibold">Status</th>
                <th className="px-3 py-2 text-left font-semibold">Carrier</th>
                <th className="px-3 py-2 text-left font-semibold">ETA</th>
              </tr>
            </thead>
            <tbody>
              {loadingShipments ? (
                <tr><td colSpan="5" className="px-3 py-4 text-center text-sm text-gray-600">Loading shipments...</td></tr>
              ) : errorShipments ? (
                <tr><td colSpan="5" className="px-3 py-4 text-center text-sm text-red-600">{errorShipments}</td></tr>
              ) : shipments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-3 py-4">
                    <EmptyState text="No shipments yet." />
                  </td>
                </tr>
              ) : (
                shipments.map((ship) => (
                  <tr key={ship.id} className="border-b border-gray-100">
                    <td className="px-3 py-2 font-semibold text-gray-900">{ship.id}</td>
                    <td className="px-3 py-2 text-gray-700">{ship.orderId}</td>
                    <td className="px-3 py-2"><Badge>{ship.status}</Badge></td>
                    <td className="px-3 py-2 text-gray-700">{ship.carrier || '—'}</td>
                    <td className="px-3 py-2 text-gray-700">{ship.eta || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
      )}

      {section === 'rates' && (
      <section className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Shipping rates</p>
            <p className="font-semibold text-gray-900">List / detail / update</p>
          </div>
          <button className="text-sm font-semibold text-gray-700 border px-3 py-2 rounded-lg hover:bg-gray-50">
            Edit
          </button>
        </div>
        <div className="space-y-2">
          {loadingRates ? (
            <EmptyState text="Loading shipping rates..." />
          ) : errorRates ? (
            <div className="text-sm text-red-600">{errorRates}</div>
          ) : shippingRates.length === 0 ? (
            <EmptyState text="No shipping rates yet." />
          ) : (
            shippingRates.map((rate) => (
              <div key={rate.id || rate.name} className="flex items-center justify-between border border-gray-100 rounded-lg px-3 py-2 text-sm">
                <div>
                  <p className="font-semibold text-gray-900">{rate.name}</p>
                  <p className="text-xs text-gray-500">{rate.region || '—'}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{rate.fee}</p>
                  <p className="text-xs text-gray-500">{rate.eta || ''}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
      )}
    </div>
  );
};

export default AdminPanel;
