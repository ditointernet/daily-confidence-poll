import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  collection,
  getFirestore,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { Card, Flex, Status, Text } from "@ditointernet/uai-components";
import { GRID, TYPOGRAPHY } from "@ditointernet/uai-foundation";

import { POLL_BY_ID } from "../constants/routes";
import { useFirebaseAuthUser } from "../containers/AuthProvider";
import { IPoll } from "../constants/types";
import Navbar from "../components/Navbar";
import Container from "../components/Container";
import { mappedStatus } from "../utils/contants";
import Tag from "../components/Tag";
import LoadingCard from "../components/Loading";

const Home = () => {
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
  if (isLoading || !myPolls) return <LoadingCard />;

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
              <Card padding={`${GRID(1)} ${GRID(2)}`}>
                <Flex gap={GRID(1)}>
                  <Tag>{poll.id}</Tag>
                  <Status
                    appearance={mappedStatus[poll.status].appearance}
                    text={mappedStatus[poll.status].text}
                  />
                </Flex>
              </Card>
            </Link>
          ))}
        </Flex>
      </Container>
    </>
  );
};

export default Home;
