import React, { useState } from "react";
import { useSelector } from "react-redux";

const RegisterVoter = () => {
  const [address, setAddress] = useState("");
  const contract = useSelector((state) => state.web3.contract);
  const account = useSelector((state) => state.web3.accounts[0]);

  const addressInputChangeHandler = (event) => {
    setAddress(event.target.value);
  };

  const whitelist = async (event) => {
    event.preventDefault();
    try {
      // Get network provider and web3 instance.
      await contract.methods.whitelist(address).send({ from: account });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(error);
    }
  };

  contract.events.VoterRegistered().on("data", async ({ returnValues }) => {
    const address = await returnValues[0];
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
