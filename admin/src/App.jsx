import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AdminPanel from './pages/AdminPanel';

const App = () => {
  const [activePage, setActivePage] = useState('admin');

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      <Sidebar active={activePage} onSelect={setActivePage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
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
