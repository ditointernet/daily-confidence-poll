import { FirebaseOptions, initializeApp } from "firebase/app";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

if (
  !process.env.REACT_APP_FIREBASE_PROJECT_ID ||
  !process.env.REACT_APP_FIREBASE_MEASUREMENT_ID ||
  !process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID ||
  !process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ||
  !process.env.REACT_APP_FIREBASE_API_KEY ||
  !process.env.REACT_APP_FIREBASE_APP_ID
) {
  throw new Error("unset environment variables: firebaseConfig");
}

const firebaseConfig: FirebaseOptions = {
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

export default function initFirebase() {
  if (!process.env.REACT_APP_FIREBASE_FIRESTORE_EMULATOR_PORT) {
    throw new Error(
      "unset environment variables: FIREBASE_FIRESTORE_EMULATOR_PORT"
    );
  }

  initializeApp(firebaseConfig);

  if (process.env.NODE_ENV === "development") {
    connectFirestoreEmulator(
      getFirestore(),
      "localhost",
      parseInt(process.env.REACT_APP_FIREBASE_FIRESTORE_EMULATOR_PORT)
    );
  }
}
