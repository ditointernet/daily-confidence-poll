import { Flex } from "@ditointernet/uai-components";
import { COLORS, GRID, TYPOGRAPHY } from "@ditointernet/uai-foundation";
import styled from "styled-components";

const Tag = styled(Flex)`
  background-color: ${COLORS.GRAY_2};
  color: ${COLORS.GRAY_6};
  border-radius: 4px;
  padding: ${GRID(0.5)} ${GRID(1)};
  height: ${GRID(3)};
  font-weight: ${TYPOGRAPHY.FontWeight.MEDIUM};
  font-size: ${TYPOGRAPHY.FontSize.OVERLINE};
`;

export default Tag;
