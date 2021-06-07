// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/math/SafeMath.sol"; // import library to be able to use it

contract Crowdsale {
    using SafeMath for uint256;

    // address public owner; => no need for owner if use of pull over push
    address public escrow; // wallet to collect raised ETH
    uint256 public savedBalance = 0; // Total amount raised in ETH
    mapping(address => uint256) public balances; // Balances in incoming Ether

    // Initialization
    constructor(address _escrow) {
        // updated to constructor to match solidity version
        // owner = msg.sender;
        // add address of the specific contract
        escrow = _escrow;
    }

    // function to receive ETH
    receive() external payable {
        // updated to receive to match solidity version
        balances[msg.sender] = balances[msg.sender].add(msg.value);
        savedBalance = savedBalance.add(msg.value);
        // escrow.send(msg.value);
        (bool success, ) = escrow.call{value: msg.value}(""); // use .call instead of .send
        require(success, "Transfer to escrow contract failed");
    }

    // refund investisor
    function withdrawPayments() public {
        address payee = msg.sender;
        uint256 payment = balances[payee];

        // Use pull over push
        require(balances[payee] != 0, "You have no funds available for refund");
        (bool success, ) = payee.call{value: payment}("");
        require(success, "Transaction failed");

        // payee.send(payment);

        savedBalance = savedBalance.sub(payment);
        delete balances[payee];
    }
}
