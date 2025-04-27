// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "note-app-ntu.firebaseapp.com",
  projectId: "note-app-ntu",
  storageBucket: "note-app-ntu.firebasestorage.app",
  messagingSenderId: "19695143315",
  appId: "1:19695143315:web:51dee2cede1ea7b71b4066"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Authentication
const auth = getAuth(app);

// 導出認證狀態監聽函數
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export { db, auth };