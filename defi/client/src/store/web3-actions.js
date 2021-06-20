import VotingContract from "../contracts/Voting.json";
import getWeb3 from "../getWeb3";
import { web3Actions } from "./web3-slice";

export const loadWeb3 = () => {
  return async (dispatch) => {
    const load = async () => {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = VotingContract.networks[networkId];
      const contract = new web3.eth.Contract(
        VotingContract.abi,
        deployedNetwork && deployedNetwork.address
      );
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      // setOwner(owner);
      return { web3, accounts, contract };
    };

    try {
      // Get network provider and web3 instance.
      const loadWeb3Data = await load();
      dispatch(web3Actions.replaceWeb3(loadWeb3Data));
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };
};

export const updateAccounts = (newAccount) => {
  return (dispatch) => {
    dispatch(web3Actions.updateAccounts({ accounts: newAccount }));
  };
};

export const checkOwnership = (owner, user) => {
  return (dispatch) => {
    let isOwner = false;
    if (owner == user) {
      isOwner = true;
    }
    dispatch(web3Actions.checkOwnership({ isOwner : isOwner }));
  };
};
