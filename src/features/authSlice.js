import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getHistory } from "../store";
import { auth, addNewUserToCloud, addNewUser } from "../services/firebase";
import { db, database } from "../services/firebase";
import action from "containers/AuthPage/actions";
import { act } from "react-dom/test-utils";
import { formatRelativeWithOptions } from "date-fns/esm/fp";

export const doSignin = createAsyncThunk("userLogin", async (userInfo) => {
  try {
    console.log("vào login", userInfo);
    await auth
      .signInWithEmailAndPassword(userInfo.email, userInfo.password)
      .then((res) => {
        console.log("res register", res.user.uid);
        setUserState(res.user.uid);
        getHistory().push("/");
      });
    return userInfo;
  } catch (error) {
    console.log("lỗi login nè", error);
  }
});
// ref.orderByChild("email").equalTo(email).once("value").then(....)
export const setUserState = async (id) => {
  let user = {};
  const ref = database.ref("usersTable/");
  await ref.orderByChild("id").equalTo(id).once("value")
    .then((snapshot) => {
      if (!snapshot.empty) {
        let listuser = snapshot.val();
        console.log("check user login", listuser[id]);
        user = {
          id: listuser[id].id,
          firstname: listuser[id].firstname,
          lastname: listuser[id].lastname,
          email: listuser[id].email,
          password: listuser[id].password,
        };
        console.log("hiazzzzzzzzzz", user);
        const userLoginLocalStorage = JSON.stringify(user);
        localStorage.setItem("userLogin", userLoginLocalStorage);
      }
    });
};

export const doSignup = createAsyncThunk("userRegister", async (userInfo) => {
  try {
    console.log("action", userInfo);
    let response = await auth
      .createUserWithEmailAndPassword(userInfo.email, userInfo.password)
      .then((res) => {
        addNewUser({
          id: res.user.uid,
          firstname: userInfo.firstname,
          lastname: userInfo.lastname,
          email: userInfo.email,
          password: userInfo.password,
        });
        console.log("res", res);
      });
    console.log("response register", response);
    getHistory().push("/signin");
    return response;
  } catch (error) {
    console.log("errror register", error);
  }
});

export const doInitLoadingDone = () => {
  return (dispatch) => {
    return dispatch(actions.signinInitLoadingDone);
  };
};

export const doSignout = () => {
  return (dispatch) => {
    getHistory().push("/signin");
    console.log("vafo logout");
    const user = JSON.parse(localStorage.getItem("userLogin"));
    console.log(
      "userLoginLocalStorage",
      JSON.parse(localStorage.getItem("userLogin"))
    );
    return dispatch(actions.logout(user));
  };
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    initLoading: false,
    signinLoading: false,
    signupLoading: false,
    sendResetPasswordLoading: false,
    sendResetPasswordError: null,
    changePasswordLoading: false,
    changePasswordError: null,
    signinError: null,
    sigupError: null,
    userLogin: {
      id: null,
      firstname: "",
      lastname: "",
      email: "",
      password: "",
    },
  },
  reducers: {
    signinInitLoadingDone: (state, action) => {
      state.initLoading = false;
      console.log("state.initLoading", state.initLoading);
    },
    logout: (state, action) => {
      state.initLoading = false;
      state.signinLoading = false;
      state.userLogin = action.payload;
    },
  },
  extraReducers: {
    [doSignin.pending]: (state, action) => {
      state.initLoading = true;
      state.signinLoading = true;
      state.signinError = null;
    },
    [doSignin.fulfilled]: (state, action) => {
      if (state.signinLoading === true) {
        console.log("vao do sign in action.payload", action, action.payload);
        state.userLogin = action.payload;
        console.log("state.userLogin", state.userLogin);
        state.signinLoading = false;

        
      }
    },
    [doSignin.rejected]: (state, action) => {
      state.signinLoading = false;
      state.sigupError = action || null;
    },
    [doSignup.pending]: (state, action) => {
      state.signupLoading = true;
      state.signinError = null;
    },
    [doSignup.fulfilled]: (state, action) => {
      state.signupLoading = true;
    },
  },
});

export const { actions, reducer } = authSlice;
export default reducer;
