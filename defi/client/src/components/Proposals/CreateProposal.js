import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { uiActions } from "../../store/ui-slice";

const CreateProposal = () => {
  const dispatch = useDispatch();
  const [proposal, setProposal] = useState("");
  const contract = useSelector((state) => state.web3.contract);
  const account = useSelector((state) => state.web3.accounts[0]);

  const proposalChangeHandler = (event) => {
    setProposal(event.target.value);
  };

  const proposalSubmitHandler = async (event) => {
    event.preventDefault();
    const proposalExists = await contract.methods
      .checkProposalExists(proposal)
      .call();
    const voters = await contract.methods.getVoters().call();
    if (!voters.includes(account)) {
      dispatch(
        uiActions.setNotification({
          display: true,
          message: `Account ${account} not whitelisted`,
          type: "failure",
        })
      );
    } else if (proposalExists) {
      dispatch(
        uiActions.setNotification({
          display: true,
          message: "Proposal already submitted",
          type: "failure",
        })
      );
    } else {
      try {
        await contract.methods.submitProposal(proposal).send({ from: account });
      } catch (error) {
        alert("Transaction failed");
        console.log(error);
      }
    }
  };

  return (
    <form onSubmit={proposalSubmitHandler} className="mb-4">
      <div className="form-group text-start">
        <label htmlFor="proposal" className="pb-3 pt-3">
          Write your proposal
        </label>
        <textarea
          className="form-control"
          id="proposal"
          rows="3"
          onChange={proposalChangeHandler}
        ></textarea>
        <button type="submit" className="btn btn-primary mt-3">
          Submit Proposal
        </button>
      </div>
    </form>
  );
};

export default CreateProposal;
