import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import { authUser } from "../../store/auth-slice";
import useInput from "../hooks/use-input";
import classes from "./UserAuthForm.module.css";

const UserAuthForm = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = useState(true);
  const [optionInput, setOptionInput] = useState("user");

  const {
    value: enteredEmail,
    hasError: emailInputHasError,
    isValid: enteredEmailIsValid,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
  } = useInput((value) =>
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      value
    )
  );

  const {
    value: enteredPassword,
    hasError: passwordInputHasError,
    isValid: enteredPasswordIsValid,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
  } = useInput((value) => value.trim() !== "" && value.length >= 6);

  const optionChange = (e) => setOptionInput(e.target.value);

  let formIsValid = false;
  if (enteredPasswordIsValid && enteredEmailIsValid) formIsValid = true;

  const switchAuthModeHandler = () => setIsLogin((prevState) => !prevState);

  const submitHandler = async (event) => {
    event.preventDefault();

    if (!enteredPasswordIsValid && !enteredEmailIsValid) return;

    dispatch(
      authUser({
        email: enteredEmail,
        password: enteredPassword,
        isLogin,
        optionInput,
      })
    );

    history.push("/");
  };

  const passwordInputClasses = passwordInputHasError
    ? `${classes["form-control"]} ${classes.invalid}`
    : `${classes["form-control"]}`;

  const emailInputClasses = emailInputHasError
    ? `${classes["form-control"]} ${classes.invalid}`
    : `${classes["form-control"]}`;

  return (
    <form onSubmit={submitHandler}>
      <h2 className={classes["auth-header"]}>
        {isLogin ? "Login" : "Sign Up"}
      </h2>
      <div className={emailInputClasses}>
        <label htmlFor="email">Your Email</label>
        <input
          type="email"
          id="email"
          onBlur={emailBlurHandler}
          onChange={emailChangeHandler}
          value={enteredEmail}
        />
        {emailInputHasError && (
          <p className={classes["error-text"]}>
            Email field must be valid and not be empty
          </p>
        )}
      </div>
      <div className={passwordInputClasses}>
        <label htmlFor="password">Your Password</label>
        <input
          type="password"
          id="password"
          onBlur={passwordBlurHandler}
          onChange={passwordChangeHandler}
          value={enteredPassword}
        />
        {passwordInputHasError && (
          <p className={classes["error-text"]}>
            Password must not be empty and at least 6 character long
          </p>
        )}
      </div>
      {!isLogin && (
        <div className={classes["form-control"]}>
          <label htmlFor="select">Who are you?</label>
          <select value={optionInput} onChange={optionChange} id="select">
            <option value="user">User</option>
            <option value="admin">Administrator</option>
          </select>
        </div>
      )}
      <div className={classes["form-actions"]}>
        <button disabled={!formIsValid}>
          {isLogin ? "Login" : "Create Account"}
        </button>
      </div>
      <button type="button" onClick={switchAuthModeHandler}>
        {isLogin ? "Create new account" : "Login with existing account"}
      </button>
    </form>
  );
};

export default UserAuthForm;
