import { Redirect, Route, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ component: Component, ...rest }) {
  const user = useSelector((state) => state.client.user);
  const location = useLocation();

  return (
    <Route
      {...rest}
      render={(props) =>
        user ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: "/login", state: { from: location.pathname } }} />
        )
      }
    />
  );
}
