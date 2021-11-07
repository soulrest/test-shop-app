import { createSlice } from "@reduxjs/toolkit";

import { uiActions } from "./ui-slice";
import { cartActions } from "./cart-slice";

const FIREBASE_USERS_URL = process.env.REACT_APP_FIREBASE_USERS_URL;
const FIREBASE_AUTH_SIGN_UP_URL =
  process.env.REACT_APP_FIREBASE_AUTH_SIGN_UP_URL;
const FIREBASE_AUTH_SIGN_IN_URL =
  process.env.REACT_APP_FIREBASE_AUTH_SIGN_IN_URL;
const FIREBASE_AUTH_KEY = process.env.REACT_APP_FIREBASE_AUTH_KEY;

let logoutTimer;

const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();
  const remainingTime = adjExpirationTime - currentTime;
  return remainingTime;
};

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem("token");
  const storedExpirationDate = localStorage.getItem("expirationTime");
  const storedUserType = localStorage.getItem("userType");
  const storedUserId = localStorage.getItem("id");

  const remainingTime = calculateRemainingTime(storedExpirationDate);
  if (remainingTime <= 60000) {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("expirationTime");
    localStorage.removeItem("userType");
    return null;
  }

  return {
    id: storedUserId,
    token: storedToken,
    duration: remainingTime,
    userType: storedUserType,
  };
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    id: "",
    token: "",
    userType: "",
    isLoggedIn: false,
  },
  reducers: {
    checkLoggedIn(state) {
      const tokenData = retrieveStoredToken();
      state.userType = tokenData?.userType;
      state.id = tokenData?.id;
      state.token = tokenData?.token;
      state.isLoggedIn = !!tokenData?.token;
    },
    login(state, action) {
      state.token = action.payload.token;
      state.userType = action.payload.userType;
      state.id = action.payload.id;
      state.isLoggedIn = true;
    },
    logout(state) {
      state.token = "";
      state.userType = "";
      state.isLoggedIn = false;
    },
  },
});

export const authUser = (userData) => {
  const { email, password, isLogin, optionInput } = userData;

  return async (dispatch) => {
    const sendUserData = async (url) => {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (!response.ok) {
        const error = data?.error?.message || '"Authentication failed!"';
        throw new Error(error);
      }
      return data;
    };

    const setUserType = async (id, user) => {
      const response = await fetch(FIREBASE_USERS_URL);
      const usersData = await response.json();

      const userType = Object.entries(usersData || {}).find(
        (el) => el[1].id === id
      );

      if (!userType) {
        const response = await fetch(FIREBASE_USERS_URL, {
          method: "POST",
          body: JSON.stringify({
            id,
            user,
          }),
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Fetching user data failed.");
        return user;
      }
      return userType[1].user;
    };

    let url;
    if (isLogin) {
      url = `${FIREBASE_AUTH_SIGN_IN_URL}${FIREBASE_AUTH_KEY}`;
    } else {
      url = `${FIREBASE_AUTH_SIGN_UP_URL}${FIREBASE_AUTH_KEY}`;
    }

    try {
      const data = await sendUserData(url);
      const userType = await setUserType(data.localId, optionInput);

      const { idToken: token, expiresIn } = data;
      const expirationTime = new Date(new Date().getTime() + +expiresIn * 1000);
      dispatch(authActions.login({ token, userType, id: data.localId }));

      localStorage.setItem("token", token);
      localStorage.setItem("id", data.localId);
      localStorage.setItem("expirationTime", expirationTime);
      localStorage.setItem("userType", userType);

      dispatch(
        uiActions.showNotification({
          status: "success",
          title: "User Authorised",
          message: "User seccessfully authorised!",
        })
      );

      const remainingTime = calculateRemainingTime(expirationTime);
      logoutTimer = setTimeout(() => {
        dispatch(authActions.logout());
        dispatch(cartActions.clearSate());
      }, remainingTime);
    } catch (err) {
      console.error(err);
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error!",
          message: "User authentication failed!",
        })
      );
    }
  };
};

export const logoutUser = () => {
  return (dispatch) => {
    dispatch(authActions.logout());
    dispatch(cartActions.clearSate());
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    localStorage.removeItem("userType");
    localStorage.removeItem("id");
    if (logoutTimer) clearTimeout(logoutTimer);
    dispatch(
      uiActions.showNotification({
        status: "success",
        title: "User Logout",
        message: "User seccessfully logout",
      })
    );
  };
};

export const authActions = authSlice.actions;

export default authSlice;
