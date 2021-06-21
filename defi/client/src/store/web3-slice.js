import { createSlice } from "@reduxjs/toolkit";

const web3Slice = createSlice({
  name: "web3",
  initialState: {
    web3: null,
    accounts: null,
    contract: null,
    isOwner: null,
  },
  reducers: {
    replaceWeb3(state, action) {
      state.web3 = action.payload.web3;
      state.accounts = action.payload.accounts;
      state.contract = action.payload.contract;
    },
    updateAccounts(state, action) {
      state.accounts = action.payload.accounts;
    },
    checkOwnership(state, action) {
      state.isOwner = action.payload.isOwner;
    },
  },
});

export const web3Actions = web3Slice.actions;

export default web3Slice;
