import {
  Avatar,
  AvatarSize,
  AvatarType,
  Flex,
  Text,
} from "@ditointernet/uai-components";
import { VoteRange } from "../constants/types";
import { COLORS_NEXT, GRID, TYPOGRAPHY } from "@ditointernet/uai-foundation";

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
  <Flex alignItems="center" width="100%">
    <Avatar
      srcPhoto={photoUrl}
      size={AvatarSize.MEDIUM}
      type={photoUrl ? AvatarType.PHOTO : AvatarType.ICON}
    />
    <Flex ml={GRID(2)} flexDirection="column" width="100%">
      <Text
        weight={TYPOGRAPHY.FontWeight.SEMI_BOLD}
        size={TYPOGRAPHY.FontSize.LARGE}
        color={vote == 1 ? COLORS_NEXT.CHART.RED_600 : COLORS_NEXT.NEUTRAL_600}
      >
        {displayName || participantId}
      </Text>
      <Text size={TYPOGRAPHY.FontSize.SMALL} color={COLORS_NEXT.NEUTRAL_400}>
        {hasVoted && vote && `Confiança: ${confidence[vote]}`}
        {!hasVoted && `... aguardando`}
      </Text>
    </Flex>
  </Flex>
);

export default Participant;
