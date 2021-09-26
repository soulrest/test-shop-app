import { configureStore } from "@reduxjs/toolkit";

import productSlice from "./products-slice";
import uiSlice from "./ui-slice";
import cartSlice from "./cart-slice";
import authSlice from "./auth-slice";

const store = configureStore({
  reducer: {
    products: productSlice.reducer,
    auth: authSlice.reducer,
    ui: uiSlice.reducer,
    cart: cartSlice.reducer,
  },
});

export default store;
