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

export const incrementWorflow = (newWorkflowStatus) => {
  return (dispatch) => {
    dispatch(
      contractActions.updateWorkflow({ workflowStatus: newWorkflowStatus })
    );
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
