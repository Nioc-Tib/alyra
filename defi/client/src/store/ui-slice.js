import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    display: null,
    message: null,
    type: null,
  },
  reducers: {
    setNotification(state, action) {
      state.display = action.payload.display;
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice;
