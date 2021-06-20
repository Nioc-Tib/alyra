import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { incrementWorflow } from "../../store/contract-actions";

const Workflow = (props) => {
  const dispatch = useDispatch();
  const contract = useSelector((state) => state.web3.contract);
  const workflowStatus = useSelector((state) => state.contract.workflowStatus);
  const account = useSelector((state) => state.web3.accounts[0]);

  const workflowTitle = [
    "Start Proposal Registration",
    "End Proposal Registration",
    "Start Voting Session",
    "End Voting Session",
    "Count Votes",
  ];

  const incrementWorkflow = async () => {
    if (workflowStatus === 0) {
      try {
        await contract.methods
          .startProposalRegistration()
          .send({ from: account });
      } catch (error) {
        alert(error);
      }
    }
    if (workflowStatus === 1) {
      try {
        await contract.methods
          .endProposalRegistration()
          .send({ from: account });
      } catch (error) {
        alert(error);
      }
    }
    if (workflowStatus === 2) {
      try {
        await contract.methods.startVotingSession().send({ from: account });
      } catch (error) {
        alert(error);
      }
    }
    if (workflowStatus === 3) {
      try {
        await contract.methods.endVotingSession().send({ from: account });
      } catch (error) {
        alert(error);
      }
    }
    if (workflowStatus === 4) {
      try {
        if (contract !== null) {
            await contract.methods.countVotes().send({ from: account });    
        }
      } catch (error) {
        alert(error);
      }
    }
  };

  contract.events.ProposalsRegistrationStarted().on("data", () => {
    dispatch(incrementWorflow(1));
  });

  contract.events.ProposalsRegistrationEnded().on("data", () => {
    dispatch(incrementWorflow(2));
  });

  contract.events.VotingSessionStarted().on("data", () => {
    dispatch(incrementWorflow(3));
  });

  contract.events.VotingSessionEnded().on("data", () => {
    dispatch(incrementWorflow(4));
  });

  contract.events.VotesTallied().on("data", () => {
    dispatch(incrementWorflow(5));
  });

  return (
    <div>
      <div className="row g-3 align-items-center">
        <div className="col-auto">
          <label htmlFor="inputAddress" className="col-form-label">
            Change Workflow
          </label>
        </div>
        <div className="col-auto">
          <button
            type="submit"
            className="btn btn-primary"
            onClick={incrementWorkflow}
            disabled={workflowStatus === 5}
          >
            {workflowStatus >= workflowTitle.length
              ? "Workflow Ended"
              : workflowTitle[workflowStatus]}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Workflow;
