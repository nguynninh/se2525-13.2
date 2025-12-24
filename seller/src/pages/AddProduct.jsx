import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AddProductModal from "../components/AddProductModal";
import EditProductModal from "../components/EditProductModal";
import { extractList } from "../api/client";
import { fetchProducts, fetchCategories, deleteProduct, updateProduct, fetchProductDetail } from "../api/product";

const AddProduct = () => {
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [productData, categoryData] = await Promise.all([fetchProducts(), fetchCategories()]);
      const listProducts = extractList(productData, ["products"]);
      const listCategories = extractList(categoryData, ["categories"]);
      setProducts(listProducts);
      setCategories(listCategories);
    } catch (err) {
      setError(err.message || "Failed to load products.");
      setProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this product?");
    if (!ok) return;
    setError("");
    try {
      await deleteProduct(id);
      await loadData();
    } catch (err) {
      setError(err.message || "Failed to delete product.");
    }
  };

  const handleUpdate = async (payload) => {
    if (!editingProduct) return;
    setError("");
    try {
      await updateProduct(editingProduct.id || editingProduct._id, payload);
      setEditingProduct(null);
      await loadData();
    } catch (err) {
      setError(err.message || "Failed to update product.");
    }
  };

  const handleOpenEdit = async (product) => {
    setError("");
    try {
      const detail = await fetchProductDetail(product.id || product._id);
      setEditingProduct({ ...product, ...detail });
    } catch (err) {
      // fallback to basic product if detail fails
      setEditingProduct(product);
    }
  };

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;
    const keyword = search.trim().toLowerCase();
    return products.filter((p) => p.name?.toLowerCase().includes(keyword));
  }, [products, search]);

  return (
    <div className="p-4">
      <div className="mb-4 rounded-lg bg-white p-4 shadow">
        <div className="mb-4 flex flex-wrap items-center gap-3 justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/product" className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
              Product
            </Link>
            <Link to="/add-product" className="bg-gray-800 text-white px-4 py-2 rounded-lg">
              Add products
            </Link>
          </div>
          <button
            onClick={() => setIsAddProductOpen(true)}
            className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600"
          >
            + Add Product
          </button>
        </div>

        <h2 className="text-xl font-bold mb-4">Add New Product</h2>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">Search product</label>
          <input
            type="text"
            placeholder="Search product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>
      </div>

      {error && (
        <div className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100 bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Category</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Product</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Image</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Stock</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Description</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-sm text-gray-600">
                  Loading...
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-sm text-gray-600">
                  No products available.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id || product._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">{product.category?.name || product.category_name || "N/A"}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{product.name}</td>
                  <td className="px-4 py-3">
                    {product.cover || product.image ? (
                      <img src={product.cover || product.image} alt={product.name} className="h-16 w-16 rounded-md object-cover" />
                    ) : (
                      <div className="h-16 w-16 rounded-md bg-gray-100 grid place-items-center text-xs text-gray-500">No image</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{product.stock ?? product.total_stock ?? "-"}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{product.description || "-"}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <button
                        className="rounded-lg bg-blue-600 px-3 py-1 text-white shadow-sm transition hover:bg-blue-700"
                        onClick={() => handleOpenEdit(product)}
                      >
                        Edit
                      </button>
                      <button
                        className="rounded-lg border px-3 py-1 text-red-600 shadow-sm transition hover:bg-gray-100"
                        onClick={() => handleDelete(product.id || product._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isAddProductOpen && (
        <AddProductModal
          categories={categories}
          onClose={() => setIsAddProductOpen(false)}
          onCreated={loadData}
        />
      )}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={handleUpdate}
          onReload={loadData}
          categories={categories}
        />
      )}
    </div>
  );
};

export default AddProduct;
