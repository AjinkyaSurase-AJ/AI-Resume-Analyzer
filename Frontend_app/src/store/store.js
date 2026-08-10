import { configureStore } from "@reduxjs/toolkit";

import analysisReducer from "../slices/analysisSlice";
import authReducer from "../slices/analysisSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer
    },
});