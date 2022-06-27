import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate, useSearchParams } from "react-router-dom";

import { HOME } from "../constants/routes";

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

  return <button onClick={onGoogleLoginClick}>login com google</button>;
};

export default Login;
