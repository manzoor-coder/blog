import React, { useState, useRef } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import JoditEditorComponent from './JoditEditorComponent';
import { db } from '../Authentication/firebase_config';
import { collection, addDoc } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import QuillEditorComponent from './QuillEditorComponent';

const NewPost = () => {
  const { categories, adminData } = useOutletContext();
  const [content, setContent] = useState('');
  const [editorImages, setEditorImages] = useState([]);
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    image: null,
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle featured image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));
  };

  // Callback to collect images from JoditEditorComponent
  const handleEditorImages = (imageFile) => {
    console.log('Received editor image:', imageFile); // Debug
    setEditorImages((prev) => [...prev, imageFile]);
  };

  // Upload image to Cloudinary and store metadata in Firestore
  const uploadImageToCloudinary = async (file) => {
    if (!file) return null;
    const formDataCloud = new FormData();
    formDataCloud.append('file', file);
    formDataCloud.append('upload_preset', 'manzoor_upload');
    formDataCloud.append('cloud_name', 'dpygiayf2');

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/dpygiayf2/image/upload', {
        method: 'POST',
        body: formDataCloud,
      });

      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      console.log('Uploaded to Cloudinary:', data.secure_url); // Debug

      // Store metadata in Firestore
      await addDoc(collection(db, 'uploaded_images'), {
        url: data.secure_url,
        public_id: data.public_id,
        original_filename: data.original_filename,
        format: data.format,
        created_at: data.created_at,
        uploadedAt: new Date(),
      });

      return data.secure_url;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Upload featured image
      let featuredImageUrl = '';
      if (formData.image) {
        featuredImageUrl = await uploadImageToCloudinary(formData.image);
      }

      // Upload editor images and update content
      let updatedContent = content || '';
      const editorImageUrls = [];
      const blobToCloudinaryMap = new Map();

      for (const imageFile of editorImages) {
        const cloudinaryUrl = await uploadImageToCloudinary(imageFile);
        if (cloudinaryUrl) {
          const localUrl = URL.createObjectURL(imageFile);
          blobToCloudinaryMap.set(localUrl, cloudinaryUrl);
          editorImageUrls.push(cloudinaryUrl);
          console.log(`Mapped ${localUrl} to ${cloudinaryUrl}`); // Debug
        }
      }

      // Ensure content contains blob URLs before replacement
      console.log('Content before replacement:', updatedContent); // Debug
      if (!updatedContent) {
        console.warn('Content is empty, no replacement performed');
      }

      // Replace all blob URLs with Cloudinary URLs
      let replacementsMade = 0;
      for (const [localUrl, cloudinaryUrl] of blobToCloudinaryMap) {
        const regex = new RegExp(localUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        const originalContent = updatedContent;
        updatedContent = updatedContent.replace(regex, cloudinaryUrl);
        if (originalContent !== updatedContent) {
          replacementsMade++;
          console.log(`Replaced ${localUrl} with ${cloudinaryUrl}`);
        } else {
          console.warn(`No replacement for ${localUrl} in content`);
        }
      }
      console.log(`Total replacements made: ${replacementsMade}`);
      console.log('Updated content after replacement:', updatedContent); // Debug
      console.log('Editor image URLs:', editorImageUrls); // Debug

      // Combine form + content
      const postData = {
        title: formData.title,
        category: formData.category,
        content: updatedContent,
        featuredImage: featuredImageUrl || '',
        imageurl: editorImageUrls,
        createdAt: new Date(),
        author: adminData.name,
      };
      console.log('Saving postData:', postData); // Debug

      // Store in Firestore
      const docRef = await addDoc(collection(db, 'posts'), postData);
      console.log('Post saved with ID:', docRef.id); // Debug
      toast.success('Post published successfully!');
      navigate('/admin/posts');

      // Reset
      setFormData({ title: '', category: '', image: null });
      setContent('');
      setEditorImages([]);

      // Revoke blob URLs to prevent memory leaks
      for (const localUrl of blobToCloudinaryMap.keys()) {
        URL.revokeObjectURL(localUrl);
      }
    } catch (err) {
      console.error('❌ Error:', err);
      toast.error('Failed to publish post.');
    }
  };

  return (
    <div className="w-full mx-auto p-6 rounded-md shadow-md bg-gray-100">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Post</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div className="bg-gray-50 p-5 rounded shadow-md">
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            autoComplete="off"
            className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Category */}
        <div className="bg-gray-50 p-5 rounded shadow-md">
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Featured Image */}
        <div className="bg-gray-50 p-5 rounded shadow-md">
          <label className="block text-sm font-medium text-gray-700">Featured Image</label>
          <input
            type="file"
            accept="image/*"
            name="image"
            id="image"
            autoComplete="off"
            onChange={handleImageChange}
            className="mt-2"
          />
          {formData.image && (
            <img
              src={URL.createObjectURL(formData.image)}
              alt="Preview"
              className="mt-3 w-full max-h-64 object-cover rounded"
            />
          )}
        </div>

        {/* Jodit Editor */}
        <div className="bg-gray-50 p-5 rounded shadow-md prose max-w-none">
          <label className="text-sm font-medium text-gray-600 block mb-2">
            Add Description
          </label>
          <div className="prose max-w-none">
            <JoditEditorComponent
              value={content}
              onChange={(newContent) => {
                console.log('Jodit content updated:', newContent); // Debug
                setContent(newContent);
              }}
              onImageSelect={handleEditorImages}
            />

            
            {/* <QuillEditorComponent
              value={content}
              onChange={setContent}
              onImageSelect={handleEditorImages}
              editorRef={editorRef}
            /> */}
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 cursor-pointer rounded hover:bg-blue-700"
        >
          Publish Post
        </button>
      </form>
    </div>
  );
};

export default NewPost;