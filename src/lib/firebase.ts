import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDTKj-ZFE7sKHJmz_rRZ2XlCM89rGZad_g",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "adnan-1c2a7.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "adnan-1c2a7",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "adnan-1c2a7.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "911759483993",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:911759483993:web:ed44add20d3da3cd89bd48"
};

// Initialize Firebase App singleton safely
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export { app, auth, db, googleProvider };
