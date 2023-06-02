import { Card, Flex, Text } from "@ditointernet/uai-components";
import { VoteRange } from "../constants/types";
import { COLORS, GRID, TYPOGRAPHY } from "@ditointernet/uai-foundation";

const confidence = {
  1: "Baixa 😨",
  2: "Média 🤨",
  3: "Alta 😎",
};

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
  <Card padding={GRID(2)}>
    <Flex alignItems="center">
      {!!photoUrl && (
        <img
          src={photoUrl}
          alt={`${displayName}'s face`}
          width={100}
          height={100}
          style={{ borderRadius: "50%" }}
        />
      )}
      <Flex ml={GRID(2)} flexDirection="column">
        <Text
          weight={TYPOGRAPHY.FontWeight.SEMI_BOLD}
          size={TYPOGRAPHY.FontSize.LARGE}
          color={COLORS.GRAY_6}
        >
          {displayName || participantId}
        </Text>
        <Text size={TYPOGRAPHY.FontSize.SMALL} color={COLORS.GRAY_5}>
          {!!vote ? "Confiança:" : "Votou?"}{" "}
          {!!vote ? confidence[vote] : hasVoted ? "Sim" : "Não"}
        </Text>
      </Flex>
    </Flex>
  </Card>
);

export default Participant;
