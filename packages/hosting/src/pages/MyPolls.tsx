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

import { POLL_BY_ID } from "../constants/routes";
import { useFirebaseAuthUser } from "../containers/AuthProvider";
import { IPoll } from "../constants/types";
import Navbar from "../components/Navbar";
import Container from "../components/Container";
import { Card, Flex, Status, Text } from "@ditointernet/uai-components";
import { GRID, TYPOGRAPHY } from "@ditointernet/uai-foundation";
import styled from "styled-components";
import { mappedStatus } from "../utils/contants";
import Tag from "../components/Tag";

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
      <Navbar />
      <Container>
        <Text
          size={TYPOGRAPHY.FontSize.H1}
          weight={TYPOGRAPHY.FontWeight.SEMI_BOLD}
        >
          Minhas polls
        </Text>
        <Flex flexDirection="column" py={GRID(3)} gap={GRID(1)}>
          {myPolls.map((poll) => (
            <Link key={poll.id} to={POLL_BY_ID.replace(":pollId", poll.id)}>
              <AnimatedCard padding={`${GRID(1)} ${GRID(2)}`}>
                <Flex gap={GRID(1)}>
                  <Tag>{poll.id}</Tag>
                  <Status
                    appearance={mappedStatus[poll.status].appearance}
                    text={mappedStatus[poll.status].text}
                  />
                </Flex>

                {formatRelative(poll.createdAt.toDate(), new Date(), {
                  locale: ptBR,
                })}
              </AnimatedCard>
            </Link>
          ))}
        </Flex>
      </Container>
    </>
  );
};

const AnimatedCard = styled(Card)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: transform 250ms;

  &:hover {
    transform: scale(1.05);
  }
`;

export default MyPolls;
