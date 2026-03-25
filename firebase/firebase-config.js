// ============================================
// UNIBOLT ERP — FIREBASE CONFIGURATION
// Copy this file to assets/js/firebase.js and
// replace placeholder values with your actual
// Firebase project config.
// ============================================

// HOW TO GET YOUR CONFIG:
// 1. Go to console.firebase.google.com
// 2. Create a new project (or select existing)
// 3. Go to Project Settings > Your Apps > Web App
// 4. Copy the firebaseConfig object below

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
if (typeof firebase !== 'undefined') {
  if (!firebase.apps || !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
}

const db = typeof firebase !== 'undefined' ? firebase.firestore() : null;
const auth = typeof firebase !== 'undefined' ? firebase.auth() : null;
const storage = typeof firebase !== 'undefined' ? firebase.storage() : null;
const functions = typeof firebase !== 'undefined' ? firebase.functions() : null;
