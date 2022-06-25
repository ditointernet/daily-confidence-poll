import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const auth = getAuth();
  const navigate = useNavigate();

  function onGoogleLoginClick() {
    const provider = new GoogleAuthProvider();

    return signInWithPopup(auth, provider)
      .then(() => navigate("/home"))
      .catch(console.error);
  }

  return <button onClick={onGoogleLoginClick}>login com google</button>;
};

export default Login;
