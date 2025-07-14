import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../Authentication/firebase_config';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';


const Profile = () => {
    const { adminData } = useOutletContext();

    // Step 1: Set local editable state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [preview, setPreview] = useState(adminData.imageUrl);
    const [imageFile, setImageFile] = useState(null);

    // Step 2: Fill inputs with admin data when component mounts
    useEffect(() => {
        if (adminData) {
            setName(adminData.name || '');
            setEmail(adminData.email || '');
        }
    }, [adminData]);

    // Step 3: Handle profile update
   const handleSubmit = async (e) => {
  e.preventDefault();

  const userRef = doc(db, 'users', adminData.uid || adminData.id);
  const updatedData = {
    name: name.trim(),
    email: email.trim(),
  };

  try {
    if (imageFile) {
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('upload_preset', 'manzoor_upload'); // replace with your preset name

      const response = await fetch('https://api.cloudinary.com/v1_1/dpygiayf2/image/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.secure_url) {
        updatedData.imageUrl = data.secure_url;
      } else {
        throw new Error('Cloudinary upload failed');
      }
    }

    await updateDoc(userRef, updatedData);
    toast.success("Profile updated successfully!");

  } catch (error) {
    console.error("Error updating profile:", error);
    alert("Something went wrong during profile update.");
  }
};



    return (
        <div className="w-full mx-auto p-6 bg-gray-200 shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">My Profile</h2>

            {/* Profile Picture */}
            <div className="flex items-center space-x-4 mb-6">
                <label htmlFor="profilePic" className="cursor-pointer">
                    <img
                        src={preview}
                        alt="Profile"
                        className="w-20 h-20 rounded-full object-cover border hover:opacity-80 transition"
                    />
                </label>
                <input
                    type="file"
                    id="profilePic"
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                            setImageFile(file);
                            setPreview(URL.createObjectURL(file));
                        }
                    }}
                    className="hidden"
                />
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div className='bg-gray-50 p-5 rounded shadow-md'>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                {/* Email */}
                <div className='bg-gray-50 p-5 rounded shadow-md'>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        readOnly
                        className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                {/* Role (Read-only) */}
                <div className='bg-gray-50 p-5 rounded shadow-md'>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <input
                        type="text"
                        name="role"
                        value={adminData.role}
                        readOnly
                        className="mt-1 w-full p-2 bg-gray-100 border border-gray-300 rounded text-gray-500"
                    />
                </div>

                {/* Save Button */}
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 cursor-pointer"
                >
                    Update Profile
                </button>
            </form>
        </div>
    );
};

export default Profile;
