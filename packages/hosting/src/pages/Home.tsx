import { getAuth, signOut } from "firebase/auth";
import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import { POLL_BY_ID } from "../constants/routes";
import { useFirebaseAuthUser } from "../containers/AuthProvider";

const Home: React.FC = () => {
  const user = useFirebaseAuthUser()!;
  const navigate = useNavigate();

  const auth = getAuth();
  const firestore = getFirestore();
  const pollsCollection = collection(firestore, "polls");

  function onCreatePollClick() {
    return addDoc(pollsCollection, {
      ownerId: user.uid,
      status: "NOT_STARTED",
      hasParticipantVoted: {},
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
      .then((poll) => navigate(POLL_BY_ID.replace(":pollId", poll.id)))
      .catch((err) => console.error(err.code));
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
