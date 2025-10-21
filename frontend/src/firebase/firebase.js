// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider, getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA9SFFQDfJ4AzyPTSVfltvf_ZHEv5TKnm0",
  authDomain: "blog-spot-e547b.firebaseapp.com",
  projectId: "blog-spot-e547b",
  storageBucket: "blog-spot-e547b.firebasestorage.app",
  messagingSenderId: "737127426537",
  appId: "1:737127426537:web:292bc4035da37e01dc0378",
  measurementId: "G-VS6SJ9CTSE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
