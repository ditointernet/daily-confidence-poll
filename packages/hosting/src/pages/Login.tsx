import styled from "styled-components";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { HOME } from "../constants/routes";
import { Flex } from "@ditointernet/uai-components";
import { COLORS, GRID } from "@ditointernet/uai-foundation";
import { ReactComponent as GoogleIcon } from "../assets/google-icon.svg";

const Login: React.FC = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const redirectAfterLogin = search.get("redirectAfterLogin");

  function onGoogleLoginClick() {
    const provider = new GoogleAuthProvider();

    return signInWithPopup(auth, provider)
      .then(() =>
        navigate(
          redirectAfterLogin ? decodeURIComponent(redirectAfterLogin) : HOME
        )
      )
      .catch(console.error);
  }

  return (
    <Flex padding={GRID(1)}>
      <GoogleButton type="button" onClick={onGoogleLoginClick}>
        <GoogleIcon />
        <span>Login com google</span>
      </GoogleButton>
    </Flex>
  );
};

const GoogleButton = styled.button`
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

  &:hover {
    box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.04), 0 2px 4px rgba(0, 0, 0, 0.25);
  }

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
`;

export default Login;
