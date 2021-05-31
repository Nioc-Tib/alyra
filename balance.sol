// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.4;

contract getBalance {
    function getAddressBalance(address _address) public view returns (uint256) {
        return _address.balance;
    }
}
