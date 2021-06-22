import { contractActions } from "./contract-slice";
import { uiActions } from "./ui-slice";

export const loadContract = (contract) => {
  return async (dispatch) => {
    const loadContract = async () => {
      const owner = await contract.methods.owner().call();
      const workflowStatus = await contract.methods.state().call();
      return { owner: owner, workflowStatus: parseInt(workflowStatus) };
    };

    try {
      // Get network provider and web3 instance.
      const contractData = await loadContract();
      dispatch(contractActions.setState(contractData));
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(`Failed to load contract.`);
      console.error(error);
    }
  };
};

export const addProposal = (newProposalId, contract) => {
  return async (dispatch) => {
    const getProposal = async () => {
      const proposalDesc = await contract.methods
        .getProposal(newProposalId)
        .call();
      return { id: newProposalId, description: proposalDesc };
    };
    try {
      const proposal = await getProposal();
      dispatch(contractActions.addProposal({ proposal }));
      dispatch(
        uiActions.setNotification({
          display: true,
          message: `Proposal #${proposal.id} successfully registered`,
          type: "success",
        })
      );
    } catch (error) {
      alert("Fail to get proposal");
      console.log(error);
    }
  };
};

export const getProposals = (proposalCount, contract) => {
  return async (dispatch) => {
    const getProposals = async () => {
      const proposals = [];
      for (let i = 0; i < proposalCount; i++) {
        const proposalDesc = await contract.methods.getProposal(i).call();
        const proposal = { id: i, description: proposalDesc };
        proposals.push(proposal);
      }

      return proposals;
    };

    try {
      const proposals = await getProposals();
      dispatch(contractActions.getProposals({ proposals }));
    } catch (error) {
      alert("Failed to get existing proposals");
      console.log(error);
    }
  };
};

export const subscribeToEvents = (contract) => {
  let newProposalId = null;
  return async (dispatch) => {
    contract.events
      .ProposalRegistered()
      .on("data", async ({ returnValues }) => {
        const id = parseInt(await returnValues[0]);
        const description = await contract.methods.getProposal(id).call();
        const proposal = { id, description };
        if (newProposalId !== id) {
          dispatch(contractActions.addProposal({ proposal }));
        }
        newProposalId = id;
      });

    contract.events.ProposalsRegistrationStarted().on("data", () => {
      dispatch(contractActions.updateWorkflow({ workflowStatus: 1 }));
    });

    contract.events.ProposalsRegistrationEnded().on("data", () => {
      dispatch(contractActions.updateWorkflow({ workflowStatus: 2 }));
    });

    contract.events.VotingSessionStarted().on("data", () => {
      dispatch(contractActions.updateWorkflow({ workflowStatus: 3 }));
    });

    contract.events.VotingSessionEnded().on("data", () => {
      dispatch(contractActions.updateWorkflow({ workflowStatus: 4 }));
    });

    contract.events.VotesTallied().on("data", () => {
      dispatch(contractActions.updateWorkflow({ workflowStatus: 5 }));
    });

    contract.events.VoterRegistered().on("data", async ({ returnValues }) => {
      const address = await returnValues[0];
      dispatch(
        uiActions.setNotification({
          display: true,
          message: `address ${await address} successfully whitelisted!`,
          type: "success",
        })
      );
    });

    contract.events.Voted().on("data", async () => {
      dispatch(
        uiActions.setNotification({
          display: "true",
          message: "Your vote has been registered!",
          type: "success",
        })
      );
    });
  };
};
