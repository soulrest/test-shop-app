import React from "react";
import { useSelector } from "react-redux";

import Cart from "../Cart/Cart";

const MainPage = () => {
  const { userType } = useSelector((state) => state.auth);
  const showCart = useSelector((state) => state.ui.cartIsVisible);

  return (
    <React.Fragment>
      {userType === "user" && showCart && <Cart />}
      <h1 style={{ textAlign: "center" }}>Main Page</h1>
      <p style={{ textAlign: "center" }}>
        login as an administrator or a user and try that simple demo-shop 😊
      </p>
    </React.Fragment>
  );
};

export default MainPage;
