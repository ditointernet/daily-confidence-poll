import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate, useSearchParams } from "react-router-dom";

import { HOME } from "../constants/routes";
import { Button, Flex } from "@ditointernet/uai-components";
import { GRID } from "@ditointernet/uai-foundation";

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
    <Flex py={GRID(1)}>
      <Button onClick={onGoogleLoginClick} large>
        Login com google
      </Button>
    </Flex>
  );
};

export default Login;
