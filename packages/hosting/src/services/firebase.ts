import { initializeApp } from "firebase/app";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

if (
  !process.env.FIREBASE_PROJECT_ID ||
  !process.env.FIREBASE_MEASUREMENT_ID ||
  !process.env.FIREBASE_MESSAGING_SENDER_ID ||
  !process.env.FIREBASE_API_KEY ||
  !process.env.FIREBASE_APP_ID
) {
  throw new Error("unset environment variables");
}

const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  apiKey: process.env.FIREBASE_API_KEY,
  appId: process.env.FIREBASE_APP_ID,
};

export default function initFirebase() {
  if (!process.env.FIREBASE_FIRESTORE_EMULATOR_PORT) {
    throw new Error("unset environment variables");
  }

  if (process.env.NODE_ENV === "development") {
    connectFirestoreEmulator(
      getFirestore(),
      "localhost",
      parseInt(process.env.FIREBASE_FIRESTORE_EMULATOR_PORT)
    );
  }

  return initializeApp(firebaseConfig);
}
