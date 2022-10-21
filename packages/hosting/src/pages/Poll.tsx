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

import { useFirebaseAuthUser } from "../containers/AuthProvider";
import {
  IPoll,
  IUser,
  IVote,
  PollStatuses,
  VoteRange,
} from "../constants/types";
import Participant from "../components/Participant";
import React, { useEffect, useState } from "react";
import {
  AppearenceType,
  Badge,
  Button,
  Divider,
  Flex,
  Status,
  Text,
  ButtonAppearance,
} from "@ditointernet/uai-components";
import { COLORS, GRID, TYPOGRAPHY } from "@ditointernet/uai-foundation";

const Poll: React.FC = () => {
  const { pollId } = useParams<Record<"pollId", string>>();

  const firestore = getFirestore();
  const pollsCollection = collection(firestore, "polls");
  const pollDocumentRef = doc(pollsCollection, pollId);

  const [pollDocument, isLoading, didError] = useDocumentData(pollDocumentRef);
  const poll = pollDocument as IPoll | undefined;

  const [_users, setUsers] = useState<
    Record<number, Array<IUser & { id: string }>>
  >([]);
  const [votes, setVotes] = useState<Record<string, VoteRange>>({});
  const users = Object.values(_users).flat();
  const currentSnapshots = Object.keys(_users).length;

  const user = useFirebaseAuthUser()!;

  const mappedPollStatus = {
    FINISHED: {
      appearence: AppearenceType.SUCCESS,
      text: "Votação finalizada",
    },
    VOTING_IN_PROGRESS: {
      appearence: AppearenceType.WARNING,
      text: "Votação em andamento",
    },
    NOT_STARTED: {
      appearence: AppearenceType.DISABLED,
      text: "Votação não iniciada",
    },
  };

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
  if (isLoading || !poll) return <>Loading</>;

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

  function onVotePollClick(event: React.MouseEvent<HTMLButtonElement>) {
    const vote =
      parseInt(event.currentTarget.getAttribute("data-vote") ?? "", 10) ?? 1;

    const voteRef = doc(pollsCollection, pollId, "votes", user.uid);

    setDoc(voteRef, {
      vote,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }).catch((err) => console.error(err.code));
  }

  const isCurrentUserParticipating = user.uid in poll.hasParticipantVoted;
  const isPollOwner = user.uid === poll.ownerId;

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

  return (
    <Flex flexDirection="column" style={{ padding: GRID(2) }}>
      <Flex justifyContent="space-between" alignItems="center">
        <Flex flexDirection="column">
          <Flex mb={GRID(2)}>
            <Text weight={TYPOGRAPHY.FontWeight.SEMI_BOLD}>ID da sala: </Text>
            <Badge statusText={poll.ownerId} />
          </Flex>
          <Flex>
            <Text weight={TYPOGRAPHY.FontWeight.SEMI_BOLD}>Status: </Text>
            <Status
              appearence={mappedPollStatus[poll.status].appearence}
              text={mappedPollStatus[poll.status].text}
            />
          </Flex>
        </Flex>
        {isPollOwner &&
          poll.status !== PollStatuses.FINISHED &&
          !!participants.length && (
            <Button onClick={onAdvancePollClick} large>
              {poll.status === PollStatuses.NOT_STARTED
                ? "Iniciar poll"
                : "Finalizar poll"}
            </Button>
          )}
      </Flex>
      <Divider style={{ margin: `${GRID(3)} 0` }} />

      {isCurrentUserParticipating &&
        poll.status === PollStatuses.VOTING_IN_PROGRESS && (
          <>
            <Text
              mb={GRID(1)}
              color={COLORS.GRAY_5}
              size={TYPOGRAPHY.FontSize.LARGE}
              lineHeight={TYPOGRAPHY.LineHeight.LARGE}
            >
              Qual seu nível de confiança na sprint?
            </Text>
            <Flex gap={GRID(1)}>
              <Button
                appearance={ButtonAppearance.tertiary}
                onClick={onVotePollClick}
                data-vote="1"
              >
                1 - Pouco confiante
              </Button>
              <Button
                appearance={ButtonAppearance.tertiary}
                onClick={onVotePollClick}
                data-vote="2"
              >
                2 - Atenção em alguns pontos
              </Button>
              <Button
                appearance={ButtonAppearance.tertiary}
                onClick={onVotePollClick}
                data-vote="3"
              >
                3 - Muito confiante
              </Button>
            </Flex>
          </>
        )}
      {poll.status === PollStatuses.NOT_STARTED && (
        <>
          <br />
          {!isCurrentUserParticipating && participants.length <= 10 && (
            <button onClick={onJoinPollClick}>entrar na poll</button>
          )}
          <br />
          {isCurrentUserParticipating && (
            <button onClick={onLeavePollClick}>sair da poll</button>
          )}
        </>
      )}
      <h3>Participants</h3>
      {participants.map((participant) => (
        <Participant key={participant.participantId} {...participant} />
      ))}
    </Flex>
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
