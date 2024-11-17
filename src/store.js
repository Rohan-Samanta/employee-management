import { configureStore } from "@reduxjs/toolkit";
import employeeReducer from "./redux/employeeSlice";

const store = configureStore({
  reducer: {
    employees: employeeReducer,
  },
});

export default store;
