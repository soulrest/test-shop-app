import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { logoutUser } from "../../store/auth-slice";
import classes from "./LogoutButton.module.css";

const LoginButton = () => {
  const history = useHistory();
  const isLogin = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();

  const changeActionHandler = () => {
    if (isLogin) {
      dispatch(logoutUser());
      history.replace("/");
    } else history.replace("/login");
  };

  return (
    <button className={classes.button} onClick={changeActionHandler}>
      <span>{isLogin ? "Logout" : "Login"}</span>
    </button>
  );
};

export default LoginButton;
