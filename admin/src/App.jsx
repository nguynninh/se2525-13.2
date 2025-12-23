import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './pages/Login';
import { logoutAdmin } from './api/auth';
import Overview from './pages/admin/Overview';
import Users from './pages/admin/Users';
import SellerApps from './pages/admin/SellerApps';
import Shops from './pages/admin/Shops';
import Orders from './pages/admin/Orders';
import Shipments from './pages/admin/Shipments';
import Rates from './pages/admin/Rates';

const readSession = () => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!accessToken || !user) return null;
    return { accessToken, refreshToken, user };
  } catch {
    return null;
  }
};

const App = () => {
  const [activePage, setActivePage] = useState('overview');
  const [session, setSession] = useState(() => readSession());

  const handleLogin = (payload) => {
    const { accessToken, refreshToken, user } = payload || {};
    if (!accessToken || !user) return;
    const role = String(user.role || '').trim().toLowerCase();
    if (role !== 'admin') {
      console.warn('Login blocked: role is not admin', role);
      return;
    }
    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    setSession({ accessToken, refreshToken, user });
  };

  const handleLogout = () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      logoutAdmin(refreshToken);
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setSession(null);
  };

  if (!session) {
    return <Login onSuccess={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="flex min-h-screen">
        <Sidebar active={activePage} onSelect={setActivePage} onLogout={handleLogout} user={session.user} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header user={session.user} onLogout={handleLogout} onNavigate={setActivePage} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto px-6 py-8 lg:px-10 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
            <div className="w-full mx-auto space-y-8">
              {activePage === 'overview' && <Overview onNavigate={setActivePage} />}
              {activePage === 'users' && <Users />}
              {activePage === 'sellerApps' && <SellerApps />}
              {activePage === 'shops' && <Shops />}
              {activePage === 'orders' && <Orders />}
              {activePage === 'shipments' && <Shipments />}
              {activePage === 'rates' && <Rates />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
