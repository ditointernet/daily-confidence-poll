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

export enum VoteRange {
  "NO_CONFIDENCE" = 1,
  "MEDIUM_CONFIDENCE" = 2,
  "HIGH_CONFIDENCE" = 3,
}

export interface IVote extends DocumentData {
  vote: VoteRange;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface IUser extends DocumentData {
  displayName: string;
  photoUrl: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
