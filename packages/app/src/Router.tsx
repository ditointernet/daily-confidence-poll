import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import { Home, Login, Poll } from "./pages";
import {
  AuthenticatedRoute,
  UnauthenticatedRoute,
} from "./containers/middlewares";
import { ROUTES } from "./constants/routes";

function Router() {
  return (
    <Routes>
      <Route path={ROUTES.AUTH} element={<UnauthenticatedRoute />}>
        <Route path={ROUTES.AUTH_LOGIN} element={<Login />} />
        <Route element={<Navigate to={ROUTES.AUTH_LOGIN} replace />} />
      </Route>

      <Route element={<AuthenticatedRoute />}>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.POLLS} element={<Outlet />}>
          <Route path={ROUTES.MY_POLLS} element={<Home />} />
          <Route path={ROUTES.POLL_BY_ID} element={<Poll />} />
          <Route path="" element={<Navigate to={ROUTES.HOME} replace />} />
        </Route>
        <Route path="" element={<Navigate to={ROUTES.HOME} replace />} />
      </Route>
    </Routes>
  );
}

export default Router;
