import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCategories, fetchProducts } from '../api/product';

const statusStyles = {
  active: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  draft: 'bg-amber-50 text-amber-700 ring-amber-100',
  hidden: 'bg-gray-100 text-gray-700 ring-gray-200',
  banned: 'bg-red-50 text-red-700 ring-red-100',
};

const Product = () => {
  const [filters, setFilters] = useState({
    keyword: '',
    category_id: '',
    min_price: '',
    max_price: '',
    status: '',
  });
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState(null);

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  const loadProducts = async (activeFilters = filters) => {
    setLoading(true);
    setError('');
    try {
      const payload = await fetchProducts({
        ...activeFilters,
        min_price: activeFilters.min_price || undefined,
        max_price: activeFilters.max_price || undefined,
        status: activeFilters.status || undefined,
      });
      setProducts(payload?.data || []);
      setPagination(payload?.pagination || null);
    } catch (err) {
      setError(err.message || 'Unable to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
    loadProducts(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = (event) => {
    event.preventDefault();
    loadProducts(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      keyword: '',
      category_id: '',
      min_price: '',
      max_price: '',
      status: '',
    };
    setFilters(resetFilters);
    loadProducts(resetFilters);
  };

  const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(Number(value || 0));

  const renderStatus = (status) => {
    const style = statusStyles[status] || 'bg-gray-100 text-gray-700 ring-gray-200';
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${style}`}>
        {status || 'unknown'}
      </span>
    );
  };

  const displayedProducts = useMemo(() => products, [products]);

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

        <form onSubmit={handleSearch} className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Product name</label>
            <input
              type="text"
              value={filters.keyword}
              onChange={handleInputChange('keyword')}
              placeholder="Search by keyword"
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={filters.category_id}
              onChange={handleInputChange('category_id')}
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price range</label>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="number"
                min="0"
                value={filters.min_price}
                onChange={handleInputChange('min_price')}
                placeholder="Min"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
              <span className="text-sm text-gray-500">-</span>
              <input
                type="number"
                min="0"
                value={filters.max_price}
                onChange={handleInputChange('max_price')}
                placeholder="Max"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={filters.status}
              onChange={handleInputChange('status')}
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
            >
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="hidden">Hidden</option>
              <option value="banned">Banned</option>
            </select>
          </div>
          <div className="md:col-span-2 flex items-end gap-2">
            <button
              type="submit"
              className="w-full rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-gray-900"
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto border border-gray-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <p className="text-sm text-gray-700 font-semibold">Products</p>
          {pagination?.total !== undefined && (
            <p className="text-xs text-gray-500">Total: {pagination.total}</p>
          )}
        </div>
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Product name</th>
              <th scope="col" className="px-6 py-3">SKU</th>
              <th scope="col" className="px-6 py-3">Price</th>
              <th scope="col" className="px-6 py-3">Stock</th>
              <th scope="col" className="px-6 py-3">Rating</th>
              <th scope="col" className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-6 text-center text-sm text-gray-600">
                  Loading products...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="6" className="px-6 py-6 text-center text-sm text-red-600">
                  {error}
                </td>
              </tr>
            ) : displayedProducts.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-6 text-center text-sm text-gray-600">
                  No products available.
                </td>
              </tr>
            ) : (
              displayedProducts.map((product) => {
                const mainImage = product.images?.[0]?.image_url;
                const ratingValue = Number(product.rating_avg ?? 0);
                const filledStars = Math.round(ratingValue);

                return (
                  <tr key={product.id} className="bg-white border-b last:border-0">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {mainImage ? (
                          <img src={mainImage} alt={product.name} className="w-12 h-12 rounded-md object-cover" />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gray-100 text-xs font-semibold text-gray-500">
                            N/A
                          </div>
                        )}
                        <span className="text-sm font-medium text-gray-900 break-words">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{product.sku || '-'}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{formatCurrency(product.price)}</td>
                    <td className="px-6 py-4">{product.quantity ?? 0}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < filledStars ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="ml-2 text-xs text-gray-500">
                          {ratingValue > 0 ? ratingValue.toFixed(1) : 'No ratings'}
                          {product.rating_count ? ` (${product.rating_count})` : ''}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{renderStatus(product.status)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Product;
