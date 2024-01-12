import ConditionalRoute from "./ConditionalRoute";
import { useFirebaseAuthUser } from "../AuthProvider";
import { HOME } from "../../constants/routes";

const UnauthenticatedRoute: React.FC = () => {
  const firebaseAuthUser = useFirebaseAuthUser();

  function checkIfUnauthenticated() {
    return !firebaseAuthUser;
  }

  return (
    <ConditionalRoute redirect={HOME} condition={checkIfUnauthenticated} />
  );
};

export default UnauthenticatedRoute;
