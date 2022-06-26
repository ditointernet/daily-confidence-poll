import { Navigate, Outlet } from "react-router";

interface ConditionalRouteProps {
  redirect: string;
  condition: () => boolean;
}

const ConditionalRoute: React.FC<ConditionalRouteProps> = ({
  redirect,
  condition,
}) => {
  if (!condition()) {
    return <Navigate to={redirect} replace={true} />;
  }

  return <Outlet />;
};

export default ConditionalRoute;
