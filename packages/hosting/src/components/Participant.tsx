type ParticipantProps = {
  participantId: string;
  photoUrl?: string;
  displayName?: string;
  hasVoted: boolean;
};

const Participant: React.FC<ParticipantProps> = ({
  photoUrl,
  displayName,
  hasVoted,
}) => (
  <div>
    <h1>{displayName}</h1>
    <img src={photoUrl} alt={`${displayName}'s face`} />
    <p>Votou? {hasVoted ? "Sim" : "Não"}</p>
  </div>
);

export default Participant;
