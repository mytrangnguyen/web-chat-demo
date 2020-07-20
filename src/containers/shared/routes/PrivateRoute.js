import { isAuthenticated } from "./permissionChecker";
import React, { useEffect } from "react";
import { Redirect, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import userActions from "../../UserPage/actions";
import userSelectors from "../../UserPage/selectors";
import { configSocket } from "../../rootSocket";
const PrivateRoute = ({ component: Component, ...rest }) => {
  const currentUser = useSelector(userSelectors.selectCurrentUser);
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.auth.userLogin);
  const userLoginLocalStorage = JSON.parse(localStorage.getItem('userLogin'));

  useEffect(() => {
    
  });
  return (
    <Route
      {...rest}
      render={(props) =>
        !userLoginLocalStorage || !userLogin  ? (
          <Redirect
            to={{
              pathname: "/signin",
              state: { from: props.location },
            }}
          />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

export default PrivateRoute;
