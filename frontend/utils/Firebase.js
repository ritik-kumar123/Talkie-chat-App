import {getAuth, GoogleAuthProvider} from "firebase/auth"
import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "loginvirtualcourses-a00c2.firebaseapp.com",
  projectId: "loginvirtualcourses-a00c2",
  storageBucket: "loginvirtualcourses-a00c2.firebasestorage.app",
  messagingSenderId: "1025671013047",
  appId: "1:1025671013047:web:92b49ea2b2d44c8478e332",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()
export {auth,provider}