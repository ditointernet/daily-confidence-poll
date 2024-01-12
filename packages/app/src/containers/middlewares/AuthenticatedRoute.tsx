import ConditionalRoute from "./ConditionalRoute";
import { useFirebaseAuthUser } from "../AuthProvider";
import { AUTH_LOGIN } from "../../constants/routes";
import { useLocation } from "react-router-dom";

const AuthenticatedRoute: React.FC = () => {
  const firebaseAuthUser = useFirebaseAuthUser();
  const location = useLocation();

  function checkIfAuthenticated() {
    return !!firebaseAuthUser;
  }

  const redirectAfterLogin = encodeURIComponent(
    location.pathname + location.search
  );

  return (
    <ConditionalRoute
      redirect={AUTH_LOGIN + `?redirectAfterLogin=${redirectAfterLogin}`}
      condition={checkIfAuthenticated}
    />
  );
};

export default AuthenticatedRoute;
