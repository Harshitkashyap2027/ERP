// ============================================
// UNIBOLT ERP — FIREBASE CONFIGURATION
// ============================================
// NOTE: Replace with your actual Firebase project config.
// Keep these values in environment variables for production.

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase (using compat SDK for HTML/JS)
if (typeof firebase !== 'undefined') {
  if (!firebase.apps || !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
}

// Export references for use in modules
const db = typeof firebase !== 'undefined' ? firebase.firestore() : null;
const auth = typeof firebase !== 'undefined' ? firebase.auth() : null;
const storage = typeof firebase !== 'undefined' ? firebase.storage() : null;
const functions = typeof firebase !== 'undefined' ? firebase.functions() : null;

// Enable Firestore offline persistence
if (db) {
  db.enablePersistence({ synchronizeTabs: true }).catch(err => {
    if (err.code === 'failed-precondition') {
      console.warn('UniBolt: Multiple tabs open — offline persistence disabled.');
    } else if (err.code === 'unimplemented') {
      console.warn('UniBolt: Browser does not support offline persistence.');
    }
  });
}
