import { DocumentData, Timestamp } from "firebase/firestore";

export enum PollStatuses {
  NOT_STARTED = "NOT_STARTED",
  VOTING_IN_PROGRESS = "VOTING_IN_PROGRESS",
  FINISHED = "FINISHED",
}

export interface IPoll extends DocumentData {
  ownerId: string;
  status: PollStatuses;
  hasParticipantVoted: Record<string, boolean>;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
