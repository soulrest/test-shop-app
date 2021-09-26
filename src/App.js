import { Switch, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import MainPage from "./components/Layout/MainPage";
import Notification from "./components/UI/Notification";
import Shop from "./components/Shop/Shop";
import UserAuthForm from "./components/Auth/UserAuthForm";
import Layout from "./components/Layout/Layout";
import AddProductForm from "./components/Shop/AddProductForm";
import PageNotFound from "./components/UI/PageNotFound";
import { authActions } from "./store/auth-slice";
import { fetchCartData } from "./store/cart-slice";

const App = () => {
  const { userType } = useSelector((state) => state.auth);
  const userId = useSelector((state) => state.auth.id);
  const notification = useSelector((state) => state.ui.notification);
  const [showNotification, setShowNotification] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authActions.checkLoggedIn());
  }, [dispatch]);

  useEffect(() => {
    if (userId && userType === "user") dispatch(fetchCartData(userId));
  }, [dispatch, userId, userType]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(false);
    }, 2000);

    return () => {
      setShowNotification(true);
      clearTimeout(timer);
    };
  }, [notification]);

  return (
    <Layout>
      {notification && showNotification && (
        <Notification
          status={notification.status}
          title={notification.title}
          message={notification.message}
        />
      )}
      <Switch>
        <Route path="/" exact>
          <MainPage />
        </Route>
        {userType && (
          <Route path="/shop">
            <Shop />
          </Route>
        )}
        {userType === "admin" && (
          <Route path="/add-new-product">
            <AddProductForm />
          </Route>
        )}
        <Route path="/login">
          <UserAuthForm />
        </Route>
        <Route path="*">
          <PageNotFound />
        </Route>
      </Switch>
    </Layout>
  );
};

export default App;
