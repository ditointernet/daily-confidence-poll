import { firestore } from "firebase-admin";
import * as functions from "firebase-functions";

const db = firestore();
const pollsCollection = db.collection("polls");

export default functions
  .region("southamerica-east1")
  .firestore.document("polls/{pollId}/votes/{voteId}")
  .onCreate(async function onVoteDocumentCreated(_, context) {
    const pollId = context.params.pollId as string;
    const voteId = context.params.voteId as string;

    await pollsCollection.doc(pollId).update({
      [`hasParticipantVoted.${voteId}`]: true,
    });
  });
