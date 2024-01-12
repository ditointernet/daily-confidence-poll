import {
  collection,
  deleteField,
  doc,
  documentId,
  getDocsFromServer,
  getFirestore,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useParams } from "react-router-dom";
import { useDocumentData } from "react-firebase-hooks/firestore";

import { ptBR } from "date-fns/locale";
import { format } from "date-fns";

import React, { useEffect, useState } from "react";
import {
  Button,
  ButtonAppearance,
  Card,
  Col,
  Divider,
  Flex,
  ScopeButton,
  Status,
  Text,
} from "@ditointernet/uai-components";
import { COLORS, GRID, TYPOGRAPHY } from "@ditointernet/uai-foundation";

import { useFirebaseAuthUser } from "../containers/AuthProvider";
import {
  IPoll,
  IUser,
  IVote,
  PollStatuses,
  VoteRange,
} from "../constants/types";
import Participant from "../components/Participant";
import Container from "../components/Container";
import Navbar from "../components/Navbar";
import { mappedStatus } from "../utils/contants";
import Tag from "../components/Tag";
import LoadingCard from "../components/Loading";

const Poll: React.FC = () => {
  const date = new Date();
  const { pollId } = useParams<Record<"pollId", string>>();
  const currentWeek = format(date, "EEEE", { locale: ptBR });

  const firestore = getFirestore();
  const pollsCollection = collection(firestore, "polls");
  const pollDocumentRef = doc(pollsCollection, pollId);

  const [pollDocument, isLoading, didError] = useDocumentData(pollDocumentRef);
  const poll = pollDocument as IPoll | undefined;

  const [_users, setUsers] = useState<
    Record<number, Array<IUser & { id: string }>>
  >([]);
  const [votes, setVotes] = useState<Record<string, VoteRange>>({});
  const [confidenceValue, setConfidenceValue] = useState("");
  const users = Object.values(_users).flat();
  const currentSnapshots = Object.keys(_users).length;

  const user = useFirebaseAuthUser()!;

  if (didError) console.error(didError);

  useEffect(() => {
    const participantIds = Object.keys(poll?.hasParticipantVoted ?? {});

    if (!participantIds.length) return setUsers([]);

    const partitionedIds = partitionBy(participantIds, 10);
    const desiredSnapshots = partitionedIds.length;

    if (desiredSnapshots < currentSnapshots) {
      setUsers((state) => {
        const newState = { ...state };

        for (
          let i = desiredSnapshots;
          i <= currentSnapshots - desiredSnapshots;
          i++
        ) {
          delete newState[i];
        }

        return newState;
      });
    }

    const unsubscribeFns = partitionedIds.map((partition, index) =>
      onSnapshot(
        query(
          collection(firestore, "users"),
          where(documentId(), "in", partition)
        ),
        (snapshot) =>
          setUsers((state) => ({
            ...state,
            [index]: snapshot.docs.map((user) => ({
              id: user.id,
              ...(user.data() as IUser),
            })),
          })),
        (err) => console.error(err.code)
      )
    );

    return () => unsubscribeFns.forEach((unsubscribeFn) => unsubscribeFn());
  }, [firestore, poll?.hasParticipantVoted, currentSnapshots]);

  useEffect(() => {
    if (poll?.status === PollStatuses.FINISHED) {
      getDocsFromServer(
        query(collection(firestore, "polls", pollId ?? "", "votes"))
      )
        .then((snapshot) =>
          setVotes(
            snapshot.docs.reduce(
              (acc, vote) => ({
                ...acc,
                [vote.id]: (vote.data() as IVote).vote,
              }),
              {}
            )
          )
        )
        .catch((err) => console.error(err.code));
    } else {
      setVotes({});
    }
  }, [firestore, poll?.status, pollId]);

  if (didError) return <>Error</>;
  if (isLoading || !poll) return <LoadingCard />;

  function onJoinPollClick() {
    updateDoc(pollDocumentRef, {
      [`hasParticipantVoted.${user.uid}`]: false,
      updatedAt: serverTimestamp(),
    }).catch((err) => console.error(err.code));
  }

  function onLeavePollClick() {
    updateDoc(pollDocumentRef, {
      [`hasParticipantVoted.${user.uid}`]: deleteField(),
      updatedAt: serverTimestamp(),
    }).catch((err) => console.error(err.code));
  }

  function onAdvancePollClick() {
    if (!poll || poll.status === PollStatuses.FINISHED) return;

    updateDoc(pollDocumentRef, {
      status:
        poll.status === PollStatuses.NOT_STARTED
          ? PollStatuses.VOTING_IN_PROGRESS
          : PollStatuses.FINISHED,
      updatedAt: serverTimestamp(),
    }).catch((err) => console.error(err.code));
  }

  function onVotePollClick() {
    const vote = parseInt(confidenceValue) ?? 1;

    const voteRef = doc(pollsCollection, pollId, "votes", user.uid);

    setDoc(voteRef, {
      vote,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }).catch((err) => console.error(err.code));
  }

  const isCurrentUserParticipating = user.uid in poll.hasParticipantVoted;
  const isPollOwner = user.uid === poll.ownerId;
  const pollOwnerHasVoted = poll.hasParticipantVoted[user.uid];

  const participants = users.length
    ? users.map(({ id, displayName, photoUrl }) => ({
        participantId: id,
        displayName,
        photoUrl,
        hasVoted: poll.hasParticipantVoted[id],
        vote: votes[id],
      }))
    : Object.entries(poll.hasParticipantVoted).map(
        ([participantId, hasVoted]) => ({
          participantId,
          hasVoted,
          vote: votes[participantId],
        })
      );

  const items = [
    {
      key: "1",
      label: `😨 Baixa`,
      disabled: pollOwnerHasVoted && confidenceValue !== "1",
    },
    {
      key: "2",
      label: "🤨 Média",
      disabled: pollOwnerHasVoted && confidenceValue !== "2",
    },
    {
      key: "3",
      label: "😎 Alta",
      disabled: pollOwnerHasVoted && confidenceValue !== "3",
    },
  ];

  return (
    <>
      <Navbar />
      <Container>
        <Flex justifyContent="space-between" alignItems="center">
          <Flex flexDirection="column">
            <Text mb={GRID(1)} size={TYPOGRAPHY.FontSize.LARGE}>
              Daily da <b>{currentWeek}</b>
            </Text>
            <Flex gap={GRID(1)}>
              <Tag>ID: {pollId}</Tag>
              <Status
                appearance={mappedStatus[poll.status].appearance}
                text={mappedStatus[poll.status].text}
              />
            </Flex>
          </Flex>
          <Flex gap={GRID(1)}>
            {poll.status === PollStatuses.NOT_STARTED && (
              <>
                {!isCurrentUserParticipating ? (
                  <Button
                    appearance={ButtonAppearance.secondary}
                    onClick={onJoinPollClick}
                  >
                    Entrar na poll
                  </Button>
                ) : (
                  <Button
                    appearance={ButtonAppearance.secondary}
                    onClick={onLeavePollClick}
                  >
                    Sair da poll
                  </Button>
                )}
              </>
            )}
            {isPollOwner &&
              poll.status !== PollStatuses.FINISHED &&
              !!participants.length && (
                <Button onClick={onAdvancePollClick}>
                  {poll.status === PollStatuses.NOT_STARTED
                    ? "Iniciar poll"
                    : "Finalizar poll"}
                </Button>
              )}
          </Flex>
        </Flex>

        <Divider />

        {isCurrentUserParticipating &&
          poll.status === PollStatuses.VOTING_IN_PROGRESS && (
            <Flex
              flexDirection="column"
              m={`${GRID(3)} 0 `}
              alignItems="center"
            >
              <Text color={COLORS.GRAY_5} mb={GRID(0.5)}>
                Minha confiança na aposta?
              </Text>
              <ScopeButton
                items={items}
                onChange={(item) => {
                  setConfidenceValue(item.key);
                }}
                value={confidenceValue}
              />
              <Flex mt={GRID(2)}>
                <Button
                  large
                  onClick={onVotePollClick}
                  disabled={!confidenceValue || pollOwnerHasVoted}
                >
                  Votar
                </Button>
              </Flex>
            </Flex>
          )}
        <Flex flexDirection="column" mb={GRID(2)}>
          <Text color={COLORS.GRAY_7} weight={TYPOGRAPHY.FontWeight.SEMI_BOLD}>
            Participantes
          </Text>
          <Text size={TYPOGRAPHY.FontSize.OVERLINE} color={COLORS.GRAY_5}>
            TOTAL: <b>{participants.length}</b> / VOTANTES:{" "}
            {participants.filter((participant) => participant.hasVoted)
              ?.length || 0}
          </Text>
        </Flex>

        <Flex flexDirection="row" width="100%" gap={GRID(2)}>
          <Col md={8}>
            <Card p={GRID(2)} width="100%">
              <Text mb={GRID(2)} weight={TYPOGRAPHY.FontWeight.SEMI_BOLD}>
                Aguardando Voto
              </Text>
              <Flex gap={GRID(1)} flexDirection="column">
                {participants
                  .filter((participant) => !participant.hasVoted)
                  .map((participant) => (
                    <Participant {...participant} />
                  ))}
              </Flex>
            </Card>
          </Col>
          {participants.filter((participant) => participant.hasVoted).length >
            0 && (
            <Col md={16}>
              <Card p={GRID(2)} width="100%">
                <Text mb={GRID(2)} weight={TYPOGRAPHY.FontWeight.SEMI_BOLD}>
                  Votos
                </Text>
                <Flex gap={GRID(1)} flexDirection="column">
                  {participants
                    .filter((participant) => participant.hasVoted)
                    .sort((a, b) => {
                      if (a.vote > b.vote) return 1;
                      if (a.vote < b.vote) return -1;
                      return 0;
                    })
                    .reverse()
                    .map((participant) => (
                      <Participant {...participant} />
                    ))}
                </Flex>
              </Card>
            </Col>
          )}
        </Flex>
      </Container>
    </>
  );
};

function partitionBy<T>(arr: T[], size: number): T[][] {
  const partitions = [];

  for (let i = 0; i < arr.length; i += size) {
    partitions.push(arr.slice(i, i + size));
  }

  return partitions;
}

export default Poll;
