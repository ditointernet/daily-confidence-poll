import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { HOME } from "../constants/routes";

const Login: React.FC = () => {
  const auth = getAuth();
  const navigate = useNavigate();

  function onGoogleLoginClick() {
    const provider = new GoogleAuthProvider();

    return signInWithPopup(auth, provider)
      .then(() => navigate(HOME))
      .catch(console.error);
  }

  return <button onClick={onGoogleLoginClick}>login com google</button>;
};

export default Login;
