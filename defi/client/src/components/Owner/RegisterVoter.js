import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { uiActions } from "../../store/ui-slice";

const RegisterVoter = () => {
  const dispatch = useDispatch();
  const [address, setAddress] = useState(null);
  const contract = useSelector((state) => state.web3.contract);
  const account = useSelector((state) => state.web3.accounts[0]);

  const addressInputChangeHandler = (event) => {
    setAddress(event.target.value);
  };

  const whitelist = async (event) => {
    event.preventDefault();
    const voters = await contract.methods.getVoters().call();
    if (voters.includes(address)) {
      dispatch(
        uiActions.setNotification({
          display: true,
          message: `address ${await address} already whitelisted!`,
          type: "failure",
        })
      );
    } else {
      try {
        // Get network provider and web3 instance.
        await contract.methods.whitelist(address).send({ from: account });
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(error);
      }
    }
  };

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

  return (
    <form onSubmit={whitelist}>
      <div className="row g-3 align-items-center">
        <div className="col-auto">
          <label htmlFor="inputAddress" className="col-form-label">
            Address
          </label>
        </div>
        <div className="col-auto">
          <input
            id="inputAddress"
            className="form-control"
            aria-describedby="Address to whitelist"
            onChange={addressInputChangeHandler}
          />
        </div>
        <div className="col-auto">
          <button type="submit" className="btn btn-primary">
            Whitelist
          </button>
        </div>
      </div>
    </form>
  );
};

export default RegisterVoter;
