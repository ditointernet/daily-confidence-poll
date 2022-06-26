import { firestore } from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import * as functions from "firebase-functions";

initializeApp();
const db = firestore();
const pollsCollection = db.collection("polls");

interface EnhancedEventContext extends functions.EventContext {
  auth?: {
    uid: string;
    token: {
      email?: string;
    };
  };
}

export const onUserVoted = functions
  .region("southamerica-east1")
  .firestore.document("polls/{pollId}/votes/{voteId}")
  .onCreate(function onVoteDocumentCreated(_, context: EnhancedEventContext) {
    const pollId = context.params.pollId as string;
    const voteId = context.params.voteId as string;
    const poll = pollsCollection.doc(pollId);

    return poll.update(
      {
        hasParticipantVoted: {
          [voteId]: true,
        },
      },
      { exists: true }
    );
  });
