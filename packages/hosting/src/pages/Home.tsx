// import { useEffect, useState } from "react";
// import { getAuth, onAuthStateChanged, User } from "firebase/auth";

import { getAuth, signOut } from "firebase/auth";
import { useFirebaseAuthUser } from "../containers/AuthProvider";

const Home: React.FC = () => {
  const auth = getAuth();
  // const firestore = getFirestore();
  // const pollsCollection = collection(firestore, "polls");
  const user = useFirebaseAuthUser()!;

  function onCreatePollClick() {
    if (!user) return;

    // return addDoc(pollsCollection, {
    //   ownerId: user.uid,
    //   status: "NOT_STARTED",
    //   hasParticipantVoted: {},
    //   createdAt: serverTimestamp(),
    //   updatedAt: serverTimestamp(),
    // })
    //   .then((poll) => {
    //     const voteRef = doc(pollsCollection, poll.id, "votes", user.uid);

    //     return setDoc(voteRef, {
    //       vote: 3,
    //       createdAt: serverTimestamp(),
    //       updatedAt: serverTimestamp(),
    //     }).then(() => console.log("created"));
    //   })
    //   .catch((err) => console.error(err.code));
  }

  return (
    <>
      <h1>{user.email}</h1>
      <h3>{user.uid}</h3>
      <button onClick={onCreatePollClick}>criar poll</button>
      <button onClick={() => signOut(auth)}>logout</button>
    </>
  );
};

export default Home;
