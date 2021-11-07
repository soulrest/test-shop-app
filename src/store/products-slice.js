import { createSlice } from "@reduxjs/toolkit";
import { uiActions } from "./ui-slice";

const FIREBASE_PRODUCTS_URL = process.env.REACT_APP_FIREBASE_PRODUCTS_URL;
const FIREBASE_URL = process.env.REACT_APP_FIREBASE_URL;

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    changed: false,
  },
  reducers: {
    replaceProducts(state, action) {
      state.products = action.payload.products;
      state.changed = true;
    },
    unsubscribeToProductData(state) {
      state.changed = false;
    },
    addProduct(state, action) {
      state.changed = true;
      state.products = [
        ...state.products,
        {
          id: Math.random().toString(),
          title: action.payload.title,
          price: action.payload.price,
          description: action.payload.description,
          img: action.payload.img,
        },
      ];
    },
    removeProduct(state, action) {
      const id = action.payload;
      state.changed = true;
      state.products = state.products.filter((prod) => prod.id !== id);
    },
  },
});

export const fetchProductData = () => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await fetch(FIREBASE_PRODUCTS_URL);
      if (!response.ok) throw new Error("Could not fetch product data.");
      const data = await response.json();

      return data;
    };
    try {
      let productData = await fetchData();
      if (!productData) productData = {};

      const products = Object.entries(productData).map((product) => {
        return {
          id: product[0],
          title: product[1].title,
          price: product[1].price,
          description: product[1].description,
          img: product[1].img,
        };
      });

      dispatch(productActions.replaceProducts({ products }));
      dispatch(
        uiActions.showNotification({
          status: "success",
          title: "Success!",
          message: "Fetch product data successfully",
        })
      );
    } catch (err) {
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error!",
          message: "Fetching product data failed!",
        })
      );
    }
  };
};

export const sendProductData = (product) => {
  return async (dispatch) => {
    dispatch(
      uiActions.showNotification({
        status: "pending",
        title: "Sending...",
        message: "Sending product data.",
      })
    );

    const sendRequest = async () => {
      const response = await fetch(FIREBASE_PRODUCTS_URL, {
        method: "POST",
        body: JSON.stringify(product),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Sending product data failed.");
    };
    try {
      await sendRequest();
      dispatch(
        uiActions.showNotification({
          status: "success",
          title: "Success!",
          message: "Send product data successfully",
        })
      );
    } catch {
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error!",
          message: "Sending product data failed!",
        })
      );
    }
  };
};

export const deleteProductData = (id) => {
  return async (dispatch) => {
    dispatch(
      uiActions.showNotification({
        status: "pending",
        title: "Deleting...",
        message: "Deleting product from data.",
      })
    );
    const sendRequest = async () => {
      const response = await fetch(`${FIREBASE_URL}/products/${id}.json`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Deleting product from data failed.");
    };
    try {
      await dispatch(productActions.removeProduct(id));
      await sendRequest();
      dispatch(
        uiActions.showNotification({
          status: "success",
          title: "Success!",
          message: "Product was successfully deteled from data ",
        })
      );
    } catch {
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error!",
          message: "Deleting product from data failed!",
        })
      );
    }
  };
};

export const productActions = productSlice.actions;

export default productSlice;
