import { configureStore, combineReducers } from "@reduxjs/toolkit";
// import { combineReducers } from "redux";
import userReducer from "./redux/userSlice";
import authReducer from "./redux/authSlice";
import layoutReducer from "./redux/layoutSlice";
import messageReducer from "./redux/messageSlice";
import contactReducer from "./redux/contactSlice";
import callReducer from "./redux/callSlice";
import { createBrowserHistory } from "history";
import { connectRouter } from "connected-react-router";

const history = createBrowserHistory();

export function getHistory() {
  return history;
}

const createRootReducer = () =>
  combineReducers({
    router: connectRouter(history),
    user: userReducer,
    auth: authReducer,
    layout: layoutReducer,
    message: messageReducer,
    contact: contactReducer,
    call: callReducer,
  });

const store = configureStore({
  reducer: createRootReducer(history),
});

export default store;

// const store = createStore(
//     createRootReducer(history), // root reducer with router state
//     preloadedState,
//     compose(
//       applyMiddleware(
//         routerMiddleware(history), // for dispatching history actions
//         // ... other middlewares ...
//       ),
//     ),
//   )
