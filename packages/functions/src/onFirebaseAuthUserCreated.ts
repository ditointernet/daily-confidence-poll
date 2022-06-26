import { firestore } from "firebase-admin";
import * as functions from "firebase-functions";

const db = firestore();
const usersCollection = db.collection("users");

const allowedDomainsRegex = /^.*@(dito\.com\.br|uriell\.dev)$/;

export default functions
  .region("southamerica-east1")
  .auth.user()
  .beforeCreate(async function onFirebaseAuthUserCreated(user) {
    const googleProvider = user.providerData.find(
      (provider) => provider.providerId === "google.com"
    );

    if (!googleProvider || !allowedDomainsRegex.test(user.email ?? "")) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Unauthorized access."
      );
    }

    await usersCollection.doc(user.uid).set({
      displayName: user.displayName,
      photoUrl: user.photoURL,
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
  });
