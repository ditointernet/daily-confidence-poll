import { useNavigate, useSearchParams } from "react-router-dom";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import styled from "styled-components";

import { Card, Flex, H3, Text } from "@ditointernet/uai-components";
import { COLORS, GRID, TYPOGRAPHY } from "@ditointernet/uai-foundation";

import GoogleIcon from "../assets/google-icon.svg";
import { ROUTES } from "../constants/routes";

const Login = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const redirectAfterLogin = search.get("redirectAfterLogin");

  const handleGoogleLoginClick = async () => {
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      navigate(
        redirectAfterLogin
          ? decodeURIComponent(redirectAfterLogin)
          : ROUTES.HOME
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Flex
      padding={GRID(1)}
      justifyContent="center"
      alignItems="center"
      minHeight="100%"
    >
      <Card p={GRID(2)}>
        <H3 weight={TYPOGRAPHY.FontWeight.SEMI_BOLD}>
          Daily - Confiança do time
        </H3>
        <Text>É necessário estar logado na plataforma</Text>
        <Flex mt={GRID(3)} justifyContent="center">
          <GoogleButton onClick={handleGoogleLoginClick}>
            <img src={GoogleIcon} width="16px" />
            <Text>Login com google</Text>
          </GoogleButton>
        </Flex>
      </Card>
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

  img {
    width: 18px;
    height: 18px;
    margin-right: ${GRID(3)};
  }

  &:hover {
    box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.04), 0 2px 4px rgba(0, 0, 0, 0.25);
  }
`;

export default Login;
