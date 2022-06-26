import { firestore } from "firebase-admin";
import * as functions from "firebase-functions";

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

export default functions
  .region("southamerica-east1")
  .firestore.document("polls/{pollId}/votes/{voteId}")
  .onCreate(async function onVoteDocumentCreated(
    _,
    context: EnhancedEventContext
  ) {
    const pollId = context.params.pollId as string;
    const voteId = context.params.voteId as string;
    const poll = pollsCollection.doc(pollId);

    await poll.update({
      [`participants.${voteId}.hasVoted`]: true,
    });
  });
