import { Fragment, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import Cart from "../Cart/Cart";
import Products from "./Products";
import LoadingSpinner from "../UI/LoadingSpinner";
import { sendCartData } from "../../store/cart-slice";
import { fetchProductData } from "../../store/products-slice";

let isInitial = true;

function Shop() {
  const userId = useSelector((state) => state.auth.id);
  const { userType } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { products, changed: productDataChanged } = useSelector(
    (state) => state.products
  );
  const showCart = useSelector((state) => state.ui.cartIsVisible);
  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    if (isInitial) {
      isInitial = false;
      return;
    }
    if (cart.changed && userId) dispatch(sendCartData(cart, userId));
  }, [dispatch, cart, userId]);

  useEffect(() => {
    dispatch(fetchProductData());
  }, [dispatch]);

  let output;

  if (products.length === 0 && !productDataChanged) {
    output = (
      <Fragment>
        {showCart && userType === "user" && <Cart />}
        <h1 style={{ textAlign: "center", margin: "10rem 0" }}>
          No products added yet!
        </h1>
      </Fragment>
    );
  } else {
    output = (
      <Fragment>
        {showCart && userType === "user" && <Cart />}
        {productDataChanged ? <Products /> : <LoadingSpinner />}
      </Fragment>
    );
  }

  return output;
}

export default Shop;
