import React from 'react'
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from './firebase_config';

import uploadToCloudinary from '../Authentication/cloudinary/uploadToCloudinary';
import { toast } from 'react-toastify';

const UserSignUp = async (email, password, name, image, role) => {
  try {
    if (!image) throw new Error("Image is required");

    // Upload image to Cloudinary
    const imageUrl = await uploadToCloudinary(image);

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;


    const userData = {
      uid: user.uid,
      email: user.email,
      name,
      role,
      imageUrl,
      createdAt: new Date(),
    };

    // Save user data to Firestore
    await setDoc(doc(db, "users", user.uid), userData);

    toast.success("User registered with Cloudinary image.");

    return { userData, user }; // ✅ Only return plain data
  } catch (error) {
    console.error("Registration error:", error.message);
    toast.error("User already Registered.");
    throw error;
  }

};

export default UserSignUp;
