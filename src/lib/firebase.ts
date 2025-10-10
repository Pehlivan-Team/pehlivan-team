// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration that you copied
const firebaseConfig = {
  apiKey: "AIzaSyBhHG36_tSDJxvTzNX6LkazVYxu_RmQnYg",
  authDomain: "pehli1team-com.firebaseapp.com",
  projectId: "pehli1team-com",
  storageBucket: "pehli1team-com.firebasestorage.app",
  messagingSenderId: "621698809301",
  appId: "1:621698809301:web:0c2ef7267f9654dc76115c",
  measurementId: "G-DXHG5G31BB",
};

// Initialize Firebase
// Bu kontrol, Next.js'in geliştirme modunda sürekli yeni bir uygulama başlatmasını engeller.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
