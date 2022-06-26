import { Navigate, Route, Routes } from "react-router-dom";

import {
  AuthenticatedRoute,
  UnauthenticatedRoute,
} from "./containers/middlewares";
import { Home, Login } from "./pages";
import { AUTH, AUTH_LOGIN, HOME } from "./constants/routes";
import AuthProvider from "./containers/AuthProvider";

function Router() {
  return (
    <AuthProvider>
      <Routes>
        <Route path={AUTH} element={<UnauthenticatedRoute />}>
          <Route path={AUTH_LOGIN} element={<Login />} />
          <Route element={<Navigate to={AUTH_LOGIN} replace />} />
        </Route>

        <Route element={<AuthenticatedRoute />}>
          <Route path={HOME} element={<Home />} />
          <Route element={<Navigate to={HOME} replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default Router;
