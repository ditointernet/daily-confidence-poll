import { Link, useMatch, useNavigate } from "react-router-dom";
import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
} from "firebase/firestore";
import styled from "styled-components";

import {
  Button,
  ButtonAppearance,
  Flex,
  Text,
} from "@ditointernet/uai-components";
import { GRID, SHADOWS } from "@ditointernet/uai-foundation";

import { useFirebaseAuthUser } from "../containers/AuthProvider";
import { ROUTES } from "../constants/routes";
import { getAuth, signOut } from "firebase/auth";

const Navbar = () => {
  const user = useFirebaseAuthUser()!;
  const navigate = useNavigate();
  const auth = getAuth();
  const firestore = getFirestore();
  const pollsCollection = collection(firestore, "polls");
  const canCreate = useMatch(ROUTES.HOME);

  const handleCreatePoll = async () => {
    try {
      const poll = await addDoc(pollsCollection, {
        ownerId: user.uid,
        status: "NOT_STARTED",
        hasParticipantVoted: {},
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      navigate(ROUTES.POLL_BY_ID.replace(":pollId", poll.id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogOut = () => {
    signOut(auth);
  };

  return (
    <NavbarTag
      as="nav"
      justifyContent="space-between"
      alignItems="center"
      mb={GRID(4)}
      padding={`${GRID(2)} ${GRID(3)}`}
    >
      <Link to={ROUTES.HOME}>
        <Text>Daily - Confiança</Text>
      </Link>
      <Flex mr={GRID(2)}>
        {canCreate && (
          <Button
            appearance={ButtonAppearance.primary}
            onClick={handleCreatePoll}
          >
            Criar poll
          </Button>
        )}
        <Button appearance={ButtonAppearance.link} onClick={handleLogOut}>
          Sair
        </Button>
      </Flex>
    </NavbarTag>
  );
};

const NavbarTag = styled(Flex)`
  box-shadow: ${SHADOWS.DEFAULT("down")};
`;

export default Navbar;
