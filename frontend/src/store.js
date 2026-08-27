import { configureStore } from "@reduxjs/toolkit";
import codeNestReducer from "./redux/Slice";
import authReducer from "./redux/authSlice";

export const store = configureStore({
  reducer: {
    codenest: codeNestReducer,
    auth: authReducer,
  },
});
