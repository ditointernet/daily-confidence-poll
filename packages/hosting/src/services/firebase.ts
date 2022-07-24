import { FirebaseOptions, initializeApp } from "firebase/app";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

const env = process.env;

if (
  !env.REACT_APP_FIREBASE_PROJECT_ID ||
  !env.REACT_APP_FIREBASE_MEASUREMENT_ID ||
  !env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID ||
  !env.REACT_APP_FIREBASE_AUTH_DOMAIN ||
  !env.REACT_APP_FIREBASE_API_KEY ||
  !env.REACT_APP_FIREBASE_APP_ID
) {
  throw new Error("unset environment variables: firebaseConfig");
}

const firebaseConfig: FirebaseOptions = {
  projectId: env.REACT_APP_FIREBASE_PROJECT_ID,
  measurementId: env.REACT_APP_FIREBASE_MEASUREMENT_ID,
  messagingSenderId: env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  authDomain: env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  apiKey: env.REACT_APP_FIREBASE_API_KEY,
  appId: env.REACT_APP_FIREBASE_APP_ID,
};

export default function initFirebase() {
  initializeApp(firebaseConfig);

  if (env.NODE_ENV === "production") return;

  if (!env.REACT_APP_FIREBASE_FIRESTORE_EMULATOR_PORT) {
    throw new Error(
      "unset environment variables: FIREBASE_FIRESTORE_EMULATOR_PORT"
    );
  }

  connectFirestoreEmulator(
    getFirestore(),
    "localhost",
    parseInt(env.REACT_APP_FIREBASE_FIRESTORE_EMULATOR_PORT)
  );
}
