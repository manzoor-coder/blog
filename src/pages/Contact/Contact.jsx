import React, { useState } from 'react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent!");
    // Connect to EmailJS or backend here if needed
  };

  return (
    <div className="min-h-screen grid my-10 md:grid-cols-2">
      {/* Left: Contact Info */}
      <div className="bg-black text-white px-10 py-20 flex flex-col justify-center" style={{ backgroundImage: 'url(https://www.shutterstock.com/shutterstock/photos/92236804/display_1500/stock-photo-blue-sky-reflected-in-modern-building-mirror-glass-wall-92236804.jpg)', backgroundSize: 'cover', backgroundBlendMode: 'overlay', backgroundColor: '#000000bb' }}>
        <div className="space-y-10 max-w-md">
          <div>
            <h3 className="text-lg font-semibold text-gray-400">Address</h3>
            <p className="mt-1">Cure Logics Canal Road Rahim Yar Khan</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-400">Let's Talk</h3>
            <p className="mt-1 text-green-400">+92 300 1236879</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-400">General Support</h3>
            <p className="mt-1 text-green-400">contact@example.com</p>
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="bg-white px-10 py-20 flex flex-col justify-center">
        <h2 className="text-3xl font-bold mb-10">Send Us A Message</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First name"
              value={formData.firstName}
              onChange={handleChange}
              className="flex-1 border border-gray-300 px-4 py-2 rounded"
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last name"
              value={formData.lastName}
              onChange={handleChange}
              className="flex-1 border border-gray-300 px-4 py-2 rounded"
              required
            />
          </div>
          <input
            type="email"
            name="email"
            placeholder="Eg. example@email.com"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded"
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Eg. +92 300 000000"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded"
          />
          <textarea
            name="message"
            rows="5"
            placeholder="Write us a message"
            value={formData.message}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded"
            required
          ></textarea>
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition"
          >
            SEND MESSAGE
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
