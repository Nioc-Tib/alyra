import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";

import web3Slice from "./web3-slice";
import contractSlice from "./contract-slice";
import uiSlice from "./ui-slice";

const customizedMiddleware = getDefaultMiddleware({
  serializableCheck: false,
});

const store = configureStore({
  reducer: {
    web3: web3Slice.reducer,
    contract: contractSlice.reducer,
    ui: uiSlice.reducer,
  },
  middleware: customizedMiddleware,
});

export default store;
