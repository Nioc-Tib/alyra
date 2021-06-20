import { createSlice } from "@reduxjs/toolkit";

const contractSlice = createSlice({
  name: "contract",
  initialState: {
    owner: null,
    worklowStatus: 0,
    proposals: [],
  },
  reducers: {
    setState(state, action) {
      state.owner = action.payload.owner;
      state.workflowStatus = action.payload.workflowStatus;
    },
    updateWorkflow(state, action) {
      state.workflowStatus = action.payload.workflowStatus;
    },
    addProposal(state, action) {
      state.proposals.push(action.payload.proposal);
    },
  },
});

export const contractActions = contractSlice.actions;

export default contractSlice;
