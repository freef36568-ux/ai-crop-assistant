import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { isSupported, getAnalytics, Analytics } from 'firebase/analytics';

// Your web app's Firebase configuration (AI Crop Assistant project)
// apiKey/appId here are public client identifiers, not secrets — safe to ship in the frontend.
const firebaseConfig = {
  apiKey: 'AIzaSyAeHEizRWu7kbQguFZRCvDvQH0Cg6pkKtY',
  authDomain: 'crop-wise-project.firebaseapp.com',
  projectId: 'crop-wise-project',
  storageBucket: 'crop-wise-project.firebasestorage.app',
  messagingSenderId: '989932595828',
  appId: '1:989932595828:web:6576f40a02fc9ea3b2ff21',
  measurementId: 'G-TWXPTQNVNS',
};

// Avoid re-initializing on hot reload
export const firebaseApp: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db: Firestore = getFirestore(firebaseApp);

export const isFirebaseConfigured = true;

// Analytics only works in a real browser context that supports it (not SSR, not every test env)
export let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(firebaseApp);
      }
    })
    .catch(() => {
      // Analytics unsupported in this environment (private browsing, blocked script, etc.) — non-fatal.
    });
}
