import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Plus, Layers, Package, ClipboardList, Sparkles, Store } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchCategories, fetchProducts, fetchProductDetail } from '../api/product';

const statusStyles = {
  active: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  draft: 'bg-amber-50 text-amber-700 border border-amber-100',
  hidden: 'bg-gray-100 text-gray-700 border border-gray-200',
  banned: 'bg-rose-50 text-rose-700 border border-rose-100',
};

const Product = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [variantMatrix, setVariantMatrix] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [productData, categoryData] = await Promise.all([fetchProducts(), fetchCategories()]);
      const listProducts = Array.isArray(productData?.items) ? productData.items : Array.isArray(productData) ? productData : [];
      const listCategories = Array.isArray(categoryData?.items) ? categoryData.items : Array.isArray(categoryData) ? categoryData : [];
      setProducts(listProducts);
      setCategories(listCategories);
      // Flatten stock matrix from all products
      setVariantMatrix(
        listProducts.flatMap((p) => {
          if (!Array.isArray(p.stocks)) return [];
          return p.stocks.map((stock) => ({
            sku: stock.sku || stock.id,
            attrs: Array.isArray(stock.attributes)
              ? stock.attributes.map((a) => `${a.name}: ${a.value}`).join(', ')
              : stock.attrs || '',
            stock: stock.quantity ?? stock.stock,
            price: stock.price,
          }));
        }),
      );
    } catch (err) {
      setError(err.message || 'Failed to load products.');
      setProducts([]);
      setCategories([]);
      setVariantMatrix([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const totalProducts = products.length;
  const totalCategories = categories.length;
  const featuredCount = useMemo(
    () => products.filter((p) => p.featured || p.is_featured).length,
    [products],
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-900 text-white grid place-items-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total products</p>
              <p className="text-xl font-semibold text-gray-900">{loading ? '...' : totalProducts || '0'}</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 grid place-items-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Categories</p>
              <p className="text-xl font-semibold text-gray-900">{loading ? '...' : totalCategories || '0'}</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 grid place-items-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Featured products</p>
              <p className="text-xl font-semibold text-gray-900">{loading ? '...' : featuredCount || '0'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div>
              <p className="text-sm text-gray-500">Products</p>
              <p className="text-lg font-semibold text-gray-900">Manage products and categories</p>
            </div>
            <div className="flex gap-2">
            <Link
              to="/add-product"
              className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-gray-700 border rounded-lg hover:bg-gray-50"
            >
              <Plus className="w-4 h-4" />
              Add product
            </Link>
            <Link
              to="/add-category"
              className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-gray-700 border rounded-lg hover:bg-gray-50"
            >
              <Layers className="w-4 h-4" />
              Add category
            </Link>
            <button
              onClick={loadData}
              className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-gray-700 border rounded-lg hover:bg-gray-50"
              disabled={loading}
              type="button"
            >
              <Package className="w-4 h-4" />
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>

        {error && (
          <div className="px-4 py-3 text-sm text-rose-700 bg-rose-50 border-b border-rose-100">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-700 text-xs uppercase border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Product</th>
                <th className="px-4 py-3 text-left font-semibold">SKU</th>
                <th className="px-4 py-3 text-left font-semibold">Price</th>
                <th className="px-4 py-3 text-left font-semibold">Stock</th>
                <th className="px-4 py-3 text-left font-semibold">Variants</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-4 py-6 text-center text-sm text-gray-600">
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-6 text-center text-sm text-gray-600">
                    No products yet.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-900">{product.name}</td>
                    <td className="px-4 py-3 text-gray-700">{product.sku}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{product.price}</td>
                    <td className="px-4 py-3 text-gray-700">{product.stock ?? product.total_stock ?? 'N/A'}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {Array.isArray(product.variants) ? product.variants.length : product.variants || 0}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full ${statusStyles[product.status]}`}>
                        {product.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-gray-500">Categories</p>
              <p className="font-semibold text-gray-900">Manage categories</p>
            </div>
            <Link
              to="/add-category"
              className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-gray-700 border rounded-lg hover:bg-gray-50"
            >
              <Plus className="w-4 h-4" />
              Add
            </Link>
          </div>
          <div className="space-y-2">
            {loading ? (
              <div className="border border-dashed border-gray-200 rounded-lg p-3 text-sm text-gray-600">
                Loading categories...
              </div>
            ) : categories.length === 0 ? (
              <div className="border border-dashed border-gray-200 rounded-lg p-3 text-sm text-gray-600">
                No categories yet.
              </div>
            ) : (
              categories.map((category) => (
                <div key={category.name} className="flex items-center justify-between border border-gray-100 rounded-lg px-3 py-2">
                  <span className="font-semibold text-gray-900">{category.name}</span>
                  <span className="text-sm text-gray-600">{category.count} products</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-gray-500">SKU & stock</p>
              <p className="font-semibold text-gray-900">Manage stock</p>
            </div>
            <Link
              to="/stock/update"
              className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-gray-700 border rounded-lg hover:bg-gray-50"
            >
              <ClipboardList className="w-4 h-4" />
              Update stock
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-700 text-xs uppercase border-b border-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">SKU</th>
                  <th className="px-3 py-2 text-left font-semibold">Attributes</th>
                  <th className="px-3 py-2 text-left font-semibold">Stock</th>
                  <th className="px-3 py-2 text-left font-semibold">Price</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-3 py-4 text-center text-sm text-gray-600">
                      Loading stock...
                    </td>
                  </tr>
                ) : variantMatrix.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-3 py-4 text-center text-sm text-gray-600">
                      No SKU/variant yet.
                    </td>
                  </tr>
                ) : (
                  variantMatrix.map((item) => (
                    <tr key={item.sku} className="border-b border-gray-100">
                      <td className="px-3 py-2 font-semibold text-gray-900">{item.sku}</td>
                      <td className="px-3 py-2 text-gray-700">{item.attrs}</td>
                      <td className="px-3 py-2 text-gray-700">{item.stock}</td>
                      <td className="px-3 py-2 font-semibold text-gray-900">{item.price}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Shop highlight removed */}
    </div>
  );
};

export default Product;
