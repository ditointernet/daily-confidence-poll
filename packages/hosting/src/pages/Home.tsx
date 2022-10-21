import { Button, Card, Text, Flex, Badge } from "@ditointernet/uai-components";
import { TYPOGRAPHY, GRID } from "@ditointernet/uai-foundation";
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
    <Flex justifyContent="center" alignItems="center" height="100%">
      <Card
        padding={GRID(2)}
        style={{ flexDirection: "column", maxWidth: "320px", width: "100%" }}
      >
        <Text>
          <b>Usuário:</b> {user.email}
        </Text>
        <Flex mt={GRID(1)}>
          <Text weight={TYPOGRAPHY.FontWeight.SEMI_BOLD}>Sala: </Text>
          <Badge statusText={user.uid} />
        </Flex>
        <Flex flexDirection="column" gap={GRID(1)} mt={GRID(3)}>
          <Button onClick={onCreatePollClick} style={{ width: "100%" }}>
            Criar poll
          </Button>
          <Button onClick={() => signOut(auth)} style={{ width: "100%" }}>
            Logout
          </Button>
        </Flex>
      </Card>
    </Flex>
  );
};

export default Home;
