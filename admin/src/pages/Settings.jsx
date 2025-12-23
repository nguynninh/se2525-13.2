import React, { useState, useRef } from "react";

const Settings = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "",
  });

  const [preferences, setPreferences] = useState({
    currency: "",
    language: "",
    timezone: "",
  });

  const [notifications, setNotifications] = useState({
    orders: false,
    marketing: false,
    system: false,
    chat: false,
  });
  const avatarInitial = (profile.name || "?").slice(0, 1).toUpperCase();

  const handleProfileChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handlePrefChange = (field, value) => {
    setPreferences((prev) => ({ ...prev, [field]: value }));
  };

  const toggleNotify = (field) => {
    setNotifications((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const fileInputRef = useRef(null);

  const saveAll = () => {
    alert("Settings saved (demo).");
  };

  return (
    <div className="p-4 lg:p-5 space-y-4 bg-content-bg min-h-screen">
      <div className="rounded-xl bg-white border border-gray-200 p-4 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">Manage your account, store preferences, and notifications.</p>
        </div>
        <button
          onClick={saveAll}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800"
        >
          Save changes
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Profile */}
        <div className="lg:col-span-2 rounded-xl bg-white border border-gray-200 p-4 shadow-sm space-y-4">
          <h2 className="text-base font-semibold text-gray-900">Profile</h2>
          <div className="flex flex-col md:flex-row md:items-start gap-4">
            <div className="flex flex-col items-center gap-3">
              {profile.avatar ? (
                <img src={profile.avatar} alt="Avatar" className="h-20 w-20 rounded-full object-cover border border-gray-200" />
              ) : (
                <div className="h-20 w-20 rounded-full border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-xl font-semibold text-gray-500">
                  {avatarInitial}
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = URL.createObjectURL(file);
                    handleProfileChange("avatar", url);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-1 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
              >
                Change avatar
              </button>
            </div>
            <div className="grid gap-3 md:grid-cols-2 flex-1">
              <div>
                <label className="block text-sm font-medium text-gray-800">Full name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => handleProfileChange("name", e.target.value)}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleProfileChange("email", e.target.value)}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800">Phone</label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => handleProfileChange("phone", e.target.value)}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800">Password</label>
                <input
                  type="password"
                  placeholder="********"
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
                <p className="mt-1 text-xs text-gray-500">Leave blank to keep current password.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="rounded-xl bg-white border border-gray-200 p-4 shadow-sm space-y-3">
          <h2 className="text-base font-semibold text-gray-900">Store preferences</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-800">Currency</label>
              <select
                value={preferences.currency}
                onChange={(e) => handlePrefChange("currency", e.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
              >
                <option value="" disabled>
                  Select currency
                </option>
                <option value="USD">USD</option>
                <option value="VND">VND</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800">Language</label>
              <select
                value={preferences.language}
                onChange={(e) => handlePrefChange("language", e.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
              >
                <option value="" disabled>
                  Select language
                </option>
                <option value="English">English</option>
                <option value="Vietnamese">Vietnamese</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800">Timezone</label>
              <input
                type="text"
                value={preferences.timezone}
                onChange={(e) => handlePrefChange("timezone", e.target.value)}
                placeholder="e.g. GMT+7"
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Notifications */}
        <div className="rounded-xl bg-white border border-gray-200 p-4 shadow-sm space-y-3">
          <h2 className="text-base font-semibold text-gray-900">Notifications</h2>
          <div className="space-y-2 text-sm text-gray-800">
            {[
              { key: "orders", label: "Orders & delivery updates" },
              { key: "chat", label: "Customer chat" },
              { key: "marketing", label: "Marketing campaigns" },
              { key: "system", label: "System alerts" },
            ].map((item) => (
              <label key={item.key} className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2">
                <span>{item.label}</span>
                <input
                  type="checkbox"
                  checked={notifications[item.key]}
                  onChange={() => toggleNotify(item.key)}
                  className="h-4 w-4"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Store info */}
        <div className="lg:col-span-2 rounded-xl bg-white border border-gray-200 p-4 shadow-sm space-y-3">
          <h2 className="text-base font-semibold text-gray-900">Store information</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-800">Store name</label>
              <input
                type="text"
                defaultValue=""
                placeholder="Store name"
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800">Contact email</label>
              <input
                type="email"
                defaultValue=""
                placeholder="you@example.com"
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800">Address</label>
              <input
                type="text"
                defaultValue=""
                placeholder="Enter store address"
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800">Return policy link</label>
              <input
                type="text"
                defaultValue=""
                placeholder="https://example.com/policy"
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white border border-gray-200 p-4 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">Danger zone</h2>
        <p className="mt-1 text-sm text-gray-600">Resetting data will remove store information. This is not reversible.</p>
        <button className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-100">
          Reset store data
        </button>
      </div>
    </div>
  );
};

export default Settings;
