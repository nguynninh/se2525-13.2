import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Product from './pages/Product';
import AddProduct from './pages/AddProduct';
import AddCategory from './pages/AddCategory';
import Delivery from './pages/Delivery';

const AppContent = () => {
  const location = useLocation();
  let title = 'Dashboard';
  if (location.pathname === '/chat') {
    title = 'Chat';
  } else if (location.pathname === '/product') {
    title = 'Product';
  } else if (location.pathname === '/add-product') {
    title = 'Add Product';
  } else if (location.pathname === '/delivery') {
    title = 'Delivery';
  } else if (location.pathname === '/add-category') {
    title = 'Add Category';
  }

  const showDatePicker = location.pathname === '/';

  return (
    <div className="flex h-screen bg-content-bg overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {location.pathname !== '/delivery' && <Header title={title} showDatePicker={showDatePicker} />}
        <main className="flex-1 overflow-y-auto p-3 lg:p-5 min-w-0 bg-content-bg">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/product" element={<Product />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/add-category" element={<AddCategory />} />
            <Route path="/delivery" element={<Delivery />} />
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
