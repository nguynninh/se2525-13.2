import React, { useState } from "react";

const initialPrograms = [];

const ProgramFormModal = ({ onClose, onSubmit, initial }) => {
  const [form, setForm] = useState(
    initial || {
      name: "",
      description: "",
      type: "Percentage",
      value: "",
      max: "",
      start: "",
      end: "",
    }
  );

  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name: form.name || "New program",
      type: form.type,
      value: form.value || "-",
      start: form.start || "-",
      end: form.end || "-",
    });
    onClose();
  };

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

        <h2 className="mb-4 text-xl font-semibold text-gray-900">{initial ? "Edit discount program" : "Add discount program"}</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-800">Program name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter program name"
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800">Description</label>
            <textarea
              rows="3"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter program description"
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
            ></textarea>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-800">Discount type</label>
              <select
                value={form.type}
                onChange={(e) => handleChange("type", e.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
              >
                <option value="Percentage">Percentage (%)</option>
                <option value="Fixed amount">Fixed amount</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800">Discount value</label>
              <input
                type="text"
                value={form.value}
                onChange={(e) => handleChange("value", e.target.value)}
                placeholder="e.g. 10 or 50000"
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800">Maximum discount (optional)</label>
            <input
              type="text"
              value={form.max}
              onChange={(e) => handleChange("max", e.target.value)}
              placeholder="e.g. 100000"
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-800">Start date</label>
              <input
                type="date"
                value={form.start}
                onChange={(e) => handleChange("start", e.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800">End date</label>
              <input
                type="date"
                value={form.end}
                onChange={(e) => handleChange("end", e.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
          >
            {initial ? "Update program" : "Create program"}
          </button>
        </form>
      </div>
    </div>
  );
};

const Discount = () => {
  const [programs, setPrograms] = useState(initialPrograms);
  const [modalState, setModalState] = useState({ open: false, editingIndex: null });

  const addProgram = (program) => {
    setPrograms((prev) => [...prev, program]);
  };

  const updateProgram = (program) => {
    setPrograms((prev) => prev.map((p, idx) => (idx === modalState.editingIndex ? program : p)));
  };

  const deleteProgram = (idx) => {
    const ok = window.confirm("Are you sure you want to delete this program?");
    if (!ok) return;
    setPrograms((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="p-4 lg:p-5 space-y-4 bg-content-bg min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">List of all active discount campaigns.</p>
        </div>
        <button
          onClick={() => setModalState({ open: true, editingIndex: null })}
          className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-600"
        >
          + Add program
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white border border-gray-200 shadow-sm">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-600">
            <tr>
              <th className="px-6 py-3">Program name</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Value</th>
              <th className="px-6 py-3">Start date</th>
              <th className="px-6 py-3">End date</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {programs.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-6 text-center text-sm text-gray-600">
                  No discount programs available.
                </td>
              </tr>
            ) : (
              programs.map((p, idx) => (
                <tr key={`${p.name}-${idx}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-gray-900">{p.name}</td>
                  <td className="px-6 py-4 text-gray-700">{p.type}</td>
                  <td className="px-6 py-4 text-gray-700">{p.value}</td>
                  <td className="px-6 py-4 text-gray-700">{p.start}</td>
                  <td className="px-6 py-4 text-gray-700">{p.end}</td>
                  <td className="px-6 py-4 text-gray-700">
                    <div className="flex gap-2">
                      <button
                        className="rounded-lg bg-blue-600 px-3 py-1 text-white shadow-sm transition hover:bg-blue-700"
                        onClick={() => setModalState({ open: true, editingIndex: idx })}
                      >
                        Edit
                      </button>
                      <button
                        className="rounded-lg border px-3 py-1 text-red-600 shadow-sm transition hover:bg-gray-100"
                        onClick={() => deleteProgram(idx)}
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

      {modalState.open && (
        <ProgramFormModal
          onClose={() => setModalState({ open: false, editingIndex: null })}
          onSubmit={modalState.editingIndex === null ? addProgram : updateProgram}
          initial={modalState.editingIndex === null ? null : programs[modalState.editingIndex]}
        />
      )}
    </div>
  );
};

export default Discount;
