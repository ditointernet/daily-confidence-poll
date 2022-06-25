import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { addDoc, collection, getFirestore } from "firebase/firestore";

const Home: React.FC = () => {
  const auth = getAuth();
  const firestore = getFirestore();
  const pollsCollection = collection(firestore, "polls");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(auth, (authState) => setUser(authState));
  }, [auth]);

  if (!user) return null;

  function onCreatePollClick() {
    if (!user) return;

    return addDoc(pollsCollection, {
      status: "NOT_STARTED",
      hasParticipantVoted: {
        [user.uid]: false,
      },
    })
      .then((doc) => console.log(doc.id))
      .catch((err) => console.error(err.code));
  }

  return (
    <>
      <h1>{user.email}</h1>
      <h3>{user.uid}</h3>
      <button onClick={onCreatePollClick}>criar poll</button>
    </>
  );
};

export default Home;
