import React, { useMemo, useState } from "react";

const initialNotifications = [];

const filters = [
  { label: "All", value: "all" },
  { label: "Unread", value: "unread" },
  { label: "Orders", value: "Orders" },
  { label: "Marketing", value: "Marketing" },
  { label: "System", value: "System" },
];

const typeColors = {
  Orders: "bg-blue-100 text-blue-700",
  Marketing: "bg-amber-100 text-amber-700",
  System: "bg-gray-200 text-gray-700",
};

const Notification = () => {
  const [items, setItems] = useState(initialNotifications);
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");

  const unreadCount = items.filter((n) => n.unread).length;

  const filtered = useMemo(() => {
    return items.filter((n) => {
      const matchFilter =
        activeFilter === "all"
          ? true
          : activeFilter === "unread"
          ? n.unread
          : n.type === activeFilter;
      const matchSearch = `${n.title} ${n.message}`.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [items, activeFilter, search]);

  const markRead = (id) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  };

  const deleteItem = (id) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
  };

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <div className="p-4 lg:p-5 space-y-4 bg-content-bg min-h-screen">
      <div className="rounded-xl bg-white border border-gray-200 p-4 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">You have {unreadCount} unread notifications.</p>
        </div>
        <button
          onClick={markAllRead}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Mark all as read
        </button>
      </div>

      <div className="rounded-xl bg-white border border-gray-200 p-4 shadow-sm space-y-3">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => {
            const active = activeFilter === f.value;
            const count =
              f.value === "all"
                ? items.length
                : f.value === "unread"
                ? unreadCount
                : items.filter((n) => n.type === f.value).length;
            return (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  active ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {f.label}
                <span
                  className={`ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full text-xs font-bold ${
                    active ? "bg-white text-gray-900" : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="w-full md:w-80">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notifications..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white border border-gray-200 shadow-sm">
        {filtered.length === 0 ? (
          <div className="p-6 text-sm text-gray-600">No notifications found.</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filtered.map((n) => (
              <li key={n.id} className="p-4 flex items-start gap-3 hover:bg-gray-50">
                <div className="flex-shrink-0">
                  <span
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-xs font-semibold ${typeColors[n.type] || "bg-gray-100 text-gray-700"}`}
                  >
                    {n.type[0]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900">{n.title}</p>
                      {n.unread && <span className="h-2 w-2 rounded-full bg-rose-500"></span>}
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">{n.time}</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-700">{n.message}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${typeColors[n.type] || "bg-gray-100 text-gray-700"}`}>
                      {n.type}
                    </span>
                    <button
                      onClick={() => markRead(n.id)}
                      className="rounded-lg border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                    >
                      Mark as read
                    </button>
                    <button
                      onClick={() => deleteItem(n.id)}
                      className="rounded-lg border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notification;
