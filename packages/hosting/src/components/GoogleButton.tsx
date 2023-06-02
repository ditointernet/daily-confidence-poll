import styled from "styled-components";
import { ReactComponent as GoogleIcon } from "../assets/google-icon.svg";
import { COLORS, GRID } from "@ditointernet/uai-foundation";

const GoogleButton = ({ onClick }: { onClick: () => void }) => (
  <CustomButton type="button" onClick={onClick}>
    <GoogleIcon />
    <span>Login com google</span>
  </CustomButton>
);

const CustomButton = styled.button`
  display: flex;
  align-items: center;
  border: none;
  width: 200px;
  height: 40px;
  background-color: ${COLORS.WHITE};
  padding: ${GRID(1)};
  cursor: pointer;
  border-radius: 3px;
  box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.04), 0 1px 1px rgba(0, 0, 0, 0.25);
  transition: box-shadow 0.3s;

  span {
    font-family: "Roboto", sans-serif;
    font-weight: bold;
    font-size: 14px;
    color: #757575;
  }

  svg {
    width: 18px;
    height: 18px;
    margin-right: ${GRID(3)};
  }

  &:hover {
    box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.04), 0 2px 4px rgba(0, 0, 0, 0.25);
  }
`;

export default GoogleButton;
