// Firebase Configuration and Initialization
// This file sets up Firebase services for the DMX website
// Required services: Firestore (database), Storage (file uploads), Auth (authentication)

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// Firebase configuration object - uses environment variables for security
// TODO: Replace with actual Firebase project credentials
const firebaseConfig = {
  apiKey: "AIzaSyB-u2JNaS_ghb1TUwqzwh7n75Q4hFwSje0",
  authDomain: "dmx-website-2025.firebaseapp.com",
  databaseURL: "https://dmx-website-2025-default-rtdb.firebaseio.com",
  projectId: "dmx-website-2025",
  storageBucket: "dmx-website-2025.firebasestorage.app",
  messagingSenderId: "463170932849",
  appId: "1:463170932849:web:733c3de416f7deeb394bd0",
  measurementId: "G-969SXPMVT4"
};

// Initialize Firebase app (only once to avoid multiple instances)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Export Firebase services for use throughout the application
export const db = getFirestore(app);       // Firestore database
export const storage = getStorage(app);    // Firebase Storage
export const auth = getAuth(app);          // Firebase Authentication
