import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import AuthProvider from "./containers/AuthProvider";
import { Home, Login, Poll, MyPolls } from "./pages";
import {
  AuthenticatedRoute,
  UnauthenticatedRoute,
} from "./containers/middlewares";
import {
  AUTH,
  AUTH_LOGIN,
  HOME,
  MY_POLLS,
  POLLS,
  POLL_BY_ID,
} from "./constants/routes";

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
          <Route path={POLLS} element={<Outlet />}>
            <Route path={MY_POLLS} element={<MyPolls />} />
            <Route path={POLL_BY_ID} element={<Poll />} />
            <Route path="" element={<Navigate to={HOME} replace />} />
          </Route>
          <Route path="" element={<Navigate to={HOME} replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default Router;
