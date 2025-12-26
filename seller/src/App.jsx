import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Product from './pages/Product';
import AddProduct from './pages/AddProduct';
import QA from './pages/QA';
import Shipping from './pages/Shipping';
import ShippingRates from './pages/ShippingRates';
import UpdateStock from './pages/UpdateStock';
import Settings from './pages/Settings';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import { logoutSeller } from './api/auth';

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

const AppContent = ({ user, onLogout }) => {
  const location = useLocation();
  let title = 'Dashboard';
  if (location.pathname === '/products' || location.pathname === '/product') {
    title = 'Products';
  } else if (location.pathname === '/add-product') {
    title = 'Add Product';
  } else if (location.pathname === '/qa') {
    title = 'Q&A';
  } else if (location.pathname === '/shipping') {
    title = 'Shipping';
  } else if (location.pathname === '/shipping/rates') {
    title = 'Shipping Rates';
  } else if (location.pathname === '/stock/update') {
    title = 'Update Stock';
  } else if (location.pathname === '/settings') {
    title = 'Settings';
  }

  return (
    <div className="flex h-screen bg-content-bg overflow-hidden">
      <Sidebar onLogout={onLogout} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header title={title} user={user} onLogout={onLogout} />
        <main className="flex-1 overflow-y-auto p-3 lg:p-5 min-w-0 bg-content-bg">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Product />} />
            <Route path="/product" element={<Product />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/qa" element={<QA />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/shipping/rates" element={<ShippingRates />} />
            <Route path="/stock/update" element={<UpdateStock />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App = () => {
  const [session, setSession] = useState(() => readSession());
  const [loginError, setLoginError] = useState('');

  const handleLogin = (payload) => {
    const { accessToken, refreshToken, user } = payload || {};
    if (!accessToken || !user) return;
    if (user.role !== 'seller') {
      setLoginError('Account is not seller');
      return;
    }
    setLoginError('');
    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    setSession({ accessToken, refreshToken, user });
  };

  const handleLogout = () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      logoutSeller(refreshToken);
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setSession(null);
  };

  return (
    <Router>
      {session ? (
        <AppContent user={session.user} onLogout={handleLogout} />
      ) : (
        <Routes>
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="*" element={<Login onSuccess={handleLogin} externalError={loginError} onClearError={() => setLoginError('')} />} />
        </Routes>
      )}
    </Router>
  );
};

export default App;
