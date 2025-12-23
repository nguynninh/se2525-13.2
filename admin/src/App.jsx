import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Product from './pages/Product';
import AddProduct from './pages/AddProduct';

const AppContent = () => {
  const location = useLocation();
  let title = 'Dashboard';
  if (location.pathname === '/chat') {
    title = 'Chat';
  } else if (location.pathname === '/product') {
    title = 'Product';
  } else if (location.pathname === '/add-product') {
    title = 'Add Product';
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header title={title} />
        <main className="flex-1 overflow-y-auto bg-white p-3 lg:p-5 min-w-0">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/product" element={<Product />} />
            <Route path="/add-product" element={<AddProduct />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
