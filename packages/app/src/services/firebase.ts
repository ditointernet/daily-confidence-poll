import { FirebaseOptions, initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

const env = import.meta.env;

if (
  !env.VITE_FIREBASE_PROJECT_ID ||
  !env.VITE_FIREBASE_MEASUREMENT_ID ||
  !env.VITE_FIREBASE_MESSAGING_SENDER_ID ||
  !env.VITE_FIREBASE_AUTH_DOMAIN ||
  !env.VITE_FIREBASE_API_KEY ||
  !env.VITE_FIREBASE_APP_ID
) {
  throw new Error("unset environment variables: firebaseConfig");
}

const firebaseConfig: FirebaseOptions = {
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  apiKey: env.VITE_FIREBASE_API_KEY,
  appId: env.VITE_FIREBASE_APP_ID,
};

export default function initFirebase() {
  initializeApp(firebaseConfig);

  if (import.meta.env.MODE === "production") return;

  if (!env.VITE_FIREBASE_EMULATOR_PORT) {
    throw new Error("unset environment variables: FIRESTORE_EMULATOR_PORT");
  }

  connectFirestoreEmulator(
    getFirestore(),
    "localhost",
    parseInt(env.VITE_FIREBASE_EMULATOR_PORT)
  );

  connectAuthEmulator(getAuth(), "http://localhost:9099");
}
