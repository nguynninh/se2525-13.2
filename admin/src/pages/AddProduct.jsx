import React, { useState } from "react";
import { Link } from "react-router-dom";
import AddProductModal from "../components/AddProductModal";
import EditProductModal from "../components/EditProductModal";

const categories = [
  {
    name: "T-Shirts",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=120&h=120&fit=crop",
    description: "Easy-to-pair tees that match a wide range of looks.",
  },
  {
    name: "Jeans",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=120&h=120&fit=crop",
    description: "Youthful, energetic denim in slim, straight, or baggy fits.",
  },
  {
    name: "Hoodies",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=120&h=120&fit=crop&sat=-40",
    description: "Relaxed hoodies with drawstrings—perfect for cool weather.",
  },
  {
    name: "Vests",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&h=120&fit=crop&sat=-70",
    description: "Lightweight vests designed to layer over shirts or long sleeves.",
  },
];

const AddProduct = () => {
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleDelete = (name) => {
    const ok = window.confirm("Are you sure you want to delete this product?");
    if (!ok) return;
    // TODO: remove item from state when wired to real data
  };

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
            <Link to="/add-category" className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
              Add Category
            </Link>
          </div>
          <button
            onClick={() => setIsAddProductOpen(true)}
            className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600"
          >
            + Add Product
          </button>
        </div>


        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">Search product</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search product..."
              className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-2 text-sm text-gray-800 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>
        </div>
      </div>

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
            {categories.map((category, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-semibold text-gray-900">{category.name}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{category.name}</td>
                <td className="px-4 py-3">
                  <img src={category.image} alt={category.name} className="h-16 w-16 rounded-md object-cover" />
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">-</td>
                <td className="px-4 py-3 text-sm text-gray-700">{category.description}</td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex gap-2">
                    <button
                      className="rounded-lg bg-blue-600 px-3 py-1 text-white shadow-sm transition hover:bg-blue-700"
                      onClick={() =>
                        setEditingProduct({
                          name: category.name,
                          sellingPrice: "",
                          purchasePrice: "",
                          category: category.name.toLowerCase(),
                          description: category.description,
                        })
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="rounded-lg border px-3 py-1 text-red-600 shadow-sm transition hover:bg-gray-100"
                      onClick={() => handleDelete(category.name)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isAddProductOpen && <AddProductModal onClose={() => setIsAddProductOpen(false)} />}
      {editingProduct && <EditProductModal product={editingProduct} onClose={() => setEditingProduct(null)} />}
    </div>
  );
};

export default AddProduct;
