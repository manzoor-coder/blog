// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";



const provider = new GoogleAuthProvider();

const firebaseConfig = {
  apiKey: "AIzaSyDDxw3sXA7AwGfJ_KuJLsVzIKw936XVIUE",
  authDomain: "blog-c5c88.firebaseapp.com",
  projectId: "blog-c5c88",
  storageBucket: "blog-c5c88.firebasestorage.app",
  messagingSenderId: "59685667796",
  appId: "1:59685667796:web:0938b519c85d387c7c0c41",
  measurementId: "G-HTL09QG2Z7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

export { app, auth, storage, db, provider };