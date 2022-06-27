import { VoteRange } from "../constants/types";

type ParticipantProps = {
  participantId: string;
  photoUrl?: string;
  displayName?: string;
  hasVoted: boolean;
  vote?: VoteRange;
};

const Participant: React.FC<ParticipantProps> = ({
  participantId,
  photoUrl,
  displayName,
  hasVoted,
  vote,
}) => (
  <div style={{ display: "inline-block", marginLeft: "1rem" }}>
    <h1>{displayName || participantId}</h1>
    {!!photoUrl && <img src={photoUrl} alt={`${displayName}'s face`} />}
    <p>
      {!!vote ? "Voto:" : "Votou?"} {!!vote ? vote : hasVoted ? "Sim" : "Não"}
    </p>
  </div>
);

export default Participant;
