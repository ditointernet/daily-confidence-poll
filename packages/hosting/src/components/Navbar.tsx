import {
  Button,
  ButtonAppearance,
  Flex,
  Text,
} from "@ditointernet/uai-components";
import {
  COLORS,
  GRID,
  SHADOWS,
  TYPOGRAPHY,
} from "@ditointernet/uai-foundation";
import { ArrowLeft, ExternalLink } from "@ditointernet/uai-icons";
import styled from "styled-components";
import { HOME } from "../constants/routes";
import { Link } from "react-router-dom";

const Navbar = () => (
  <NavbarTag>
    <Link to={HOME}>
      <Flex alignItems="center">
        <ArrowLeft fill={COLORS.GREEN_MAIN} />
        <Text
          size={TYPOGRAPHY.FontSize.MEDIUM}
          lineHeight={TYPOGRAPHY.LineHeight.MEDIUM}
          weight={TYPOGRAPHY.FontWeight.REGULAR}
          color={COLORS.GREEN_MAIN}
        >
          Home
        </Text>
      </Flex>
    </Link>
    <Button
      appearance={ButtonAppearance.link}
      href="https://ditointernet.atlassian.net/jira/dashboards/10341"
      target="_blank"
      icon={<ExternalLink />}
    >
      Jira Dashboard
    </Button>
  </NavbarTag>
);

const NavbarTag = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: ${GRID(2)} ${GRID(3)};
  box-shadow: ${SHADOWS.DEFAULT("down")};
  margin-bottom: ${GRID(4)};
`;

export default Navbar;
