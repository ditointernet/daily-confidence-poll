import { useMemo } from "react";
import { ptBR } from "date-fns/locale";
import { formatRelative } from "date-fns";
import { Link } from "react-router-dom";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  collection,
  getFirestore,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { HOME, POLL_BY_ID } from "../constants/routes";
import { useFirebaseAuthUser } from "../containers/AuthProvider";
import { IPoll } from "../constants/types";

const MyPolls: React.FC = () => {
  const user = useFirebaseAuthUser()!;
  const firestore = getFirestore();
  const pollsCollection = collection(firestore, "polls");

  const [myPollsSnapshot, isLoading, didError] = useCollection(
    query(
      pollsCollection,
      where("ownerId", "==", user.uid),
      orderBy("createdAt", "desc")
    )
  );

  const myPolls = useMemo(
    () =>
      myPollsSnapshot?.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as IPoll & { id: string })
      ) ?? [],
    [myPollsSnapshot]
  );

  if (didError) return <>Error</>;
  if (isLoading || !myPolls) return <>Loading</>;

  return (
    <>
      <Link to={HOME}>voltar pra home</Link>
      <h1>my polls</h1>
      {myPolls.map((poll) => (
        <Link key={poll.id} to={POLL_BY_ID.replace(":pollId", poll.id)}>
          <p>
            {poll.status} - {poll.id} -{" "}
            {formatRelative(poll.createdAt.toDate(), new Date(), {
              locale: ptBR,
            })}
          </p>
        </Link>
      ))}
    </>
  );
};

export default MyPolls;
