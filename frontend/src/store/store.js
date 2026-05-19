// Redux store configuration for the frontend application state.
import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./slices/appSlice";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";

const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
    cart: cartReducer,
  },
  devTools: import.meta.env.DEV,
});

export default store;
