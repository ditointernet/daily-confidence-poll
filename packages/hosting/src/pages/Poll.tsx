import {
  collection,
  deleteField,
  doc,
  documentId,
  getFirestore,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useParams } from "react-router-dom";
import { useDocumentData, useCollection } from "react-firebase-hooks/firestore";

import { useFirebaseAuthUser } from "../containers/AuthProvider";
import { IPoll, PollStatuses } from "../constants/types";
import Participant from "../components/Participant";
import React from "react";

const Poll: React.FC = () => {
  const { pollId } = useParams<Record<"pollId", string>>();

  const firestore = getFirestore();
  const pollsCollection = collection(firestore, "polls");
  const usersCollection = collection(firestore, "users");
  const pollDocumentRef = doc(pollsCollection, pollId);
  const [pollDocument, isLoading, didError] = useDocumentData(pollDocumentRef);
  const poll = pollDocument as IPoll;

  const participantIds = Object.keys(poll?.hasParticipantVoted ?? {});
  const [userDocuments] = useCollection(
    query(
      usersCollection,
      participantIds.length
        ? where(documentId(), "in", participantIds)
        : where(documentId(), "==", "never-existing-user")
    )
  );

  const user = useFirebaseAuthUser()!;

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
    if (poll.status === PollStatuses.FINISHED) return;

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

  const participants = userDocuments
    ? userDocuments.docs.map((userDoc) => ({
        participantId: userDoc.id,
        displayName: userDoc.data().displayName,
        photoUrl: userDoc.data().photoUrl,
        hasVoted: poll.hasParticipantVoted[userDoc.id],
      }))
    : Object.entries(poll.hasParticipantVoted).map(
        ([participantId, hasVoted]) => ({
          participantId,
          hasVoted,
        })
      );

  return (
    <>
      <h1>{poll.ownerId}</h1>
      <h3>{poll.status}</h3>
      {isPollOwner &&
        poll.status !== PollStatuses.FINISHED &&
        !!participantIds.length && (
          <button onClick={onAdvancePollClick}>
            {poll.status === PollStatuses.NOT_STARTED
              ? "Iniciar poll"
              : "Finalizar poll"}
          </button>
        )}
      {isCurrentUserParticipating &&
        poll.status === PollStatuses.VOTING_IN_PROGRESS && (
          <div>
            <button onClick={onVotePollClick} data-vote="1">
              1
            </button>
            <button onClick={onVotePollClick} data-vote="2">
              2
            </button>
            <button onClick={onVotePollClick} data-vote="3">
              3
            </button>
          </div>
        )}
      {poll.status === PollStatuses.NOT_STARTED && (
        <>
          <br />
          {!isCurrentUserParticipating && (
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
    </>
  );
};

export default Poll;
