import React from 'react'
import { signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { auth, db } from './firebase_config';
import { doc, getDoc } from 'firebase/firestore';
import { GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

const provider = new GoogleAuthProvider();


const UserLogin = async (email, password) => {
 
    

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Firestore fetch
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            throw new Error("User data not found in Firestore.");
        }

        const userData = userDoc.data();


        return {
            uid: user.uid,
            email: user.email,
            ...userData  // includes name, role, imageUrl, etc.
        };
        // return full userData if needed
    } catch (error) {
        console.error("Signin error:", error.message);
        throw error;
    }
};

const handleLogout = async (navigate) => {
  try {
    await signOut(auth);
    console.log("User logged out successfully");
    // Optional: redirect to login
    navigate("/login");
  } catch (error) {
    console.error("Logout failed:", error.message);
  }
};




const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        return user;
    } catch (error) {
        console.error("Google Sign-in Error:", error.message);
        throw error;
    }
};




export { UserLogin, signInWithGoogle, handleLogout };
