import React from "react";
import { useSelector } from "react-redux";

const Header = (propos) => {
  const account = useSelector((state) => state.web3.accounts[0]);
  const workflowStatus = useSelector((state) => state.contract.workflowStatus);

  const truncateWalletAddress = (address, startLength = 4, endLength = 4) => {
    return `${address.substring(0, startLength)}...${address.substring(
      address.length - endLength
    )}`;
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light">
      <div className="container-fluid">
        <h2>Voting Dapp</h2>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <h4 className="navbar-nav ms-auto mb-2 mb-lg-0">
            Workflow Status: {propos.workflowTitle[workflowStatus]}
          </h4>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              Account: {truncateWalletAddress(account)}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
