import React, { useMemo, useState } from "react";

const guessCategoryType = (value) => {
  if (!value) return "other";
  const v = value.toLowerCase();
  if (["t-shirt", "shirt", "hoodie", "jean", "pant", "dress", "clothing", "fashion"].some((k) => v.includes(k))) {
    return "clothing";
  }
  if (["phone", "case", "iphone", "samsung", "pixel", "accessory"].some((k) => v.includes(k))) {
    return "phone";
  }
  return "other";
};

const EditProductModal = ({ product, onClose }) => {
  const [activeTab, setActiveTab] = useState("details");
  const [category, setCategory] = useState(product?.category || "tshirts");
  const categoryType = useMemo(() => guessCategoryType(category), [category]);

  const [variants, setVariants] = useState([
    { size: "S", color: "Black", stock: 10 },
  ]);

  const [deviceCompat, setDeviceCompat] = useState({ brand: "", model: "", stock: "" });
  const [customAttrs, setCustomAttrs] = useState([{ key: "", value: "" }]);

  const addVariant = () => setVariants((prev) => [...prev, { size: "", color: "", stock: "" }]);
  const updateVariant = (idx, field, value) => {
    setVariants((prev) => prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row)));
  };
  const removeVariant = (idx) => setVariants((prev) => prev.filter((_, i) => i !== idx));

  const updateAttr = (idx, field, value) => {
    setCustomAttrs((prev) => prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row)));
  };
  const addAttr = () => setCustomAttrs((prev) => [...prev, { key: "", value: "" }]);
  const removeAttr = (idx) => setCustomAttrs((prev) => prev.filter((_, i) => i !== idx));

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/60 px-4 py-8 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-xl bg-white px-6 py-6 shadow-2xl sm:px-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 transition hover:text-gray-600 focus:outline-none"
          aria-label="Close"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <h2 className="mb-4 text-xl font-semibold text-gray-900">Edit Product</h2>

        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setActiveTab("details")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold border ${
              activeTab === "details" ? "bg-gray-800 text-white border-gray-800" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab("images")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold border ${
              activeTab === "images" ? "bg-gray-800 text-white border-gray-800" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            Images
          </button>
        </div>

        {activeTab === "images" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-800">Add product images</label>
              <input
                type="file"
                multiple
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
              <p className="mt-1 text-xs text-gray-500">JPEG/PNG, &lt; 5MB. You can set a cover image after upload.</p>
            </div>
            <div className="flex justify-end gap-2">
              <button className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">
                Upload
              </button>
              <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50" onClick={onClose}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {activeTab === "details" && (
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-800">Product name</label>
                <input
                  type="text"
                  defaultValue={product.name}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800">Selling price</label>
                <input
                  type="number"
                  defaultValue={product.sellingPrice || ""}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800">Purchase price</label>
                <input
                  type="number"
                  defaultValue={product.purchasePrice || ""}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800">Product category</label>
                <select
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select category</option>
                  <option value="tshirts">T-Shirts</option>
                  <option value="jeans">Jeans</option>
                  <option value="hoodies">Hoodies</option>
                  <option value="vests">Vests</option>
                  <option value="phone-case">Phone Case</option>
                </select>
              </div>
            </div>

            {categoryType === "clothing" && (
              <div className="space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-800">Variations (Size / Color / Stock)</p>
                  <button type="button" className="text-sm font-semibold text-blue-600 hover:underline" onClick={addVariant}>
                    + Add variant
                  </button>
                </div>
                <div className="space-y-2">
                  {variants.map((variant, idx) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-7 gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Size"
                        value={variant.size}
                        onChange={(e) => updateVariant(idx, "size", e.target.value)}
                        className="md:col-span-2 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
                      />
                      <input
                        type="text"
                        placeholder="Color"
                        value={variant.color}
                        onChange={(e) => updateVariant(idx, "color", e.target.value)}
                        className="md:col-span-2 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
                      />
                      <input
                        type="number"
                        placeholder="Stock"
                        value={variant.stock}
                        onChange={(e) => updateVariant(idx, "stock", e.target.value)}
                        className="md:col-span-2 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
                      />
                      <button
                        type="button"
                        onClick={() => removeVariant(idx)}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {categoryType === "phone" && (
              <div className="space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                <p className="text-sm font-semibold text-gray-800">Compatibility / Model</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Brand / Series (e.g., iPhone, Samsung S)"
                    value={deviceCompat.brand}
                    onChange={(e) => setDeviceCompat({ ...deviceCompat, brand: e.target.value })}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Model (e.g., iPhone 14 / Galaxy S23)"
                    value={deviceCompat.model}
                    onChange={(e) => setDeviceCompat({ ...deviceCompat, model: e.target.value })}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
                  />
                  <input
                    type="number"
                    placeholder="Stock"
                    value={deviceCompat.stock}
                    onChange={(e) => setDeviceCompat({ ...deviceCompat, stock: e.target.value })}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-800">Additional attributes (optional)</p>
                <button type="button" className="text-sm font-semibold text-blue-600 hover:underline" onClick={addAttr}>
                  + Add attribute
                </button>
              </div>
              <div className="space-y-2">
                {customAttrs.map((attr, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Attribute name"
                      value={attr.key}
                      onChange={(e) => updateAttr(idx, "key", e.target.value)}
                      className="md:col-span-2 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
                    />
                    <input
                      type="text"
                      placeholder="Attribute value"
                      value={attr.value}
                      onChange={(e) => updateAttr(idx, "value", e.target.value)}
                      className="md:col-span-2 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => removeAttr(idx)}
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
            >
              Update
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditProductModal;
