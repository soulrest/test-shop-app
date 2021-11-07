import { Fragment, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import Cart from "../Cart/Cart";
import Products from "./Products";
import LoadingSpinner from "../UI/LoadingSpinner";
import { sendCartData, cartActions } from "../../store/cart-slice";
import { fetchProductData, productActions } from "../../store/products-slice";

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
      dispatch(fetchProductData());
      isInitial = false;
      return;
    }

    if (cart.changed && userId) dispatch(sendCartData(cart, userId));

    return () => dispatch(cartActions.unsubscribeCart());
  }, [dispatch, cart, userId]);

  useEffect(() => {
    if (productDataChanged) dispatch(fetchProductData());
    return () => dispatch(productActions.unsubscribeToProductData());
  }, [dispatch, productDataChanged]);

  let output;
  const dispalyCart = showCart && userType === "user" && <Cart />;

  if (products.length === 0) {
    output =
      products.length === 0 && isInitial ? (
        <LoadingSpinner />
      ) : (
        <h1 style={{ textAlign: "center", margin: "10rem 0" }}>
          No products added yet!
        </h1>
      );
  } else {
    output = <Products products={products} userType={userType} />;
  }

  return (
    <Fragment>
      {dispalyCart}
      {output}
    </Fragment>
  );
}

export default Shop;
