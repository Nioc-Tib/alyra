import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addProposal } from "../../store/contract-actions";

const CreateProposal = () => {
  const dispatch = useDispatch();
  const [newProposalId, setNewProposalId] = useState(null);
  const [proposal, setProposal] = useState("");
  const contract = useSelector((state) => state.web3.contract);
  const account = useSelector((state) => state.web3.accounts[0]);
  const proposals = useSelector((state) => state.contract.proposals);

  useEffect(() => {
    if (contract !== null && newProposalId !== null) {
      if (proposals === []) {
        dispatch(addProposal(newProposalId, contract));
      } else if (proposals[proposals.length] !== newProposalId) {
        dispatch(addProposal(newProposalId, contract));
      }
    }
  }, [dispatch, newProposalId]);

  const proposalChangeHandler = (event) => {
    setProposal(event.target.value);
  };

  const proposalSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await contract.methods.submitProposal(proposal).send({ from: account });
    } catch (error) {
      alert("Transaction failed");
      console.log(error);
    }
  };

  contract.events.ProposalRegistered().on("data", async ({ returnValues }) => {
    const id = parseInt(await returnValues[0]);
    setNewProposalId(id);
  });

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
