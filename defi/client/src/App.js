import "bootstrap/dist/css/bootstrap.min.css";
import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import RegisterVoter from "./components/Owner/RegisterVoter";
import Workflow from "./components/Owner/Workflow";
import CreateProposal from "./components/Proposals/CreateProposal.js";
import { loadContract, getProposals } from "./store/contract-actions";
import { checkOwnership, loadWeb3, updateAccounts } from "./store/web3-actions";
import ListProposals from "./components/Proposals/ListProposals";
import GetWinningProposal from "./components/Proposals/GetWinningProposal";
import Notification from "./components/UI/Notification";
import Header from "./components/UI/Header";
import { subscribeToEvents } from "./store/contract-actions";

const App = () => {
  const dispatch = useDispatch();

  const web3 = useSelector((state) => state.web3.web3);
  const contract = useSelector((state) => state.web3.contract);
  const owner = useSelector((state) => state.contract.owner);
  const accounts = useSelector((state) => state.web3.accounts);
  const workflowStatus = useSelector((state) => state.contract.workflowStatus);
  const isOwner = useSelector((state) => state.web3.isOwner);
  const notification = useSelector((state) => state.ui);

  const workflowTitle = [
    "Registering Voters",
    "Proposal Registration Started",
    "Proposal Registration Ended",
    "Voting Session Started",
    "Voting Session Ended",
    "Votes Tallied",
  ];

  window.ethereum.on("accountsChanged", async () => {
    if (isOwner !== null) {
      const newAccount = await web3.eth.getAccounts();
      dispatch(updateAccounts(newAccount));
    }
  });

  useEffect(() => {
    dispatch(loadWeb3());
  }, [dispatch]);

  useEffect(() => {
    if (contract !== null) {
      dispatch(loadContract(contract));
      const checkIfExistingProposals = async () => {
        const proposalCounter = await contract.methods.proposalCounter().call();
        dispatch(getProposals(proposalCounter, contract));
      };
      checkIfExistingProposals();
      dispatch(subscribeToEvents(contract));
    }
  }, [dispatch, contract]);

  useEffect(() => {
    if (owner !== null && accounts !== null) {
      dispatch(checkOwnership(owner, accounts[0]));
    }
  }, [dispatch, owner, accounts]);

  if (!web3) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }

  return (
    <Fragment>
      <Header workflowTitle={workflowTitle} />
      <div className="App container">
        {notification.display && (
          <Notification message={notification.message} />
        )}
        {workflowStatus === 5 && <GetWinningProposal />}
        {isOwner && <Workflow />}
        {workflowStatus === 0 && isOwner && <RegisterVoter />}
        {workflowStatus === 1 && <CreateProposal />}
        {contract !== null && web3 !== null && <ListProposals />}
      </div>
    </Fragment>
  );
};

export default App;
