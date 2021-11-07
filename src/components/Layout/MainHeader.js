import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

import LogoutButton from "../Auth/LogoutButton";
import CartButton from "../Cart/CartButton";
import classes from "./MainHeader.module.css";

const MainHeader = () => {
  const userType = useSelector((state) => state.auth.userType);
  return (
    <header className={classes.header}>
      <NavLink exact to="/">
        <h1>TestShopApp 🛍</h1>
      </NavLink>
      <nav>
        <ul>
          {userType && (
            <li>
              <NavLink
                activeStyle={{
                  fontWeight: "bold",
                  borderBottom: "5px solid black",
                }}
                to="/shop"
              >
                Shop
              </NavLink>
            </li>
          )}
          {userType === "admin" && (
            <li>
              <NavLink
                activeStyle={{
                  fontWeight: "bold",
                  borderBottom: "5px solid black",
                }}
                to="/add-new-product"
              >
                Add New Product
              </NavLink>
            </li>
          )}
          {userType === "user" && (
            <li>
              <CartButton />
            </li>
          )}
          <li>
            <LogoutButton />
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default MainHeader;
