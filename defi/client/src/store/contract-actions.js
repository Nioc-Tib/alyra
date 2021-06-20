import VotingContract from "../contracts/Voting.json";
import getWeb3 from "../getWeb3";
import { contractActions } from "./contract-slice";

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
      const proposalDesc = await contract.methods.getProposal(newProposalId).call();
      return {id: newProposalId, description: proposalDesc};
    }
    
    try {
      const proposal = await getProposal();
      dispatch(contractActions.addProposal({proposal}));
    } catch (error) {
      alert('Fail to get proposal');
      console.log(error);
    };
  };
};
