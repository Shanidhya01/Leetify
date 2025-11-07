import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Basic runtime validation to surface config mistakes early
const missing = Object.entries(firebaseConfig)
  .filter(([_, v]) => !v)
  .map(([k]) => k);
if (missing.length) {
  console.warn(
    `[Firebase] Missing config values: ${missing.join(', ')}. Check .env and restart Vite.`
  );
}

let app;
try {
  app = initializeApp(firebaseConfig);
} catch (e) {
  console.error('[Firebase] Initialization failed:', e);
  throw e;
}

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };
