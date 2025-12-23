import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import { logoutAdmin } from './api/auth';

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
  const [activePage, setActivePage] = useState('admin');
  const [session, setSession] = useState(() => readSession());

  const handleLogin = (payload) => {
    const { accessToken, refreshToken, user } = payload || {};
    if (!accessToken || !user) return;
    if (user.role !== 'admin') {
      throw new Error('Account is not admin');
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
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      <Sidebar active={activePage} onSelect={setActivePage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={session.user} onLogout={handleLogout} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto px-6 py-8 lg:px-12 bg-gray-100">
          <div className="w-full mx-auto space-y-8">
            {activePage === 'admin' ? <AdminPanel /> : null}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
