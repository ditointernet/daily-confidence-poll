import { useNavigate, useSearchParams } from "react-router-dom";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { HOME } from "../constants/routes";
import { Flex } from "@ditointernet/uai-components";
import { GRID } from "@ditointernet/uai-foundation";
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
      <button id="google-button" onClick={onGoogleLoginClick}>
        <GoogleIcon />
        <span>Login com google</span>
      </button>
    </Flex>
  );
};
export default Login;
