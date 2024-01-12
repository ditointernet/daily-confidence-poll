import { getAuth, signOut } from "firebase/auth";
import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import {
  Button,
  Card,
  Text,
  Flex,
  Badge,
  ButtonAppearance,
} from "@ditointernet/uai-components";
import { TYPOGRAPHY, GRID } from "@ditointernet/uai-foundation";

import { POLL_BY_ID } from "../constants/routes";
import { useFirebaseAuthUser } from "../containers/AuthProvider";

const CreatePoll = () => {
  const user = useFirebaseAuthUser()!;
  const navigate = useNavigate();

  const auth = getAuth();
  const firestore = getFirestore();
  const pollsCollection = collection(firestore, "polls");

  const handleCreatePoll = async () => {
    try {
      await addDoc(pollsCollection, {
        ownerId: user.uid,
        status: "NOT_STARTED",
        hasParticipantVoted: {},
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }).then((poll) => navigate(POLL_BY_ID.replace(":pollId", poll.id)));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignOut = () => {
    signOut(auth);
  };

  return (
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
        <Button onClick={handleCreatePoll} block>
          Criar poll
        </Button>
        <Button
          appearance={ButtonAppearance.secondary}
          onClick={handleSignOut}
          block
        >
          Logout
        </Button>
      </Flex>
    </Card>
  );
};

export default CreatePoll;
