import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { uiActions } from "../../store/ui-slice";

const Proposal = (props) => {
  const dispatch = useDispatch();
  const workflowStatus = useSelector((state) => state.contract.workflowStatus);
  const account = useSelector((state) => state.web3.accounts[0]);
  const contract = useSelector((state) => state.web3.contract);
  const disable = workflowStatus === 3 ? false : true;

  const voteProposal = async () => {
    const voters = await contract.methods.getVoters().call();
    const hasVoted = await contract.methods.hasVoted(account).call();
    if (!voters.includes(account)) {
      dispatch(
        uiActions.setNotification({
          display: "true",
          message: `Account ${account} note whitelisted`,
          type: "failure",
        })
      );
    } else if (hasVoted) {
      dispatch(
        uiActions.setNotification({
          display: "true",
          message: "You have already voted!",
          type: "failure",
        })
      );
    } else {
      try {
        await contract.methods.voteProposal(props.id).send({ from: account });
      } catch (error) {
        alert(error);
      }
    }
  };

  return (
    <div className="card mb-3">
      <h5 className="card-header">Proposal #{props.id}</h5>
      <div className="card-body">
        <p className="card-text">{props.description}</p>
        <button
          className="btn btn-primary"
          disabled={disable}
          onClick={voteProposal}
        >
          Vote
        </button>
      </div>
    </div>
  );
};

export default Proposal;
