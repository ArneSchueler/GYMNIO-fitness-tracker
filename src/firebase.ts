import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBjrM9xQRDkBi7StA7xgp8lv2mVwa0n6Zo",
  authDomain: "gymnio.firebaseapp.com",
  projectId: "gymnio",
  storageBucket: "gymnio.firebasestorage.app",
  messagingSenderId: "563625832949",
  appId: "1:563625832949:web:e6599d34228e5d45a5f0bc",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app;
