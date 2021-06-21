import React from "react";
import { useSelector } from "react-redux";

const Header = () => {
  const account = useSelector((state) => state.web3.accounts[0]);
  const truncateWalletAddress = (address, startLength = 4, endLength = 4) => {
    return `${address.substring(0, startLength)}...${address.substring(
      address.length - endLength
    )}`;
  };

  return (
    <nav class="navbar navbar-expand-lg navbar-light">
      <div class="container-fluid">
        <h2>Voting Dapp</h2>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
            <li class="nav-item">Account: {truncateWalletAddress(account)}</li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
