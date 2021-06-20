import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addProposal } from "../../store/contract-actions";

const CreateProposal = () => {
  const dispatch = useDispatch();
  const [newProposalId, setNewProposalId] = useState(null);
  const [proposal, setProposal] = useState("");
  const [proposalId, setProposalId] = useState(null);
  const [proposalDesc, setProposalDesc] = useState(null);
  const [eventProposal, setEvenProposal] = useState(null);
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
    await contract.methods.submitProposal(proposal).send({ from: account });
  };

  contract.events.ProposalRegistered().on(
    "data", async ({ returnValues }) => {
        const id = await returnValues[0];
        await setNewProposalId(id);
      });

  return (
    <form onSubmit={proposalSubmitHandler}>
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
