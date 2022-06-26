import ConditionalRoute from "./ConditionalRoute";
import { useFirebaseAuthUser } from "../AuthProvider";
import { AUTH_LOGIN } from "../../constants/routes";

const AuthenticatedRoute: React.FC = () => {
  const firebaseAuthUser = useFirebaseAuthUser();

  function checkIfAuthenticated() {
    return !!firebaseAuthUser;
  }

  return (
    <ConditionalRoute redirect={AUTH_LOGIN} condition={checkIfAuthenticated} />
  );
};

export default AuthenticatedRoute;
