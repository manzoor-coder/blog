import React, { useState } from 'react';

const Settings = () => {
  const [settings, setSettings] = useState({
    siteTitle: 'My Blog',
    description: 'Welcome to my blog!',
    adminEmail: 'admin@blog.com',
    theme: 'light',
    commentsEnabled: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Saved settings:', settings);
    // Send to backend or save in database
  };

  return (
    <div className="w-full mx-auto p-6 bg-gray-200 shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Site Settings</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Site Title */}
        <div className=' bg-gray-50 p-5 rounded shadow-md'>
          <label className="block text-sm font-medium text-gray-700">Site Title</label>
          <input
            type="text"
            name="siteTitle"
            className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={settings.siteTitle}
            onChange={handleChange}
          />
        </div>

        {/* Description */}
        <div className=' bg-gray-50 p-5 rounded shadow-md'>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            rows="3"
            className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={settings.description}
            onChange={handleChange}
          />
        </div>

        {/* Admin Email */}
        <div className=' bg-gray-50 p-5 rounded shadow-md'>
          <label className="block text-sm font-medium text-gray-700">Admin Email</label>
          <input
            type="email"
            name="adminEmail"
            className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={settings.adminEmail}
            onChange={handleChange}
          />
        </div>

        {/* Theme Option */}
        <div className='bg-white bg-gray-50 p-5 rounded shadow-md '>
          <label className="block text-sm font-medium text-gray-700">Theme</label>
          <select
            name="theme"
            className="mt-1 w-full p-2 border border-gray-300 rounded"
            value={settings.theme}
            onChange={handleChange}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        {/* Toggle Comments */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="commentsEnabled"
            checked={settings.commentsEnabled}
            onChange={handleChange}
          />
          <label className="text-sm font-medium text-gray-700">Enable Comments</label>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
};

export default Settings;
