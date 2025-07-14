
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import { db } from '../Authentication/firebase_config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import JoditEditorComponent from './JoditEditorComponent';
import QuillEditorComponent from './QuillEditorComponent';
import { toast } from 'react-toastify';

const EditPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { categories, adminData } = useOutletContext();

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    image: null,
  });
  const [content, setContent] = useState('');
  const [existingImageUrl, setExistingImageUrl] = useState('');
  const [editorImages, setEditorImages] = useState([]);
  const editorRef = useRef(null); // Ref to access Jodit editor instance

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const docRef = doc(db, "posts", postId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("Data is:", data);

          setFormData({
            title: data.title,
            category: data.category,
            image: null,
          });

          setExistingImageUrl(data.featuredImage || '');

          // Handle image display in content
          let updatedContent = data.content || '';
          const imageUrls = data.imageurl || [];

          // Find all <img> tags
          const imgRegex = /<img[^>]+src=["'](.*?)["'][^>]*>/g;
          const matches = updatedContent.match(imgRegex) || [];

          if (matches.length > 0 && imageUrls.length > 0) {
            let urlIndex = 0;
            updatedContent = updatedContent.replace(imgRegex, (tag) => {
              const cloudImage = imageUrls[urlIndex];
              if (cloudImage) {
                urlIndex++;
                return tag.replace(/src=["'].*?["']/, `src="${cloudImage}"`);
              }
              return tag;
            });
          }

          setContent(updatedContent);
        } else {
          navigate('/admin');
          toast.error("Post not found.");
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        toast.error("Failed to load post.");
      }
    };

    fetchPost();
  }, [postId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));
  };

  // Callback to collect images from JoditEditorComponent
  const handleEditorImages = (imageFile) => {
    console.log('Received editor image:', imageFile); // Debug
    setEditorImages((prev) => [...prev, imageFile]);
  };

  // Upload image to Cloudinary
  const uploadImageToCloudinary = async (imageFile) => {
    try {
      const formDataCloud = new FormData();
      formDataCloud.append("file", imageFile);
      formDataCloud.append("upload_preset", "manzoor_upload");
      formDataCloud.append("cloud_name", "dpygiayf2");

      const res = await fetch("https://api.cloudinary.com/v1_1/dpygiayf2/image/upload", {
        method: "POST",
        body: formDataCloud,
      });

      const data = await res.json();
      if (data.secure_url) {
        return data.secure_url;
      } else {
        throw new Error('Failed to upload image to Cloudinary');
      }
    } catch (err) {
      console.error('Error uploading image to Cloudinary:', err);
      toast.error('Failed to upload image.');
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Upload featured image if provided
      let featuredImageUrl = existingImageUrl;
      if (formData.image) {
        const formDataCloud = new FormData();
        formDataCloud.append("file", formData.image);
        formDataCloud.append("upload_preset", "manzoor_upload");
        formDataCloud.append("cloud_name", "dpygiayf2");

        const res = await fetch("https://api.cloudinary.com/v1_1/dpygiayf2/image/upload", {
          method: "POST",
          body: formDataCloud,
        });

        const data = await res.json();
        featuredImageUrl = data.secure_url;
      }

      // Upload editor images and replace blob URLs
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

      // Replace blob URLs with Cloudinary URLs
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
      console.log('Updated content after replacement:', updatedContent);
      console.log('Editor image URLs:', editorImageUrls);

      // Combine form + content
      const postData = {
        title: formData.title,
        category: formData.category,
        content: updatedContent,
        featuredImage: featuredImageUrl || '',
        imageurl: editorImageUrls,
        updatedAt: new Date(),
        author: adminData.name,
      };
      console.log('Saving postData:', postData);

      // Update Firestore
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, postData);

      // Reset
      setFormData({ title: '', category: '', image: null });
      setContent('');
      setEditorImages([]);

      // Revoke blob URLs
      for (const localUrl of blobToCloudinaryMap.keys()) {
        URL.revokeObjectURL(localUrl);
      }

      toast.success("Post updated successfully!");
      navigate('/admin/posts');
    } catch (err) {
      console.error("❌ Error updating post:", err);
      toast.error("Failed to update post.");
    }
  };

  return (
    <div className="w-full mx-auto p-6 rounded-md shadow-md bg-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Post</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-gray-50 p-5 rounded shadow-md">
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            className="mt-1 w-full p-2 border border-gray-300 rounded"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="bg-gray-50 p-5 rounded shadow-md">
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="bg-gray-50 p-5 rounded shadow-md">
          <label className="block text-sm font-medium text-gray-700">Featured Image</label>
          <input
            type="file"
            accept="image/*"
            name="image"
            onChange={handleImageChange}
            className="mt-2"
          />
          {formData.image ? (
            <img src={URL.createObjectURL(formData.image)} alt="Preview" className="mt-3 w-full max-h-64 object-cover rounded" />
          ) : (
            existingImageUrl && <img src={existingImageUrl} alt="Existing" className="mt-3 w-full max-h-64 object-cover rounded" />
          )}
        </div>

        <div className="bg-gray-50 p-5 rounded shadow-md prose max-w-none">
          <label className="text-sm font-medium text-gray-600 block mb-2">Edit Description</label>
          <JoditEditorComponent
            value={content}
            onChange={setContent}
            onImageSelect={handleEditorImages}
            editorRef={editorRef}
          />

         
          {/* <QuillEditorComponent
            value={content}
            onChange={setContent}
            onImageSelect={handleEditorImages}
            editorRef={editorRef}
          /> */}
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
        >
          Update Post
        </button>
      </form>
    </div>
  );
};

export default EditPost;
